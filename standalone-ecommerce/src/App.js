import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

// Mock product data - replace Shopify API
const MOCK_PRODUCTS = [
  {
    id: 'product-1',
    title: 'Elegant Silk Saree - Royal Blue',
    handle: 'elegant-silk-saree-royal-blue',
    vendor: 'Traditional Wears',
    price: 2499.00,
    compareAtPrice: 3199.00,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400',
      'https://images.unsplash.com/photo-1571908599407-cdb918ed83bf?w=400'
    ],
    description: 'Beautiful traditional silk saree perfect for weddings and special occasions.',
    inStock: true
  },
  {
    id: 'product-2',
    title: 'Designer Lehenga - Maroon & Gold',
    handle: 'designer-lehenga-maroon-gold',
    vendor: 'Ethnic Collection',
    price: 4999.00,
    compareAtPrice: 6499.00,
    image: 'https://images.unsplash.com/photo-1571587289339-cb7da03fb5a6?w=400',
    images: [
      'https://images.unsplash.com/photo-1571587289339-cb7da03fb5a6?w=400'
    ],
    description: 'Stunning designer lehenga with intricate embroidery work.',
    inStock: true
  },
  {
    id: 'product-3',
    title: 'Cotton Suit Set - Floral Print',
    handle: 'cotton-suit-set-floral',
    vendor: 'Daily Wear',
    price: 1299.00,
    compareAtPrice: null,
    image: 'https://images.unsplash.com/photo-1619715613791-89d35b51ff81?w=400',
    images: [
      'https://images.unsplash.com/photo-1619715613791-89d35b51ff81?w=400'
    ],
    description: 'Comfortable cotton suit set with beautiful floral patterns.',
    inStock: true
  },
  {
    id: 'product-4',
    title: 'Traditional Banarasi Saree',
    handle: 'traditional-banarasi-saree',
    vendor: 'Heritage Silks',
    price: 3499.00,
    compareAtPrice: 4299.00,
    image: 'https://images.unsplash.com/photo-1571908599407-cdb918ed83bf?w=400',
    images: [
      'https://images.unsplash.com/photo-1571908599407-cdb918ed83bf?w=400'
    ],
    description: 'Authentic Banarasi saree with traditional gold zari work.',
    inStock: true
  },
  {
    id: 'product-5',
    title: 'Party Wear Anarkali Dress',
    handle: 'party-wear-anarkali',
    vendor: 'Party Collection',
    price: 2199.00,
    compareAtPrice: null,
    image: 'https://images.unsplash.com/photo-1616583936499-d4116e7e2e76?w=400',
    images: [
      'https://images.unsplash.com/photo-1616583936499-d4116e7e2e76?w=400'
    ],
    description: 'Elegant Anarkali dress perfect for parties and celebrations.',
    inStock: true
  },
  {
    id: 'product-6',
    title: 'Georgette Saree - Pink & Silver',
    handle: 'georgette-saree-pink-silver',
    vendor: 'Modern Drapes',
    price: 1899.00,
    compareAtPrice: 2399.00,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400'
    ],
    description: 'Lightweight georgette saree with modern design elements.',
    inStock: true
  },
  {
    id: 'product-7',
    title: 'Wedding Lehenga - Red & Gold',
    handle: 'wedding-lehenga-red-gold',
    vendor: 'Bridal Collection',
    price: 7999.00,
    compareAtPrice: 9999.00,
    image: 'https://images.unsplash.com/photo-1571587289339-cb7da03fb5a6?w=400',
    images: [
      'https://images.unsplash.com/photo-1571587289339-cb7da03fb5a6?w=400'
    ],
    description: 'Luxurious bridal lehenga with heavy embellishment work.',
    inStock: true
  },
  {
    id: 'product-8',
    title: 'Casual Kurti Set - Blue',
    handle: 'casual-kurti-set-blue',
    vendor: 'Everyday Comfort',
    price: 899.00,
    compareAtPrice: null,
    image: 'https://images.unsplash.com/photo-1619715613791-89d35b51ff81?w=400',
    images: [
      'https://images.unsplash.com/photo-1619715613791-89d35b51ff81?w=400'
    ],
    description: 'Comfortable and stylish kurti set for daily wear.',
    inStock: true
  }
];

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [pendingCart, setPendingCart] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastOrderId, setLastOrderId] = useState('');

  // Professional hero images
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

  useEffect(() => {
    // Simulate API loading delay
    setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
    }, 1000);
  }, []);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const addToCart = (product) => {
    if (!product.inStock) {
      alert('Product is out of stock');
      return;
    }

    const cartItem = {
      id: product.id,
      title: product.title,
      handle: product.handle,
      quantity: 1,
      price: product.price,
      image: product.image
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

  const startCheckout = (quickBuyCart = null) => {
    const cartToUse = quickBuyCart || cart;
    
    if (cartToUse.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setPendingCart(cartToUse);
    setShowCustomerForm(true);
  };

  const generateOrderId = () => {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const simulatePaymentProcessing = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 90% success rate
        const success = Math.random() > 0.1;
        resolve(success);
      }, 2000);
    });
  };

  const proceedWithPayment = async () => {
    if (!customerInfo.email || !customerInfo.phone || !customerInfo.first_name || 
        !customerInfo.address || !customerInfo.city || !customerInfo.pincode) {
      alert('Please fill in all required fields');
      return;
    }

    setPaymentLoading(true);
    setShowCustomerForm(false);

    try {
      // Simulate payment processing
      const orderId = generateOrderId();
      setLastOrderId(orderId);
      
      const paymentSuccess = await simulatePaymentProcessing();
      
      if (paymentSuccess) {
        // Success flow
        setShowSuccessModal(true);
        setCart([]);
        setShowCart(false);
        setPendingCart(null);
        
        // Reset customer info
        setCustomerInfo({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India'
        });
        
        // Store order in localStorage for demo purposes
        const orderData = {
          id: orderId,
          items: pendingCart,
          customer: customerInfo,
          total: pendingCart.reduce((total, item) => total + (item.price * item.quantity), 0),
          date: new Date().toISOString(),
          status: 'confirmed'
        };
        
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        existingOrders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(existingOrders));
        
      } else {
        // Payment failed
        alert('❌ Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('❌ Payment processing failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const quickBuyProduct = (product) => {
    if (!product.inStock) {
      alert('Product is out of stock');
      return;
    }

    const quickCart = [{
      id: product.id,
      title: product.title,
      handle: product.handle,
      quantity: 1,
      price: product.price,
      image: product.image
    }];

    startCheckout(quickCart);
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
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
              <button className="text-sm font-medium text-black border-b-2 border-black pb-1">
                Home
              </button>
              <button className="text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200">
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
      
      {/* Hero Section */}
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
                <button className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg">
                  Shop Sarees
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-200">
                  View Collection
                </button>
              </div>
            </div>
          </div>
        </div>

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

      {/* Products Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our curated selection of authentic Indian sarees and ethnic wear
            </p>
          </div>

          {loading ? (
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => {
                const hasDiscount = product.compareAtPrice;
                
                return (
                  <div key={product.id} className="product-card group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="relative overflow-hidden">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      
                      {hasDiscount && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                          {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                        </div>
                      )}
                      
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-white text-black px-3 py-1 rounded text-sm font-medium">Out of Stock</span>
                        </div>
                      )}
                      
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="flex-1 bg-black text-white py-2 px-3 rounded text-xs font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        <button
                          onClick={() => quickBuyProduct(product)}
                          disabled={!product.inStock}
                          className="flex-1 border border-black text-black py-2 px-3 rounded text-xs font-medium hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Buy Now
                        </button>
                      </div>
                      
                      <p className="text-xs text-gray-600 uppercase tracking-wide font-medium mt-2">{product.vendor}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {products.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">👗</div>
              <h3 className="text-xl font-semibold mb-2">No products available</h3>
              <p className="text-gray-600">Check back soon for our latest collection</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50">
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
                        <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
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
                    onClick={() => startCheckout()}
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
      )}

      {/* Customer Form Modal */}
      {showCustomerForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Delivery Information</h2>
                <button 
                  onClick={() => setShowCustomerForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); proceedWithPayment(); }}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.first_name}
                        onChange={(e) => setCustomerInfo({...customerInfo, first_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={customerInfo.last_name}
                        onChange={(e) => setCustomerInfo({...customerInfo, last_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                      placeholder="e.g., 9876543210"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                      rows="2"
                      placeholder="House/Flat No., Street, Area"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.city}
                        onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        pattern="[0-9]{6}"
                        value={customerInfo.pincode}
                        onChange={(e) => setCustomerInfo({...customerInfo, pincode: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                        placeholder="e.g., 110001"
                      />
                    </div>
                  </div>
                </div>
                
                {pendingCart && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-2">Order Summary</h3>
                    <div className="text-sm text-gray-600">
                      {pendingCart.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.title} x {item.quantity}</span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2 font-medium text-black">
                        <div className="flex justify-between">
                          <span>Total:</span>
                          <span>{formatPrice(pendingCart.reduce((total, item) => total + (item.price * item.quantity), 0))}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCustomerForm(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={paymentLoading}
                    className="flex-1 px-4 py-3 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {paymentLoading ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Order Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your order has been placed successfully.
            </p>
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="text-sm text-gray-600">Order ID:</p>
              <p className="font-mono text-lg font-semibold">{lastOrderId}</p>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              You will receive a confirmation email shortly with order details and tracking information.
            </p>
            <button
              onClick={closeSuccessModal}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {paymentLoading && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-lg font-medium">Processing Payment...</p>
            <p className="text-sm text-gray-600 mt-2">Please wait while we process your order</p>
          </div>
        </div>
      )}

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