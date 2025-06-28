import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createRazorpayOrder, verifyPayment } from '../utils/api';

const CustomerForm = () => {
  const {
    customerFormOpen,
    pendingCart,
    closeCustomerForm,
    clearCart,
    setPaymentLoading,
    paymentLoading,
    formatPrice
  } = useCart();

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

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!customerInfo.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(customerInfo.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!customerInfo.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!customerInfo.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!customerInfo.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(customerInfo.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const proceedWithPayment = async () => {
    if (!validateForm()) {
      return;
    }

    if (!pendingCart || pendingCart.length === 0) {
      alert('No items in cart');
      return;
    }

    setPaymentLoading(true);

    try {
      const totalAmount = Math.round(
        pendingCart.reduce((total, item) => total + (item.price * item.quantity), 0) * 100
      );

      // Create Razorpay order
      const orderResponse = await createRazorpayOrder({
        amount: totalAmount,
        currency: 'INR',
        cart: pendingCart,
        customer_info: customerInfo
      });

      const { id: order_id, amount, currency, key } = orderResponse;

      // Razorpay options
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
            const verifyResponse = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cart: pendingCart,
              customer_info: customerInfo
            });

            if (verifyResponse.success) {
              alert('🎉 Payment successful! Your order has been placed and will appear in your Shopify admin.');
              clearCart();
              closeCustomerForm();
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
          }
        }
      };

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        setPaymentLoading(false);
        alert('❌ Payment failed: ' + response.error.description);
      });
      
      rzp.open();
      closeCustomerForm();

    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('❌ Failed to initiate payment. Please try again.');
      setPaymentLoading(false);
    }
  };

  const getPendingCartTotal = () => {
    if (!pendingCart) return 0;
    return pendingCart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (!customerFormOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Delivery Information</h2>
            <button 
              onClick={closeCustomerForm}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); proceedWithPayment(); }}>
            <div className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 ${
                      errors.first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={customerInfo.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 9876543210"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              
              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={customerInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows="2"
                  placeholder="House/Flat No., Street, Area"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>
              
              {/* City, State, Pincode */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter city"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
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
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 ${
                      errors.pincode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 110001"
                  />
                  {errors.pincode && (
                    <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                  )}
                </div>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={customerInfo.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
                  placeholder="Enter state"
                />
              </div>
            </div>
            
            {/* Order Summary */}
            {pendingCart && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-3 text-gray-900">Order Summary</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  {pendingCart.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="line-clamp-1">{item.title} x {item.quantity}</span>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 font-semibold text-gray-900">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span>{formatPrice(getPendingCartTotal())}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={closeCustomerForm}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={paymentLoading}
                className="flex-1 px-4 py-3 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {paymentLoading ? (
                  <>
                    <div className="spinner" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Proceed to Payment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;