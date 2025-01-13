import React from 'react';

const ProfilePage = () => {
  return (
    <div style={pageStyles.pageContainer}>
      <h2>Profile</h2>
      <p>Welcome to your profile page. Here you can view your details and make changes.</p>
    </div>
  );
};

const pageStyles = {
  pageContainer: {
    padding: '20px',
  },
};

export default ProfilePage;
