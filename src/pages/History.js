import React, { useState, useEffect } from 'react';

const HistoryPage = () => {
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
          src={isScrolled ? "/voucherBalance1.png" : "/voucherBalance2.png"}
          alt="logo"
          style={styles.logo}
        />
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

};

const styles = {
  logo: {
    width: '80%', // Makes the image take up the full width of the left container
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

export default HistoryPage;
