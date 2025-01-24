import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import {
  updateMainRecord,
  fetchMainRecord,
  uploadImage,
} from "../utils/firebaseUtils";
import { DARK_PURPLE, RED } from "../constants/colors";
import { GiCheckMark } from "react-icons/gi";
import { MdLogout } from "react-icons/md";
import { FaCamera } from "react-icons/fa";
import SubmitButton from "../components/SubmitButton";

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const { logout, user, updateUserBackground } = useAuth();
  const navigate = useNavigate();
  const [selectedBg, setSelectedBg] = useState(userDetails?.bg || 0);
  const defaultImageUrl = "/defaultProfile.png";

  const [profileImage, setProfileImage] = useState(defaultImageUrl);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetails = await fetchMainRecord("users", user.userId);
        console.log(user);
        setSelectedBg(userDetails.bg || 0);
        setUserDetails(userDetails);
        setProfileImage(userDetails.profileImageUrl || defaultImageUrl);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (user) {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.bg]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setTimeout(() => navigate("/"), 100);
    } else {
      alert("Logout failed. Please try again.");
    }
  };

  const handleBackgroundPreview = (bgIndex) => {
    setSelectedBg(bgIndex);
  };

  const handleSubmitBackground = () => {
    updateMainRecord("users", user?.userId, { bg: selectedBg })
      .then(() => {
        updateUserBackground(selectedBg); // Update global state
        alert("Background updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating background:", err);
        alert("Failed to update background. Please try again.");
      });
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { downloadURL, imageRef } = await uploadImage(
        file,
        user?.userId,
        "profile"
      );
      await updateMainRecord("users", user?.userId, {
        profileImageUrl: downloadURL,
        profileStorageRef: imageRef,
      });

      setProfileImage(downloadURL);
      alert("Profile image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  return (
    <div style={pageStyles.pageContainer}>
      {/* Left side - Image background */}
      <div
        style={{
          ...pageStyles.left,
          backgroundImage: `url(/bg${selectedBg}.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div style={pageStyles.userPhotoContainer}>
          <img
            src={profileImage} // Replace with user's photo URL
            alt="User"
            style={pageStyles.userPhoto}
          />
        </div>
        {/* Upload image button */}
        <div style={{ flexDirection: "row" }}>
          <label htmlFor="profileImage" style={{ cursor: "pointer" }}>
            <button style={pageStyles.button}>
              <FaCamera color={"white"} size={20} />
              <input
                type="file"
                id="profileImageUpload"
                accept="image/*"
                onChange={handleProfileImageUpload}
              />
            </button>
          </label>
        </div>
      </div>

      {/* Right side */}
      <div style={pageStyles.right}>
        {/* User details */}

        <div style={pageStyles.detailsContainer}>
          {/* Name and Email Row */}
          <div style={pageStyles.rowGroup}>
            <div style={pageStyles.detailRow}>
              <label style={pageStyles.label}>Name:</label>
              <input
                type="text"
                value={user?.name || "N/A"}
                style={pageStyles.input}
                readOnly
              />
            </div>
            <div style={pageStyles.detailRow}>
              <label style={pageStyles.label}>Email:</label>
              <input
                type="email"
                value={userDetails ? userDetails.email : "N/A"}
                style={pageStyles.input}
                readOnly
              />
            </div>
          </div>

          {/* Admission Date and Class Row */}
          <div style={pageStyles.rowGroup}>
            <div style={pageStyles.detailRow}>
              <label style={pageStyles.label}>Admission Date:</label>
              <input
                type="text"
                value={
                  userDetails?.admission_date
                    ? userDetails.admission_date.toDate().toISOString().split("T")[0]
                    : "N/A"
                }
                style={pageStyles.input}
                readOnly
              />
            </div>
            <div style={pageStyles.detailRow}>
              <label style={pageStyles.label}>Class:</label>
              <input
                type="text"
                value={userDetails?.class ? userDetails.class : "N/A"}
                style={pageStyles.input}
                readOnly
              />
            </div>
          </div>
          <hr style={pageStyles.horizontalLine} />

          <div style={pageStyles.cumulativePoints}>
            <h2 style={pageStyles.label}>Cumulative Voucher Points:</h2>
            <div style={pageStyles.points}>
              {" "}
              {userDetails?.voucher_balance ? userDetails.voucher_balance : 0}
            </div>
          </div>
          <hr style={pageStyles.horizontalLine} />
        </div>

        {/* Theme selection */}
        <div style={pageStyles.bgSelector}>
          <h2 style={pageStyles.label}>Select Theme:</h2>
          <div style={pageStyles.bgOptions}>
            {[0, 1, 2, 3, 4, 5].map((bgIndex) => (
              <div
                key={bgIndex}
                style={{
                  ...pageStyles.bgOption,
                  backgroundImage: `url(/bg${bgIndex}.png)`,
                  border:
                    selectedBg === bgIndex
                      ? `3px solid ${RED}`
                      : "2px solid #ccc",
                }}
                onClick={() => handleBackgroundPreview(bgIndex)}
              >
                {selectedBg === bgIndex && (
                  <div style={pageStyles.selectedOverlay}>
                    <GiCheckMark style={pageStyles.selectedIcon} />
                  </div>
                )}
              </div>
            ))}
          </div>
          ;
          <div style={pageStyles.submitButtonContainer}>
            <SubmitButton handleSubmitBackground={handleSubmitBackground} />
          </div>
        </div>

        <button onClick={handleLogout} style={pageStyles.logoutButton}>
          <span style={{ display: "flex", alignItems: "center" }}>
            <MdLogout color={DARK_PURPLE} size={18} />

            <span style={{ marginLeft: "8px" }}>Logout</span>
          </span>
        </button>
      </div>
    </div>
  );
};

const pageStyles = {
  pageContainer: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    fontFamily: "Arial, sans-serif",
    overflow: "hidden",
  },
  left: {
    flex: 1,
    gap: "20px",
    flexDirection: "column",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "10px 10px 10px 10px",
    borderRadius: "5px",
    border: `2px solid ${DARK_PURPLE}`,
    backgroundColor: DARK_PURPLE,
    color: "white",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  right: {
    flex: 1,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "20px",
    borderTop: "2px solid #2B3487",
    position: "relative",
    overflowY: "scroll",
    maxHeight: "100vh",
  },
  horizontalLine: {
    width: "100%",
    border: "none",
    borderTop: "2px solid #6B71AB",
    margin: "20px auto",
  },

  themeSection: {
    width: "100%",
    marginBottom: "20px",
  },
  submitButtonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: "20px",
  },

  detailsContainer: {
    marginBottom: "20px",
    textAlign: "left",
    width: "80%",
  },
  rowGroup: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "10px",
  },
  detailRow: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold",
    marginRight: "10px",
    color: DARK_PURPLE,
    marginBottom: "5px",
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "4px",
    border: "2px solid #6B71AB",
    backgroundColor: "white",
    color: "#6B71AB",
    fontWeight: "bold",
    fontSize: "14px",
    width: "80%",
  },
  cumulativePoints: {
    marginTop: "20px",
    textAlign: "left",
  },
  points: {
    fontSize: "50px",
    fontWeight: "bold",
    color: "#2B3487",
    textAlign: "right",
  },
  bgSelector: {
    margin: "20px 0",
    width: "80%",
  },
  bgOptions: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  bgOption: {
    width: "90%",
    aspectRatio: "16 / 9",
    backgroundSize: "cover",
    backgroundPosition: "center",
    cursor: "pointer",
    borderRadius: "5px",
    position: "relative",
  },

  logoutButton: {
    padding: "10px",
    margin: "10px 5px",
    border: "none",
    borderRadius: "10px",
    color: "#2B3487",
    backgroundColor: "white",
    fontWeight: "bold",
    cursor: "pointer",
    height: "50px",
    width: "150px",
    fontSize: "15px",
  },
  userPhotoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: "10px", // Optional, gives a slight rounded edge
    width: "65%",
  },
  userPhoto: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    aspectRatio: 1, // Ensure the image covers the container without distortion
  },
  selectedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedIcon: {
    color: "rgba(203, 198, 198, 0.8)", // Faint gray color
    fontSize: "50px",
  },
};

export default ProfilePage;
