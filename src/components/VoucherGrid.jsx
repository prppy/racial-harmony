import React from "react";
import { useNavigate } from "react-router-dom";

const VoucherGrid = ({ vouchers }) => {
  const navigate = useNavigate();

  const handleVoucherClick = (product) => {
    navigate(`/voucher/${product.id}`, { state: { voucher } });
  };  

  return (
    <div style={styles.voucherGrid}>
      {vouchers.map((voucher) => (
        <div
          key={voucher.id}
          style={styles.voucherCard}
          onClick={() => handleVoucherClick(voucher)}

        >
          <img
            src={voucher.image}
            alt={voucher.name}
            style={styles.voucherImage}
          />
          <div style={styles.voucherDetails}>
            <h3 style={styles.voucherName}>{voucher.name}</h3>
            <p style={styles.voucherPoints}>{voucher.price} Points</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  voucherGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", // Grid layout for responsive design
    gap: "24px", // Space between grid items
  },
  voucherCard: {
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
  voucherImage: {
    width: "100%",
    height: "200px", // Fixed height for the image
    objectFit: "cover", // Ensures the image covers the area without stretching
  },
  voucherDetails: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px",
  },
  voucherName: {
    color: "black",
    fontSize: "18px",
    margin: "5px 0",
    textAlign: "center",
  },
  voucherPoints: {
    color: "#9C3726",
    fontWeight: "bold",
  },
};

export default VoucherGrid;
