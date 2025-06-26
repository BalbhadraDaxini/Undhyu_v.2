import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://7a93d17b-e192-4382-9350-73b0bd81f98b.preview.emergentagent.com';

function App() {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('CREATED_AT');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState('');
  const [currentView, setCurrentView] = useState('home');
  
  // Cart state
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Professional hero images inspired by Soch
  const heroImages = useMemo(() => [
    {
      url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb",
      alt: "Vibrant red saree with traditional jewelry"
    },
    {
      url: "https://images.unsplash.com/photo-1571908599407-cdb918ed83bf",
      alt: "Elegant cream ethnic outfit in boutique setting"
    },
    {
      url: "https://images.unsplash.com/photo-1619715613791-89d35b51ff81",
      alt: "Green traditional outfit with modern styling"
    }
  ], []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Collection categories like Soch
  const collectionCategories = [
    { name: 'All', handle: '', icon: '🌟' },
    { name: 'Festive Sarees', handle: 'festive-sarees', icon: '✨' },
    { name: 'Everyday Sarees', handle: 'everyday-sarees', icon: '👗' },
    { name: 'Party Wear', handle: 'party-wear', icon: '🎉' },
    { name: 'Wedding Collection', handle: 'wedding', icon: '💍' },
    { name: 'Ready to Wear', handle: 'ready-to-wear', icon: '⚡' }
  ];

  useEffect(() => {
    loadCollections();
    if (currentView === 'products') {
      loadProducts();
    }
  }, [currentView]);

  useEffect(() => {
    if (currentView === 'products') {
      loadProducts();
    }
  }, [selectedCollection, searchQuery, sortKey, priceRange]);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  const loadCollections = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/collections`);
      setCollections(response.data.collections || []);
    } catch (error) {
      console.error('Error loading collections:', error);
    }
  };

  const loadProducts = async (loadMore = false) => {
    setLoading(true);
    try {
      const params = {
        first: 24, // Match Soch's 24 items per page
        collection_handle: selectedCollection || undefined,
        search_query: searchQuery || undefined,
        sort_key: sortKey,
        after: loadMore ? endCursor : undefined,
        min_price: priceRange.min || undefined,
        max_price: priceRange.max || undefined,
      };

      const response = await axios.get(`${API_BASE_URL}/api/products`, { params });
      
      if (loadMore) {
        setProducts(prev => [...prev, ...response.data.products]);
      } else {
        setProducts(response.data.products);
      }
      
      setHasNextPage(response.data.pageInfo.hasNextPage);
      setEndCursor(response.data.pageInfo.endCursor);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const firstVariant = product.variants.edges[0]?.node;
    const firstImage = product.images.edges[0]?.node;
    
    if (!firstVariant) {
      alert('Product not available');
      return;
    }

    const cartItem = {
      id: product.id,
      title: product.title,
      handle: product.handle,
      quantity: 1,
      price: parseFloat(firstVariant.price.amount),
      variant_id: firstVariant.id,
      image_url: firstImage?.url || ''
    };

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, cartItem];
    });

    // Show cart briefly
    setShowCart(true);
    setTimeout(() => setShowCart(false), 2000);
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const processPayment = async (customerInfo = {}, quickBuyCart = null) => {
    const cartToUse = quickBuyCart || cart;
    
    if (cartToUse.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // If no customer info provided, collect it first
    if (!customerInfo.email) {
      const email = prompt('Please enter your email address:');
      const phone = prompt('Please enter your phone number:');
      const name = prompt('Please enter your full name:');
      const address = prompt('Please enter your delivery address:');
      const city = prompt('Please enter your city:');
      const pincode = prompt('Please enter your pincode:');
      
      if (!email || !phone || !name || !address || !city || !pincode) {
        alert('Please provide all required details to proceed with payment.');
        return;
      }
      
      customerInfo = {
        email,
        phone,
        first_name: name.split(' ')[0] || name,
        last_name: name.split(' ').slice(1).join(' ') || '',
        address,
        city,
        pincode,
        state: '',
        country: 'India'
      };
    }

    setPaymentLoading(true);

    try {
      const totalAmount = Math.round(cartToUse.reduce((total, item) => total + (item.price * item.quantity), 0) * 100); // Convert to paise

      // Create Razorpay order
      const orderResponse = await axios.post(`${API_BASE_URL}/api/create-razorpay-order`, {
        amount: totalAmount,
        currency: 'INR',
        cart: cartToUse,
        customer_info: customerInfo
      });

      const { id: order_id, amount, currency, key } = orderResponse.data;

      // Razorpay payment options
      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: 'Undhyu.com',
        description: 'Authentic Indian Fashion',
        order_id: order_id,
        handler: async function (response) {
          try {
            setPaymentLoading(true);
            // Verify payment
            const verifyResponse = await axios.post(`${API_BASE_URL}/api/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cart: cartToUse,
              customer_info: customerInfo
            });

            if (verifyResponse.data.success) {
              alert('🎉 Payment successful! Your order has been placed and will appear in your Shopify admin.');
              setCart([]); // Clear cart
              setShowCart(false);
              // Redirect to a success page or refresh
              window.location.reload();
            } else {
              alert('❌ Payment verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('❌ Payment verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id);
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: customerInfo.first_name + ' ' + customerInfo.last_name,
          email: customerInfo.email,
          contact: customerInfo.phone
        },
        theme: {
          color: '#000000'
        },
        modal: {
          ondismiss: function() {
            setPaymentLoading(false);
            alert('Payment cancelled. You can try again anytime.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        setPaymentLoading(false);
        alert('❌ Payment failed: ' + response.error.description);
      });
      
      rzp.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('❌ Failed to initiate payment. Please try again.');
      setPaymentLoading(false);
    }
  };

  const quickBuyProduct = (product) => {
    const firstVariant = product.variants.edges[0]?.node;
    const firstImage = product.images.edges[0]?.node;
    
    if (!firstVariant) {
      alert('Product not available');
      return;
    }

    const quickCart = [{
      id: product.id,
      title: product.title,
      handle: product.handle,
      quantity: 1,
      price: parseFloat(firstVariant.price.amount),
      variant_id: firstVariant.id,
      image_url: firstImage?.url || ''
    }];

    // Process payment directly with the quick cart
    processPayment({}, quickCart);
  };

  const handleProductClick = (product) => {
    window.open(`https://${process.env.REACT_APP_SHOPIFY_DOMAIN || 'j0dktb-z1.myshopify.com'}/products/${product.handle}`, '_blank');
  };

  const handleLoadMore = () => {
    if (hasNextPage && !loading) {
      loadProducts(true);
    }
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const ProductCard = ({ product }) => {
    const firstImage = product.images.edges[0]?.node;
    const firstVariant = product.variants.edges[0]?.node;
    const hasDiscount = firstVariant?.compareAtPrice;
    
    return (
      <div className="product-card group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div className="relative overflow-hidden">
          {firstImage && (
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={firstImage.url}
                alt={firstImage.altText || product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onClick={() => handleProductClick(product)}
              />
            </div>
          )}
          
          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              {Math.round(((parseFloat(firstVariant.compareAtPrice.amount) - parseFloat(firstVariant.price.amount)) / parseFloat(firstVariant.compareAtPrice.amount)) * 100)}% OFF
            </div>
          )}
          
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => addToCart(product)}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
              title="Add to Cart"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 text-sm leading-relaxed">
            {product.title}
          </h3>
          
          {firstVariant && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(firstVariant.price.amount)}
              </span>
              {firstVariant.compareAtPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(firstVariant.compareAtPrice.amount)}
                </span>
              )}
            </div>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-black text-white py-2 px-3 rounded text-xs font-medium hover:bg-gray-800 transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={() => quickBuyProduct(product)}
              className="flex-1 border border-black text-black py-2 px-3 rounded text-xs font-medium hover:bg-black hover:text-white transition-colors"
            >
              Buy Now
            </button>
          </div>
          
          <p className="text-xs text-gray-600 uppercase tracking-wide font-medium mt-2">{product.vendor}</p>
        </div>
      </div>
    );
  };

  const CartSidebar = () => {
    if (!showCart && cart.length === 0) return null;

    return (
      <div className={`fixed inset-0 z-50 ${showCart ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCart(false)}></div>
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Shopping Cart ({getCartCount()})</h2>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-4xl mb-4">🛒</div>
                  <p className="text-gray-600">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 border-b pb-4">
                      {item.image_url && (
                        <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover rounded" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{formatPrice(item.price)}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 border rounded text-xs hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 border rounded text-xs hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="border-t p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total: {formatPrice(getCartTotal())}</span>
                </div>
                <button
                  onClick={() => processPayment()}
                  disabled={paymentLoading}
                  className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentLoading ? 'Processing...' : 'Checkout'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const FeaturedCollections = () => {
    const featuredImages = [
      {
        url: "https://images.unsplash.com/photo-1571587289339-cb7da03fb5a6",
        title: "Wedding Collection",
        subtitle: "Exquisite designs for your special day"
      },
      {
        url: "https://images.pexels.com/photos/32451616/pexels-photo-32451616.jpeg", 
        title: "Festive Sarees",
        subtitle: "Celebrate in style"
      },
      {
        url: "https://images.unsplash.com/photo-1616583936499-d4116e7e2e76",
        title: "Everyday Elegance",
        subtitle: "Comfort meets sophistication"
      }
    ];

    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Collections</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our curated selection of the finest Indian ethnic wear
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredImages.map((item, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-white/90">{item.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const FeaturedProducts = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loadingFeatured, setLoadingFeatured] = useState(true);

    useEffect(() => {
      loadFeaturedProducts();
    }, []);

    const loadFeaturedProducts = async () => {
      setLoadingFeatured(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products`, { 
          params: { 
            first: 8, // Show 8 products on homepage
            sort_key: 'BEST_SELLING' 
          } 
        });
        setFeaturedProducts(response.data.products || []);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setLoadingFeatured(false);
      }
    };

    return (
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trending Now</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular sarees and ethnic wear loved by customers
            </p>
          </div>

          {loadingFeatured ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="text-center mt-12">
                <button
                  onClick={() => setCurrentView('products')}
                  className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg"
                >
                  View All Products
                </button>
              </div>
            </>
          )}

          {featuredProducts.length === 0 && !loadingFeatured && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">👗</div>
              <h3 className="text-xl font-semibold mb-2">No featured products yet</h3>
              <p className="text-gray-600">Add some products to your Shopify store to see them here</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const CollectionFilter = () => {
    return (
      <div className="flex flex-wrap gap-2 mb-6">
        {collectionCategories.map((category) => (
          <button
            key={category.handle}
            onClick={() => setSelectedCollection(category.handle)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCollection === category.handle
                ? 'bg-black text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
    );
  };

  const HeroSection = () => {
    return (
      <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="absolute inset-0">
          <img
            src={heroImages[currentImageIndex].url}
            alt={heroImages[currentImageIndex].alt}
            className="w-full h-full object-cover transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Undhyu<span className="text-pink-300">.</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-4">
                Explore Wide Range of Indian Sarees
              </p>
              <p className="text-lg text-white/80 mb-8">
                Traditional and ready-made साड़ी, perfect for wedding, festivals, parties and special occasions
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentView('products')}
                  className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
                >
                  Shop Sarees
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-200">
                  View Collection
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Image indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  const ProductsView = () => {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sarees</h1>
            <p className="text-gray-600 mt-1">{products.length} products found</p>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            >
              <option value="CREATED_AT">What's New</option>
              <option value="BEST_SELLING">Best Seller</option>
              <option value="PRICE">Price - Low To High</option>
              <option value="TITLE">Name A-Z</option>
              <option value="RELEVANCE">Recommended</option>
            </select>
          </div>
        </div>
        
        {/* Filters */}
        <div className="mb-8">
          <CollectionFilter />
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search sarees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>
            
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min ₹"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading && products.length === 0 ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading beautiful collections...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {hasNextPage && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-8 py-3 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👗</div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Undhyu<span className="text-pink-500">.</span>
              </h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setCurrentView('home')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  currentView === 'home' 
                    ? 'text-black border-b-2 border-black pb-1' 
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView('products')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  currentView === 'products' 
                    ? 'text-black border-b-2 border-black pb-1' 
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                Sarees
              </button>
              <button className="text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200">
                Collections
              </button>
              <button className="text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200">
                New Arrivals
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-700 hover:text-black">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="p-2 text-gray-700 hover:text-black">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button 
                onClick={() => setShowCart(true)}
                className="p-2 text-gray-700 hover:text-black relative"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main>
        {currentView === 'home' ? (
          <>
            <HeroSection />
            <FeaturedCollections />
            <FeaturedProducts />
          </>
        ) : (
          <ProductsView />
        )}
      </main>
      
      {/* Cart Sidebar */}
      <CartSidebar />
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Undhyu.</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your destination for authentic Indian ethnic wear. 
                Explore our collection of sarees, suits, and traditional clothing.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Customer Care</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bulk Orders</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sell With Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📧 contact@undhyu.com</li>
                <li>📱 +91 98765 43210</li>
                <li>🌐 www.undhyu.com</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Undhyu.com - All rights reserved. Crafted with ❤️ for Indian fashion lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;