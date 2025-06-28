# Undhyu - Standalone E-commerce Website

A beautiful, fully functional e-commerce website for Indian ethnic wear built with React. This is a standalone version that doesn't require any external APIs like Shopify or payment gateways.

## Features

### 🛍️ **E-commerce Functionality**
- Product catalog with beautiful grid layout
- Shopping cart with add/remove/update quantity
- Customer information form
- Simulated payment processing
- Order confirmation system
- Local storage for order history

### 🎨 **Design & UX**
- Professional, modern design inspired by leading fashion e-commerce sites
- Fully responsive layout (mobile, tablet, desktop)
- Beautiful hero section with rotating images
- Smooth animations and transitions
- Loading states and feedback
- Success/error handling

### 💳 **Payment Simulation**
- Customer information collection form
- Order summary display
- Simulated payment processing (90% success rate)
- Order confirmation with unique order ID
- Local storage for order tracking

### 📱 **Mobile Optimized**
- Touch-friendly interface
- Responsive product grid
- Mobile-optimized cart sidebar
- Swipe-friendly image carousel

## Product Features

### 🏪 **Product Display**
- High-quality product images
- Product titles and descriptions
- Pricing with discount indicators
- Vendor information
- Stock status indicators
- Hover effects and animations

### 🛒 **Shopping Cart**
- Slide-out cart sidebar
- Real-time cart count display
- Quantity adjustment controls
- Item removal functionality
- Cart total calculation
- Empty cart state

### 📋 **Customer Forms**
- Required field validation
- Professional form styling
- Mobile-friendly inputs
- Real-time form validation
- Error handling

## Technology Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Icons**: SVG icons
- **Images**: Unsplash (high-quality stock photos)
- **Storage**: Browser localStorage
- **Build Tool**: Create React App

## Mock Data

The app includes 8 sample products:
- Elegant Silk Saree - Royal Blue
- Designer Lehenga - Maroon & Gold
- Cotton Suit Set - Floral Print
- Traditional Banarasi Saree
- Party Wear Anarkali Dress
- Georgette Saree - Pink & Silver
- Wedding Lehenga - Red & Gold
- Casual Kurti Set - Blue

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Tailwind CSS:**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── App.js          # Main application component
├── App.css         # Application styles
├── index.js        # React app entry point
├── index.css       # Global styles & Tailwind imports
└── reportWebVitals.js

public/
├── index.html      # HTML template
├── manifest.json   # PWA manifest
└── favicon.ico     # Site icon
```

## Key Components

### Main App Component
- **State Management**: Cart, customer info, UI states
- **Product Display**: Grid layout with responsive design
- **Cart Management**: Add, remove, update functionality
- **Checkout Flow**: Customer form → Payment simulation → Confirmation

### Shopping Cart
- Slide-out sidebar design
- Real-time updates
- Quantity controls
- Empty state handling

### Customer Form
- Comprehensive delivery information
- Form validation
- Order summary display
- Mobile-optimized inputs

### Payment Simulation
- Realistic payment processing flow
- Loading states
- Success/failure handling
- Order confirmation

## Customization

### Adding New Products
Update the `MOCK_PRODUCTS` array in `App.js`:

```javascript
{
  id: 'unique-id',
  title: 'Product Title',
  price: 1999.00,
  compareAtPrice: 2499.00, // Optional discount price
  image: 'image-url',
  vendor: 'Vendor Name',
  inStock: true,
  description: 'Product description'
}
```

### Styling Customization
- Colors: Update `tailwind.config.js`
- Fonts: Modify font imports in `public/index.html`
- Layout: Adjust CSS classes in components

### Images
Replace hero images in the `heroImages` array and product images in `MOCK_PRODUCTS`.

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Performance Features

- Lazy loading for images
- Optimized bundle size
- Fast development builds
- Production optimizations

## PWA Features

- Installable web app
- Offline capable (basic caching)
- App manifest included
- Mobile app-like experience

## Local Storage

The app uses localStorage to save:
- Order history
- Cart persistence (optional)
- User preferences

## Future Enhancements

### Potential Additions:
- User authentication
- Product search and filtering
- Wishlist functionality
- Product reviews and ratings
- Multiple product images
- Size/color variants
- Advanced animations
- Analytics tracking

### Integration Ready:
- Payment gateway integration
- Backend API connection
- User management system
- Inventory management
- Order tracking

## Development Notes

- Components are self-contained with inline styles
- No external API dependencies
- Fully client-side application
- Easy to deploy to static hosting
- Can be easily converted to use real APIs

## Deployment

This app can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

Build command: `npm run build`
Output directory: `build/`

## License

This is a demonstration project. Feel free to use and modify as needed.

## Credits

- Images: Unsplash (https://unsplash.com)
- Icons: Heroicons (built into Tailwind)
- Design inspiration: Professional e-commerce websites

---

**Undhyu** - Crafted with ❤️ for authentic Indian fashion lovers.