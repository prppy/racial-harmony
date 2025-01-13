import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthContextProvider, useAuth } from './context/authContext';
import Navbar from './components/Navbar';
import ProfilePage from './pages/Profile';
import LeaderboardPage from './pages/Leaderboard';
import MinimartPage from './pages/Minimart';
import HomePage from './pages/Home';
import { Auth } from './Authentication/auth';

// Main Layout Component
const MainLayout = () => {
  const { user } = useAuth();

  return (
    <div className="App">
      {user ? (
        <div>
          <div style={{ padding: '20px' }}>
            <HomePage />
          </div>
        </div>
      ) : (
        <Auth />
      )}
    </div>
  );
};

// App Component with Router
function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<MainLayout />} />
          <Route path="/minimart" element={<MinimartPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
