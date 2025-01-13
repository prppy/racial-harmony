import React from 'react';

const MinimartPage = () => {
  return (
    <div style={pageStyles.pageContainer}>
      <h2>Minimart</h2>
      <p>Welcome to the Minimart! Here you can browse and purchase items.</p>
    </div>
  );
};

const pageStyles = {
  pageContainer: {
    padding: '20px',
  },
};

export default MinimartPage;
