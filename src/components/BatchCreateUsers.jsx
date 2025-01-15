import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useAuth } from "../context/authContext"; // Import the context to use the register function

const BatchCreateUsers = () => {
  const { register } = useAuth(); // Access the register function from AuthContext
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleParse = () => {
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
      const parsedData = XLSX.utils.sheet_to_json(sheet); // Convert to JSON
      setUsers(parsedData); // Save the parsed data
    };
    reader.readAsBinaryString(file);
  };

  const handleCreateUsers = async () => {
    if (users.length === 0) {
      alert("No users to create. Please parse a file first.");
      return;
    }
  
    setLoading(true);
    setMessage(""); // Reset message before starting
  
    // Loop over users and create each one
    for (const user of users) {
      let birthdayString = user.birthday;
  
      // Ensure birthday is a string
      if (birthdayString instanceof Date) {
        // If it's a Date object, format it as "MMYYYY"
        birthdayString = `${birthdayString.getMonth() + 1}${birthdayString.getFullYear()}`;
      } else if (typeof birthdayString === "string") {
        // If it's already a string, ensure it's in the correct format (MMDDYYYY)
        const dateParts = birthdayString.split("/"); // assuming it's in MM/DD/YYYY format
        birthdayString = `${dateParts[0]}${dateParts[2]}`;
      }
  
      const password = `${user.name}${birthdayString}`;
  
      const result = await register(user.email, password, user.name, user.admin);
  
      if (result.success) {
        console.log(`User created: ${user.email}`);
      } else {
        console.error(`Failed to create user ${user.email}: ${result.msg}`);
        setMessage((prev) => `${prev}Error with ${user.email}: ${result.msg}\n`);
      }
    }
  
    setLoading(false);
    if (!message) {
      setMessage("All users created successfully!");
    }
  };
  

  return (
    <div>
      <h1>Batch Create Users</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleParse}>Parse File</button>
      <button onClick={handleCreateUsers} disabled={!users.length || loading}>
        {loading ? "Creating Users..." : "Create Users"}
      </button>
      {message && <pre>{message}</pre>} {/* Display messages */}
    </div>
  );
};

export default BatchCreateUsers;
