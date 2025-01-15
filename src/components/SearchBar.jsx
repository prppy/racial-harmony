import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";

const SearchBar = ({ searchQuery, setSearchQuery, type }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div style={styles.searchWrapper}>
      <IoSearch style={styles.searchIcon} />
      <input
        type="text"
        placeholder={`Search for ${type}...`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          ...styles.searchBar,
          outline: isFocused ? "2px solid #9C3726" : "none", // Red outline when focused
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

const styles = {
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    width: "80%",
    position: "relative", // Ensures the icon is positioned correctly within the input field
  },
  searchIcon: {
    position: "absolute",
    left: "10px",
    fontSize: "20px", // Adjust size as needed
    color: "#A24C3B", // Icon color
  },
  searchBar: {
    padding: "10px 10px 10px 35px", // Added padding on the left to make space for the icon
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "100%", // Full width
  },
};

export default SearchBar;
