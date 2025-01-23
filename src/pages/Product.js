// const ProductPage = () => {
//     const navigate = useNavigate(); // Use navigate
//     const [searchQuery, setSearchQuery] = useState("");
//     const [userData, setUserData] = useState(null);
//     const { user } = useAuth();
//     const [userFavourites, setUserFavourites] = useState([]); // favouriteProducts
//     const [quantity, setQuantity] = useState(1);
//     const [isFavourite, setIsFavourite] = useState(false);
//     const [voucherBalance, setVoucherBalance] = useState(0);

//     const userId = user?.userId;

//     useEffect(() => {
//         // Set default quantity based on product availability
//         if (product.quantity === 0) {
//             setQuantity(0); // No stock
//         } else {
//             setQuantity(1); // Minimum 1 item available
//         }
//     }, [product.quantity]);

//     useEffect(() => {
//         setSearchQuery(location.state?.searchQuery || "");
//     }, [location.state?.searchQuery]);

//     // Fetch user favourites on component mount
//     useEffect(() => {
//         if (userId && product) {
//             const getUserFavourites = async () => {
//                 try {
//                     const fetchedUserData = await fetchMainRecord(
//                         "users",
//                         userId
//                     );
//                     setUserData(fetchedUserData);
//                     setVoucherBalance(fetchedUserData.voucher_balance);
//                     const favourites = fetchedUserData?.favouriteProducts || [];
//                     setUserFavourites(favourites);
//                     setIsFavourite(favourites.includes(product.id));
//                 } catch (e) {
//                     console.error("Error fetching user data: ", e);
//                 }
//             };

//             getUserFavourites();
//         }
//     }, [user, product]);

//     // Update isFavourite state when userFavourites changes
//     useEffect(() => {
//         if (product) {
//             setIsFavourite(userFavourites.includes(product.id));
//         }
//     }, [userFavourites, product]);

//     // Handle adding/removing from favourites
//     const handleFavourite = async () => {
//         if (!userId || !product) return;

//         try {
//             const updatedFavourites = isFavourite
//                 ? userFavourites.filter((fav) => fav !== product.id) // Remove
//                 : [...userFavourites, product.id]; // Add

//             // Update Firestore
//             await updateMainRecord("users", userId, {
//                 favouriteProducts: updatedFavourites,
//             });

//             // Update local state
//             setUserFavourites(updatedFavourites);
//         } catch (e) {
//             console.error("Error updating favourite: ", e);
//         }
//     };

//     const handleRequest = async () => {
//         const totalCost = quantity * product.price;
//         if (totalCost <= voucherBalance) {
//             const new_balance = voucherBalance - totalCost;
//             try {
//                 await saveRecord("users", userId, "cart", {
//                     productId: product.id,
//                     productName: product.name,
//                     quantity: quantity,
//                     requestDate: new Date(),
//                     unitPoint: product.price,
//                 });

//                 await updateMainRecord("users", userId, {
//                     voucher_balance: new_balance,
//                 });
//                 setVoucherBalance(new_balance);

//                 console.log(`Requested ${quantity} of ${product.name}`);
//                 alert(`Requested ${quantity} of ${product.name}`);
//             } catch (e) {
//                 console.error("Error handling request: ", e);
//             }
//         } else {
//             alert("Not enough voucher points!");
//         }
//     };

//     const handleSearch = () => {
//         // Navigate to /minimart with the search query as a parameter
//         navigate("/minimart", { state: { searchQuery } });
//     };

//     if (!product) {
//         return <div>Product not found</div>;
//     }

//     return (
//         <div style={styles.page}>
//             {/* Top Section */}
//             <div style={styles.topSection}>
//                 <SearchBar
//                     searchQuery={searchQuery}
//                     setSearchQuery={setSearchQuery}
//                     type={"products"}
//                     handleSearch={handleSearch}
//                 />
//                 <div style={styles.voucherBalance}>
//                     Voucher Balance: {voucherBalance} pts
//                 </div>
//             </div>

//             {/* Product Details */}
//             <div style={styles.productContainer}>
//                 <div style={styles.productImage}>
//                     {/* Placeholder or Image */}
//                     {product.productImageUrl ? (
//                         <img
//                             src={product.productImageUrl}
//                             alt={product.name}
//                             style={{
//                                 width: "100%",
//                                 height: "100%",
//                                 borderRadius: "10px",
//                             }}
//                         />
//                     ) : (
//                         "No Image Available"
//                     )}
//                 </div>
//                 <div style={styles.productDetails}>
//                     <div style={styles.productTitle}>{product.name}</div>
//                     <div style={styles.points}>{product.price} pts</div>
//                     <div style={styles.productInfo}>
//                         <p>
//                             <strong>Category:</strong> {product.category}
//                         </p>
//                         <p>
//                             <strong>Quantity Available:</strong>{" "}
//                             {product.quantity}
//                         </p>
//                     </div>
//                     <div style={styles.quantitySelector}>
//                         <label>Quantity: </label>
//                         <button
//                             style={styles.quantityButton}
//                             onClick={() =>
//                                 setQuantity((prev) => Math.max(0, prev - 1))
//                             } // Decrease, minimum 0 if no stock
//                             disabled={quantity <= 0} // Disable if quantity is 0
//                         >
//                             -
//                         </button>
//                         <span style={styles.quantityDisplay}>{quantity}</span>
//                         <button
//                             style={styles.quantityButton}
//                             onClick={
//                                 () =>
//                                     setQuantity((prev) =>
//                                         Math.min(product.quantity, prev + 1)
//                                     ) // Increase, maximum is product quantity
//                             }
//                             disabled={
//                                 quantity >= product.quantity ||
//                                 product.quantity === 0
//                             } // Disable if quantity is max or no stock
//                         >
//                             +
//                         </button>
//                         {product.quantity === 0 && (
//                             <p style={styles.outOfStock}>Out of Stock</p>
//                         )}
//                     </div>
//                     <div style={styles.buttonContainer}>
//                         <span
//                             style={{
//                                 ...styles.favoriteIcon,
//                                 color: isFavorite ? "#FF5722" : "#ccc",
//                             }}
//                             onClick={handleFavourite}
//                             title={
//                                 isFavourite
//                                     ? "Remove from Favourites"
//                                     : "Add to Favourites"
//                             }
//                         >
//                             {isFavorite ? "♥" : "♡"}
//                         </span>
//                         <button
//                             className="button"
//                             style={styles.requestButton}
//                             onClick={handleRequest}
//                         >
//                             Request
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Define styles below the component
// const styles = {
//     page: {
//         fontFamily: "Arial, sans-serif",
//         color: "#333",
//         padding: "20px",
//         maxWidth: "1200px",
//         margin: "0 auto",
//     },
//     topSection: {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: "20px",
//     },
//     voucherBalance: {
//         backgroundColor: "#e6f7ff",
//         padding: "10px 20px",
//         borderRadius: "5px",
//         fontSize: "16px",
//         fontWeight: "bold",
//         boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
//     },
//     productContainer: {
//         display: "flex",
//         gap: "20px",
//         alignItems: "flex-start",
//     },
//     productImage: {
//         width: "400px",
//         height: "400px",
//         backgroundColor: "#f9f9f9",
//         borderRadius: "10px",
//         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         fontSize: "18px",
//         color: "#999",
//     },
//     productDetails: {
//         height: "400px",
//         flex: 1,
//         padding: "10px 20px",
//         backgroundColor: "#fff",
//         borderRadius: "10px",
//         boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
//     },
//     productTitle: {
//         fontSize: "28px",
//         fontWeight: "bold",
//         marginBottom: "15px",
//     },
//     productInfo: {
//         marginBottom: "20px",
//         fontSize: "16px",
//         lineHeight: "1.5",
//         color: "#666",
//     },
//     points: {
//         fontSize: "22px",
//         color: "#FF5722",
//         fontWeight: "bold",
//         marginBottom: "15px",
//     },
//     quantitySelector: {
//         marginBottom: "20px",
//         fontSize: "16px",
//     },
//     buttonContainer: {
//         display: "flex",
//         gap: "15px",
//         alignItems: "center",
//     },
//     favoriteIcon: {
//         fontSize: "24px",
//         cursor: "pointer",
//         transition: "color 0.3s",
//     },
//     requestButton: {
//         padding: "12px 25px",
//         backgroundColor: "#4CAF50",
//         color: "white",
//         border: "none",
//         borderRadius: "5px",
//         cursor: "pointer",
//         fontSize: "16px",
//         fontWeight: "bold",
//         transition: "background-color 0.3s",
//     },
//     quantitySelector: {
//         display: "flex",
//         alignItems: "center",
//         gap: "10px",
//         marginBottom: "20px",
//     },
//     quantityButton: {
//         padding: "5px 10px",
//         backgroundColor: "#4CAF50",
//         color: "white",
//         border: "none",
//         borderRadius: "3px",
//         cursor: "pointer",
//         fontSize: "16px",
//         fontWeight: "bold",
//         transition: "background-color 0.3s",
//         width: "40px",
//         textAlign: "center",
//         disabledStyle: {
//             backgroundColor: "#ccc",
//             cursor: "not-allowed",
//         },
//     },
//     quantityDisplay: {
//         fontSize: "18px",
//         fontWeight: "bold",
//         padding: "5px 10px",
//         border: "1px solid #ddd",
//         borderRadius: "3px",
//         minWidth: "40px",
//         textAlign: "center",
//         backgroundColor: "#f9f9f9",
//     },
//     outOfStock: {
//         color: "red",
//         fontSize: "14px",
//         fontWeight: "bold",
//         marginLeft: "10px",
//     },
// };

// export default ProductPage;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DARK_PURPLE, LIGHT_PURPLE, RED } from "../constants/colors";
import {
    updateMainRecord,
    fetchMainRecord,
    createMainRecord,
	saveRecord
} from "../utils/firebaseUtils";
import { IoMdHeartDislike } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";

import { useAuth } from "../context/authContext";

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

    const productId = product.id;

    useEffect(() => {
        if (!product) {
            console.error("Task not found!");
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

    return (
        <div style={styles.container}>
            <div style={styles.leftContainer}>
                {product.productImageUrl ? (
                    <img
                        src={product.productImageUrl}
                        alt={product.name}
                        style={styles.image}
                    />
                ) : (
                    <div
                        style={{ ...styles.image, ...styles.placeholder }}
                    ></div>
                )}
            </div>
            <div style={styles.rightContainer}>
                <h1 className="large-heading" style={{ color: DARK_PURPLE }}>
                    {product.name}
                </h1>
                <hr style={styles.divider} />
                <div style={styles.subContainer}>
                    <div style={styles.detailsContainer}>
                        <p style={styles.points}>
                            <strong>
                                <span style={{ fontSize: "30px" }}>
                                    {product.price}
                                </span>
                                pts
                            </strong>
                        </p>

                        <p style={styles.description}>
                            Category:{" "}
                            <span style={{ fontSize: "16px" }}>
                                {product.category.charAt(0).toUpperCase() +
                                    product.category.slice(1)}
                            </span>
                        </p>
                        <p style={styles.description}>
                            Quantity Available:{" "}
                            <span style={{ fontSize: "16px" }}>
                                {product.quantity}
                            </span>
                        </p>
                    </div>
                    <div style={styles.buttonContainer}>
                        <div style={{ flexGrow: 1 }} />{" "}
                        <button
                            style={{
                                ...styles.editButton,
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
                                style={styles.applyButton}
                                onClick={handleCart}
                            >
                                Add to Cart
                            </button>
                        ) : (
                            <button
                                style={{
                                    ...styles.applyButton,
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

const styles = {
    container: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "stretch", // Ensures both containers are the same height
        borderRadius: "10px",
        margin: "50px",
        boxSizing: "border-box",
        flexWrap: "wrap", // Allow for wrapping on smaller screens
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
