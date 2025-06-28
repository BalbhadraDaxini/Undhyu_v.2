import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms & Conditions', href: '/terms' }
  ];

  const customerCare = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'Track Order', href: '/track-order' },
    { name: 'Bulk Orders', href: '/bulk-orders' },
    { name: 'Sell With Us', href: '/seller' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Support', href: '/support' }
  ];

  const categories = [
    { name: 'Sarees', href: '/sarees' },
    { name: 'Lehengas', href: '/lehengas' },
    { name: 'Kurtis', href: '/kurtis' },
    { name: 'Jewelry', href: '/jewelry' },
    { name: 'New Arrivals', href: '/new-arrivals' },
    { name: 'Collections', href: '/collections' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 font-elegant">Stay in Style</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about new arrivals, 
              exclusive offers, and fashion trends.
            </p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-r-lg font-medium transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4 font-elegant">
              Undhyu<span className="text-pink-500">.</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your destination for authentic Indian ethnic wear. 
              Explore our collection of sarees, lehengas, kurtis, and traditional jewelry
              that celebrates the rich heritage of Indian fashion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.160 1.219-5.160s-.219-.438-.219-1.085c0-1.016.588-1.775 1.321-1.775.623 0 .924.466.924 1.025 0 .624-.396 1.559-.601 2.424-.171.718.359 1.304 1.065 1.304 1.279 0 2.262-1.349 2.262-3.296 0-1.725-1.239-2.932-3.008-2.932-2.049 0-3.252 1.538-3.252 3.129 0 .620.24 1.285.537 1.646.059.072.067.135.049.209-.053.225-.172.719-.195.82-.030.129-.098.157-.226.095-1.003-.467-1.63-1.932-1.63-3.109 0-2.267 1.648-4.349 4.75-4.349 2.494 0 4.434 1.776 4.434 4.151 0 2.477-1.565 4.467-3.734 4.467-.729 0-1.414-.379-1.649-.830l-.449 1.713c-.162.622-.602 1.408-.896 1.887C9.262 23.85 10.608 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Categories</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {categories.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Customer Care */}
          <div>
            <h4 className="font-semibold mb-4 text-lg">Customer Care</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {customerCare.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">Contact Info:</p>
              <p className="text-sm text-gray-300">📧 contact@undhyu.com</p>
              <p className="text-sm text-gray-300">📱 +91 98765 43210</p>
              <p className="text-sm text-gray-300">🌐 www.undhyu.com</p>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              &copy; {currentYear} Undhyu.com - All rights reserved. Crafted with ❤️ for Indian fashion lovers.
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-400">Secure Payments:</span>
              <div className="flex items-center space-x-3">
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-gray-900">VISA</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-gray-900">MC</span>
                </div>
                <div className="bg-blue-600 rounded px-2 py-1">
                  <span className="text-xs font-bold text-white">Razorpay</span>
                </div>
                <div className="bg-green-600 rounded px-2 py-1">
                  <span className="text-xs font-bold text-white">UPI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;