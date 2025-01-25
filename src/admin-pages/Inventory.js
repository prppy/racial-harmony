import React, { useEffect, useState } from "react";
import {
    fetchMainCollection,
    uploadImage,
} from "../utils/firebaseUtils";
import { createMainRecord } from "../utils/firebaseUtils";
import SearchBar from "../components/SearchBar";
import { DARK_PURPLE, LIGHT_GRAY } from "../constants/colors";
import BatchCreateProducts from "../components/BatchCreateProducts";
import "../styles/tableStyles.css";
import ProductTable from "../components/ProductTable";

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [message, setMessage] = useState("");
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: 0,
        category: "",
        quantity: 0,
        restockThreshold: 0,
    });

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await fetchMainCollection("products");
            setProducts(data || []);
        };
        fetchProducts();
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const {
            name,
            category,
            price,
            quantity,
            restockThreshold,
            productImageUrl,
        } = newProduct;

        if (
            !name ||
            !category ||
            !price ||
            !quantity ||
            !restockThreshold ||
            !productImageUrl
        ) {
            setMessage("Please fill in all fields and upload an image.");
            return;
        }

        try {
            const newProductData = {
                name,
                category,
                price: parseFloat(price),
                quantity: parseInt(quantity, 10),
                restockThreshold: parseInt(restockThreshold, 10),
                productImageUrl, // Add image URL here
            };
            console.log("New Product Data:", newProductData);
            const createdProduct = await createMainRecord(
                "products",
                newProductData
            );
            setProducts((prevProducts) => [
                ...prevProducts,
                { ...newProductData, id: createdProduct.id },
            ]);
            setNewProduct({
                name: "",
                category: "",
                price: "",
                quantity: 0,
                restockThreshold: 0,
                productImageUrl: "",
            });
            setMessage("Product added successfully");
        } catch (error) {
            console.error("Error adding product:", error);
            setMessage("Error adding product. Please try again.");
        }
    };

    const filteredProducts = products
        .filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((product) =>
            product.category
                .toLowerCase()
                .includes(filterCategory.toLowerCase())
        );

    // Sorting: products needing restocking at the top
    const sortedProducts = filteredProducts.sort((a, b) => {
        if (a.quantity < a.restockThreshold) return -1;
        if (b.quantity < b.restockThreshold) return 1;
        return 0;
    });

    const handleProductImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // Assuming the function 'uploadImage' works the same way for both users and products
            const { downloadURL, imageRef } = await uploadImage(
                file,
                "products", // Folder for storing product images
                "product" // Change to "product" or any relevant type if needed
            );

            // Store the image URL in the product state
            setNewProduct((prevProduct) => ({
                ...prevProduct,
                productImageUrl: downloadURL, // This sets the image URL in the form
                productImageRef: imageRef, // You can store the reference too if needed
            }));

            setMessage("Product image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading product image:", error);
            setMessage("Failed to upload product image. Please try again.");
        }
    };

    return (
        <div style={pageStyles.outerContainer}>
            <div style={pageStyles.innerContainer}>
                <h2 style={pageStyles.subHeading}>Manage Inventory</h2>

                <div style={pageStyles.filterContainer}>
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        type="product"
                    />

                    <div style={pageStyles.filterGroup}>
                        <input
                            type="text"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            placeholder="Filter by category"
                            style={pageStyles.input}
                        />
                    </div>
                </div>

                {message && <p style={pageStyles.message}>{message}</p>}

                <div style={pageStyles.tableWrapper}>
                    <ProductTable filterCategory={filterCategory} searchQuery={searchQuery}/>

                    <h2 style={pageStyles.subHeading}>Add New Inventory</h2>
                    {/* Add New Product Form */}
                    <h3 style={{color: DARK_PURPLE}}>Add New Product</h3>
                    <form style={pageStyles.form} onSubmit={handleAddProduct}>
                        <div style={pageStyles.formGroup}>
                            <label style={pageStyles.label}>
                                Product Name:
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            name: e.target.value,
                                        })
                                    }
                                    style={pageStyles.input}
                                    required
                                />
                            </label>
                            <label style={pageStyles.label}>
                                Category:
                                <input
                                    type="text"
                                    value={newProduct.category}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            category: e.target.value,
                                        })
                                    }
                                    style={pageStyles.input}
                                    required
                                />
                            </label>
                            <label style={pageStyles.label}>
                                Price:
                                <input
                                    type="number"
                                    value={newProduct.price}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            price: parseFloat(e.target.value),
                                        })
                                    }
                                    style={pageStyles.input}
                                    step="0.01"
                                    required
                                />
                            </label>
                            <label style={pageStyles.label}>
                                Quantity:
                                <input
                                    type="number"
                                    value={newProduct.quantity}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            quantity: parseInt(e.target.value),
                                        })
                                    }
                                    style={pageStyles.input}
                                    required
                                />
                            </label>
                            <label style={pageStyles.label}>
                                Restock Threshold:
                                <input
                                    type="number"
                                    value={newProduct.restockThreshold}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            restockThreshold: parseInt(
                                                e.target.value
                                            ),
                                        })
                                    }
                                    style={pageStyles.input}
                                    required
                                />
                            </label>
                            <label style={pageStyles.label}>
                                Product Image:
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProductImageUpload} // This triggers the image upload
                                    style={pageStyles.input}
                                />
                            </label>
                        </div>
                        <div style={pageStyles.buttonContainer}>
                            <button type="submit" style={pageStyles.button}>
                                Add Product
                            </button>
                        </div>
                    </form>
                    <h3 style={{color: DARK_PURPLE}}>Batch Add Products</h3>
                    <div style={pageStyles.form}>
                        <BatchCreateProducts />
                    </div>
                    {message && <p style={pageStyles.message}>{message}</p>}
                </div>
            </div>
        </div>
    );
};

const pageStyles = {
    outerContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
    },
    innerContainer: {
        backgroundColor: "white",
        width: "80%",
        height: "80%",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        marginTop: "20px",
        overflowY: "auto",
    },
    subHeading: {
        color: DARK_PURPLE,
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
    },
    filterContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px",
    },
    filterGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "5px",
    },
    label: {
        fontSize: "14px",
        color: DARK_PURPLE,
    },
    input: {
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid white",
        fontSize: "14px",
    },
    tableWrapper: {
        overflowX: "auto",
        marginTop: "20px",
    },
    button: {
        padding: "8px 12px",
        borderRadius: "4px",
        border: "none",
        cursor: "pointer",
        backgroundColor: DARK_PURPLE,
        color: "white",
        fontWeight: "bold",
    },
    message: {
        color: "red",
        marginTop: "10px",
        fontWeight: "bold",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        padding: "20px",
        border: `1px solid ${LIGHT_GRAY}`,
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        backgroundColor: LIGHT_GRAY,
    },
    formGroup: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
    },
};

export default Inventory;
