import React from 'react';
import {useAuth} from '../context/authContext';
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {

  const {logout} = useAuth();
  const navigate = useNavigate();


  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/"); 
    } else {
      alert("Logout failed. Please try again.");
    }
  };


  return (
    <div style={pageStyles.pageContainer}>
      <h2>Profile</h2>
      <p>Welcome to your profile page. Here you can view your details and make changes.</p>
      <button onClick={handleLogout} style={pageStyles.button}>Logout</button>
    </div>
  );
};

const pageStyles = {
  pageContainer: {
    padding: '20px',
  },
  button: {
    padding: "10px",
    margin: "0 5px",
    border: "none",
    borderRadius: "10px",
    color: "#2B3487",
    backgroundColor: "white",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
    height: "50px",
    width: "150px",
    fontSize: "15px",
  },
};

export default ProfilePage;
