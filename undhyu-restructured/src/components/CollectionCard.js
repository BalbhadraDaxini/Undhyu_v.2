import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CollectionCard = ({ collection, delay = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Use collection image or fallback to a default image
  const imageUrl = collection.image?.url || collection.image || 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb';

  return (
    <div 
      className="collection-card group cursor-pointer fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <Link to={`/collections`} className="block h-full">
        <div className="relative h-64 md:h-72 overflow-hidden rounded-lg shadow-lg">
          {/* Background Image */}
          {!imageLoaded && !imageError && (
            <div className="w-full h-full bg-gray-200 shimmer flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          )}
          
          {!imageError && (
            <img
              src={imageUrl}
              alt={collection.title}
              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
          
          {imageError && (
            <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <svg className="w-12 h-12 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            <h3 className="text-xl font-bold mb-2 group-hover:text-pink-300 transition-colors duration-300 font-elegant">
              {collection.title}
            </h3>
            
            {collection.description && (
              <p className="text-sm text-white/90 mb-4 line-clamp-2">
                {collection.description}
              </p>
            )}
            
            {/* Product Count (if available) */}
            {collection.productCount !== undefined && (
              <div className="text-xs text-white/80 mb-3">
                {collection.productCount} {collection.productCount === 1 ? 'Product' : 'Products'}
              </div>
            )}
            
            {/* View Collection Button */}
            <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <span className="inline-flex items-center text-sm font-medium text-white border-b border-white/50 hover:border-white transition-colors duration-200">
                View Collection
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </div>
          
          {/* Decorative Corner */}
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>
    </div>
  );
};

export default CollectionCard;