import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { auth } from "../firebase";
import authStyles from "../styles/authStyles.css";
import { sendPasswordResetEmail } from "firebase/auth";
import { LuEye, LuEyeClosed } from "react-icons/lu"; // Importing LuEye and LuEyeClosed icons
import { RED } from "../constants/colors";

export const Auth = () => {
    const { login, register, user, logout, isAuthenticated } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isRegister, setIsRegister] = useState(false); // Toggle between login/register
    const [admin, setAdmin] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isForgotPassword) return;

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

    const handleResidentClick = () => setAdmin(false);
    const handleAdminClick = () => setAdmin(true);

    const resetPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset email sent. Please check your email.");
            setIsForgotPassword(false); // Hide the reset password form
        } catch (error) {
            console.log(error);
            alert("Password reset failed: " + error.message);
        }
    };

    return (
        <div style={styles.container}>
            {/* Left side */}
            <div style={styles.left}>
                <img src="/mainLogo.png" alt="logo" style={styles.logo} />
            </div>

            {/* Right side */}
            <div style={styles.right}>
                <div style={styles.formContainer}>
                    {isForgotPassword ? (
                        <>
                            <h2 style={styles.signIn}>Forgot Password?</h2>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    width: "100%",
                                }}
                            >
                                <label
                                    htmlFor="email"
                                    style={{
                                        marginBottom: "10px",
                                        fontWeight: "bold",
                                        fontSize: "20px",
                                    }}
                                >
                                    Email:
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={styles.input}
                                />
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    width: "100%",
                                    marginTop: "20px",
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={resetPassword}
                                    style={styles.button}
                                >
                                    Reset Password
                                </button>
                            </div>
                            <div style={{ marginTop: "20px" }}>
                                <span
                                    style={{
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setIsForgotPassword(false)}
                                >
                                    Back to Login
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 style={styles.signIn}>
                                {" "}
                                {isRegister ? "Create an Account" : "Sign In:"}
                            </h2>

                            <div className="roleContainer">
                                <div
                                    onClick={handleResidentClick}
                                    className={
                                        admin ? "unselected" : "selected"
                                    }
                                >
                                    <span style={{ fontWeight: "bold" }}>
                                        Resident
                                    </span>
                                </div>
                                <div
                                    onClick={handleAdminClick}
                                    className={
                                        admin ? "selected" : "unselected"
                                    }
                                >
                                    <span style={{ fontWeight: "bold" }}>
                                        Admin
                                    </span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {isRegister && (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            width: "100%",
                                        }}
                                    >
                                        <label
                                            htmlFor="name"
                                            style={{
                                                marginBottom: "10px",
                                                fontWeight: "bold",
                                                fontSize: "20px",
                                            }}
                                        >
                                            Name:
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            required
                                            style={styles.input}
                                        />
                                    </div>
                                )}
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        width: "100%",
                                    }}
                                >
                                    <label
                                        htmlFor="email"
                                        style={{
                                            marginBottom: "10px",
                                            fontWeight: "bold",
                                            fontSize: "20px",
                                        }}
                                    >
                                        Email:
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                        style={styles.input}
                                    />
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        width: "100%",
                                    }}
                                >
                                    <label
                                        htmlFor="password"
                                        style={{
                                            marginBottom: "10px",
                                            fontWeight: "bold",
                                            fontSize: "20px",
                                        }}
                                    >
                                        Password:
                                    </label>
                                    <div
                                        style={{
                                            position: "relative",
                                            width: "100%",
                                            alignItems: "center",
                                            flexDirection: "row",
                                        }}
                                    >
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            required
                                            style={styles.input}
                                        />
                                        <div
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            style={{
                                                position: "absolute",
                                                right: "10px",
                                                bottom: "28px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {showPassword ? (
                                                <LuEye size={24} color={RED} />
                                            ) : (
                                                <LuEyeClosed
                                                    size={24}
                                                    color={RED}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div style={styles.forgotPasswordContainer}>
                                    <div
                                        style={styles.forgotPassword}
                                        onClick={() =>
                                            setIsForgotPassword(true)
                                        }
                                    >
                                        Forgot Password?
                                    </div>
                                </div>
                                <div style={styles.buttonWrapper}>
                                    <button type="submit" style={styles.button}>
                                        {isRegister ? "Register" : "Login"}
                                    </button>
                                </div>

                                <div
                                    onClick={() =>
                                        setIsRegister((prev) => !prev)
                                    }
                                >
                                    {isRegister ? (
                                        <div
                                            style={{
                                                marginTop: "20px",
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <span style={{ fontSize: "16px", paddingRight: "20px" }}>
                                                Already have an account?{" "}
                                            </span>
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Log In
                                            </span>
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                marginTop: "20px",
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <span style={{ fontSize: "16px", paddingRight: "20px" }}>
                                                Don't have an account?{" "}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: "16px",
                                                    fontWeight: "bold",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Sign up
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </>
                    )}
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
        backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url('/school.png')",
        backgroundSize: "cover",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
    },
    logo: {
        maxWidth: "100%",
        height: "auto",
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
        width: "50%",
        minWidth: "300px",
        display: "flex",
        alignContent: "center",
        justifyContent: "space-between",
        flexDirection: "column",
    },
    signIn: {
        fontSize: "30px",
        marginBottom: "25px",
        marginTop: "0"
    },
    button: {
        padding: "10px",
        margin: "0 5px",
        border: "none",
        borderRadius: "10px",
        color: "#2B3487",
        backgroundColor: "white",
        fontWeight: "bold",
        cursor: "pointer",
        marginTop: "10px",
        height: "50px",
        minWidth: "150px",
        fontSize: "20px",
    },
    input: {
        width: "calc(100% - 10px)",
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingLeft: "10px",
        paddingRight: "0",
        marginBottom: "25px",
        marginBottom: "25px",
        borderRadius: "10px",
        border: "none",
        fontSize: "16px",
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
        backgroundColor: "transparent",
        cursor: "pointer",
    },
    buttonWrapper: {
        width: "100%",
        display: "flex",
        justifyContent: "center", // Center the button horizontally
        marginTop: "10px", // Adjust spacing between button and other form elements
    },
};
