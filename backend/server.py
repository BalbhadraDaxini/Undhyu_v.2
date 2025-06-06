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

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configuration Settings
class Settings(BaseSettings):
    MONGO_URL: str
    DB_NAME: str
    SHOPIFY_STORE_DOMAIN: str
    SHOPIFY_STOREFRONT_ACCESS_TOKEN: str
    SHOPIFY_API_VERSION: str = "2024-01"
    
    class Config:
        env_file = ".env"

settings = Settings()

# MongoDB connection
client = AsyncIOMotorClient(settings.MONGO_URL)
db = client[settings.DB_NAME]

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

# Initialize Shopify client
shopify_client = ShopifyStorefrontClient(
    store_domain=settings.SHOPIFY_STORE_DOMAIN,
    access_token=settings.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
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

# Original status endpoints
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
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
        result = await shopify_client.execute_query(graphql_query, variables)
        
        if "errors" in result:
            raise HTTPException(status_code=400, detail=result["errors"])
            
        return {
            "products": [edge["node"] for edge in result["data"]["products"]["edges"]],
            "pageInfo": result["data"]["products"]["pageInfo"],
            "totalCount": len(result["data"]["products"]["edges"])
        }
        
    except Exception as e:
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
        result = await shopify_client.execute_query(graphql_query, variables)
        
        if "errors" in result:
            raise HTTPException(status_code=400, detail=result["errors"])
            
        product = result["data"]["productByHandle"]
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
            
        return product
        
    except HTTPException:
        raise
    except Exception as e:
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
        result = await shopify_client.execute_query(graphql_query, variables)
        
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
        result = await shopify_client.execute_query(graphql_query, variables)
        
        if "errors" in result:
            raise HTTPException(status_code=400, detail=result["errors"])
            
        collection = result["data"]["collectionByHandle"]
        if not collection:
            raise HTTPException(status_code=404, detail="Collection not found")
            
        return collection
        
    except HTTPException:
        raise
    except Exception as e:
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
    return {"message": "Welcome to Undhyu.com API - Authentic Indian Fashion"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
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
    client.close()
