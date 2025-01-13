import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import authStyles from '../styles/authStyles.css';

export const Auth = () => {
  const { login, register, user, logout, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For registration
  const [isRegister, setIsRegister] = useState(false); // Toggle between login/register
  const [admin, setAdmin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      const result = await register(email, password, name, admin);
      if (result.success) {
        alert("Registration successful!");
      } else {
        alert(result.msg || "Registration failed");
      }
    } else {
      const result = await login(email, password, admin);
      
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
    <div style={styles.container}>

      {/* Left side */}
      <div style={styles.left}> 
        <img src = "/mainLogo.png"
        alt = 'logo'
        style = {styles.logo}
        />
      </div>

      {/* Right side */}
      <div style={styles.right}>
        <div style={styles.formContainer}>
          <h2 style={styles.signIn}> {isRegister? 'Create an Account' : 'Sign In'}</h2>
            <div className='roleContainer'>
              <div
                onClick={handleResidentClick}
                className={admin ? "unselected" : "selected"}
              >
                <text style={{fontWeight:'bold'}}>Resident</text>
              </div>
              <div onClick={handleAdminClick}
              className={admin ? "selected" : "unselected"}>
                <text style={{fontWeight:'bold'}}>Admin</text>
                </div>
          </div>
          

          <form onSubmit={handleSubmit}>
            {isRegister && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                 <label htmlFor="name" style={{ marginBottom: '8px', fontWeight:'bold'}}>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
            <label htmlFor="email" style={{ marginBottom: '8px', fontWeight:'bold'}}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}

              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
            <label htmlFor="password" style={{ marginBottom: '8px', fontWeight:'bold'}}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}

              />
            </div>


              <div style={styles.forgotPasswordContainer}>
              <a href="/forgot-password" style={styles.forgotPassword}>
                Forgot Password?
              </a>
            </div>
            <button type="submit" style={styles.button}>{isRegister ? "Register" : "Login"}</button>
            <div
              
              onClick={() => setIsRegister((prev) => !prev)}
            >
              {isRegister
                ? <div style={{marginTop: '20px'}}>
                <text>Already have an account? </text>
                <text style={{fontWeight:'bold', cursor:'pointer'}}>Login</text>
                </div> 
                : <div style={{marginTop: '20px'}}>
                <text>Don't have an account? </text>
                <text style={{fontWeight:'bold', cursor:'pointer'}}>Sign up</text>
                </div> }
            </div>
          </form>
          </div>
        </div>
         
    </div>
    
  );
  
};


const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  left: {
    flex: 1,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  tagline: {
    fontSize: "24px",
    color: "#c14a2d",
    textAlign: "center",
  },
  since: {
    marginTop: "10px",
    color: "#c14a2d",
    fontSize: "16px",
  },
  right: {
    flex: 1,
    backgroundColor: "#6B71AA",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "80%",
    maxWidth: "300px",
    display:'flex',
    alignItems:'flex-start',
    flexDirection: 'column',
  },
  signIn: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  button: {
    flex: 1,
    padding: "10px",
    margin: "0 5px",
    border: "none",
    borderRadius: "10px",
    color: "#2B3487",
    backgroundColor: "white",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
    height: '50px',
    width: '150px',
    fontSize: '15px'

  },
  
  activeButton: {
    backgroundColor: "#34499D",
    color: "white",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "none",
  },
  forgotPasswordContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "20px",
  },
  forgotPassword: {
    color: "white",
    textAlign: "right",
    textDecoration: "underline",
    fontSize: "14px",
  },
  code: {
    marginTop: "20px",
    fontWeight: "bold",
    color: "#ffffff",
  },
  
};
