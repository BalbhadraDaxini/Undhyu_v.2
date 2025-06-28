import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartSidebar from './components/CartSidebar';
import CustomerForm from './components/CustomerForm';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App min-h-screen bg-white">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/sarees" element={<CategoryPage category="sarees" title="Sarees" />} />
              <Route path="/lehengas" element={<CategoryPage category="lehengas" title="Lehengas" />} />
              <Route path="/kurtis" element={<CategoryPage category="kurtis" title="Kurtis" />} />
              <Route path="/jewelry" element={<CategoryPage category="jewelry" title="Jewelry" />} />
              <Route path="/new-arrivals" element={<CategoryPage category="new-arrivals" title="New Arrivals" />} />
              <Route path="/collections" element={<CategoryPage category="collections" title="Collections" />} />
              <Route path="/products/:handle" element={<ProductPage />} />
            </Routes>
          </main>
          <Footer />
          <CartSidebar />
          <CustomerForm />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;