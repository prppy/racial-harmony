import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import CategoryTabs from "../components/CategoryTabs";
import ProductGrid from "../components/ProductGrid";
import { fetchMainCollection, fetchMainRecord } from "../utils/firebaseUtils";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
const MinimartPage = ({ voucherBalance }) => {
  const location = useLocation();
 const defaultSearchQuery = location.state?.searchQuery || "";
    const [searchQuery, setSearchQuery] = useState(defaultSearchQuery)
    const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user} = useAuth()
  
  const [voucher_balance, setVoucher_balance] = useState(voucherBalance || 0)
  // Fetch products data from firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchMainCollection("products");
        if (fetchedProducts) {
          setProducts(fetchedProducts);
        } else {
          setError("Failed to fetch products");
        }
      } catch (err) {
        setError("An error occurred while fetching products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  useEffect(() => {
    fetchMainRecord("users", user?.userId)
        .then((data) => {
            setVoucher_balance(data.voucher_balance)
        })
        .catch((error) => console.error("Error fetching tasks:", error));

        
}, []);


  // Filter products
  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "All" || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.page}>
      {/* Loading & Error Handling */}
      {loading ? (
        <div>Loading products...</div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : (
        <>
          {/* Search Bar & Voucher Balance */}
          <div style={styles.topSection}>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} type={"products"} />
            <div style={styles.voucherBalance}>
              <div style={styles.voucherAmount}>{voucher_balance}</div>
              <div style={styles.pointsLabel}>Points</div>
            </div>
          </div>

          {/* Category Tabs */}
          <CategoryTabs
            categories={["All", "Clothing", "Entertainment", "Sports", "Education", "Snacks", "Others"]}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* Product Grid */}
          <ProductGrid products={filteredProducts} />
        </>
      )}
    </div>
  );
};

// Styles
const styles = {
  page: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  topSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  voucherBalance: {
    display: 'flex',
  justifyContent:'space-between',
  alignItems: 'center',
  height: '50px',
  backgroundColor: "white",
  color:'#2B3487',
  padding: '0px 10px',
  borderRadius: '10px',

  marginLeft: '25px',
  border:' 1px solid #2B3487',
  boxSizing: 'border-box'
  },
  voucherAmount: {
    fontSize: "48px",
    fontWeight: "bold",
  },
  pointsLabel: {
    fontSize: "16px",
    color: "#555",
    marginLeft:'10px'
  },
  error: {
    color: "red",
    textAlign: "center",
  },
};

export default MinimartPage;