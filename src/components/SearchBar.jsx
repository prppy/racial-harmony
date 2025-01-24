import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { RED } from "../constants/colors";

const SearchBar = ({ searchQuery, setSearchQuery, type, handleSearch }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch(); // Call the passed handleSearch function on Enter
        }
    };

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
                    outline: isFocused ? "2px solid #9C3726" : "none",
                    // Red outline when focused
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyPress}
            />
        </div>
    );
};

const styles = {
    searchWrapper: {
        display: "flex",
        alignItems: "center",
        width: "80%",
        backgroundColor: "white",
        height: "50px",
        borderRadius: "10px",
        boxSizing: "border-box",
    },
    searchIcon: {
        position: "absolute",
        fontSize: "25px", // Adjust size as needed
        color: RED, // Icon color
        marginLeft: "25px",
    },
    searchBar: {
        fontSize: "16px",
        width: "100%", // Full width
        height: "100%",
        borderRadius: "10px",
        border: `2px solid #ccc`,
        boxSizing: "border-box",
        paddingLeft: "75px",
    },
};

export default SearchBar;
