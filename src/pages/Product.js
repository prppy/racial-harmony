import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductPage = ({ product }) => {
  const navigate = useNavigate();

  // State for quantity and favorite status
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Handle favorite toggle
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Handle redeeming the product
  const redeemProduct = () => {
    alert(`Redeemed ${quantity} ${product.name}(s) for ${product.points * quantity} points`);
    navigate("/minimart"); // Navigate back to minimart after redeeming
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Product Image */}
        <div style={styles.imageContainer}>
          <img src={product.image} alt={product.name} style={styles.productImage} />
        </div>

        {/* Product Details */}
        <div style={styles.detailsContainer}>
          <h2 style={styles.productName}>{product.name}</h2>
          <p style={styles.category}>Category: {product.category}</p>
          <p style={styles.quantity}>Available: {product.quantity}</p>

          {/* Quantity Selection */}
          <div style={styles.quantitySelection}>
            <label>Quantity: </label>
            <input
              type="number"
              value={quantity}
              min="1"
              max={product.quantity}
              onChange={(e) => setQuantity(Math.min(e.target.value, product.quantity))}
              style={styles.quantityInput}
            />
          </div>

          {/* Favorite Button */}
          <button onClick={toggleFavorite} style={isFavorite ? styles.favButtonActive : styles.favButton}>
            {isFavorite ? "Unfavorite" : "Favorite"}
          </button>

          {/* Redeem Button */}
          <button onClick={redeemProduct} style={styles.redeemButton}>
            Redeem {product.points * quantity} Points
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  page: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    flex: 1,
    marginRight: "20px",
  },
  productImage: {
    width: "100%",
    height: "auto",
    borderRadius: "10px",
  },
  detailsContainer: {
    flex: 2,
    maxWidth: "500px",
  },
  productName: {
    fontSize: "28px",
    fontWeight: "bold",
  },
  category: {
    fontSize: "18px",
    color: "#555",
  },
  quantity: {
    fontSize: "16px",
    color: "#777",
  },
  quantitySelection: {
    margin: "10px 0",
    fontSize: "16px",
  },
  quantityInput: {
    padding: "5px",
    marginLeft: "10px",
    width: "60px",
  },
  favButton: {
    padding: "10px 20px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginRight: "10px",
    cursor: "pointer",
  },
  favButtonActive: {
    padding: "10px 20px",
    backgroundColor: "#ffcc00",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginRight: "10px",
    cursor: "pointer",
  },
  redeemButton: {
    padding: "10px 20px",
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ProductPage;
