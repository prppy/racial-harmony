import React from "react";
import { RED } from "../constants/colors";

const CategoryTabs = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <div style={styles.categories}>
      {categories.map((category) => (
        <button
          key={category}
          style={{
            ...styles.categoryButton,
            backgroundColor: selectedCategory === category ? RED : "#f0f0f0",
            color: selectedCategory === category ? "#fff" : "#000",
          }}
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

const styles = {
  categories: {
    display: "flex",
    justifyContent: "left",
    gap: "15px",
    marginBottom: "20px",
  },
  categoryButton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },
};

export default CategoryTabs;
