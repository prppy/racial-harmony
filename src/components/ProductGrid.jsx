import React from "react";
import { useNavigate } from "react-router-dom";

const ProductGrid = ({ products }) => {
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };  

  return (
    <div style={styles.productGrid}>
      {products.map((product) => (
        <div
          key={product.id}
          style={styles.productCard}
          onClick={() => handleProductClick(product)}

        >
          <img
            src={product.image}
            alt={product.name}
            style={styles.productImage}
          />
          <div style={styles.productDetails}>
            <h3 style={styles.productName}>{product.name}</h3>
            <p style={styles.productPoints}>{product.price} Points</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", // Grid layout for responsive design
    gap: "24px", // Space between grid items
  },
  productCard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    height: "300px", // Fixed height for the card
    width: "250px", // Fixed width for the card
    border: "1px solid #ccc",
    borderRadius: "10px",
    overflow: "hidden",
    textAlign: "center",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "transform 0.2s",
    backgroundColor: "#fff",
  },
  productImage: {
    width: "100%",
    height: "200px", // Fixed height for the image
    objectFit: "cover", // Ensures the image covers the area without stretching
  },
  productDetails: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px",
  },
  productName: {
    color: "black",
    fontSize: "18px",
    margin: "5px 0",
    textAlign: "center",
  },
  productPoints: {
    color: "#9C3726",
    fontWeight: "bold",
  },
};

export default ProductGrid;
