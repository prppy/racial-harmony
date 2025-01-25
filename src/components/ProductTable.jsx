// ProductTable.js
import React, { useEffect, useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import {
    RED,
    DARK_GREEN,
    DARK_PURPLE,
    DARK_GRAY,
} from "../constants/colors";
import {
    deleteMainRecord,
    fetchMainCollection,
    updateMainRecord,
} from "../utils/firebaseUtils";

const ProductTable = ({
    filterCategory,
    searchQuery,
    showLimitedColumns = false,
}) => {
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editProductData, setEditProductData] = useState({
        quantity: "",
        restockThreshold: "",
    });

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await fetchMainCollection("products");
            setProducts(data || []);
        };
        fetchProducts();
    }, []);

    const handleEditProduct = async (
        productId,
        updatedQuantity,
        updatedThreshold
    ) => {
        const updatedProducts = products.map((product) =>
            product.id === productId
                ? {
                      ...product,
                      quantity: updatedQuantity,
                      restockThreshold: updatedThreshold,
                  }
                : product
        );
        setProducts(updatedProducts);

        try {
            await updateMainRecord("products", productId, {
                quantity: updatedQuantity,
                restockThreshold: updatedThreshold,
            });
            setMessage("Product updated successfully");
        } catch (error) {
            setMessage("Error updating product. Please try again.");
        }
    };

    const handleOpenModal = (product) => {
        setSelectedProduct(product);
        setEditProductData({
            quantity: product.quantity || 0,
            restockThreshold: product.restockThreshold || 0,
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
        setEditProductData({ quantity: 0, restockThreshold: 0 });
    };

    const handleSaveChanges = async () => {
        if (!selectedProduct) return;

        try {
            console.log(
                "Updating product:",
                selectedProduct.id,
                editProductData
            );
            await updateMainRecord(
                "products",
                selectedProduct.id,
                editProductData
            );
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === selectedProduct.id
                        ? { ...product, ...editProductData }
                        : product
                )
            );
            setMessage("Product updated successfully");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error updating product:", error);
            setMessage("Error updating product. Please try again.");
        }
    };

    const handleDeleteProduct = async (productId) => {
        const updatedProducts = products.filter(
            (product) => product.id !== productId
        );
        setProducts(updatedProducts);

        try {
            await deleteMainRecord("products", productId);
            setMessage("Product deleted successfully");
        } catch (error) {
            setMessage("Error deleting product. Please try again.");
        }
    };

    // Filter and sort products
    let filteredProducts = products
        .filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((product) =>
            product.category
                .toLowerCase()
                .includes(filterCategory.toLowerCase())
        );

    if (showLimitedColumns) {
        // Filter for products that need restocking when on the homepage
        filteredProducts = filteredProducts.filter(
            (product) => product.quantity < product.restockThreshold
        );
    }

    const sortedProducts = filteredProducts.sort((a, b) => {
        if (a.quantity < a.restockThreshold) return -1;
        if (b.quantity < b.restockThreshold) return 1;
        return 0;
    });

    return (
        <div
            style={{
                overflow: "auto",
                maxHeight: "400px",
                color: DARK_PURPLE,
                width: "100%",
            }}
        >
            {message && <p style={pageStyles.message}>{message}</p>}
            <table style={pageStyles.table}>
                <thead>
                    <tr>
                        <th style={pageStyles.th}>Name</th>
                        {showLimitedColumns ? null : (
                            <th style={pageStyles.th}>Category</th>
                        )}
                        <th style={pageStyles.th}>Quantity</th>
                        <th style={pageStyles.th}>Restock Threshold</th>
                        {showLimitedColumns ? null : (
                            <th style={pageStyles.th}>Restock Flag</th>
                        )}
                        <th style={pageStyles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedProducts.map((product, index) => (
                        <tr
                            key={product.id}
                            className={index % 2 === 0 ? "odd-row" : "even-row"}
                        >
                            <td style={pageStyles.td}>{product.name}</td>
                            {showLimitedColumns ? null : (
                                <td style={pageStyles.td}>
                                    {product.category || "N/A"}
                                </td>
                            )}
                            <td style={pageStyles.td}>
                                {product.quantity || 0}
                            </td>
                            <td style={pageStyles.td}>
                                {product.restockThreshold || "N/A"}
                            </td>
                            {showLimitedColumns ? null : (
                                <td
                                    style={{
                                        ...pageStyles.td,
                                        color:
                                            product.quantity <
                                            product.restockThreshold
                                                ? RED
                                                : DARK_GREEN,
                                    }}
                                >
                                    {product.quantity < product.restockThreshold
                                        ? "RESTOCK"
                                        : "SAFE"}
                                </td>
                            )}
                            <td style={pageStyles.td}>
                                <div style={pageStyles.actionMenu}>
                                    <button
                                        style={pageStyles.button}
                                        onClick={() =>
                                            handleOpenModal({
                                                id: product.id,
                                                quantity: product.quantity,
                                                restockThreshold:
                                                    product.restockThreshold,
                                            })
                                        }
                                    >
                                        Edit
                                    </button>
                                    <button
                                        style={pageStyles.iconButton}
                                        onClick={() =>
                                            handleDeleteProduct(product.id)
                                        }
                                    >
                                        <FaRegTrashCan color={RED} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Modal */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <h3 style={{color: DARK_PURPLE}}>Edit Product</h3>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveChanges();
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "25px",
                            color: DARK_PURPLE
                        }}
                    >
                        <label>
                            Quantity:
                            <input
                                type="number"
                                value={editProductData.quantity}
                                onChange={(e) =>
                                    setEditProductData({
                                        ...editProductData,
                                        quantity: parseInt(e.target.value, 10),
                                    })
                                }
                            />
                        </label>
                        <label>
                            Restock Threshold:
                            <input
                                type="number"
                                value={editProductData.restockThreshold}
                                onChange={(e) =>
                                    setEditProductData({
                                        ...editProductData,
                                        restockThreshold: parseInt(
                                            e.target.value,
                                            10
                                        ),
                                    })
                                }
                            />
                        </label>
                        <button
                            type="submit"
                            onClick={handleEditProduct}
                            style={modalStyles.button}
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                {children}
                <button onClick={onClose} style={modalStyles.closeButton}>
                    Close
                </button>
            </div>
        </div>
    );
};

const pageStyles = {
    outerContainer: {
        color: DARK_PURPLE,
        overflow: "auto",
        maxHeight: "400px",
        width: "100%",
    },
    actionButtons: {
        display: "flex",
        gap: "10px", // Space between buttons
    },
    button: {
        backgroundColor: DARK_GREEN,
        color: "white",
        border: "none",
        borderRadius: "10px",
        padding: "10px 20px",
        cursor: "pointer",
        fontWeight: "bold",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "115px",
        textAlign: "center",
    },
    disabledButton: {
        backgroundColor: DARK_GRAY,
        color: "white",
        cursor: "not-allowed",
        width: "115px",
        textAlign: "center",
        border: "none",
        borderRadius: "10px",
        padding: "10px 20px",
        fontWeight: "bold",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        backgroundColor: "#f4f4f4",
        padding: "10px",
        textAlign: "left",
        borderBottom: "1px solid #ddd",
    },
    td: {
        padding: "10px",
        borderBottom: "1px solid #ddd",
        textAlign: "left",
    },
    actionMenu: {
        display: "flex",
        gap: "10px",
        color: DARK_PURPLE
    },
    iconButton: {
        padding: "8px",
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        backgroundColor: "transparent",
        color: "white",
        fontSize: "16px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
};

const modalStyles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
    },
    modal: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 1001,
    },
    button: {
        marginTop: "10px",
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
        backgroundColor: DARK_PURPLE,
        color: "white",
        fontWeight: "bold",
    },
};

export default ProductTable;
