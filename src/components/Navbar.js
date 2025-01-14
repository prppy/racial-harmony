import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({admin}) => {
  

  const isAdmin = admin;
  console.log("Admin", isAdmin)
  return (
    <div style={navbarStyles.navbar}>
      <NavLink to="/">
        <img src="/logo.png" alt="Logo" style={navbarStyles.logo} />
      </NavLink>
      <div style={navbarStyles.tabs}>

        {!isAdmin? <>
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
          to="/vouchers"
          style={({ isActive }) =>
            isActive
              ? { ...navbarStyles.tab, color: '#9C3726', borderBottom: '3px solid #9C3726' }
              : navbarStyles.tab
          }
        >
          Vouchers
        </NavLink>
        <NavLink
          to="/history"
          style={({ isActive }) =>
            isActive
              ? { ...navbarStyles.tab, color: '#9C3726', borderBottom: '3px solid #9C3726' }
              : navbarStyles.tab
          }
        >
          History
        </NavLink>
        
        </> : <>
        
        <NavLink
          to="/manage"
          style={({ isActive }) =>
            isActive
              ? { ...navbarStyles.tab, color: '#9C3726', borderBottom: '3px solid #9C3726' }
              : navbarStyles.tab
          }
        >
          Manage
        </NavLink>
        <NavLink
          to="/reports"
          style={({ isActive }) =>
            isActive
              ? { ...navbarStyles.tab, color: '#9C3726', borderBottom: '3px solid #9C3726' }
              : navbarStyles.tab
          }
        >
          Reports
        </NavLink>
        
        <NavLink
          to="/requests"
          style={({ isActive }) =>
            isActive
              ? { ...navbarStyles.tab, color: '#9C3726', borderBottom: '3px solid #9C3726' }
              : navbarStyles.tab
          }
        >
          Requests
        </NavLink>
        <NavLink
          to="/tasks"
          style={({ isActive }) =>
            isActive
              ? { ...navbarStyles.tab, color: '#9C3726', borderBottom: '3px solid #9C3726' }
              : navbarStyles.tab
          }
        >
          Tasks
        </NavLink>
        </>
        
    
      }
        
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
