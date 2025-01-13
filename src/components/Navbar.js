import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div style={navbarStyles.navbar}>
      <NavLink to="/">
        <img src="/logo.png" alt="Logo" style={navbarStyles.logo} />
      </NavLink>
      <div style={navbarStyles.tabs}>
        <NavLink
          to="/minimart"
          style={({ isActive }) =>
            isActive
              ? { ...navbarStyles.tab, color: '#9C3726', borderBottom: '3px solid #9C3726' }
              : navbarStyles.tab
          }
        >
          Minimart
        </NavLink>
        <NavLink
          to="/leaderboard"
          style={({ isActive }) =>
            isActive
              ? { ...navbarStyles.tab, color: '#9C3726', borderBottom: '3px solid #9C3726' }
              : navbarStyles.tab
          }
        >
          Leaderboard
        </NavLink>
        <NavLink
          to="/profile"
          style={({ isActive }) =>
            isActive
              ? { ...navbarStyles.tab, color: '#9C3726', borderBottom: '3px solid #9C3726' }
              : navbarStyles.tab
          }
        >
          Profile
        </NavLink>
      </div>
    </div>
  );
};

const navbarStyles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: '10px 20px',
    color: 'white',
  },
  logo: {
    height: '60px',
    cursor: 'pointer',
  },
  tabs: {
    display: 'flex',
    gap: '20px',
  },
  tab: {
    color: 'black',
    textDecoration: 'none',
    fontWeight: 'bold',
    paddingBottom: '5px', // Space between text and underline
  },
};

export default Navbar;
