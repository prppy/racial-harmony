import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { fetchCollection, fetchMainRecord, deleteRecord } from '../utils/firebaseUtils';
import { DARK_PURPLE } from '../constants/colors';

const Cart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [qrCodeVisible, setQrCodeVisible] = useState(false); // New state for QR code visibility

  useEffect(() => {
    getCart();
  }, [user]);

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

  const toggleSelectItem = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].selected = !updatedCart[index].selected;
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
      for (let item of selectedItems) {
        await deleteRecord("users", user?.userId, "cart", item.id);
      }

      await getCart(); 

      setQrCodeVisible(true);
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div style={pageStyles.pageContainer}>
      <div style={pageStyles.leftContainer}>
        <div style={receiptStyles.receiptContainer}>
          <h2 style={receiptStyles.header}>Your Cart:</h2>
          {cart.map((item, index) => (
            <div key={index} style={receiptStyles.itemRow}>
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => toggleSelectItem(index)}
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
        {qrCodeVisible && (
          <img src="/QR.png" alt="QR Code" style={styles.qrCode} />
        )}
        {!qrCodeVisible && <p style={styles.text}>Select Check Out when you are at the Minimart!</p>}
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
    justifyContent: 'space-between', // Added to align items at both ends
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
    flex: 1, // Allows the item details to take the remaining space
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
    textAlign: 'right', // Align the quantity text to the right
    flexShrink: 0, // Prevents the quantity from shrinking
    marginLeft: '10px', // Add spacing between product details and quantity
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
    fontSize: '20px', // Increased size of the text on the right side
    fontWeight: 'bold',
    textAlign: 'center',
  },
  qrCode: {
    width: '80%',
    height: '80%',
    objectFit: 'contain',
  },
};

export default Cart;
