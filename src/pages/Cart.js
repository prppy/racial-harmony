import React, { useState, useEffect } from 'react';

const Cart = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event
  const handleScroll = () => {
    if (window.scrollY > 50) {  // Adjust scroll position as needed
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div style={pageStyles.pageContainer}>
      <div style={pageStyles.leftContainer}>
        <img
          src={isScrolled ? "/CartEmpty.png" : "/CartFull.png"}
          alt="cartEmpty"
          style={styles.logo}
        />
      </div>
      <div style={pageStyles.rightContainer}>
        <img
          src={isScrolled ? "/QR.png" : ""}
          style={styles.logo}
        />
        {!isScrolled && <p style={styles.text}>Select Check Out when you are at the Minimart!</p>}
      </div>
    </div>
  );
};

const pageStyles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
    overflowY: 'scroll',
    height: '100vh', // Ensures the page is scrollable
  },
  leftContainer: {
    flex: 1, // Takes up half of the container
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1, // Takes up the other half of the container
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column', // Align the QR and text vertically when not scrolled
  },
};

const styles = {
  logo: {
    width: '100%', // Makes the image take up the full width of the left container
    height: 'auto',
  },
  qrLogo: {
    width: '50%', // Adjust size of the QR image as needed
    height: 'auto',
  },
  text: {
    fontSize: '18px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
};

export default Cart;
