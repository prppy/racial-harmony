import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Add useNavigate
import { useAuth } from "../context/authContext";
import { updateMainRecord, fetchMainRecord, saveRecord } from "../utils/firebaseUtils";
import SearchBar from "../components/SearchBar";

const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate
  const product = location.state?.product;
  const [searchQuery, setSearchQuery] = useState("")
  const [userData, setUserData] = useState(null)
  const { user } = useAuth();
  const [userFavorites, setUserFavorites] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const userId = user?.userId

  useEffect(() => {
    // Set default quantity based on product availability
    if (product.quantity === 0) {
      setQuantity(0); // No stock
    } else {
      setQuantity(1); // Minimum 1 item available
    }
  }, [product.quantity]);

  useEffect(() => {
    setSearchQuery(location.state?.searchQuery || "")
  }, [location.state?.searchQuery]);
  
  // Fetch user favorites on component mount
  useEffect(() => {
    if (userId && product) {
      const getUserFavorites = async () => {
        try {
          const fetchedUserData = await fetchMainRecord("users", userId);
          setUserData(fetchedUserData)
          const favorites =fetchedUserData ?.favorites || [];
          setUserFavorites(favorites);
          setIsFavorite(favorites.includes(product.id));
        } catch (e) {
          console.error("Error fetching user data: ", e);
        }
      };

      getUserFavorites();
    }
  }, [userId, product]);

  // Update isFavorite state when userFavorites changes
  useEffect(() => {
    if (product) {
      setIsFavorite(userFavorites.includes(product.id));
    }
  }, [userFavorites, product]);

  // Handle adding/removing from favorites
  const handleFavorite = async () => {
    if (!userId || !product) return;

    try {
      const updatedFavorites = isFavorite
        ? userFavorites.filter((fav) => fav !== product.id) // Remove
        : [...userFavorites, product.id]; // Add

      // Update Firestore
      await updateMainRecord("users", userId, { favorites: updatedFavorites });

      // Update local state
      setUserFavorites(updatedFavorites);
    } catch (e) {
      console.error("Error updating favorite: ", e);
    }
  };

  const handleRequest = async () => {
    const totalCost = quantity * product.points
    if (totalCost <= userData.voucher_balance) {
      try {

        await saveRecord("users", userId,  "cart", {
         productId: product.id,
         productName:product.name,
         quantity: quantity,
         requestDate: new Date(),
         unitPoint: product.points
   
        } )
   
   
         console.log(`Requested ${quantity} of ${product.name}`);
         alert(`Requested ${quantity} of ${product.name}`);
       } catch (e) {
         console.error("Error handling request: ", e);
       }

    } else {
      alert("Not enough voucher points!")
    }

  }; 



  const handleSearch = () => {
    // Navigate to /minimart with the search query as a parameter
    navigate("/minimart", { state: { searchQuery } });
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div style={styles.page}>
      {/* Top Section */}
      <div style={styles.topSection}>
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          type={"products"}
          handleSearch={handleSearch}
        />
        <div style={styles.voucherBalance}>
          Voucher Balance: {userData?.voucher_balance || 0} pts
        </div>
      </div>

      {/* Product Details */}
      <div style={styles.productContainer}>
        <div style={styles.productImage}>
          {/* Placeholder or Image */}
          {product.productImageUrl ? (
            <img
              src={product.productImageUrl}
              alt={product.name}
              style={{ width: "100%", height: "100%", borderRadius: "10px" }}
            />
          ) : (
            "No Image Available"
          )}
        </div>
        <div style={styles.productDetails}>
          <div style={styles.productTitle}>{product.name}</div>
          <div style={styles.points}>{product.price} pts</div>
          <div style={styles.productInfo}>
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Quantity Available:</strong> {product.quantity}
            </p>
          </div>
          <div style={styles.quantitySelector}>
      <label>Quantity: </label>
      <button
        style={styles.quantityButton}
        onClick={() => setQuantity((prev) => Math.max(0, prev - 1))} // Decrease, minimum 0 if no stock
        disabled={quantity <= 0} // Disable if quantity is 0
      >
        -
      </button>
      <span style={styles.quantityDisplay}>{quantity}</span>
      <button
        style={styles.quantityButton}
        onClick={() =>
          setQuantity((prev) => Math.min(product.quantity, prev + 1)) // Increase, maximum is product quantity
        }
        disabled={quantity >= product.quantity || product.quantity === 0} // Disable if quantity is max or no stock
      >
        +
      </button>
      {product.quantity === 0 && <p style={styles.outOfStock}>Out of Stock</p>}
    </div>

          <div style={styles.buttonContainer}>
            <span
              style={{
                ...styles.favoriteIcon,
                color: isFavorite ? "#FF5722" : "#ccc",
              }}
              onClick={handleFavorite}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              {isFavorite ? "♥" : "♡"}
            </span>
            <button className="button" style={styles.requestButton} onClick={handleRequest}>
              Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Define styles below the component
const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    color: "#333",
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  topSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  voucherBalance: {
    backgroundColor: "#e6f7ff",
    padding: "10px 20px",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  productContainer: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
  },
  productImage: {
    width: "400px",
    height: "400px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
    color: "#999",
  },
  productDetails: {
    height: "400px",
    flex: 1,
    padding: "10px 20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  productTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  productInfo: {
    marginBottom: "20px",
    fontSize: "16px",
    lineHeight: "1.5",
    color: "#666",
  },
  points: {
    fontSize: "22px",
    color: "#FF5722",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  quantitySelector: {
    marginBottom: "20px",
    fontSize: "16px",
  },
  buttonContainer: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  favoriteIcon: {
    fontSize: "24px",
    cursor: "pointer",
    transition: "color 0.3s",
  },
  requestButton: {
    padding: "12px 25px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  }, quantitySelector: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  quantityButton: {
    padding: "5px 10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s",
    width: "40px",
    textAlign: "center",
    disabledStyle: {
      backgroundColor: "#ccc",
      cursor: "not-allowed",
    },
  },
  quantityDisplay: {
    fontSize: "18px",
    fontWeight: "bold",
    padding: "5px 10px",
    border: "1px solid #ddd",
    borderRadius: "3px",
    minWidth: "40px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  },
  outOfStock: {
    color: "red",
    fontSize: "14px",
    fontWeight: "bold",
    marginLeft: "10px",
  },
};

export default ProductPage;
