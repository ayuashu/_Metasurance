"use client";
import React from 'react';

const Footer = () => {
  const footerStyle = {
    position: 'fixed',
    bottom: '0',
    left: '0',
    width: '100%',
    backgroundColor: 'black',
    color: '#00c7b7', 
    padding: '1rem',
    textAlign: 'center',
  };

  return (
    <footer style={footerStyle}>
      &copy; {new Date().getFullYear()} Metasurance
    </footer>
  );
};

export default Footer;
