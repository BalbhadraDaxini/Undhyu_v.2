import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProducts, getFeaturedCollections } from '../utils/api';
import { HERO_IMAGES, FEATURED_COLLECTIONS } from '../utils/constants';
import ProductCard from '../components/ProductCard';
import CollectionCard from '../components/CollectionCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % HERO_IMAGES.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadHomePageData();
  }, []);

  const loadHomePageData = async () => {
    setLoading(true);
    try {
      // Load featured products and new arrivals
      const [featuredResponse, newArrivalsResponse] = await Promise.all([
        getProducts({ first: 8, sort_key: 'BEST_SELLING' }),
        getProducts({ first: 8, sort_key: 'CREATED_AT', reverse: true })
      ]);

      setFeaturedProducts(featuredResponse.products || []);
      setNewArrivals(newArrivalsResponse.products || []);

      // Try to load collections, fallback to static data
      try {
        const collectionsResponse = await getFeaturedCollections();
        setCollections(collectionsResponse.collections || FEATURED_COLLECTIONS);
      } catch (error) {
        console.log('Using fallback collections data');
        setCollections(FEATURED_COLLECTIONS);
      }

    } catch (error) {
      console.error('Error loading homepage data:', error);
      // Use fallback data
      setCollections(FEATURED_COLLECTIONS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGES[currentImageIndex].url}
            alt={HERO_IMAGES[currentImageIndex].alt}
            className="w-full h-full object-cover transition-all duration-1000"
          />
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl fade-in">
              <h1 className="hero-title text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-elegant">
                Undhyu<span className="text-pink-300">.</span>
              </h1>
              <p className="hero-subtitle text-xl md:text-2xl text-white/90 mb-4">
                Explore Wide Range of Indian Sarees
              </p>
              <p className="text-lg text-white/80 mb-8">
                Traditional and ready-made साड़ी, perfect for wedding, festivals, parties and special occasions
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  to="/sarees"
                  className="btn-primary bg-white text-black hover:bg-gray-100"
                >
                  Shop Sarees
                </Link>
                <Link 
                  to="/collections"
                  className="btn-secondary border-white text-white hover:bg-white hover:text-black"
                >
                  View Collection
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 slide-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-elegant">Featured Collections</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collections for every occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.slice(0, 4).map((collection, index) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                delay={index * 0.1}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/collections"
              className="btn-primary"
            >
              View All Collections
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 slide-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-elegant">New Arrivals</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Latest additions to our collection - fresh styles for the modern woman
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4 shimmer"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 shimmer"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 shimmer"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  delay={index * 0.1}
                  showBadge="new"
                />
              ))}
            </div>
          )}

          {!loading && newArrivals.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">👗</div>
              <h3 className="text-xl font-semibold mb-2">New arrivals coming soon</h3>
              <p className="text-gray-600">Check back soon for our latest collection</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/new-arrivals"
              className="btn-primary"
            >
              View All New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 slide-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-elegant">Best Sellers</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our most loved pieces - discover why these are customer favorites
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4 shimmer"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 shimmer"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 shimmer"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  delay={index * 0.1}
                  showBadge="bestseller"
                />
              ))}
            </div>
          )}

          {!loading && featuredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Featured products coming soon</h3>
              <p className="text-gray-600">Check back soon for our best sellers</p>
            </div>
          )}
        </div>
      </section>

      {/* Uniqueness Highlight Section */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center slide-up">
            <h2 className="text-4xl font-bold mb-8 font-elegant">Why Choose Undhyu?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center fade-in">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Authentic Quality</h3>
                <p className="text-white/90">
                  Handpicked traditional pieces with authentic craftsmanship and premium materials
                </p>
              </div>

              <div className="text-center fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Trusted by Thousands</h3>
                <p className="text-white/90">
                  Over 10,000+ satisfied customers across India trust us for their ethnic wear needs
                </p>
              </div>

              <div className="text-center fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm6 16H8a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h2v1a1 1 0 0 0 2 0V9h2v12a1 1 0 0 1-1 1z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
                <p className="text-white/90">
                  Safe and secure payments with easy returns and hassle-free exchange policy
                </p>
              </div>
            </div>

            <div className="mt-12">
              <Link
                to="/about"
                className="btn-secondary border-white text-white hover:bg-white hover:text-purple-700"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center slide-up">
          <h2 className="text-3xl font-bold mb-4 font-elegant">Ready to Explore Indian Fashion?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of women who have found their perfect ethnic wear with us
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/sarees"
              className="btn-primary bg-pink-600 hover:bg-pink-700"
            >
              Shop Sarees
            </Link>
            <Link
              to="/new-arrivals"
              className="btn-secondary border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-gray-900"
            >
              View New Arrivals
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;