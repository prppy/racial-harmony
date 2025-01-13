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
import Reports from './admin-pages/Reports';
import Manage from './admin-pages/Manage';
import Requests from './admin-pages/Requests';
import Tasks from './admin-pages/Tasks';

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
      {user && <Navbar admin={user?.admin}/>} 
      <Routes>
        <Route exact path="/" element={<MainLayout />} />
        <Route exact path="/minimart" element={<MinimartPage />} />
        <Route exact path="/leaderboard" element={<LeaderboardPage />} />
        <Route exact path="/vouchers" element={<VoucherPage />} />
        <Route exact path="/history" element={<HistoryPage />} />
        {/* admin */ }
        <Route exact path="/manage" element={<Manage />} />
        <Route exact path="/reports" element={<Reports />} />
        <Route exact path="/requests" element={<Requests />} />
        <Route exact path="/tasks" element={<Tasks />} />
        <Route exact path="/profile" element={<ProfilePage />} />



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
