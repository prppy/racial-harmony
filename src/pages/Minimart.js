import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import CategoryTabs from "../components/CategoryTabs";
import ProductGrid from "../components/ProductGrid";
import { fetchMainCollection } from "../utils/firebaseUtils";

const MinimartPage = ({ voucherBalance }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Filter products
  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "All" || product.category === selectedCategory) &&
      product.name.toLowerCase().startsWith(searchQuery.toLowerCase())
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
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div style={styles.voucherBalance}>
              <div style={styles.voucherAmount}>{voucherBalance}</div>
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
    textAlign: "center",
  },
  voucherAmount: {
    fontSize: "48px",
    fontWeight: "bold",
  },
  pointsLabel: {
    fontSize: "16px",
    color: "#555",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
};

export default MinimartPage;