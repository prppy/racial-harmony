import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import CategoryTabs from "../components/CategoryTabs";
import ProductGrid from "../components/ProductGrid";

const MinimartPage = ({ voucherBalance }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // TO FETCH FROM FIREBASE
  const products = [
    { id: 1, name: "T-Shirt", category: "Clothing", points: 100, image: "/images/tshirt.jpg" },
    { id: 2, name: "Basketball", category: "Sports", points: 200, image: "/images/basketball.jpg" },
    { id: 3, name: "Notebook", category: "Education", points: 50, image: "/images/notebook.jpg" },
    { id: 4, name: "Chips", category: "Snacks", points: 20, image: "/images/chips.jpg" },
    { id: 5, name: "Movie Ticket", category: "Entertainment", points: 150, image: "/images/movie.jpg" },
  ];

  // Filter products
  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "All" || product.category === selectedCategory) &&
      product.name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.page}>
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
};

export default MinimartPage;
