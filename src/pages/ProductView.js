import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DARK_PURPLE, LIGHT_PURPLE, RED } from "../constants/colors";
import {
    updateMainRecord,
    fetchMainRecord,
    saveRecord,
} from "../utils/firebaseUtils";
import { IoMdHeartDislike } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { useAuth } from "../context/authContext";
import SearchBar from "../components/SearchBar";
import styles from "../admin-pages/Tasks.module.css";

const ProductView = () => {
    const location = useLocation();
    const product = location.state?.product;
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isFavourite, setIsFavourite] = useState(false);
    const [carted, setCarted] = useState(false);
    const [userData, setUserData] = useState(null);
    const [voucherBalance, setVoucherBalance] = useState(0);
    const [quantitySelected, setQuantitySelected] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const productId = product.id;

    useEffect(() => {
        if (!product) {
            console.error("Product not found!");
            return;
        }

        // Set default quantity based on product availability
        if (product.quantity === 0) {
            setQuantitySelected(0); // No stock
        } else {
            setQuantitySelected(1); // Minimum 1 item available
        }

        const fetchData = async () => {
            try {
                const userData = await fetchMainRecord("users", user.userId);
                setUserData(userData);
                setVoucherBalance(userData.voucher_balance);
                if (
                    userData?.favouriteProducts &&
                    userData.favouriteProducts.includes(productId)
                ) {
                    setIsFavourite(true);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        if (user && product) {
            fetchData();
        }
    }, [product, user, product.quantity]);

    useEffect(() => {
        setSearchQuery(location.state?.searchQuery || "");
    }, [location.state?.searchQuery]);

    if (!product) {
        return <div>Product not found. Please go back and try again.</div>;
    }

    const handleFavourite = async () => {
        if (!user?.userId || !productId) {
            console.error("Missing user or productId");
            return;
        }

        try {
            const userData = await fetchMainRecord("users", user.userId);
            const favouriteProducts = userData?.favouriteProducts || [];

            if (isFavourite) {
                const updatedfavouriteProducts = favouriteProducts.filter(
                    (id) => id !== productId
                );

                await updateMainRecord("users", user.userId, {
                    favouriteProducts: updatedfavouriteProducts,
                });

                setIsFavourite(false); // Mark as not favourited
                alert("Product removed from favourites!");
            } else {
                // Add the productId to the favouriteProducts array if not already present
                if (!favouriteProducts.includes(productId)) {
                    favouriteProducts.push(productId);

                    // Update the user's favouriteProducts field in Firestore
                    await updateMainRecord("users", user.userId, {
                        favouriteProducts: favouriteProducts,
                    });

                    setIsFavourite(true);
                    alert("Product added to favourites!");
                }
            }
        } catch (error) {
            console.error("Error updating product favourite status:", error);
        }
    };

    const handleCart = async () => {
        const totalCost = quantitySelected * product.price;
        if (totalCost <= voucherBalance) {
            const new_balance = voucherBalance - totalCost;
            try {
                await saveRecord("users", user.userId, "cart", {
                    productId: product.id,
                    productName: product.name,
                    quantity: quantitySelected,
                    requestDate: new Date(),
                    unitPoint: product.price,
                });

                await updateMainRecord("users", user.userId, {
                    voucher_balance: new_balance,
                });
                setVoucherBalance(new_balance);

                console.log(`Requested ${quantitySelected} of ${product.name}`);
                alert(`Requested ${quantitySelected} of ${product.name}`);
            } catch (e) {
                console.error("Error handling request: ", e);
            }
        } else {
            alert("Not enough voucher points!");
        }
    };

    const handleSearch = () => {
        navigate("/minimart", { state: { searchQuery } });
    };

    return (
        <div style={pageStyles.container}>
            <div className={styles.topSection}>
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    type={"product"}
                    handleSearch={handleSearch}
                />
                {/* Voucher Balance */}
                <div className={styles.voucherBalanceContainer}>
                    <span className={styles.voucherBalanceText}>
                        Voucher Balance: {voucherBalance} points
                    </span>
                </div>
            </div>
            <div style={pageStyles.leftContainer}>
                {product.productImageUrl ? (
                    <img
                        src={product.productImageUrl}
                        alt={product.name}
                        style={pageStyles.image}
                    />
                ) : (
                    <div
                        style={{
                            ...pageStyles.image,
                            ...pageStyles.placeholder,
                        }}
                    ></div>
                )}
            </div>
            <div style={pageStyles.rightContainer}>
                <h1 className="large-heading" style={{ color: DARK_PURPLE }}>
                    {product.name}
                </h1>
                <hr style={pageStyles.divider} />
                <div style={pageStyles.subContainer}>
                    <div style={pageStyles.detailsContainer}>
                        <p style={pageStyles.points}>
                            <strong>
                                <span style={{ fontSize: "30px" }}>
                                    {product.price}
                                </span>
                                pts
                            </strong>
                        </p>

                        <p style={pageStyles.description}>
                            Category:{" "}
                            <span style={{ fontSize: "16px" }}>
                                {product.category.charAt(0).toUpperCase() +
                                    product.category.slice(1)}
                            </span>
                        </p>
                        <p style={pageStyles.description}>
                            Quantity Available:{" "}
                            <span style={{ fontSize: "16px" }}>
                                {product.quantity}
                            </span>
                        </p>
                    </div>
                    <div style={pageStyles.buttonContainer}>
                        <div style={{ flexGrow: 1 }} />{" "}
                        <button
                            style={{
                                ...pageStyles.editButton,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: isFavourite ? "gray" : RED, // Change color if favorited
                                cursor: "pointer",
                            }}
                            onClick={handleFavourite}
                        >
                            {isFavourite ? (
                                <IoMdHeartDislike
                                    color="white"
                                    style={{ marginRight: "10px" }}
                                /> // Use dislike icon when favorited
                            ) : (
                                <IoMdHeart
                                    color="white"
                                    style={{ marginRight: "10px" }}
                                /> // Use heart icon when not favorited
                            )}
                            <span style={{ color: "white" }}>
                                {isFavourite ? "Unfavourite" : "Favourite"}
                            </span>
                        </button>
                        {!carted ? (
                            <button
                                style={pageStyles.applyButton}
                                onClick={handleCart}
                            >
                                Add to Cart
                            </button>
                        ) : (
                            <button
                                style={{
                                    ...pageStyles.applyButton,
                                    backgroundColor: "gray",
                                }}
                                onClick={handleCart}
                                disabled
                            >
                                Added to Cart
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const pageStyles = {
    container: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "stretch", // Ensures both containers are the same height
        borderRadius: "10px",
        margin: "50px",
        boxSizing: "border-box",
        flexWrap: "wrap", // Allow for wrapping on smaller screens
    },
    topSection: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: "25px",
    },
    leftContainer: {
        flex: 1, // Ensures both containers grow to fill available space
        display: "flex",
        marginRight: "25px",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: LIGHT_PURPLE,
        borderRadius: "10px",
        border: `2px solid ${DARK_PURPLE}`,
        boxSizing: "border-box",
    },
    rightContainer: {
        flex: 1, // Ensures both containers grow to fill available space
        display: "flex",
        marginLeft: "25px",
        justifyContent: "flex-start",
        flexDirection: "column", // Aligns the details container and button container vertically
        alignItems: "flex-start",
        padding: "25px",
        border: `2px solid ${DARK_PURPLE}`,
        borderRadius: "10px",
        boxSizing: "border-box",
        backgroundColor: "white",
    },
    subContainer: {
        display: "flex",
        flexDirection: "row", // Aligns the details container and button container horizontally
        alignItems: "flex-start",
        width: "100%",
        flexWrap: "wrap", // Wrap contents for smaller screens
    },
    detailsContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "column", // Stack the buttons vertically
        flex: 1, // Ensure the container stretches to fill available space
        width: "auto",
        maxWidth: "25%",
        justifyContent: "flex-end", // Push the buttons to the bottom
        marginTop: "auto", // Ensures the container takes up remaining space
        minWidth: "150px",
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        objectFit: "cover",
    },
    placeholder: {
        backgroundColor: "#868bbd",
    },
    divider: {
        width: "100%",
        border: "1px solid #2a2a72",
        marginBottom: "25px",
    },
    points: {
        fontSize: "20px",
        color: RED,
        marginBottom: "25px",
        marginTop: "0",
    },
    description: {
        fontSize: "20px",
        color: DARK_PURPLE,
        marginTop: "0px",
        marginBottom: "25px", // Remove margin to prevent extra space
        display: "inline-block", // Makes both lines inline without extra vertical space
    },
    editButton: {
        backgroundColor: RED,
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        padding: "10px 20px",
        cursor: "pointer",
        fontWeight: "bold",
        marginBottom: "25px",
    },
    applyButton: {
        backgroundColor: "#1c660d",
        color: "white",
        border: "none",
        borderRadius: "4px",
        padding: "10px 20px",
        cursor: "pointer",
        fontWeight: "bold",
    },
};

export default ProductView;
