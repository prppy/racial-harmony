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

  const handleParse = (file) => {
    if (!file) {
      alert("Please upload a file first!");
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
  
      const rawParsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      if (rawParsedData.length > 0) {
        const headers = rawParsedData[0].map((header) =>
          header.toLowerCase().replace(/\s+/g, "_")
        );
  
        const parsedData = rawParsedData.slice(1).map((row) =>
          row.reduce((acc, value, index) => {
            acc[headers[index]] = value;
            return acc;
          }, {})
        );
  
        const formattedData = parsedData.map((user) => {
          if (user.admission_date) {
            // Convert Excel serial date to JS Date
            user.admission_date = convertExcelDate(user.admission_date);
          }
          if (user.birthday) {
            // Convert Excel serial date to JS Date
            user.birthday = convertExcelDate(user.birthday);
          }
          return user;
        });
  
        setUsers(formattedData);
      } else {
        alert("No data found in the uploaded file!");
      }
    };
  
    reader.readAsArrayBuffer(file);
  };
  
  // Helper function to convert Excel date serial to JavaScript Date
  const convertExcelDate = (excelDate) => {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel's epoch (Dec 30, 1899)
    const msPerDay = 24 * 60 * 60 * 1000;
  
    if (!isNaN(excelDate)) {
      // Convert serial date to milliseconds and add to epoch
      return new Date(excelEpoch.getTime() + (excelDate - 1) * msPerDay);
    }
  
    // If not a valid Excel date, return null or handle gracefully
    return null;
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
        setMessage("All users created successfully! Please reload the page to see the updates");
        
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
  <div style={styles.buttonContainer}>
  <span
    onClick={handleReset}
    style={{
      color: RED,
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px',
      marginLeft: '10px',
    }}
  >
    Create more users
  </span>
   
  </div>
 

  {message && <pre style={{color:'black'}}>{message}</pre>} {/* Display messages */}
</div>

  );
};

export default BatchCreateUsers;

const styles = {
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
}