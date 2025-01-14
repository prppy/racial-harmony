import React from 'react';
import { useAuth } from '../context/authContext';

const HomePage = () => {
  const {user} = useAuth();
  return (
    <div style={pageStyles.pageContainer}>
      <h2>Welcome {user.admin ? "Admin " : "Resident "}{user?.name}</h2>
      <p>Home dashboard</p>
    </div>
  );
};

const pageStyles = {
  pageContainer: {
    padding: '20px',
  },
};

export default HomePage