import React, { useEffect, useState } from "react";
import { fetchMainCollection, updateMainRecord } from "../utils/firebaseUtils";
import { createMainRecord, deleteMainRecord } from "../utils/firebaseUtils";
import { FaRegTrashCan } from "react-icons/fa6";
import SearchBar from "../components/SearchBar";
import { DARK_GREEN, DARK_PURPLE, RED } from "../constants/colors";
import BatchCreateProducts from "../components/BatchCreateProducts";
import "../styles/tableStyles.css"
const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editProductData, setEditProductData] = useState({
    quantity: "",
    restockThreshold: "",
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
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
      quantity: product.quantity || "",
      restockThreshold: product.restockThreshold || "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setEditProductData({ quantity: "", restockThreshold: "" });
  };

  const handleSaveChanges = async () => {
    if (!selectedProduct) return;

    try {
      console.log("Updating product:", selectedProduct.id, editProductData);
      await updateMainRecord("products", selectedProduct.id, editProductData);
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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const { name, category, price, quantity, restockThreshold } = newProduct;

    if (!name || !category || !price || !quantity || !restockThreshold) {
      setMessage("Please fill in all fields");
      return;
    }

    try {
      const newProductData = {
        name,
        category,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
        restockThreshold: parseInt(restockThreshold, 10),
      };
      console.log("New Product Data:", newProductData);
      const createdProduct = await createMainRecord("products", newProductData);
      setProducts((prevProducts) => [
        ...prevProducts,
        { ...newProductData, id: createdProduct.id },
      ]);
      setNewProduct({
        name: "",
        category: "",
        price: "",
        quantity: "",
        restockThreshold: "",
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
      product.category.toLowerCase().includes(filterCategory.toLowerCase())
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
          <table style={pageStyles.table}>
            <thead className="header">
              <tr>
                <th className="header">Name</th>
                <th className="header">Category</th>
                <th className="header">Quantity</th>
                <th className="header">Restock Threshold</th>
                <th className="header">Restock Flag</th>
                <th className="header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((product, index) => (
                <tr key={product.id} className={index % 2 === 0 ? "odd-row" : "even-row"}>
                  <td>{product.name}</td>
                  <td>{product.category || "N/A"}</td>
                  <td>{product.quantity || "N/A"}</td>
                  <td>{product.restockThreshold || "N/A"}</td>
                  <td
                    style={{
                      color:
                        product.quantity < product.restockThreshold
                          ? RED
                          : DARK_GREEN,
                    }}
                  >
                    {product.quantity < product.restockThreshold
                      ? "RESTOCK"
                      : "SAFE"}
                  </td>
                  <td>
                    <div style={pageStyles.actionMenu}>
                      <button
                        style={pageStyles.button}
                        onClick={() =>
                          handleOpenModal({
                            id: product.id,
                            quantity: product.quantity,
                            restockThreshold: product.restockThreshold,
                          })
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
      {/* Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h3>Edit Product</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveChanges();
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
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
                    restockThreshold: parseInt(e.target.value, 10),
                  })
                }
              />
            </label>
            <button type="submit">Save Changes</button>
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
    backgroundColor: "#fff",
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
    backgroundColor: "#6A3D9A",
    color: "#fff",
    fontWeight: "bold",
  },
};

export default Inventory;
