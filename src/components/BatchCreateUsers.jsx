import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios"; // Axios for HTTP requests
import { DARK_PURPLE, LIGHT_PURPLE, RED } from "../constants/colors";
import { fetchMainCollection } from "../utils/firebaseUtils";
const BatchCreateUsers = () => {
  const [fileName, setFileName] = useState(''); // New state for file name
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle file change
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile)
   { setFileName(uploadedFile.name)
    handleParse(uploadedFile)}
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
  
      // Format date fields
      const formattedData = parsedData.map((user) => {
        if (user.admission_date) {
          // Convert Excel serial date number to Date object
          user.admission_date = XLSX.utils.format_cell({ t: 'd', v: user.admission_date });
        }
        if (user.birthday) {
          // Convert Excel serial date number to Date object
          user.birthday = XLSX.utils.format_cell({ t: 'd', v: user.birthday });
        }
        return user;
      });
  
      setUsers(formattedData); // Save the formatted data
    };
    reader.readAsArrayBuffer(file);
  };
  

  // Handle batch creation of users
  const handleCreateUsers = async () => {
    if (users.length === 0) {
      alert("No users to create. Please parse a file first.");
      return;
    }

    setLoading(true);
    setMessage(""); // Reset message before starting

    try {
      const response = await axios.post("http://localhost:5001/createBatchUsers", {
        users,
      });

      // Handle success or error based on response
      if (response.data.success) {
        setMessage("All users created successfully!");
      } else {
        // Display errors for users that couldn't be created
        const errorMessages = response.data.errors.map(
          (e) => `${e.email}: ${e.error}`
        ).join("\n");

        setMessage(`Some users could not be created:\n${errorMessages}`);
      }
    } catch (error) {
      console.error("Error creating users:", error);
      setMessage(`An error occurred: ${error.message || "Unknown error"}`);
    }

    setLoading(false);
  };

  const handleReset = () => {
    setUsers([]); // Clear the users data
    setMessage(""); // Reset the message
    setFileName(''); // Reset the file name
  };

  return (
<div>
  <h1>Batch Create Users</h1>
  <input
    type="file"
    accept=".xlsx, .xls"
    onChange={handleFileChange}
    id="file-input"
    style={{ display: 'none' }}
  />
  {/* Custom button to trigger file input */}
  <button onClick={() => document.getElementById('file-input').click()} className="button">
    Choose File
  </button>

  {fileName && (
    <p style={{ color: DARK_PURPLE, fontWeight: 'bold' }}>
      Selected File: <span style={{ color: 'black', fontWeight: 'normal' }}>{fileName}</span>
    </p>
  )}

  <button onClick={handleCreateUsers} disabled={!users.length || loading} className="button">
    {loading ? "Creating Users..." : "Create Users"}
  </button>

  {/* Replace the button with a clickable span */}
  <span
    onClick={handleReset}
    style={{
      color: RED,
      cursor: 'pointer',
      fontWeight: 'bold',
    }}
  >
    Create more users
  </span>

  {message && <pre style={{color:'black'}}>{message}</pre>} {/* Display messages */}
</div>

  );
};

export default BatchCreateUsers;
