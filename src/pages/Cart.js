import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import {
    fetchCollection,
    fetchMainRecord,
    deleteRecord,
    updateMainRecord,
} from "../utils/firebaseUtils";
import { DARK_GRAY, DARK_PURPLE, LIGHT_PURPLE, RED } from "../constants/colors";

const Cart = () => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [qrCodeVisible, setQrCodeVisible] = useState(false); // State for controlling QR code visibility

    useEffect(() => {
        getCart();
    }, []);

    const getCart = async () => {
        try {
            const cartData = await fetchCollection(
                "users",
                user?.userId,
                "cart"
            );
            const updatedCartData = await Promise.all(
                cartData.map(async (product) => {
                    const productData = await fetchMainRecord(
                        "products",
                        product.productId
                    );
                    if (productData) {
                        return {
                            ...product,
                            productImageUrl: productData.productImageUrl,
                            selected: false, // Add a selected flag to each product
                        };
                    }
                    return product;
                })
            );
            setCart(updatedCartData);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    const toggleSelectItem = (id) => {
        const updatedCart = cart.map((item) =>
            item.id === id ? { ...item, selected: !item.selected } : item
        );
        setCart(updatedCart);

        const updatedSelectedItems = updatedCart
            .filter((item) => item.selected)
            .map((item) => item);
        setSelectedItems(updatedSelectedItems);
    };

    const toggleSelectAll = () => {
        const allSelected = cart.every((item) => item.selected);
        const updatedCart = cart.map((item) => ({
            ...item,
            selected: !allSelected,
        }));
        setCart(updatedCart);

        if (allSelected) {
            setSelectedItems([]);
        } else {
            setSelectedItems(updatedCart);
        }
    };

    const handleCheckout = async () => {
        try {
            await Promise.all(
                selectedItems.map(async (item) => {
                    const product = await fetchMainRecord(
                        "products",
                        item.productId
                    );
                    const oldQuantity = product.quantity;
                    const newQuantity = oldQuantity - item.quantity;

                    if (newQuantity >= 0) {
                        // Update the product quantity
                        await updateMainRecord("products", item.productId, {
                            quantity: newQuantity,
                        });

                        // Delete the item from the cart
                        await deleteRecord(
                            "users",
                            user?.userId,
                            "cart",
                            item.id
                        );
                    } else {
                        throw new Error(
                            `Not enough stock for ${item.productName}.`
                        );
                    }
                })
            );
            setQrCodeVisible(true);

            setCart(cart.filter((item) => !item.selected));
            setSelectedItems([]); // Reset selected items
            alert("Checkout successful!");
        } catch (error) {
            // If something fails, show an alert and stop the process
            console.error("Checkout failed:", error);
            alert(`Checkout failed: ${error.message}`);
        }
    };

    return (
        <div style={pageStyles.pageContainer}>
            <div style={pageStyles.leftContainer}>
                <h2 style={receiptStyles.header}>Uncollected Items:</h2>
                {cart.map((item, index) => (
                    <div key={item.id} style={receiptStyles.itemRow}>
                        <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => toggleSelectItem(item.id)} // Use id here instead of index
                        />

                        <img
                            src={item.productImageUrl}
                            alt={item.productName}
                            style={receiptStyles.image}
                        />
                        <div style={receiptStyles.itemDetails}>
                            <p style={receiptStyles.productName}>
                                {item.productName}
                            </p>
                            <p style={receiptStyles.points}>
                                {item.unitPoint}pts
                            </p>
                            <p style={receiptStyles.quantity}>
                                x {item.quantity}
                            </p>
                        </div>
                    </div>
                ))}
                <div style={receiptStyles.footer}>
                    <div>
                        <input
                            type="checkbox"
                            checked={cart.every((item) => item.selected)}
                            onChange={toggleSelectAll}
                        />
                        <label style={receiptStyles.selectAll}>All</label>
                    </div>
                    <button
                        style={receiptStyles.checkoutButton}
                        onClick={handleCheckout}
                    >
                        Check Out ({selectedItems.length})
                    </button>
                </div>
            </div>
            <div style={pageStyles.rightContainer}>
                <p style={styles.text}>
                    Select Check Out when you are at the Minimart!
                </p>
                {qrCodeVisible && (
                    <div>
                        <img
                            src="/QR.png"
                            alt="QR Code"
                            style={styles.qrCode}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const pageStyles = {
    pageContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "stretch", // Ensures both containers are the same height
        borderRadius: "10px",
        margin: "50px",
        boxSizing: "border-box",
        flexWrap: "wrap", // Allow for wrapping on smaller screens
    },
    leftContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 200px)", // Adjust height based on viewport minus paddings/margins
        marginRight: "25px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxSizing: "border-box",
        padding: "25px", // Ensures internal content is not cut off
        paddingBottom: "25px", // Prevent the bottom part from being clipped
        overflowY: "auto", // Enables scrolling within the container
        overflowX: "hidden", // Prevents horizontal overflow
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    rightContainer: {
        flex: 1, // Ensures both containers grow to fill available space
        display: "flex",
        height: "calc(100vh - 200px)",
        marginLeft: "25px",
        justifyContent: "flex-start",
        flexDirection: "column", // Aligns the details container and button container vertically
        alignItems: "center",
        padding: "25px",
        paddingTop: "0",
        paddingBottom: "0",
        borderRadius: "10px",
        boxSizing: "border-box",
    },
};

const receiptStyles = {
    header: {
        fontSize: "25px",
        fontWeight: "bold",
        marginBottom: "15px",
        color: DARK_PURPLE,
        marginTop: "0",
    },
    itemRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "25px",
    },
    image: {
        width: "100px",
        height: "100px",
        objectFit: "cover",
        marginRight: "25px",
        marginLeft: "25px",
        borderRadius: "10px",
        border: `2px solid ${DARK_GRAY}`,
    },
    itemDetails: {
        flex: 1,
    },
    productName: {
        fontSize: "20px",
        fontWeight: "bold",
        color: DARK_PURPLE,
        marginTop: "0",
    },
    points: {
        fontSize: "16px",
        color: "#555",
    },
    quantity: {
        fontSize: "16px",
        color: "#777",
        textAlign: "right",
        flexShrink: 0,
        marginLeft: "25px",
    },
    footer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "25px",
    },
    selectAll: {
        fontSize: "20px",
        marginLeft: "25px",
        color: RED,
    },
    checkoutButton: {
        backgroundColor: DARK_PURPLE,
        color: "#FFF",
        border: "none",
        borderRadius: "10px",
        padding: "12px 25px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "16px",
    },
};

const styles = {
    text: {
        fontSize: "25px",
        fontWeight: "bold",
        textAlign: "center",
        marginTop: "0",
        backgroundColor: RED,
        padding: "10px",
        borderRadius: "10px",
    },
    qrCode: {
        width: "100%",
        height: "100%",
        objectFit: "contain",
    },
};

export default Cart;
