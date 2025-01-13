import React from 'react';

const HomePage = () => {
  return (
    <div style={pageStyles.pageContainer}>
      <h2>Home</h2>
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