import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthContextProvider, useAuth } from './context/authContext';
import Navbar from './components/Navbar';
import ProfilePage from './pages/Profile';
import LeaderboardPage from './pages/Leaderboard';
import MinimartPage from './pages/Minimart';
import HomePage from './pages/Home';
import VoucherPage from './pages/Vouchers';
import HistoryPage from './pages/History';


import { Auth } from './authentication/auth';

// Main Layout Component
const MainLayout = () => {
  const { user } = useAuth();

  return (
    <div className="App">
      {user ? (
        <div style={{ padding: '20px' }}>
          <HomePage />
        </div>
      ) : (
        <Auth />
      )}
    </div>
  );
};

const AppContent = () => {
  const { user } = useAuth(); 

  return (
    <>
      {user && <Navbar />} 
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/minimart" element={<MinimartPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/vouchers" element={<VoucherPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />



      </Routes>
    </>
  );
};

// App Component
function App() {
  return (
    <AuthContextProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthContextProvider>
  );
}

export default App;
