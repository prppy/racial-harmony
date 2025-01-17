import React, { useEffect, useState } from "react";
import { fetchMainCollection } from "../utils/firebaseUtils";
import { createMainRecord } from "../utils/firebaseUtils"; // Import the createMainRecord function
import { FaRegTrashCan } from "react-icons/fa6";
import SearchBar from "../components/SearchBar";
import { DARK_PURPLE } from "../constants/colors";
import BatchCreateProducts from "../components/BatchCreateProducts";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [message, setMessage] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
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

  const handleEditProduct = (productId, updatedQuantity, updatedThreshold) => {
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
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter(
      (product) => product.id !== productId
    );
    setProducts(updatedProducts);
  };

  const handleAddProduct = async () => {
    const { name, category, quantity, restockThreshold } = newProduct;

    if (!name || !category || !quantity || !restockThreshold) {
      setMessage("Please fill in all fields");
      return;
    }

    try {
      // Create the new product record in Firestore
      const newProductData = { name, category, quantity, restockThreshold };
      await createMainRecord("products", newProductData);
      setProducts([
        ...products,
        { ...newProductData, id: Date.now().toString() },
      ]);
      setNewProduct({
        name: "",
        category: "",
        quantity: "",
        restockThreshold: "",
      });
      setMessage("Product added successfully");
    } catch (error) {
      setMessage("Error adding product. Please try again.");
    }
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) =>
      filterCategory ? product.category === filterCategory : true
    );

  // Sorting: products needing restocking at the top
  const sortedProducts = filteredProducts.sort((a, b) => {
    if (a.quantity < a.restockThreshold) return -1;
    if (b.quantity < b.restockThreshold) return 1;
    return 0;
  });

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
            <label style={pageStyles.label}>Filter by Category:</label>
            <input
              type="text"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              placeholder="Enter category"
              style={pageStyles.input}
            />
          </div>
        </div>

        {message && <p style={pageStyles.message}>{message}</p>}

        <div style={pageStyles.tableWrapper}>
          <table style={pageStyles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Restock Threshold</th>
                <th>Restock Flag</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category || "N/A"}</td>
                  <td>{product.quantity || "N/A"}</td>
                  <td>{product.restockThreshold || "N/A"}</td>
                  <td
                    style={{
                      color:
                        product.quantity < product.restockThreshold
                          ? "red"
                          : "green",
                    }}
                  >
                    {product.quantity < product.restockThreshold
                      ? "Restock"
                      : "Safe"}
                  </td>
                  <td>
                    <div style={pageStyles.actionMenu}>
                      <button
                        style={pageStyles.button}
                        oonClick={() =>
                          handleEditProduct(
                            product.id,
                            prompt("Enter new quantity:", product.quantity),
                            prompt(
                              "Enter new restock threshold:",
                              product.restockThreshold
                            )
                          )
                        }
                      >
                        Edit
                      </button>
                      <button
                        style={pageStyles.iconButton}
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <FaRegTrashCan color="red" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 style={pageStyles.subHeading}>Add New Inventory</h2>
          {/* Add New Product Form */}
          <h3>Add New Product</h3>
          <form style={pageStyles.form} onSubmit={handleAddProduct}>
            <div style={pageStyles.formGroup}>
              <label style={pageStyles.label}>
                Product Name:
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
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
                    setNewProduct({ ...newProduct, category: e.target.value })
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
                      restockThreshold: parseInt(e.target.value),
                    })
                  }
                  style={pageStyles.input}
                  required
                />
              </label>
            </div>
            <div style={pageStyles.buttonContainer}>
              <button type="submit" style={pageStyles.button}>
                Add Product
              </button>
            </div>
          </form>
          <h3>Batch Add Products</h3>
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
    color: "black",
  },
  innerContainer: {
    backgroundColor: "#fff",
    width: "80%",
    height: "80%",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    marginTop: "20px",
  },
  subHeading: {
    color: "#6A3D9A",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  filterContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    marginTop: "20px",
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
    border: "1px solid #ccc",
    fontSize: "14px",
    marginLeft: "10px",
  },
  tableWrapper: {
    overflowX: "auto",
    marginTop: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  button: {
    padding: "8px 12px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#6A3D9A",
    color: "#fff",
    fontWeight: "bold",
  },
  actionMenu: {
    display: "flex",
    gap: "10px",
  },
  iconButton: {
    padding: "8px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    backgroundColor: "transparent",
    color: "#fff",
    fontSize: "16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    color: "red",
    marginTop: "10px",
    fontWeight: "bold",
  },
  addProductContainer: {
    marginBottom: "20px",
    marginTop: "20px",
  },
  inputGroup: {
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "20px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
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
