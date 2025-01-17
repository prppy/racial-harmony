import React, { useEffect, useState } from "react";
import {
  fetchMainRecord,
  fetchCollection,
  fetchMainCollection,
} from "../utils/firebaseUtils";
import { useAuth } from "../context/authContext";
import { DARK_PURPLE } from "../constants/colors";
import AWARDS from "../constants/awards";
import { startOfMonth, endOfMonth, format } from "date-fns";  // Make sure date-fns is installed

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [awards, setAwards] = useState([]);
  const [month, setMonth] = useState(null)

  // This effect fetches the leaderboard and awards data
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const monthName = format(new Date(), "MMMM yyyy");
    setMonth(monthName);

        const applications = await fetchMainCollection("applications");
        
        // Get current month's start and end date
        const startOfMonthDate = startOfMonth(new Date());
        const endOfMonthDate = endOfMonth(new Date());

        // Filter for approved applications within the current month
        const filteredApplications = applications.filter(application => {
          const statusUpdateDate = new Date(application.statusUpdateDate);
          return (
            application.status === "approved" &&
            statusUpdateDate >= startOfMonthDate &&
            statusUpdateDate <= endOfMonthDate
          );
        });

        console.log("filteredApplications", filteredApplications)

        // Fetch task data (points) and resident data (name, class) for each application
        const applicationsWithDetails = await Promise.all(
          filteredApplications.map(async (application) => {
            // Fetch task data for each application using taskId
            const taskData = await fetchMainRecord("tasks", application.taskId);

            // Fetch resident data for each application using residentID
            const residentData = await fetchMainRecord("users", application.residentID);
            
            // Ensure the taskData and residentData are valid
            if (!taskData || !residentData) {
              console.warn(`Missing task or resident data for application ID ${application.id}`);
              return null;
            }

            // Add the name, class, and points to the application object
            return {
              ...application,
              points: taskData.points || 0,  // Default to 0 if no points
              residentName: residentData.name,
              residentClass: residentData.class
            };
          })
        );

        // Filter out any null values in case of missing data
        const validApplications = applicationsWithDetails.filter(application => application !== null);

        // Group by residentID and sum the points
        const groupedApplications = validApplications.reduce((acc, application) => {
          const { residentID, points, residentName, residentClass } = application;

          // Initialize if not already in the accumulator
          if (!acc[residentID]) {
            acc[residentID] = {
              residentID,
              residentName,
              residentClass,
              totalPoints: 0
            };
          }

          // Add points to the resident's total
          acc[residentID].totalPoints += points;
          return acc;
        }, {});

        // Convert the object to an array of residents
        const leaderboardData = Object.values(groupedApplications);

        // Sort by points in descending order
        leaderboardData.sort((a, b) => b.totalPoints - a.totalPoints);
        console.log('leaderboardData', leaderboardData);
        // Set the leaderboard state
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    const fetchUserAwards = async () => {
      try {
        if (user?.userId) {
          const userAwards = await fetchCollection(
            "users",
            user.userId,
            "awards"
          );
          setAwards(userAwards || []);
        }
      } catch (error) {
        console.error("Error fetching awards:", error);
      }
    };

    // Call both functions
    fetchLeaderboardData();
    fetchUserAwards();
  }, []);  // The effect runs when `user` changes

  return (
    <div style={styles.pageContainer}>
            <div style={styles.monthDisplay}>{month}</div>

      <h2>Leaderboard</h2>
      <p>Check out the current leaderboard standings below!</p>

      {/* Top Part: Podium */}
      <div style={styles.podiumContainer}>
        {leaderboard.slice(0, 3).map((user, index) => (
          <div key={user.residentID} style={styles[`podium${index + 1}`]}>
            <h3>{index + 1 === 1 ? "🥇" : index + 1 === 2 ? "🥈" : "🥉"}</h3>
            <p>{user.residentName}</p>
            <p>{user.totalPoints} pts</p>
          </div>
        ))}
      </div>

      {/* List of Users */}
      <div style={styles.userListContainer}>
  <table style={styles.userTable}>
    <thead>
      <tr>
        <th style={styles.tableHeader}>Rank</th>
        <th style={styles.tableHeader}>Name</th>
        <th style={styles.tableHeader}>Class</th>
        <th style={styles.tableHeader}>Points</th>
      </tr>
    </thead>
    <tbody>
      {leaderboard.map((user, index) => (
        <tr key={user.residentID} style={styles.tableRow}>
          <td style={styles.tableCell}>{index + 1}</td>
          <td style={styles.tableCell}>{user.residentName}</td>
          <td style={styles.tableCell}>{user.residentClass}</td>
          <td style={styles.tableCell}>{user.totalPoints} pts</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      {/* Awards Section */}
      <div style={styles.awardsContainer}>
        <h3>Your Awards</h3>
        <div style={styles.awardsGrid}>
          {awards.map((awardId, index) => {
            const award = AWARDS.find((a) => a.id === awardId);
            if (!award) return null;

            const { Icon } = award;
            return (
              <div key={index} style={styles.awardCard}>
                <Icon style={styles.awardIcon} />
                <h4>{award.name}</h4>
                <p>{award.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: "20px",
    color:'white'
  },
  podiumContainer: {
    display: "flex",
    height: "100%",
    width: "100%",
    justifyContent: "space-around",
    marginBottom: "20px",
  },
  podium1: {
    textAlign: "center",
    background: "#ffd700",
    padding: "10px",
    borderRadius: "10px",
  },
  podium2: {
    textAlign: "center",
    background: "#c0c0c0",
    padding: "10px",
    borderRadius: "10px",
  },
  podium3: {
    textAlign: "center",
    background: "#cd7f32",
    padding: "10px",
    borderRadius: "10px",
  },
  userTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",

  },
  tableHeader: {
    backgroundColor: DARK_PURPLE,
    padding: "10px",
    textAlign: "left",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  tableCell: {
    padding: "8px",
  },
  awardsContainer: {
    marginTop: "20px",
  },
  awardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "20px",
  },
  awardCard: {
    textAlign: "center",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "10px",
  },
  awardIcon: {
    width: "50px",
    height: "50px",
    marginBottom: "10px",
  },
  monthDisplay: {
    
    fontSize: "20px",
    fontWeight: "bold",
    color: "white",
  },
};

export default LeaderboardPage;
