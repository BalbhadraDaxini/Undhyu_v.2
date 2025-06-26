
import requests
import sys
import json
import hmac
import hashlib
import uuid
from datetime import datetime

class UndhyuAPITester:
    def __init__(self, base_url="https://7a93d17b-e192-4382-9350-73b0bd81f98b.preview.emergentagent.com"):
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
    
    # Test root endpoint
    tester.test_root_endpoint()
    
    # Test products endpoint with various filters
    tester.test_products_endpoint()
    tester.test_products_endpoint({"first": 5})
    tester.test_products_endpoint({"sort_key": "PRICE"})
    tester.test_products_endpoint({"search_query": "silk"})
    tester.test_products_endpoint({"min_price": 1000, "max_price": 5000})
    
    # Test specific product
    tester.test_product_by_handle("traditional-printed-silk-lehenga-choli-with-dupatta")
    
    # Test collections endpoints
    tester.test_collections_endpoint()
    tester.test_collections_endpoint({"first": 5})
    tester.test_featured_collections()
    
    # Print results
    tester.print_summary()
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
