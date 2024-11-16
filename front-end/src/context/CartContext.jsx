// src/context/CartContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = JSON.parse(localStorage.getItem('cartItems'));
    return savedCart || [];
  });

  const addToCart = (course) => {
    const updatedCart = [...cartItems, { ...course, quantity: 1 }];
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const removeFromCart = (courseId) => {
    const updatedCart = cartItems.filter((item) => item._id !== courseId);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const clearCart = () => {
    localStorage.removeItem('cartItems'); // Clear cart from localStorage
    setCartItems([]); // Update state to empty array
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart, // Add clearCart to context value
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
