import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, delay = 0, showBadge = null }) => {
  const { addToCart, quickBuyProduct, formatPrice } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const firstImage = product.images?.edges[0]?.node;
  const firstVariant = product.variants?.edges[0]?.node;
  const hasDiscount = firstVariant?.compareAtPrice;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((parseFloat(firstVariant.compareAtPrice.amount) - parseFloat(firstVariant.price.amount)) /
          parseFloat(firstVariant.compareAtPrice.amount)) *
          100
      )
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleQuickBuy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    quickBuyProduct(product);
  };

  const getBadgeConfig = () => {
    if (showBadge === 'new') {
      return {
        text: 'NEW',
        className: 'new-badge text-white text-xs px-2 py-1 rounded font-medium'
      };
    }
    if (showBadge === 'bestseller') {
      return {
        text: 'BESTSELLER',
        className: 'bg-yellow-500 text-white text-xs px-2 py-1 rounded font-medium'
      };
    }
    if (hasDiscount) {
      return {
        text: `${discountPercentage}% OFF`,
        className: 'discount-badge text-white text-xs px-2 py-1 rounded font-medium'
      };
    }
    return null;
  };

  const badge = getBadgeConfig();

  return (
    <div 
      className="product-card group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <Link to={`/products/${product.handle}`} className="block">
        <div className="relative overflow-hidden rounded-t-lg">
          {/* Product Image */}
          {firstImage && (
            <div className="aspect-[3/4] overflow-hidden bg-gray-100">
              {!imageLoaded && !imageError && (
                <div className="w-full h-full bg-gray-200 shimmer flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              )}
              
              {!imageError && (
                <img
                  src={firstImage.url}
                  alt={firstImage.altText || product.title}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              )}
              
              {imageError && (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          )}
          
          {/* Badges */}
          {badge && (
            <div className="absolute top-3 left-3">
              <span className={badge.className}>
                {badge.text}
              </span>
            </div>
          )}
          
          {/* Wishlist Button */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200"
              title="Add to Wishlist"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // TODO: Implement wishlist functionality
              }}
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Quick View Button */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              className="p-2 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors duration-200"
              title="Quick View"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // TODO: Implement quick view functionality
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 text-sm leading-relaxed group-hover:text-black transition-colors duration-200">
            {product.title}
          </h3>
          
          {/* Vendor */}
          {product.vendor && (
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
              {product.vendor}
            </p>
          )}
          
          {/* Price */}
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
          
          {/* Rating (placeholder) */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">(4.0)</span>
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="px-4 pb-4">
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-black text-white py-2 px-3 rounded text-xs font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-1"
            disabled={!firstVariant?.availableForSale}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            <span>Add to Cart</span>
          </button>
          <button
            onClick={handleQuickBuy}
            className="flex-1 border border-black text-black py-2 px-3 rounded text-xs font-medium hover:bg-black hover:text-white transition-colors duration-200 flex items-center justify-center space-x-1"
            disabled={!firstVariant?.availableForSale}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Buy Now</span>
          </button>
        </div>
        
        {/* Availability Status */}
        <div className="mt-2 text-center">
          {firstVariant?.availableForSale ? (
            <span className="text-xs text-green-600 font-medium">✓ In Stock</span>
          ) : (
            <span className="text-xs text-red-600 font-medium">✗ Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;