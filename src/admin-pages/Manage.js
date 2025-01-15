import React, { useState } from 'react';
import BatchCreateUsers from '../components/BatchCreateUsers';
import UserSearch from '../components/UserSearch';  // Import UserSearch component
import { LIGHT_PURPLE, DARK_PURPLE } from '../constants/colors';
import axios
 from 'axios';
const Manage = () => {
  const [userId, setUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  // Delete user function using axios.delete
  // DELETE user function using axios DELETE
const handleDeleteUser = async () => {
  if (!userId) {
    setMessage("Please enter a User ID.");
    return;
  }

  try {
    const response = await axios.delete(`http://localhost:5001/deleteUser/${userId}`);

    // Handle response
    if (response.data.success) {
      setMessage('User deleted successfully!');
    } else {
      setMessage(response.data.error || 'Failed to delete user');
    }
  } catch (error) {
    setMessage('Failed to delete user');
  }
};

// RESET PASSWORD
const handleResetPassword = async () => {
  if (!userId || !newPassword) {
    setMessage("Please enter both User ID and New Password.");
    return;
  }

  try {
    // Corrected URL with userId included in the URL path
    const response = await axios.post(`http://localhost:5001/resetPassword/${userId}`, {
      newPassword,
    });

    // Handle response
    if (response.data.success) {
      setMessage('Password reset successfully!');
    } else {
      setMessage(response.data.error || 'Failed to reset password');
    }
  } catch (error) {
    setMessage('Failed to reset password');
  }
};

  return (
    <div style={pageStyles.outerContainer}>
      <div style={pageStyles.innerContainer}>
        <text style={pageStyles.subHeading}>Batch Create Users</text>
        <BatchCreateUsers />

        <UserSearch setUserId={setUserId} setMessage={setMessage} />

        {/* Admin Actions */}
        <div>
          <h3 style={pageStyles.subHeading}>Admin Actions</h3>

          <div>
            <label style={{color:'black', fontWeight:'bold'}}>User ID:</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User ID to manage"
            />
          </div>

          <div>
            <label style={{color:'black', fontWeight:'bold'}}>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <button onClick={handleDeleteUser} disabled={!userId}>
            Delete User
          </button>

          <button onClick={handleResetPassword} disabled={!userId || !newPassword}>
            Reset Password
          </button>

          {message && <p style={{color:'black'}}>{message}</p>}
        </div>
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
    color: LIGHT_PURPLE,
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'left', // Align the text to the left
  },
};

export default Manage;
