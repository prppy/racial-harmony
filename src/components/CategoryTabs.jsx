import React from "react";

const CategoryTabs = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <div style={styles.categories}>
      {categories.map((category) => (
        <button
          key={category}
          style={{
            ...styles.categoryButton,
            backgroundColor: selectedCategory === category ? "#9C3726" : "#f0f0f0",
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
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },
};

export default CategoryTabs;
