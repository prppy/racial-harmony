
import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthContextProvider, useAuth } from './context/authContext';
import Navbar from './components/Navbar';
import ProfilePage from './pages/Profile';
import LeaderboardPage from './pages/Leaderboard';
import MinimartPage from './pages/Minimart';
import HomePage from './pages/Home';
import VoucherPage from './pages/Vouchers';
import VoucherView from './pages/VoucherView'
import HistoryPage from './pages/History';
import ProductPage from './pages/Product';
import Reports from './admin-pages/Reports';
import Manage from './admin-pages/Manage';
import Inventory from "./admin-pages/Inventory";
import Tasks from './admin-pages/Tasks';
import Task from './admin-pages/Task';
import AuditLog from './admin-pages/AuditLog';

import { Auth } from "./authentication/auth";

// Main Layout Component
const MainLayout = () => {
    const { user, isAuthenticated } = useAuth();

    if (isAuthenticated === false || !user) {
        return <Auth />;
    }


  return (
    <div style={{ padding: "20px" }}>
      <HomePage />
    </div>
  );
};



const AppContent = () => {

  const { user, isAuthenticated } = useAuth(); 

  return (
    <>
      {user && isAuthenticated && <Navbar admin={user?.admin} />}
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/minimart" element={<MinimartPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/vouchers" element={<VoucherPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route exact path="/" element={<MainLayout />} />
        <Route exact path="/minimart" element={<MinimartPage />} />
        <Route exact path="/leaderboard" element={<LeaderboardPage />} />
        <Route exact path="/vouchers" element={<VoucherPage />} />
        <Route path="/voucher/:id" element={<VoucherView />} />

        <Route exact path="/history" element={<HistoryPage />} />
        {/* admin */}
        <Route exact path="/manage" element={<Manage />} />
        <Route exact path="/reports" element={<Reports />} />
        <Route exact path="/inventory" element={<Inventory />} />
        <Route exact path="/task/:id" element={<Task />} />

        <Route exact path="/tasks" element={<Tasks />} />
        <Route exact path="/auditLog" element={<AuditLog />} />


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
