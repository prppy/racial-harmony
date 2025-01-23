import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import CategoryTabs from "../components/CategoryTabs";
import ProductGrid from "../components/ProductGrid";
import { fetchMainCollection, fetchMainRecord } from "../utils/firebaseUtils";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import styles from "../admin-pages/Tasks.module.css";
import { ProductSlide } from "../components/Slides";

const MinimartPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [voucherBalance, setVoucherBalance] = useState(0); // State for voucher balance
    const { user } = useAuth();
    const location = useLocation();
    const defaultSearchQuery = location.state?.searchQuery || "";

    const [searchQuery, setSearchQuery] = useState(defaultSearchQuery);

    useEffect(() => {
        fetchMainCollection("products")
            .then((data) => {
                setProducts(data);
            })
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    useEffect(() => {
        fetchMainRecord("users", user?.userId)
            .then((data) => {
                setVoucherBalance(data.voucher_balance);
                console.log("voucher balance", data.voucher_balance);
            })
            .catch((error) =>
                console.error("Error fetching voucher balance:", error)
            );
    }, []);

    const filteredProducts = products.filter(
        (product) =>
            (selectedCategory === "All" ||
                product.category === selectedCategory) &&
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={pageStyles.pageContainer}>
            <div className={styles.topSection}>
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    type={"tasks"}
                />
                {/* Voucher Balance */}
                <div className={styles.voucherBalanceContainer}>
                    <span className={styles.voucherBalanceText}>
                        Voucher Balance: {voucherBalance} points
                    </span>
                </div>
            </div>

            <CategoryTabs
                categories={[
                    "All",
                    "Clothing",
                    "Entertainment",
                    "Sports",
                    "Education",
                    "Electronics",
                    "Snacks",
                    "Accessories",
                    "Others",
                ]}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            {/* Render Filtered Tasks */}
            <div className={styles.tasksGrid}>
                {filteredProducts.map((product) => (
                    <div key={product.id} onClick={() => {}}>
                        <ProductSlide
                            product={product}
                            style={{ width: "100%" }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const pageStyles = {
    pageContainer: {
        padding: "50px",
    },
    selectedCategory: {
        backgroundColor: "#68180a",
        color: "white",
    },
};

export default MinimartPage;
