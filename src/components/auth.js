import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import authStyles from '../styles/authStyles.css';
// whole file is chatgpted. to be changed later (made just to test admin stuff)
export const Auth = () => {
  const { login, register, user, logout, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // For registration
  const [isRegister, setIsRegister] = useState(false); // Toggle between login/register
  const [admin, setAdmin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      const result = await register(email, password, username, admin);
      if (result.success) {
        alert("Registration successful!");
      } else {
        alert(result.msg || "Registration failed");
      }
    } else {
      const result = await login(email, password);
      if (result.success) {
        alert("Login successful!");
      } else {
        alert(result.msg || "Login failed");
      }
    }
  };

  const handleResidentClick = () => {
    setAdmin(false);
  };

  const handleAdminClick = () => {
    setAdmin(true);
  };

  return (
    <div>
      <h1>
        {isAuthenticated
          ? `Welcome ${user?.username || "User"}`
          : "Please Log In"}
      </h1>

      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <>
          <div className='roleContainer'>
            <div
              onClick={handleResidentClick}
              className={admin ? "unselected" : "selected"}
            >
              Resident
            </div>
            <div onClick={handleAdminClick}
            className={admin ? "selected" : "unselected"}>
              Admin
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div>
                <label>Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">{isRegister ? "Register" : "Login"}</button>
            <button
              type="button"
              onClick={() => setIsRegister((prev) => !prev)}
            >
              {isRegister
                ? "Already have an account? Login"
                : "Create an account"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};
