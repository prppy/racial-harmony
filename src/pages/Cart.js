import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { fetchCollection, fetchMainRecord, deleteRecord } from '../utils/firebaseUtils';
import { DARK_PURPLE } from '../constants/colors';

const Cart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [qrCodeVisible, setQrCodeVisible] = useState(false); // State for controlling QR code visibility

  useEffect(() => {
    getCart();
  }, []);

  const getCart = async () => {
    try {
      const cartData = await fetchCollection("users", user?.userId, "cart");
      const updatedCartData = await Promise.all(
        cartData.map(async (product) => {
          const productData = await fetchMainRecord("products", product.productId);
          if (productData) {
            return {
              ...product,
              productImageUrl: productData.productImageUrl,
              selected: false, // Add a selected flag to each product
            };
          }
          return product;
        })
      );
      setCart(updatedCartData);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const toggleSelectItem = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setCart(updatedCart);
  
    const updatedSelectedItems = updatedCart
      .filter((item) => item.selected)
      .map((item) => item);
    setSelectedItems(updatedSelectedItems);
  };
  

  const toggleSelectAll = () => {
    const allSelected = cart.every((item) => item.selected);
    const updatedCart = cart.map((item) => ({
      ...item,
      selected: !allSelected,
    }));
    setCart(updatedCart);

    if (allSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(updatedCart);
    }
  };

  const handleCheckout = async () => {
    try {
      await Promise.all(
        selectedItems.map(async (item) => {
          await deleteRecord("users", user?.userId, "cart", item.id);
        })
      );
      
      setQrCodeVisible(true);
      
      setCart(cart.filter((item) => !item.selected));
      setSelectedItems([]); // Reset selected items
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div style={pageStyles.pageContainer}>
      <div style={pageStyles.leftContainer}>
        <div style={receiptStyles.receiptContainer}>
          <h2 style={receiptStyles.header}>Uncollected Items:</h2>
          {cart.map((item, index) => (
            <div key={item.id} style={receiptStyles.itemRow}>
            <input
  type="checkbox"
  checked={item.selected}
  onChange={() => toggleSelectItem(item.id)}  // Use id here instead of index
/>

              <img
                src={item.productImageUrl}
                alt={item.productName}
                style={receiptStyles.image}
              />
              <div style={receiptStyles.itemDetails}>
                <p style={receiptStyles.productName}>{item.productName}</p>
                <p style={receiptStyles.points}>{item.unitPoint}pts</p>
                <p style={receiptStyles.quantity}>x {item.quantity}</p>
              </div>
            </div>
          ))}
          <div style={receiptStyles.footer}>
            <div>
              <input
                type="checkbox"
                checked={cart.every((item) => item.selected)}
                onChange={toggleSelectAll}
              />
              <label style={receiptStyles.selectAll}>All</label>
            </div>
            <button style={receiptStyles.checkoutButton} onClick={handleCheckout}>
              Check Out ({selectedItems.length})
            </button>
          </div>
        </div>
      </div>
      <div style={pageStyles.rightContainer}>
        <p style={styles.text}>Select Check Out when you are at the Minimart!</p>
        {qrCodeVisible && (
          <div style={styles.qrCodeContainer}>
            <img src="/QR.png" alt="QR Code" style={styles.qrCode} />
          </div>
        )}
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
    height: '100vh',
  },
  leftContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
};

const receiptStyles = {
  receiptContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '90%',
    maxWidth: '400px',
    height: '60vh',
    overflowY: 'scroll',
  },
  header: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#4B0082',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  image: {
    width: '70px',
    height: '70px',
    objectFit: 'cover',
    marginRight: '15px',
    borderRadius: '8px',
  },
  itemDetails: {
    flex: 1,
  },
  productName: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#4B0082',
  },
  points: {
    fontSize: '15px',
    color: '#555',
  },
  quantity: {
    fontSize: '15px',
    color: '#777',
    textAlign: 'right',
    flexShrink: 0,
    marginLeft: '10px',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '25px',
  },
  selectAll: {
    fontSize: '16px',
    marginLeft: '8px',
    color: 'black',
  },
  checkoutButton: {
    backgroundColor: DARK_PURPLE,
    color: '#FFF',
    border: 'none',
    borderRadius: '4px',
    padding: '12px 25px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
  },
};

const styles = {
  text: {
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  qrCodeContainer: {
    marginTop: '20px',
  },
  qrCode: {
    width: '80%',
    height: '80%',
    objectFit: 'contain',
  },
};

export default Cart;
