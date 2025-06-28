import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          isOpen: true
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        isOpen: true
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id)
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      };

    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false
      };

    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true
      };

    case 'SET_CUSTOMER_FORM_OPEN':
      return {
        ...state,
        customerFormOpen: action.payload.open,
        pendingCart: action.payload.cart || null
      };

    case 'SET_PAYMENT_LOADING':
      return {
        ...state,
        paymentLoading: action.payload
      };

    default:
      return state;
  }
};

const initialState = {
  items: [],
  isOpen: false,
  customerFormOpen: false,
  pendingCart: null,
  paymentLoading: false
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('undhyu-cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        cartData.forEach(item => {
          dispatch({ type: 'ADD_TO_CART', payload: item });
        });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('undhyu-cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product) => {
    const firstVariant = product.variants?.edges[0]?.node;
    const firstImage = product.images?.edges[0]?.node;
    
    if (!firstVariant) {
      alert('Product not available');
      return;
    }

    const cartItem = {
      id: product.id,
      title: product.title,
      handle: product.handle,
      price: parseFloat(firstVariant.price.amount),
      variant_id: firstVariant.id,
      image_url: firstImage?.url || ''
    };

    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const startCheckout = (quickBuyCart = null) => {
    const cartToUse = quickBuyCart || state.items;
    
    if (cartToUse.length === 0) {
      alert('Your cart is empty');
      return;
    }

    dispatch({ 
      type: 'SET_CUSTOMER_FORM_OPEN', 
      payload: { open: true, cart: cartToUse }
    });
  };

  const closeCustomerForm = () => {
    dispatch({ 
      type: 'SET_CUSTOMER_FORM_OPEN', 
      payload: { open: false, cart: null }
    });
  };

  const setPaymentLoading = (loading) => {
    dispatch({ type: 'SET_PAYMENT_LOADING', payload: loading });
  };

  const quickBuyProduct = (product) => {
    const firstVariant = product.variants?.edges[0]?.node;
    const firstImage = product.images?.edges[0]?.node;
    
    if (!firstVariant) {
      alert('Product not available');
      return;
    }

    const quickCart = [{
      id: product.id,
      title: product.title,
      handle: product.handle,
      quantity: 1,
      price: parseFloat(firstVariant.price.amount),
      variant_id: firstVariant.id,
      image_url: firstImage?.url || ''
    }];

    startCheckout(quickCart);
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    closeCart,
    openCart,
    startCheckout,
    closeCustomerForm,
    setPaymentLoading,
    quickBuyProduct,
    getCartTotal,
    getCartCount,
    formatPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};