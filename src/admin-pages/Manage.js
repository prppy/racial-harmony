import React from 'react';
import BatchCreateUsers from '../components/BatchCreateUsers';
const Manage = () => {
  return (
    <div style={pageStyles.pageContainer}>
      <h2>Manage</h2>
      <p>Manage</p>
      <BatchCreateUsers />
    </div>
  );
};

const pageStyles = {
  pageContainer: {
    padding: '20px',
  },
};

export default Manage