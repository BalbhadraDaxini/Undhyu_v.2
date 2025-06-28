
import requests
import sys
import json
import hmac
import hashlib
import uuid
from datetime import datetime

class UndhyuAPITester:
    def __init__(self, base_url="https://d2a7b3a3-ad7c-4560-bca6-c8874481d6c0.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        # Razorpay test key from backend/.env
        self.razorpay_key_secret = "DJutG7yBw0KVpcBk81drh2bd"

    def run_test(self, name, method, endpoint, expected_status=200, params=None):
        """Run a single API test"""
        url = f"{self.base_url}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=params, headers=headers)

            success = response.status_code == expected_status
            
            # Try to parse response as JSON
            try:
                response_data = response.json()
                response_preview = json.dumps(response_data, indent=2)[:500] + "..." if len(json.dumps(response_data)) > 500 else json.dumps(response_data, indent=2)
            except:
                response_preview = response.text[:500] + "..." if len(response.text) > 500 else response.text
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                result = {
                    "name": name,
                    "status": "PASSED",
                    "response_code": response.status_code,
                    "response_preview": response_preview
                }
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                result = {
                    "name": name,
                    "status": "FAILED",
                    "expected_status": expected_status,
                    "response_code": response.status_code,
                    "response_preview": response_preview
                }
            
            self.test_results.append(result)
            return success, response.json() if success and response.headers.get('content-type', '').startswith('application/json') else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({
                "name": name,
                "status": "ERROR",
                "error": str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test(
            "Root API Endpoint",
            "GET",
            "/api/"
        )
        
    def test_health_endpoint(self):
        """Test the health check endpoint"""
        return self.run_test(
            "Health Check Endpoint",
            "GET",
            "/api/health"
        )

    def test_products_endpoint(self, params=None):
        """Test the products endpoint with optional filters"""
        test_name = "Products Endpoint"
        if params:
            param_desc = ", ".join([f"{k}={v}" for k, v in params.items()])
            test_name += f" with filters ({param_desc})"
        
        return self.run_test(
            test_name,
            "GET",
            "/api/products",
            params=params
        )

    def test_product_by_handle(self, handle):
        """Test getting a specific product by handle"""
        return self.run_test(
            f"Product by Handle ({handle})",
            "GET",
            f"/api/products/{handle}"
        )

    def test_collections_endpoint(self, params=None):
        """Test the collections endpoint"""
        test_name = "Collections Endpoint"
        if params:
            param_desc = ", ".join([f"{k}={v}" for k, v in params.items()])
            test_name += f" with filters ({param_desc})"
            
        return self.run_test(
            test_name,
            "GET",
            "/api/collections",
            params=params
        )

    def test_featured_collections(self):
        """Test the featured collections endpoint"""
        return self.run_test(
            "Featured Collections",
            "GET",
            "/api/collections/featured"
        )
        
    def test_orders_endpoint(self):
        """Test the orders endpoint"""
        return self.run_test(
            "Orders Endpoint",
            "GET",
            "/api/orders"
        )
        
    def test_create_razorpay_order(self, cart_items=None, customer_info=None):
        """Test creating a Razorpay order"""
        if cart_items is None:
            cart_items = [
                {
                    "id": f"gid://shopify/Product/{uuid.uuid4()}",
                    "title": "Test Saree",
                    "quantity": 1,
                    "price": 1999.00,
                    "handle": "test-saree",
                    "variant_id": f"gid://shopify/ProductVariant/{uuid.uuid4()}",
                    "image_url": "https://example.com/test-saree.jpg"
                }
            ]
            
        if customer_info is None:
            customer_info = {
                "first_name": "Test",
                "last_name": "Customer",
                "email": "test@example.com",
                "phone": "9876543210",
                "address": "123 Test Street",
                "city": "Test City",
                "state": "Test State",
                "country": "India",
                "pincode": "123456"
            }
            
        # Calculate total amount in paise
        total_amount = int(sum(item["price"] * item["quantity"] for item in cart_items) * 100)
        
        data = {
            "amount": total_amount,
            "currency": "INR",
            "cart": cart_items,
            "customer_info": customer_info
        }
        
        return self.run_test(
            "Create Razorpay Order",
            "POST",
            "/api/create-razorpay-order",
            params=data
        )
        
    def test_verify_payment(self, order_id, payment_id, cart_items=None, customer_info=None):
        """Test verifying a Razorpay payment"""
        if cart_items is None:
            cart_items = [
                {
                    "id": f"gid://shopify/Product/{uuid.uuid4()}",
                    "title": "Test Saree",
                    "quantity": 1,
                    "price": 1999.00,
                    "handle": "test-saree",
                    "variant_id": f"gid://shopify/ProductVariant/{uuid.uuid4()}",
                    "image_url": "https://example.com/test-saree.jpg"
                }
            ]
            
        if customer_info is None:
            customer_info = {
                "first_name": "Test",
                "last_name": "Customer",
                "email": "test@example.com",
                "phone": "9876543210",
                "address": "123 Test Street",
                "city": "Test City",
                "state": "Test State",
                "country": "India",
                "pincode": "123456"
            }
            
        # Generate signature using the same algorithm as in the server
        message = f"{order_id}|{payment_id}"
        signature = hmac.new(
            self.razorpay_key_secret.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        
        data = {
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": signature,
            "cart": cart_items,
            "customer_info": customer_info
        }
        
        return self.run_test(
            "Verify Razorpay Payment",
            "POST",
            "/api/verify-payment",
            params=data
        )
        
    def test_verify_payment_invalid_signature(self, order_id, payment_id):
        """Test verifying a Razorpay payment with invalid signature"""
        cart_items = [
            {
                "id": f"gid://shopify/Product/{uuid.uuid4()}",
                "title": "Test Saree",
                "quantity": 1,
                "price": 1999.00,
                "handle": "test-saree",
                "variant_id": f"gid://shopify/ProductVariant/{uuid.uuid4()}",
                "image_url": "https://example.com/test-saree.jpg"
            }
        ]
        
        customer_info = {
            "first_name": "Test",
            "last_name": "Customer",
            "email": "test@example.com",
            "phone": "9876543210"
        }
        
        # Generate invalid signature
        invalid_signature = "invalid_signature_" + uuid.uuid4().hex
        
        data = {
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": invalid_signature,
            "cart": cart_items,
            "customer_info": customer_info
        }
        
        return self.run_test(
            "Verify Razorpay Payment with Invalid Signature",
            "POST",
            "/api/verify-payment",
            expected_status=400,  # Expect 400 Bad Request
            params=data
        )
        
    def test_create_razorpay_order_empty_cart(self):
        """Test creating a Razorpay order with empty cart"""
        data = {
            "amount": 0,
            "currency": "INR",
            "cart": [],
            "customer_info": {}
        }
        
        return self.run_test(
            "Create Razorpay Order with Empty Cart",
            "POST",
            "/api/create-razorpay-order",
            params=data
        )

    def print_summary(self):
        """Print a summary of all test results"""
        print("\n" + "="*80)
        print(f"📊 TEST SUMMARY: {self.tests_passed}/{self.tests_run} tests passed")
        print("="*80)
        
        for i, result in enumerate(self.test_results, 1):
            status_icon = "✅" if result["status"] == "PASSED" else "❌"
            print(f"\n{i}. {status_icon} {result['name']}")
            
            if result["status"] == "PASSED":
                print(f"   Status Code: {result['response_code']}")
                print(f"   Response Preview: {result['response_preview'][:150]}...")
            elif result["status"] == "FAILED":
                print(f"   Expected Status: {result['expected_status']}, Got: {result['response_code']}")
                print(f"   Response Preview: {result['response_preview'][:150]}...")
            else:  # ERROR
                print(f"   Error: {result['error']}")
        
        print("\n" + "="*80)

def main():
    # Setup
    tester = UndhyuAPITester()
    
    print("\n=== TESTING FIXED RAZORPAY INTEGRATION ===")
    print("Testing areas mentioned in the review request:")
    print("1. Backend API Endpoints")
    print("2. Razorpay Integration")
    print("3. Error Handling")
    
    # 1. Test Backend API Endpoints
    print("\n--- Testing Backend API Endpoints ---")
    
    # Test health endpoint - Should show all services configured
    tester.test_health_endpoint()
    
    # Test orders endpoint - Should return empty array (no more 500 errors)
    tester.test_orders_endpoint()
    
    # Test products endpoint - Should still work for Shopify integration
    tester.test_products_endpoint()
    
    # 2. Test Razorpay Integration
    print("\n--- Testing Razorpay Integration ---")
    
    # Create a valid order with proper cart data
    cart_items = [
        {
            "id": "gid://shopify/Product/8145339646089",
            "title": "PREMIUM LICHI PASHMINA SILK",
            "quantity": 1,
            "price": 1999.00,
            "handle": "premium-lichi-pashmina-silk",
            "variant_id": "gid://shopify/ProductVariant/44618429776009",
            "image_url": "https://cdn.shopify.com/s/files/1/0719/3798/8049/products/1_e9e8b4e5-f0e5-4abb-a3c0-154d8e1c6b0c.jpg"
        }
    ]
    
    # Test creating a Razorpay order
    success, order_response = tester.test_create_razorpay_order(cart_items)
    
    # Verify the order ID format and response structure
    if success and "id" in order_response:
        order_id = order_response["id"]
        print(f"\n✅ Order ID format check: {order_id}")
        print(f"✅ Response contains expected fields: {', '.join(order_response.keys())}")
        
        # Test payment verification
        payment_id = f"pay_{uuid.uuid4().hex[:14]}"  # Mock payment ID
        tester.test_verify_payment(order_id, payment_id, cart_items)
        
        # Test invalid signature (error handling)
        tester.test_verify_payment_invalid_signature(order_id, payment_id)
    else:
        print("❌ Skipping payment verification tests due to order creation failure")
    
    # 3. Test Error Handling
    print("\n--- Testing Error Handling ---")
    
    # Test with empty cart
    tester.test_create_razorpay_order_empty_cart()
    
    # Print results
    tester.print_summary()
    
    # Check if all critical tests passed
    critical_tests_passed = all(
        result["status"] == "PASSED" 
        for result in tester.test_results 
        if result["name"] in [
            "Health Check Endpoint", 
            "Orders Endpoint", 
            "Create Razorpay Order"
        ]
    )
    
    if critical_tests_passed:
        print("\n✅ CRITICAL TESTS PASSED: The 405 error is fixed and Razorpay integration is working!")
    else:
        print("\n❌ CRITICAL TESTS FAILED: Some issues still remain with the Razorpay integration.")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
