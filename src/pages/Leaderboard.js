import React from 'react';

const LeaderboardPage = () => {
  return (
    <div style={pageStyles.pageContainer}>
      <h2>Leaderboard</h2>
      <p>Check out the current leaderboard standings below!</p>
    </div>
  );
};

const pageStyles = {
  pageContainer: {
    padding: '20px',
  },
};

export default LeaderboardPage;
