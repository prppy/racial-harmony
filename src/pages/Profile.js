import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { updateMainRecord } from '../utils/firebaseUtils';

const ProfilePage = () => {
  const { logout, user, updateUserBackground} = useAuth();
  const navigate = useNavigate();
  const [selectedBg, setSelectedBg] = useState(user?.bg || 0); // Initial background based on user's current bg

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/');
    } else {
      alert('Logout failed. Please try again.');
    }
  };

  const handleBackgroundPreview = (bgIndex) => {
    setSelectedBg(bgIndex); // Set the preview background without saving it yet
  };

  const handleSubmitBackground = () => {
    updateMainRecord('users', user?.userId, { bg: selectedBg })
      .then(() => {
        updateUserBackground(selectedBg); // Update global state
        alert('Background updated successfully!');
      })
      .catch((err) => {
        console.error('Error updating background:', err);
        alert('Failed to update background. Please try again.');
      });
  };
  return (
    <div style={{ ...pageStyles.pageContainer, backgroundImage: `url(/bg${selectedBg}.png)` }}>
      <h2>Profile</h2>
      <p>Welcome to your profile page. Here you can view your details and make changes.</p>

      <div style={pageStyles.bgSelector}>
        <h3>Select Your Background:</h3>
        <div style={pageStyles.bgOptions}>
          {[0,1, 2, 3, 4, 5].map((bgIndex) => (
            <div
              key={bgIndex}
              style={{
                ...pageStyles.bgOption,
                backgroundImage: bgIndex !== 0 ? `url(/bg${bgIndex}.png)`: 'transparent',
                border: selectedBg === bgIndex ? '3px solid #9C3726' : '2px solid #ccc',
              }}
              onClick={() => handleBackgroundPreview(bgIndex)}
            />
          ))}
        </div>
      </div>

      <button onClick={handleSubmitBackground} style={pageStyles.submitButton}>
        Submit Background
      </button>

      <button onClick={handleLogout} style={pageStyles.logoutButton}>
        Logout
      </button>
    </div>
  );
};

const pageStyles = {
  pageContainer: {
    padding: '20px',
    minHeight: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  bgSelector: {
    margin: '20px 0',
  },
  bgOptions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  bgOption: {
    width: '80px',
    height: '80px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  submitButton: {
    padding: '10px',
    margin: '10px 5px',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    backgroundColor: '#2B3487',
    fontWeight: 'bold',
    cursor: 'pointer',
    height: '50px',
    width: '200px',
    fontSize: '15px',
  },
  logoutButton: {
    padding: '10px',
    margin: '10px 5px',
    border: 'none',
    borderRadius: '10px',
    color: '#2B3487',
    backgroundColor: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    height: '50px',
    width: '150px',
    fontSize: '15px',
  },
};

export default ProfilePage;
