from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
import httpx
from pydantic_settings import BaseSettings
import razorpay
import hmac
import hashlib
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configuration Settings
class Settings(BaseSettings):
    MONGO_URL: str = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    DB_NAME: str = os.getenv("DB_NAME", "undhyu_db")
    SHOPIFY_STORE_DOMAIN: str = os.getenv("SHOPIFY_STORE_DOMAIN", "j0dktb-z1.myshopify.com")
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: str = os.getenv("SHOPIFY_STOREFRONT_ACCESS_TOKEN", "")
    SHOPIFY_ADMIN_ACCESS_TOKEN: str = os.getenv("SHOPIFY_ADMIN_ACCESS_TOKEN", "")
    SHOPIFY_API_VERSION: str = os.getenv("SHOPIFY_API_VERSION", "2024-01")
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "")
    PORT: int = int(os.getenv("PORT", 8001))
    
    class Config:
        env_file = ".env"

settings = Settings()

# MongoDB connection with fallback
try:
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.DB_NAME]
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    client = None
    db = None

# Razorpay client
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

# Shopify Storefront API Client
class ShopifyStorefrontClient:
    def __init__(self, store_domain: str, access_token: str, api_version: str = "2024-01"):
        self.store_domain = store_domain
        self.access_token = access_token
        self.api_version = api_version
        self.base_url = f"https://{store_domain}/api/{api_version}/graphql.json"
        
    async def execute_query(self, query: str, variables: Optional[Dict] = None) -> Dict[str, Any]:
        headers = {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": self.access_token
        }
        
        payload = {"query": query}
        if variables:
            payload["variables"] = variables
            
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.base_url,
                headers=headers,
                json=payload,
                timeout=30.0
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Shopify API error: {response.text}"
                )
                
            return response.json()

# Shopify Admin API Client
class ShopifyAdminClient:
    def __init__(self, store_domain: str, access_token: str, api_version: str = "2024-01"):
        self.store_domain = store_domain
        self.access_token = access_token
        self.api_version = api_version
        self.base_url = f"https://{store_domain}/admin/api/{api_version}"
        
    async def create_order(self, order_data: Dict) -> Dict[str, Any]:
        headers = {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": self.access_token
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/orders.json",
                headers=headers,
                json={"order": order_data},
                timeout=30.0
            )
            
            if response.status_code not in [200, 201]:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Shopify Admin API error: {response.text}"
                )
                
            return response.json()

# Initialize clients
shopify_storefront_client = ShopifyStorefrontClient(
    store_domain=settings.SHOPIFY_STORE_DOMAIN,
    access_token=settings.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    api_version=settings.SHOPIFY_API_VERSION
)

shopify_admin_client = ShopifyAdminClient(
    store_domain=settings.SHOPIFY_STORE_DOMAIN,
    access_token=settings.SHOPIFY_ADMIN_ACCESS_TOKEN,
    api_version=settings.SHOPIFY_API_VERSION
)

# Create the main app
app = FastAPI(title="Undhyu.com API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class CartItem(BaseModel):
    id: str
    title: str
    quantity: int
    price: float
    handle: str
    variant_id: str = ""
    image_url: str = ""

class CreateOrderRequest(BaseModel):
    amount: int  # Amount in paise
    currency: str = "INR"
    cart: List[CartItem]
    customer_info: Dict[str, Any] = {}

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    cart: List[CartItem]
    customer_info: Dict[str, Any] = {}

# Payment endpoints
@api_router.post("/create-razorpay-order")
async def create_razorpay_order(request: CreateOrderRequest):
    try:
        # Create Razorpay order
        order_data = {
            "amount": request.amount,
            "currency": request.currency,
            "receipt": f"ord_{uuid.uuid4().hex[:8]}",  # Short receipt ID under 40 chars
            "payment_capture": 1
        }
        
        razorpay_order = razorpay_client.order.create(data=order_data)
        
        # Store order in MongoDB
        if db is not None:
            order_record = {
                "razorpay_order_id": razorpay_order["id"],
                "amount": request.amount,
                "currency": request.currency,
                "cart": [item.dict() for item in request.cart],
                "customer_info": request.customer_info,
                "status": "created",
                "created_at": datetime.utcnow()
            }
            await db.orders.insert_one(order_record)
        
        return {
            "id": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "currency": razorpay_order["currency"],
            "status": razorpay_order["status"],
            "key": settings.RAZORPAY_KEY_ID
        }
        
    except Exception as e:
        logger.error(f"Failed to create Razorpay order: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")

@api_router.post("/verify-payment")
async def verify_payment(request: VerifyPaymentRequest):
    try:
        # Verify payment signature
        signature = request.razorpay_signature
        order_id = request.razorpay_order_id
        payment_id = request.razorpay_payment_id
        
        message = f"{order_id}|{payment_id}"
        generated_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(signature, generated_signature):
            raise HTTPException(status_code=400, detail="Invalid payment signature")
        
        # Fetch payment details from Razorpay
        payment = razorpay_client.payment.fetch(payment_id)
        
        if payment["status"] != "captured":
            raise HTTPException(status_code=400, detail="Payment not captured")
        
        # Create order in Shopify
        shopify_order = None
        try:
            # Prepare line items for Shopify
            line_items = []
            for item in request.cart:
                line_items.append({
                    "title": item.title,
                    "quantity": item.quantity,
                    "price": str(item.price),
                    "variant_id": item.variant_id if item.variant_id else None
                })
            
            # Customer info
            customer_info = request.customer_info or {}
            
            # Shopify order data
            shopify_order_data = {
                "line_items": line_items,
                "customer": {
                    "first_name": customer_info.get("first_name", "Customer"),
                    "last_name": customer_info.get("last_name", ""),
                    "email": customer_info.get("email", "customer@undhyu.com"),
                    "phone": customer_info.get("phone", "")
                },
                "billing_address": {
                    "first_name": customer_info.get("first_name", "Customer"),
                    "last_name": customer_info.get("last_name", ""),
                    "address1": customer_info.get("address", ""),
                    "city": customer_info.get("city", ""),
                    "province": customer_info.get("state", ""),
                    "country": customer_info.get("country", "India"),
                    "zip": customer_info.get("pincode", ""),
                    "phone": customer_info.get("phone", "")
                },
                "shipping_address": {
                    "first_name": customer_info.get("first_name", "Customer"),
                    "last_name": customer_info.get("last_name", ""),
                    "address1": customer_info.get("address", ""),
                    "city": customer_info.get("city", ""),
                    "province": customer_info.get("state", ""),
                    "country": customer_info.get("country", "India"),
                    "zip": customer_info.get("pincode", ""),
                    "phone": customer_info.get("phone", "")
                },
                "financial_status": "paid",
                "tags": "razorpay,online",
                "note": f"Payment ID: {payment_id}, Order ID: {order_id}",
                "transactions": [
                    {
                        "kind": "sale",
                        "status": "success",
                        "amount": str(payment["amount"] / 100),  # Convert from paise to rupees
                        "currency": "INR",
                        "gateway": "razorpay"
                    }
                ]
            }
            
            shopify_order = await shopify_admin_client.create_order(shopify_order_data)
            
        except Exception as e:
            logger.warning(f"Failed to create Shopify order: {str(e)}")
            # Continue even if Shopify order creation fails
        
        # Update order in MongoDB
        if db is not None:
            update_data = {
                "razorpay_payment_id": payment_id,
                "status": "paid",
                "paid_at": datetime.utcnow(),
                "payment_details": payment
            }
            
            if shopify_order:
                update_data["shopify_order_id"] = shopify_order["order"]["id"]
                update_data["shopify_order"] = shopify_order["order"]
            
            await db.orders.update_one(
                {"razorpay_order_id": order_id},
                {"$set": update_data}
            )
        
        return {
            "success": True,
            "payment_id": payment_id,
            "order_id": order_id,
            "amount": payment["amount"],
            "status": payment["status"],
            "shopify_order_id": shopify_order["order"]["id"] if shopify_order else None,
            "message": "Payment verified and order created successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Payment verification failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Payment verification failed: {str(e)}")

@api_router.get("/orders")
async def get_orders():
    if db is None:
        return {"orders": []}
    try:
        orders = await db.orders.find().sort("created_at", -1).to_list(100)
        # Convert ObjectId to string for JSON serialization
        for order in orders:
            if "_id" in order:
                order["_id"] = str(order["_id"])
        return {"orders": orders}
    except Exception as e:
        logger.error(f"Failed to fetch orders: {str(e)}")
        return {"orders": []}

# Original status endpoints
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    if db:
        _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    if not db:
        return []
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Shopify Products Endpoints
@api_router.get("/products")
async def get_products(
    first: int = Query(20, le=250),
    after: Optional[str] = None,
    collection_handle: Optional[str] = None,
    search_query: Optional[str] = None,
    sort_key: str = Query("CREATED_AT", regex="^(CREATED_AT|UPDATED_AT|TITLE|PRICE|BEST_SELLING|RELEVANCE)$"),
    reverse: bool = False,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
):
    """Fetch products with filtering and search capabilities"""
    
    # Build GraphQL query based on parameters
    query_filters = []
    
    if collection_handle:
        query_filters.append(f'collection:"{collection_handle}"')
    
    if search_query:
        query_filters.append(f'title:*{search_query}* OR tag:*{search_query}*')
        
    if min_price is not None:
        query_filters.append(f'variants.price:>={min_price}')
        
    if max_price is not None:
        query_filters.append(f'variants.price:<={max_price}')
    
    query_string = " AND ".join(query_filters) if query_filters else None
    
    graphql_query = """
    query getProducts($first: Int!, $after: String, $query: String, $sortKey: ProductSortKeys!, $reverse: Boolean!) {
        products(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
            edges {
                node {
                    id
                    title
                    handle
                    description
                    vendor
                    productType
                    tags
                    createdAt
                    updatedAt
                    images(first: 5) {
                        edges {
                            node {
                                id
                                url
                                altText
                                width
                                height
                            }
                        }
                    }
                    variants(first: 10) {
                        edges {
                            node {
                                id
                                title
                                price {
                                    amount
                                    currencyCode
                                }
                                compareAtPrice {
                                    amount
                                    currencyCode
                                }
                                availableForSale
                                quantityAvailable
                                selectedOptions {
                                    name
                                    value
                                }
                            }
                        }
                    }
                    collections(first: 5) {
                        edges {
                            node {
                                id
                                title
                                handle
                            }
                        }
                    }
                }
                cursor
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
        }
    }
    """
    
    variables = {
        "first": first,
        "after": after,
        "query": query_string,
        "sortKey": sort_key,
        "reverse": reverse
    }
    
    try:
        result = await shopify_storefront_client.execute_query(graphql_query, variables)
        
        if "errors" in result:
            raise HTTPException(status_code=400, detail=result["errors"])
            
        return {
            "products": [edge["node"] for edge in result["data"]["products"]["edges"]],
            "pageInfo": result["data"]["products"]["pageInfo"],
            "totalCount": len(result["data"]["products"]["edges"])
        }
        
    except Exception as e:
        logger.error(f"Failed to fetch products: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/products/{product_handle}")
async def get_product_by_handle(product_handle: str):
    """Get a single product by its handle"""
    
    graphql_query = """
    query getProduct($handle: String!) {
        productByHandle(handle: $handle) {
            id
            title
            handle
            description
            descriptionHtml
            vendor
            productType
            tags
            createdAt
            updatedAt
            images(first: 10) {
                edges {
                    node {
                        id
                        url
                        altText
                        width
                        height
                    }
                }
            }
            variants(first: 100) {
                edges {
                    node {
                        id
                        title
                        price {
                            amount
                            currencyCode
                        }
                        compareAtPrice {
                            amount
                            currencyCode
                        }
                        availableForSale
                        quantityAvailable
                        selectedOptions {
                            name
                            value
                        }
                        image {
                            id
                            url
                            altText
                        }
                    }
                }
            }
            collections(first: 10) {
                edges {
                    node {
                        id
                        title
                        handle
                        description
                    }
                }
            }
            seo {
                title
                description
            }
        }
    }
    """
    
    variables = {"handle": product_handle}
    
    try:
        result = await shopify_storefront_client.execute_query(graphql_query, variables)
        
        if "errors" in result:
            raise HTTPException(status_code=400, detail=result["errors"])
            
        product = result["data"]["productByHandle"]
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
            
        return product
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch product: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Shopify Collections Endpoints
@api_router.get("/collections")
async def get_collections(
    first: int = Query(20, le=250),
    after: Optional[str] = None,
    search_query: Optional[str] = None
):
    """Fetch collections with search capability"""
    
    query_string = f'title:*{search_query}*' if search_query else None
    
    graphql_query = """
    query getCollections($first: Int!, $after: String, $query: String) {
        collections(first: $first, after: $after, query: $query) {
            edges {
                node {
                    id
                    title
                    handle
                    description
                    descriptionHtml
                    image {
                        id
                        url
                        altText
                        width
                        height
                    }
                    products(first: 1) {
                        edges {
                            node {
                                id
                            }
                        }
                    }
                    updatedAt
                }
                cursor
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
        }
    }
    """
    
    variables = {
        "first": first,
        "after": after,
        "query": query_string
    }
    
    try:
        result = await shopify_storefront_client.execute_query(graphql_query, variables)
        
        if "errors" in result:
            raise HTTPException(status_code=400, detail=result["errors"])
            
        collections = []
        for edge in result["data"]["collections"]["edges"]:
            collection = edge["node"]
            collection["productCount"] = len(collection["products"]["edges"])
            collections.append(collection)
            
        return {
            "collections": collections,
            "pageInfo": result["data"]["collections"]["pageInfo"]
        }
        
    except Exception as e:
        logger.error(f"Failed to fetch collections: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/collections/{collection_handle}")
async def get_collection_by_handle(collection_handle: str):
    """Get a single collection by its handle"""
    
    graphql_query = """
    query getCollection($handle: String!) {
        collectionByHandle(handle: $handle) {
            id
            title
            handle
            description
            descriptionHtml
            image {
                id
                url
                altText
                width
                height
            }
            products(first: 50) {
                edges {
                    node {
                        id
                        title
                        handle
                        images(first: 1) {
                            edges {
                                node {
                                    id
                                    url
                                    altText
                                }
                            }
                        }
                        variants(first: 1) {
                            edges {
                                node {
                                    price {
                                        amount
                                        currencyCode
                                    }
                                    compareAtPrice {
                                        amount
                                        currencyCode
                                    }
                                }
                            }
                        }
                    }
                }
            }
            updatedAt
        }
    }
    """
    
    variables = {"handle": collection_handle}
    
    try:
        result = await shopify_storefront_client.execute_query(graphql_query, variables)
        
        if "errors" in result:
            raise HTTPException(status_code=400, detail=result["errors"])
            
        collection = result["data"]["collectionByHandle"]
        if not collection:
            raise HTTPException(status_code=404, detail="Collection not found")
            
        return collection
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch collection: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/collections/featured")
async def get_featured_collections():
    """Get featured collections: sarees, lehengas, suits, jewelry"""
    
    featured_handles = ["sarees", "lehengas", "suits", "jewelry", "salwar-kameez", "ethnic-wear"]
    collections = []
    
    for handle in featured_handles:
        try:
            collection = await get_collection_by_handle(handle)
            collections.append(collection)
        except HTTPException as e:
            if e.status_code == 404:
                # Collection doesn't exist, skip it
                continue
    
    return {"collections": collections}

# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "Welcome to Undhyu.com API - Authentic Indian Fashion with Razorpay Integration"}

# Add health check endpoint for deployment
@api_router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "shopify_configured": bool(settings.SHOPIFY_STOREFRONT_ACCESS_TOKEN),
        "shopify_admin_configured": bool(settings.SHOPIFY_ADMIN_ACCESS_TOKEN),
        "razorpay_configured": bool(settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET),
        "mongodb_connected": bool(client)
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "https://undhyu.com",
        "https://www.undhyu.com", 
        "https://*.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.PORT)