import React from 'react';
import { useCart } from '../context/CartContext';

const CartSidebar = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    startCheckout,
    getCartTotal,
    getCartCount,
    formatPrice,
    paymentLoading
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={closeCart}
      />
      
      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Shopping Cart ({getCartCount()})
            </h2>
            <button 
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some beautiful items to your cart</p>
                <button
                  onClick={closeCart}
                  className="btn-primary"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow duration-200">
                    {/* Product Image */}
                    {item.image_url && (
                      <div className="flex-shrink-0">
                        <img 
                          src={item.image_url} 
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </div>
                    )}
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm font-semibold text-gray-900 mb-2">
                        {formatPrice(item.price)}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                            disabled={item.quantity <= 1}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 p-1 transition-colors duration-200"
                          title="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Item Total */}
                      <div className="mt-2 text-right">
                        <span className="text-sm text-gray-600">
                          Total: {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer - Checkout Section */}
          {items.length > 0 && (
            <div className="border-t bg-gray-50 p-4 space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Subtotal:</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              
              {/* Shipping Info */}
              <div className="text-sm text-gray-600 text-center">
                Shipping and taxes calculated at checkout
              </div>
              
              {/* Checkout Button */}
              <button
                onClick={() => startCheckout()}
                disabled={paymentLoading}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {paymentLoading ? (
                  <>
                    <div className="spinner" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure Checkout</span>
                  </>
                )}
              </button>
              
              {/* Continue Shopping */}
              <button
                onClick={closeCart}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;