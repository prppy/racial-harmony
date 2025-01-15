import React from 'react';
import BatchCreateUsers from '../components/BatchCreateUsers';
import { LIGHT_PURPLE, DARK_PURPLE } from '../constants/colors';
const Manage = () => {
  return (
    <div style={pageStyles.outerContainer}>
      <div style={pageStyles.innerContainer}>
        <text style={pageStyles.subHeading}>Batch Create Users</text>
        <BatchCreateUsers />
      </div>
    </div>
  );
};

const pageStyles = {
  outerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh', // Full viewport height
  },
  innerContainer: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
    width: '90%', // Increased width
    minHeight: '80vh', // Increased height with minHeight
    maxWidth: '1200px',
    textAlign: 'left', 
    overflowY: 'auto', // Allows scrolling if content overflows
  },
   subHeading: {
      color: LIGHT_PURPLE ,
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "20px",
      textAlign: "left", // Align the text to the left
    },
};

export default Manage;
