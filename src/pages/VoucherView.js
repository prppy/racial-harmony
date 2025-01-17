import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DARK_PURPLE, RED } from '../constants/colors';
import { updateMainRecord, fetchMainRecord, createMainRecord } from '../utils/firebaseUtils';
import { CiHeart } from "react-icons/ci";
import { IoMdHeartDislike } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";

import { useAuth } from '../context/authContext';
import { arrayUnion, arrayRemove } from 'firebase/firestore';

const VoucherView = () => {
  const location = useLocation();
  const task = location.state?.task;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFavourite, setIsFavourite] = useState(false);
  const [applied, setApplied] = useState(false);

  const [userData, setUserData] = useState(null)
  const taskId = task.id;


useEffect(() => {
    if (!task) {
        console.error("Task not found!");
        return;
    }

    const fetchData = async () => {
      try {
        const userData = await fetchMainRecord("users", user.userId);
        setUserData(userData);
        if (userData?.favouriteTasks && userData.favouriteTasks.includes(taskId)) {
          setIsFavourite(true);  
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (user && task) {
      fetchData();
    }
}, [task, user]);

if (!task) {
  return <div>Task not found. Please go back and try again.</div>;
}

  const handleFavourite = async () => {
    if (!user?.userId || !taskId) {
      console.error("Missing user or taskId");
      return;
    }

    try {
      const userData = await fetchMainRecord("users", user.userId);
      const favouriteTasks = userData?.favouriteTasks || [];

      if (isFavourite) {
        const updatedFavouriteTasks = favouriteTasks.filter(id => id !== taskId);

        await updateMainRecord("users", user.userId, {
          favouriteTasks: updatedFavouriteTasks,
        });

        setIsFavourite(false);  // Mark as not favourited
        alert("Task removed from favourites!");
      } else {
        // Add the taskId to the favouriteTasks array if not already present
        if (!favouriteTasks.includes(taskId)) {
          favouriteTasks.push(taskId);

          // Update the user's favouriteTasks field in Firestore
          await updateMainRecord("users", user.userId, {
            favouriteTasks: favouriteTasks,
          });

          setIsFavourite(true);  
          alert("Task added to favourites!");
        }
      }
    } catch (error) {
      console.error("Error updating task favourite status:", error);
    }
  };

  const handleApply = async () => {
    if (!user?.userId || !taskId) {
      console.error("Missing user or taskId");
      return;
    } 
    try {
      const application = {
        residentID: user?.userId,
        status:"pending",
        taskId: taskId,
        class:userData?.class || "N/A",
        applicationDate: new Date()
        }
      await createMainRecord("applications", application)
      alert("Application submitted successfully!");
      setApplied(true)
    } catch (e) {
      alert("Error applying for this task! Please try again later");
      console.log(e)

    }

  }
  return (
    <div style={styles.container}>
      <div style={styles.leftContainer}>
        {task.imageUrl ? (
          <img src={task.imageUrl} alt={task.title} style={styles.image} />
        ) : (
          <div style={{ ...styles.image, ...styles.placeholder }}></div>
        )}
      </div>
      <div style={styles.rightContainer}>
        <h1 style={styles.title}>{task.title}</h1>
        <hr style={styles.divider} />
        <div style={styles.subContainer}>
          <div style={styles.detailsContainer}>
            <p style={styles.points}>
              <strong>{task.points} pts</strong>
            </p>
            <p style={styles.description}>
              <strong>Description:</strong> {task.description}
            </p>
            <p style={styles.dueDate}>
              <strong>Due By:</strong> {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>
          <div style={styles.buttonContainer}>
            <button
              style={{
                ...styles.editButton,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: isFavourite ? 'gray' : RED, // Change color if favorited
                cursor: 'pointer', 
              }}
              onClick={handleFavourite}
            >
              {isFavourite ? (
                <IoMdHeartDislike color='white' style={{ marginRight: '8px' }} />  // Use dislike icon when favorited
              ) : (
                <IoMdHeart color='white' style={{ marginRight: '8px' }} />  // Use heart icon when not favorited
              )}
              <span style={{ color: 'white' }}>
                {isFavourite ? "Remove from Favourites" : "Add to Favourites"}
              </span>
            </button>
            {
              !applied?              <button style={styles.applyButton} onClick={handleApply}>Apply</button>

              :        <button 
              style={{ ...styles.applyButton, backgroundColor: 'gray' }} 
              onClick={handleApply}
              disabled
            >
              Applied
            </button>

            }
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px',
    maxWidth: '80%',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #ccc',
    marginTop: '20px',
  },
  leftContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#868bbd',
    borderRadius: '8px',
    padding: '10px',
  },
  rightContainer: {
    flex: 2,
    marginLeft: '20px',
    display: 'flex',
    flexDirection: 'column', // Aligns the details container and button container vertically
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'row', // Aligns the details container and button container horizontally
    alignItems: 'flex-start',
    width: '100%',
  },
  detailsContainer: {
    flex: 1, 
    display: 'flex',
    flexDirection: 'column',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',  // Stack the buttons vertically
    gap: '10px',  // Add spacing between buttons
    marginLeft: 'auto',
    marginTop: '20px',
  },
  image: {
    width: '100%',
    height: '250px',
    borderRadius: '8px',
    objectFit: 'contain',
  },
  placeholder: {
    backgroundColor: '#868bbd',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2a2a72',
    marginBottom: '10px',
  },
  divider: {
    width: '100%',
    border: '1px solid #2a2a72',
    margin: '10px 0',
  },
  points: {
    fontSize: '20px',
    color: RED,
    marginBottom: '10px',
  },
  description: {
    fontSize: '16px',
    marginBottom: '10px',
    color: '#333',
  },
  dueDate: {
    fontSize: '16px',
    marginBottom: '20px',
    color: RED,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: RED,
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  applyButton: {
    backgroundColor: '#1c660d',  
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default VoucherView;