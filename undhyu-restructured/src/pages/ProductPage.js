import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProductByHandle, getProducts } from '../utils/api';
import { LOADING_STATES } from '../utils/constants';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductPage = () => {
  const { handle } = useParams();
  const { addToCart, quickBuyProduct, formatPrice } = useCart();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(LOADING_STATES.LOADING);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (handle) {
      loadProduct();
    }
  }, [handle]);

  const loadProduct = async () => {
    setLoading(LOADING_STATES.LOADING);
    setError(null);

    try {
      const productData = await getProductByHandle(handle);
      setProduct(productData);
      
      // Set default variant
      if (productData.variants?.edges?.length > 0) {
        setSelectedVariant(productData.variants.edges[0].node);
      }

      // Load related products
      try {
        const relatedResponse = await getProducts({ 
          first: 8, 
          collection_handle: productData.collections?.edges[0]?.node?.handle 
        });
        setRelatedProducts(relatedResponse.products?.filter(p => p.id !== productData.id) || []);
      } catch (relatedError) {
        console.log('Could not load related products');
      }

      setLoading(LOADING_STATES.SUCCESS);
    } catch (error) {
      console.error('Error loading product:', error);
      setError('Product not found or could not be loaded.');
      setLoading(LOADING_STATES.ERROR);
    }
  };

  const handleAddToCart = () => {
    if (product && selectedVariant?.availableForSale) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };

  const handleBuyNow = () => {
    if (product && selectedVariant?.availableForSale) {
      quickBuyProduct(product);
    }
  };

  const hasDiscount = selectedVariant?.compareAtPrice;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((parseFloat(selectedVariant.compareAtPrice.amount) - parseFloat(selectedVariant.price.amount)) /
          parseFloat(selectedVariant.compareAtPrice.amount)) *
          100
      )
    : 0;

  if (loading === LOADING_STATES.LOADING) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (loading === LOADING_STATES.ERROR) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.edges || [];
  const variants = product.variants?.edges || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-black">Home</Link>
            <span>/</span>
            {product.collections?.edges[0] && (
              <>
                <Link 
                  to={`/collections`} 
                  className="hover:text-black"
                >
                  {product.collections.edges[0].node.title}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Product Images */}
          <div className="mb-8 lg:mb-0">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-[4/5] rounded-lg overflow-hidden bg-gray-100">
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage].node.url}
                    alt={images[selectedImage].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={image.node.id}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-md overflow-hidden border-2 transition-colors duration-200 ${
                        selectedImage === index ? 'border-black' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.node.url}
                        alt={image.node.altText || `${product.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title and Vendor */}
            <div>
              {product.vendor && (
                <p className="text-sm text-gray-600 uppercase tracking-wide font-medium mb-2">
                  {product.vendor}
                </p>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">(4.0) · 24 reviews</span>
              </div>
            </div>

            {/* Price */}
            {selectedVariant && (
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(selectedVariant.price.amount)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(selectedVariant.compareAtPrice.amount)}
                      </span>
                      <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-medium">
                        {discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">Inclusive of all taxes</p>
              </div>
            )}

            {/* Variant Selection */}
            {variants.length > 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Select Variant</h3>
                <div className="grid grid-cols-2 gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.node.id}
                      onClick={() => setSelectedVariant(variant.node)}
                      className={`p-3 text-left border rounded-md transition-colors duration-200 ${
                        selectedVariant?.id === variant.node.id
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-sm font-medium">{variant.node.title}</div>
                      <div className="text-sm opacity-80">
                        {formatPrice(variant.node.price.amount)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-900">Quantity</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleBuyNow}
                disabled={!selectedVariant?.availableForSale}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale}
                className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              
              {/* Stock Status */}
              <div className="text-center">
                {selectedVariant?.availableForSale ? (
                  <span className="text-sm text-green-600 font-medium">✓ In Stock</span>
                ) : (
                  <span className="text-sm text-red-600 font-medium">✗ Out of Stock</span>
                )}
              </div>
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Description</h3>
                <div 
                  className="text-gray-600 prose prose-sm"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
                />
              </div>
            )}

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Free shipping on orders above ₹999
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Easy 7-day return policy
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Secure payment options
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Authentic Indian craftsmanship
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-16 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct, index) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;