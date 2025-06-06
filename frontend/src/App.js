import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://c13e2433-9270-4f3d-befd-9404fe8b16ae.preview.emergentagent.com';

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

  // Memoized hero images for performance
  const heroImages = useMemo(() => [
    {
      url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
      alt: "Beautiful red saree with gold embellishments"
    },
    {
      url: "https://images.unsplash.com/photo-1574847872646-abff244bbd87", 
      alt: "Vibrant yellow lehenga with pink dupatta"
    },
    {
      url: "https://images.unsplash.com/photo-1619715613791-89d35b51ff81",
      alt: "Elegant green lehenga with intricate embroidery"
    }
  ], []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const loadCollections = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/collections/featured`);
      setCollections(response.data.collections || []);
    } catch (error) {
      console.error('Error loading collections:', error);
    }
  };

  const loadProducts = async (loadMore = false) => {
    setLoading(true);
    try {
      const params = {
        first: 20,
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

  const handleProductClick = (product) => {
    window.open(`https://j0dktb-z1.myshopify.com/products/${product.handle}`, '_blank');
  };

  const handleLoadMore = () => {
    if (hasNextPage && !loading) {
      loadProducts(true);
    }
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price.amount).toLocaleString('en-IN')}`;
  };

  const ProductCard = ({ product }) => {
    const firstImage = product.images.edges[0]?.node;
    const firstVariant = product.variants.edges[0]?.node;
    
    return (
      <div 
        className="product-card group cursor-pointer transform transition-all duration-300 hover:scale-105"
        onClick={() => handleProductClick(product)}
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-100 hover:shadow-2xl transition-shadow duration-300">
          {firstImage && (
            <div className="relative overflow-hidden h-64">
              <img
                src={firstImage.url}
                alt={firstImage.altText || product.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          )}
          
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2 group-hover:text-orange-600 transition-colors">
              {product.title}
            </h3>
            
            {firstVariant && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-bold text-orange-600">
                  {formatPrice(firstVariant.price)}
                </span>
                {firstVariant.compareAtPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(firstVariant.compareAtPrice)}
                  </span>
                )}
              </div>
            )}
            
            <p className="text-gray-600 text-sm mb-2 font-medium">{product.vendor}</p>
            
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="bg-orange-50 text-orange-700 px-2 py-1 rounded-full text-xs border border-orange-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CollectionFilter = () => {
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setSelectedCollection('')}
          className={`px-4 py-2 rounded-full border transition-all duration-200 ${
            selectedCollection === ''
              ? 'bg-orange-600 text-white border-orange-600 shadow-lg'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-orange-50 hover:border-orange-300'
          }`}
        >
          All Products
        </button>
        
        {collections.map((collection) => (
          <button
            key={collection.id}
            onClick={() => setSelectedCollection(collection.handle)}
            className={`px-4 py-2 rounded-full border transition-all duration-200 ${
              selectedCollection === collection.handle
                ? 'bg-orange-600 text-white border-orange-600 shadow-lg'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-orange-50 hover:border-orange-300'
            }`}
          >
            {collection.title}
          </button>
        ))}
      </div>
    );
  };

  const HeroSection = () => {
    return (
      <div className="relative h-96 md:h-[500px] overflow-hidden rounded-3xl mx-4 my-8 shadow-2xl">
        <div className="absolute inset-0">
          <img
            src={heroImages[currentImageIndex].url}
            alt={heroImages[currentImageIndex].alt}
            className="w-full h-full object-cover transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-4xl mx-auto px-6 text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Welcome to <span className="text-orange-400">Undhyu</span>
            </h1>
            <p className="text-xl md:text-2xl mb-6 opacity-90">
              Discover the finest collection of authentic Indian women's apparel
            </p>
            <p className="text-lg mb-8 opacity-80">
              From the silk sarees of Banaras to the vibrant lehengas of Jaipur, 
              explore traditional craftsmanship from across India
            </p>
            <button
              onClick={() => setCurrentView('products')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Shop Collection
            </button>
          </div>
        </div>

        {/* Image indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
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
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Our Exquisite Collection</h2>
        
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <CollectionFilter />
          
          <div className="flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-w-64"
            />
            
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="CREATED_AT">Newest First</option>
              <option value="TITLE">Name A-Z</option>
              <option value="PRICE">Price Low-High</option>
              <option value="BEST_SELLING">Best Selling</option>
              <option value="RELEVANCE">Most Relevant</option>
            </select>
            
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min Price"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 w-24"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 w-24"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading && products.length === 0 ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading beautiful collections...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {hasNextPage && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                >
                  {loading ? 'Loading...' : 'Load More Products'}
                </button>
              </div>
            )}
          </>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center py-16 text-gray-500">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl">No products found</p>
            <p>Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    );
  };

  const AboutSection = () => {
    return (
      <div className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Crafted Across India</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Undhyu brings you authentic Indian fashion from the most celebrated regions, 
              where tradition meets contemporary elegance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🕌</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Banaras Silk</h3>
              <p className="text-gray-600">Timeless silk sarees woven with golden threads, representing centuries of craftsmanship</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">👑</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Jaipur Royalty</h3>
              <p className="text-gray-600">Regal lehengas and suits inspired by Rajasthani royal heritage and vibrant culture</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Gujarat Artistry</h3>
              <p className="text-gray-600">Intricate bandhani work and mirror embellishments showcasing Gujarat's rich textile tradition</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ContactSection = () => {
    return (
      <div className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-gray-300 mb-6">
                Have questions about our products or need styling advice? 
                Our team is here to help you find the perfect outfit.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                    📧
                  </span>
                  <span>contact@undhyu.com</span>
                </div>
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                    📱
                  </span>
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                    🌐
                  </span>
                  <span>www.undhyu.com</span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6">Sell With Us</h2>
              <p className="text-gray-300 mb-6">
                Are you a craftsperson or designer? Join our platform to showcase 
                your authentic Indian fashion to customers worldwide.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center mr-3 mt-1">
                    ✨
                  </span>
                  <span>Showcase your authentic designs</span>
                </div>
                <div className="flex items-start">
                  <span className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center mr-3 mt-1">
                    🤝
                  </span>
                  <span>Partner with established artisans</span>
                </div>
                <div className="flex items-start">
                  <span className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center mr-3 mt-1">
                    📈
                  </span>
                  <span>Grow your business nationwide</span>
                </div>
              </div>
              
              <button className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full transition-colors duration-200">
                Become a Partner
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="App min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-2 border-orange-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                <span className="text-orange-600">Undhyu</span>.com
              </h1>
              <span className="ml-2 text-sm text-gray-600 italic">Authentic Indian Fashion</span>
            </div>
            
            <nav className="flex space-x-6">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                  currentView === 'home' 
                    ? 'bg-orange-600 text-white' 
                    : 'text-gray-700 hover:text-orange-600'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView('products')}
                className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                  currentView === 'products' 
                    ? 'bg-orange-600 text-white' 
                    : 'text-gray-700 hover:text-orange-600'
                }`}
              >
                Shop
              </button>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main>
        {currentView === 'home' ? (
          <>
            <HeroSection />
            <AboutSection />
            <ContactSection />
          </>
        ) : (
          <ProductsView />
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 border-t-2 border-orange-100">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p className="mb-2">&copy; 2025 Undhyu.com - Authentic Indian Fashion. All rights reserved.</p>
          <p className="text-sm">Bringing you the finest collection from Jaipur, Banaras, Gujarat and beyond</p>
        </div>
      </footer>
    </div>
  );
}

export default App;