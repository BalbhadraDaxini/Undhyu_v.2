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
    const hasDiscount = firstVariant?.compareAtPrice;
    
    return (
      <div 
        className="product-card group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
        onClick={() => handleProductClick(product)}
      >
        <div className="relative overflow-hidden">
          {firstImage && (
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={firstImage.url}
                alt={firstImage.altText || product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          
          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              {Math.round(((parseFloat(firstVariant.compareAtPrice.amount) - parseFloat(firstVariant.price.amount)) / parseFloat(firstVariant.compareAtPrice.amount)) * 100)}% OFF
            </div>
          )}
          
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 text-sm leading-relaxed">
            {product.title}
          </h3>
          
          {firstVariant && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(firstVariant.price)}
              </span>
              {firstVariant.compareAtPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(firstVariant.compareAtPrice)}
                </span>
              )}
            </div>
          )}
          
          <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">{product.vendor}</p>
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
  };

  return (
    <div className="App min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
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
              <button className="p-2 text-gray-700 hover:text-black">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
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
            <FeaturedProducts />
          </>
        ) : (
          <ProductsView />
        )}
      </main>
      
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