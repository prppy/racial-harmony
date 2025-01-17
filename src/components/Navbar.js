import React from "react";
import { NavLink } from "react-router-dom";
import { RED, DARK_PURPLE } from "../constants/colors";
const Navbar = ({ admin }) => {
  const isAdmin = admin;
  return (
    <div style={navbarStyles.navbar}>
      <NavLink to="/">
        <img src="/logo.png" alt="Logo" style={navbarStyles.logo} />
      </NavLink>
      <div style={navbarStyles.tabs}>
        {!isAdmin ? (
          <>
            <NavLink
              to="/minimart"
              style={({ isActive }) =>
                isActive
                  ? {
                      ...navbarStyles.tab,
                      color: RED,
                      borderBottom: `2px solid ${RED}`,
                    }
                  : navbarStyles.tab
              }
            >
              Minimart
            </NavLink>
            <NavLink
              to="/cart"
              style={({ isActive }) =>
                isActive
                  ? {
                      ...navbarStyles.tab,
                      color: RED,
                      borderBottom: `2px solid ${RED}`,
                    }
                  : navbarStyles.tab
              }
            >
              Cart
            </NavLink>

            <NavLink
              to="/vouchers"
              style={({ isActive }) =>
                isActive
                  ? {
                      ...navbarStyles.tab,
                      color: RED,
                      borderBottom: `2px solid ${RED}`,
                    }
                  : navbarStyles.tab
              }
            >
              Vouchers
            </NavLink>
            <NavLink
              to="/leaderboard"
              style={({ isActive }) =>
                isActive
                  ? {
                      ...navbarStyles.tab,
                      color: RED,
                      borderBottom: `2px solid ${RED}`,
                    }
                  : navbarStyles.tab
              }
            >
              Leaderboard
            </NavLink>
            <NavLink
              to="/history"
              style={({ isActive }) =>
                isActive
                  ? {
                      ...navbarStyles.tab,
                      color: RED,
                      borderBottom: `2px solid ${RED}`,
                    }
                  : navbarStyles.tab
              }
            >
              History
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/manage"
              style={({ isActive }) =>
                isActive
                  ? {
                      ...navbarStyles.tab,
                      color: RED,
                      borderBottom: `2px solid ${RED}`,
                    }
                  : navbarStyles.tab
              }
            >
              Manage
            </NavLink>
            <NavLink
              to="/reports"
              style={({ isActive }) =>
                isActive
                  ? {
                      ...navbarStyles.tab,
                      color: RED,
                      borderBottom: `2px solid ${RED}`,
                    }
                  : navbarStyles.tab
              }
            >
              Reports
            </NavLink>

            <NavLink
              to="/inventory"
              style={({ isActive }) =>
                isActive
                  ? {
                      ...navbarStyles.tab,
                      color: RED,
                      borderBottom: `2px solid ${RED}`,
                    }
                  : navbarStyles.tab
              }
            >
              Inventory
            </NavLink>
            <NavLink
              to="/tasks"
              style={({ isActive }) =>
                isActive
                  ? {
                      ...navbarStyles.tab,
                      color: RED,
                      borderBottom: `2px solid ${RED}`,
                    }
                  : navbarStyles.tab
              }
            >
              Tasks
            </NavLink>
          </>
        )}

        <NavLink
          to="/profile"
          style={({ isActive }) =>
            isActive
              ? {
                  ...navbarStyles.tab,
                  color: RED,
                  borderBottom: `2px solid ${RED}`,
                }
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingRight: "50px",
    color: "white",
  },
  logo: {
    height: "80px",
    cursor: "pointer",
  },
  tabs: {
    display: "flex",
    gap: "25px",
    fontSize: "16px",
  },
  tab: {
    color: DARK_PURPLE,
    textDecoration: "none",
    fontWeight: "bold",
    paddingBottom: "5px", // Space between text and underline
  },
};

export default Navbar;
