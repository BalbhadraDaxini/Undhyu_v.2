import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

// Mock product data with categories
const MOCK_PRODUCTS = [
  {
    id: 'product-1',
    title: 'Elegant Silk Saree - Royal Blue',
    handle: 'elegant-silk-saree-royal-blue',
    vendor: 'Traditional Wears',
    price: 2499.00,
    compareAtPrice: 3199.00,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400',
    description: 'Beautiful traditional silk saree perfect for weddings and special occasions.',
    inStock: true,
    category: 'sarees',
    color: 'blue',
    fabric: 'silk',
    occasion: 'wedding',
    region: 'banarasi',
    size: 'one-size',
    rating: 4.5,
    isNewArrival: true
  },
  {
    id: 'product-2',
    title: 'Designer Lehenga - Maroon & Gold',
    handle: 'designer-lehenga-maroon-gold',
    vendor: 'Ethnic Collection',
    price: 4999.00,
    compareAtPrice: 6499.00,
    image: 'https://images.unsplash.com/photo-1571587289339-cb7da03fb5a6?w=400',
    description: 'Stunning designer lehenga with intricate embroidery work.',
    inStock: true,
    category: 'lehengas',
    color: 'maroon',
    fabric: 'georgette',
    occasion: 'wedding',
    region: 'rajasthani',
    size: 's',
    rating: 4.8,
    isNewArrival: false
  },
  {
    id: 'product-3',
    title: 'Cotton Kurti Set - Floral Print',
    handle: 'cotton-kurti-set-floral',
    vendor: 'Daily Wear',
    price: 1299.00,
    compareAtPrice: null,
    image: 'https://images.unsplash.com/photo-1619715613791-89d35b51ff81?w=400',
    description: 'Comfortable cotton kurti set with beautiful floral patterns.',
    inStock: true,
    category: 'kurtis',
    color: 'multicolor',
    fabric: 'cotton',
    occasion: 'casual',
    region: 'modern',
    size: 'm',
    rating: 4.2,
    isNewArrival: true
  },
  {
    id: 'product-4',
    title: 'Traditional Banarasi Saree',
    handle: 'traditional-banarasi-saree',
    vendor: 'Heritage Silks',
    price: 3499.00,
    compareAtPrice: 4299.00,
    image: 'https://images.unsplash.com/photo-1571908599407-cdb918ed83bf?w=400',
    description: 'Authentic Banarasi saree with traditional gold zari work.',
    inStock: true,
    category: 'sarees',
    color: 'gold',
    fabric: 'silk',
    occasion: 'festival',
    region: 'banarasi',
    size: 'one-size',
    rating: 4.7,
    isNewArrival: false
  },
  {
    id: 'product-5',
    title: 'Party Wear Anarkali Kurti',
    handle: 'party-wear-anarkali',
    vendor: 'Party Collection',
    price: 2199.00,
    compareAtPrice: null,
    image: 'https://images.unsplash.com/photo-1616583936499-d4116e7e2e76?w=400',
    description: 'Elegant Anarkali kurti perfect for parties and celebrations.',
    inStock: true,
    category: 'kurtis',
    color: 'pink',
    fabric: 'georgette',
    occasion: 'party',
    region: 'modern',
    size: 'l',
    rating: 4.3,
    isNewArrival: true
  },
  {
    id: 'product-6',
    title: 'Georgette Saree - Pink & Silver',
    handle: 'georgette-saree-pink-silver',
    vendor: 'Modern Drapes',
    price: 1899.00,
    compareAtPrice: 2399.00,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400',
    description: 'Lightweight georgette saree with modern design elements.',
    inStock: true,
    category: 'sarees',
    color: 'pink',
    fabric: 'georgette',
    occasion: 'party',
    region: 'modern',
    size: 'one-size',
    rating: 4.1,
    isNewArrival: false
  },
  {
    id: 'product-7',
    title: 'Wedding Lehenga - Red & Gold',
    handle: 'wedding-lehenga-red-gold',
    vendor: 'Bridal Collection',
    price: 7999.00,
    compareAtPrice: 9999.00,
    image: 'https://images.unsplash.com/photo-1571587289339-cb7da03fb5a6?w=400',
    description: 'Luxurious bridal lehenga with heavy embellishment work.',
    inStock: true,
    category: 'lehengas',
    color: 'red',
    fabric: 'silk',
    occasion: 'wedding',
    region: 'punjabi',
    size: 'm',
    rating: 4.9,
    isNewArrival: false
  },
  {
    id: 'product-8',
    title: 'Casual Kurti Set - Blue',
    handle: 'casual-kurti-set-blue',
    vendor: 'Everyday Comfort',
    price: 899.00,
    compareAtPrice: null,
    image: 'https://images.unsplash.com/photo-1619715613791-89d35b51ff81?w=400',
    description: 'Comfortable and stylish kurti set for daily wear.',
    inStock: true,
    category: 'kurtis',
    color: 'blue',
    fabric: 'cotton',
    occasion: 'casual',
    region: 'modern',
    size: 's',
    rating: 4.0,
    isNewArrival: true
  },
  {
    id: 'product-9',
    title: 'Traditional Gold Earrings',
    handle: 'traditional-gold-earrings',
    vendor: 'Heritage Jewelry',
    price: 3999.00,
    compareAtPrice: 4999.00,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
    description: 'Elegant traditional gold earrings with intricate design.',
    inStock: true,
    category: 'jewelry',
    color: 'gold',
    fabric: 'gold',
    occasion: 'wedding',
    region: 'traditional',
    size: 'one-size',
    rating: 4.6,
    isNewArrival: true
  },
  {
    id: 'product-10',
    title: 'Silver Necklace Set',
    handle: 'silver-necklace-set',
    vendor: 'Modern Jewelry',
    price: 2499.00,
    compareAtPrice: null,
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400',
    description: 'Beautiful silver necklace set perfect for any occasion.',
    inStock: true,
    category: 'jewelry',
    color: 'silver',
    fabric: 'silver',
    occasion: 'party',
    region: 'modern',
    size: 'one-size',
    rating: 4.4,
    isNewArrival: false
  }
];

// Cart Context
const CartContext = React.createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

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

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{
      cart,
      showCart,
      setShowCart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      getCartTotal,
      getCartCount,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Header Component
function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getCartCount, setShowCart } = useCart();
  const location = useLocation();

  const navigationItems = [
    { name: 'Sarees', path: '/sarees' },
    { name: 'Lehengas', path: '/lehengas' },
    { name: 'Kurtis', path: '/kurtis' },
    { name: 'Jewelry', path: '/jewelry' },
    { name: 'New Arrivals', path: '/new-arrivals' },
    { name: 'Collections', path: '/collections' }
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              Undhyu<span className="text-pink-500">.</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-black border-b-2 border-black pb-1'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                {item.name}
              </Link>
            ))}
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
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center cart-badge">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block py-2 text-sm font-medium ${
                  location.pathname === item.path
                    ? 'text-black font-semibold'
                    : 'text-gray-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

// Hero Section Component
function HeroSection() {
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
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

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
              Explore Wide Range of Indian Ethnic Wear
            </p>
            <p className="text-lg text-white/80 mb-8">
              Traditional and ready-made clothing, perfect for wedding, festivals, parties and special occasions
            </p>
            <div className="flex gap-4">
              <Link
                to="/collections"
                className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              >
                Shop Now
              </Link>
              <Link
                to="/collections"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-200"
              >
                Explore Collections
              </Link>
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
  );
}

// Product Card Component
function ProductCard({ product, showQuickActions = true }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const hasDiscount = product.compareAtPrice;

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const handleBuyNow = () => {
    navigate('/checkout', { state: { product } });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">★</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">☆</span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">☆</span>
      );
    }

    return stars;
  };

  return (
    <div className="product-card group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
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

        {product.isNewArrival && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
            New
          </div>
        )}
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-black px-3 py-1 rounded text-sm font-medium">Out of Stock</span>
          </div>
        )}
        
        {showQuickActions && (
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
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 text-sm leading-relaxed">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {renderStars(product.rating)}
          <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
        </div>
        
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
            onClick={handleBuyNow}
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
}

// Homepage Component
function Homepage() {
  const collections = [
    {
      name: 'Wedding Collection',
      image: 'https://images.unsplash.com/photo-1571587289339-cb7da03fb5a6?w=400',
      path: '/collections',
      description: 'Exquisite designs for your special day'
    },
    {
      name: 'Festive Sarees',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400',
      path: '/sarees',
      description: 'Celebrate in style'
    },
    {
      name: 'Casual Wear',
      image: 'https://images.unsplash.com/photo-1619715613791-89d35b51ff81?w=400',
      path: '/kurtis',
      description: 'Comfort meets elegance'
    }
  ];

  const newArrivals = MOCK_PRODUCTS.filter(product => product.isNewArrival).slice(0, 4);

  return (
    <div>
      <HeroSection />
      
      {/* Collections Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Collections</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our curated selection of the finest Indian ethnic wear
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <Link
                key={index}
                to={collection.path}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                    <p className="text-white/90">{collection.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* New Arrivals Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">New Arrivals</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our latest additions to the collection
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/new-arrivals"
              className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg"
            >
              View All New Arrivals
            </Link>
          </div>
        </div>
      </div>

      {/* Uniqueness Highlight Section */}
      <div className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Handpicked Across India</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the rich cultural heritage and exquisite craftsmanship from every corner of India
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentic Craftsmanship</h3>
                    <p className="text-gray-600">Each piece is carefully crafted by skilled artisans using traditional techniques passed down through generations.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Regional Diversity</h3>
                    <p className="text-gray-600">From Banarasi silks to Kanjeevaram sarees, discover the unique styles from different states of India.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Quality</h3>
                    <p className="text-gray-600">We source only the finest fabrics and materials to ensure each garment meets our high standards of quality.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1571908599407-cdb918ed83bf?w=600"
                alt="Indian craftsperson at work"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
                <p className="text-2xl font-bold text-gray-900">15+</p>
                <p className="text-sm text-gray-600">States Represented</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Category Page Component
function CategoryPage({ category, title }) {
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    color: '',
    fabric: '',
    size: '',
    occasion: '',
    region: ''
  });
  const [sortBy, setSortBy] = useState('featured');

  const categoryProducts = MOCK_PRODUCTS.filter(product => 
    category === 'new-arrivals' ? product.isNewArrival : product.category === category
  );

  const filteredProducts = categoryProducts.filter(product => {
    return (
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1] &&
      (!filters.color || product.color === filters.color) &&
      (!filters.fabric || product.fabric === filters.fabric) &&
      (!filters.size || product.size === filters.size) &&
      (!filters.occasion || product.occasion === filters.occasion) &&
      (!filters.region || product.region === filters.region)
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const uniqueValues = {
    colors: [...new Set(categoryProducts.map(p => p.color))],
    fabrics: [...new Set(categoryProducts.map(p => p.fabric))],
    sizes: [...new Set(categoryProducts.map(p => p.size))],
    occasions: [...new Set(categoryProducts.map(p => p.occasion))],
    regions: [...new Set(categoryProducts.map(p => p.region))]
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      color: '',
      fabric: '',
      size: '',
      occasion: '',
      region: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={resetFilters}
                className="text-sm text-pink-600 hover:text-pink-800"
              >
                Clear All
              </button>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: [0, parseInt(e.target.value)]
                  }))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹0</span>
                  <span>₹{filters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Color Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Color</h4>
              <select
                value={filters.color}
                onChange={(e) => setFilters(prev => ({ ...prev, color: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Colors</option>
                {uniqueValues.colors.map(color => (
                  <option key={color} value={color}>{color.charAt(0).toUpperCase() + color.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Fabric Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Fabric</h4>
              <select
                value={filters.fabric}
                onChange={(e) => setFilters(prev => ({ ...prev, fabric: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Fabrics</option>
                {uniqueValues.fabrics.map(fabric => (
                  <option key={fabric} value={fabric}>{fabric.charAt(0).toUpperCase() + fabric.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Size Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Size</h4>
              <select
                value={filters.size}
                onChange={(e) => setFilters(prev => ({ ...prev, size: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Sizes</option>
                {uniqueValues.sizes.map(size => (
                  <option key={size} value={size}>{size.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Occasion Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Occasion</h4>
              <select
                value={filters.occasion}
                onChange={(e) => setFilters(prev => ({ ...prev, occasion: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Occasions</option>
                {uniqueValues.occasions.map(occasion => (
                  <option key={occasion} value={occasion}>{occasion.charAt(0).toUpperCase() + occasion.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Region</h4>
              <select
                value={filters.region}
                onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Regions</option>
                {uniqueValues.regions.map(region => (
                  <option key={region} value={region}>{region.charAt(0).toUpperCase() + region.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Side - Products */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600 mt-1">{sortedProducts.length} products found</p>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price - Low To High</option>
                <option value="price-high">Price - High To Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters to see more results</p>
              <button
                onClick={resetFilters}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Cart Sidebar Component
function CartSidebar() {
  const { cart, showCart, setShowCart, removeFromCart, updateCartQuantity, getCartTotal, getCartCount } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const handleCheckout = () => {
    setShowCart(false);
    navigate('/checkout');
  };

  if (!showCart) return null;

  return (
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
          
          <div className="flex-1 overflow-y-auto p-4 cart-sidebar">
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
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Checkout Component
function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle single product checkout from Buy Now
  const singleProduct = location.state?.product;
  const checkoutItems = singleProduct ? [{ ...singleProduct, quantity: 1 }] : cart;
  
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
  
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastOrderId, setLastOrderId] = useState('');

  const total = singleProduct ? singleProduct.price : getCartTotal();

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const generateOrderId = () => {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const simulatePaymentProcessing = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        resolve(success);
      }, 2000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!customerInfo.email || !customerInfo.phone || !customerInfo.first_name || 
        !customerInfo.address || !customerInfo.city || !customerInfo.pincode) {
      alert('Please fill in all required fields');
      return;
    }

    setPaymentLoading(true);

    try {
      const orderId = generateOrderId();
      setLastOrderId(orderId);
      
      const paymentSuccess = await simulatePaymentProcessing();
      
      if (paymentSuccess) {
        setShowSuccessModal(true);
        
        if (!singleProduct) {
          clearCart();
        }
        
        // Store order in localStorage
        const orderData = {
          id: orderId,
          items: checkoutItems,
          customer: customerInfo,
          total: total,
          date: new Date().toISOString(),
          status: 'confirmed'
        };
        
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        existingOrders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(existingOrders));
        
      } else {
        alert('❌ Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('❌ Payment processing failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <Link
          to="/"
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Customer Information Form */}
        <div>
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
              
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
            </div>

            <button
              type="submit"
              disabled={paymentLoading}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paymentLoading ? 'Processing Payment...' : `Place Order - ${formatPrice(total)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              {checkoutItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 border-b pb-4">
                  <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.title}</h3>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    <p className="text-gray-900 font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 text-center success-modal">
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
    </div>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Undhyu.</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your destination for authentic Indian ethnic wear. 
              Explore our collection of sarees, lehengas, kurtis, and traditional jewelry.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="/bulk-orders" className="hover:text-white transition-colors">Bulk Orders</Link></li>
              <li><Link to="/sell-with-us" className="hover:text-white transition-colors">Sell With Us</Link></li>
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
  );
}

// Main App Component
function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App min-h-screen bg-white">
          <Header />
          
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/sarees" element={<CategoryPage category="sarees" title="Sarees" />} />
            <Route path="/lehengas" element={<CategoryPage category="lehengas" title="Lehengas" />} />
            <Route path="/kurtis" element={<CategoryPage category="kurtis" title="Kurtis" />} />
            <Route path="/jewelry" element={<CategoryPage category="jewelry" title="Jewelry" />} />
            <Route path="/new-arrivals" element={<CategoryPage category="new-arrivals" title="New Arrivals" />} />
            <Route path="/collections" element={<CategoryPage category="all" title="All Collections" />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
          
          <CartSidebar />
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;