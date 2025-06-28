// Category mappings
export const CATEGORIES = {
  'sarees': {
    name: 'Sarees',
    description: 'Elegant traditional sarees for every occasion',
    collectionHandle: 'sarees'
  },
  'lehengas': {
    name: 'Lehengas',
    description: 'Beautiful lehengas for weddings and festivals',
    collectionHandle: 'lehengas'
  },
  'kurtis': {
    name: 'Kurtis',
    description: 'Stylish kurtis for everyday wear',
    collectionHandle: 'kurtis'
  },
  'jewelry': {
    name: 'Jewelry',
    description: 'Traditional jewelry to complete your look',
    collectionHandle: 'jewelry'
  },
  'new-arrivals': {
    name: 'New Arrivals',
    description: 'Latest additions to our collection',
    collectionHandle: 'new-arrivals'
  },
  'collections': {
    name: 'Collections',
    description: 'Curated collections for special occasions',
    collectionHandle: 'collections'
  }
};

// Filter options
export const FILTER_OPTIONS = {
  priceRanges: [
    { label: 'Under ₹1,000', min: 0, max: 1000 },
    { label: '₹1,000 - ₹2,500', min: 1000, max: 2500 },
    { label: '₹2,500 - ₹5,000', min: 2500, max: 5000 },
    { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
    { label: 'Above ₹10,000', min: 10000, max: null }
  ],
  colors: [
    'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Black', 'White', 'Golden'
  ],
  fabrics: [
    'Cotton', 'Silk', 'Chiffon', 'Georgette', 'Crepe', 'Linen', 'Velvet', 'Net', 'Satin', 'Polyester'
  ],
  sizes: [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'
  ],
  occasions: [
    'Wedding', 'Festival', 'Party', 'Casual', 'Office', 'Traditional', 'Formal', 'Ethnic'
  ],
  regions: [
    'North Indian', 'South Indian', 'Bengali', 'Gujarati', 'Rajasthani', 'Punjabi', 'Maharashtrian'
  ]
};

// Sort options
export const SORT_OPTIONS = [
  { label: 'Latest', value: 'CREATED_AT', reverse: true },
  { label: 'Price: Low to High', value: 'PRICE', reverse: false },
  { label: 'Price: High to Low', value: 'PRICE', reverse: true },
  { label: 'Best Selling', value: 'BEST_SELLING', reverse: false },
  { label: 'A-Z', value: 'TITLE', reverse: false },
  { label: 'Z-A', value: 'TITLE', reverse: true }
];

// Hero section images
export const HERO_IMAGES = [
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
  },
  {
    url: "https://images.unsplash.com/photo-1594736797933-d0da92a1f64a",
    alt: "Beautiful Indian bride in red lehenga"
  }
];

// Featured collections data
export const FEATURED_COLLECTIONS = [
  {
    id: '1',
    title: 'Wedding Collection',
    handle: 'wedding-collection',
    description: 'Exquisite pieces for your special day',
    image: 'https://images.unsplash.com/photo-1594736797933-d0da92a1f64a'
  },
  {
    id: '2',
    title: 'Festival Specials',
    handle: 'festival-specials',
    description: 'Celebrate in style with our festive range',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb'
  },
  {
    id: '3',
    title: 'Bridal Jewelry',
    handle: 'bridal-jewelry',
    description: 'Complete your bridal look',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338'
  },
  {
    id: '4',
    title: 'Casual Elegance',
    handle: 'casual-elegance',
    description: 'Comfortable yet stylish everyday wear',
    image: 'https://images.unsplash.com/photo-1571908599407-cdb918ed83bf'
  }
];

// Loading states
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// API endpoints
export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  COLLECTIONS: '/collections',
  ORDERS: '/orders',
  PAYMENT_CREATE: '/create-razorpay-order',
  PAYMENT_VERIFY: '/verify-payment',
  HEALTH: '/health'
};

// Local storage keys
export const STORAGE_KEYS = {
  CART: 'undhyu-cart',
  USER_PREFERENCES: 'undhyu-preferences',
  RECENT_SEARCHES: 'undhyu-recent-searches'
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  PRODUCT_NOT_FOUND: 'Product not found.',
  CART_EMPTY: 'Your cart is empty.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  ADDED_TO_CART: 'Product added to cart!',
  PAYMENT_SUCCESS: 'Payment successful! Your order has been placed.',
  ORDER_PLACED: 'Order placed successfully!'
};