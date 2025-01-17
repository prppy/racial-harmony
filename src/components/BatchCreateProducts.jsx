import React, { useState } from "react";
import * as XLSX from "xlsx";
import { DARK_PURPLE, LIGHT_PURPLE, RED } from "../constants/colors";
import { createMainRecord } from "../utils/firebaseUtils";

const BatchCreateProducts = () => {
  const [fileName, setFileName] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle file change
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFileName(uploadedFile.name);
      handleParse(uploadedFile);
    }
  };

  // Parse the Excel file
  const handleParse = (file) => {
    if (!file) {
      alert("Please upload a file first!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0]; // Assuming a single sheet
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, { raw: false }); // Convert to JSON and format data

      setProducts(parsedData);
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle batch creation of products
  const handleCreateProducts = async () => {
    if (products.length === 0) {
      alert("No products to create. Please parse a file first.");
      return;
    }

    setLoading(true);
    setMessage(""); // Reset message before starting

    try {
      const promises = products.map((product) => {
        createMainRecord("products", product);
      });
      await Promise.all(promises);
      setMessage("Products created successfully!");
    } catch (error) {
      setMessage("An error occurred while creating products");
      console.error(error);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setProducts([]); // Clear the products data
    setMessage(""); // Reset the message
    setFileName(""); // Reset the file name
  };

  return (
    <div>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        id="file-input"
        style={{ display: "none" }}
      />
      {/* Custom button to trigger file input */}
      <button
        onClick={() => document.getElementById("file-input").click()}
        className="button"
      >
        Choose File
      </button>
      {fileName && (
        <p style={{ color: DARK_PURPLE, fontWeight: "bold" }}>
          Selected File:{" "}
          <span style={{ color: "black", fontWeight: "normal" }}>
            {fileName}
          </span>
        </p>
      )}
      <button
        onClick={handleCreateProducts}
        disabled={!products.length || loading}
        className="button"
      >
        {loading ? "Creating Products..." : "Create Products"}
      </button>
      {/* Replace the button with a clickable span */}
      <div style={styles.buttonContainer}>
        <span
          onClick={handleReset}
          style={{
            color: RED,
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
            marginLeft: "10px",
          }}
        >
          Create more products
        </span>
      </div>
      {message && <pre style={{ color: "black" }}>{message}</pre>}{" "}
      {/* Display messages */}
    </div>
  );
};

export default BatchCreateProducts;
const styles = {
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
};
