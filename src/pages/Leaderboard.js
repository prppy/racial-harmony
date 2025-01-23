import React, { useEffect, useState } from "react";
import {
  fetchMainRecord,
  fetchCollection,
  fetchMainCollection,
} from "../utils/firebaseUtils";
import { useAuth } from "../context/authContext";
import { DARK_PURPLE } from "../constants/colors";
import AWARDS from "../constants/awards";
import { startOfMonth, endOfMonth, format } from "date-fns"; // Make sure date-fns is installed
import "../styles/tableStyles.css";

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [awards, setAwards] = useState([]);
  const [month, setMonth] = useState(null);
  const [selectedAward, setSelectedAward] = useState(null);

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
        const filteredApplications = applications.filter((application) => {
          const statusUpdateDate = new Date(application.statusUpdateDate);
          return (
            application.status === "approved" &&
            statusUpdateDate >= startOfMonthDate &&
            statusUpdateDate <= endOfMonthDate
          );
        });

        console.log("filteredApplications", filteredApplications);

        // Fetch task data (points) and resident data (name, class) for each application
        const applicationsWithDetails = await Promise.all(
          filteredApplications.map(async (application) => {
            // Fetch task data for each application using taskId
            const taskData = await fetchMainRecord("tasks", application.taskId);

            // Fetch resident data for each application using residentID
            const residentData = await fetchMainRecord(
              "users",
              application.residentID
            );

            // Ensure the taskData and residentData are valid
            if (!taskData || !residentData) {
              console.warn(
                `Missing task or resident data for application ID ${application.id}`
              );
              return null;
            }

            // Add the name, class, and points to the application object
            return {
              ...application,
              points: taskData.points || 0, // Default to 0 if no points
              residentName: residentData.name,
              residentClass: residentData.class,
            };
          })
        );

        // Filter out any null values in case of missing data
        const validApplications = applicationsWithDetails.filter(
          (application) => application !== null
        );

        // Group by residentID and sum the points
        const groupedApplications = validApplications.reduce(
          (acc, application) => {
            const { residentID, points, residentName, residentClass } =
              application;

            // Initialize if not already in the accumulator
            if (!acc[residentID]) {
              acc[residentID] = {
                residentID,
                residentName,
                residentClass,
                totalPoints: 0,
              };
            }

            // Add points to the resident's total
            acc[residentID].totalPoints += points;
            return acc;
          },
          {}
        );

        // Convert the object to an array of residents
        const leaderboardData = Object.values(groupedApplications);

        // Sort by points in descending order
        leaderboardData.sort((a, b) => b.totalPoints - a.totalPoints);
        console.log("leaderboardData", leaderboardData);
        // Set the leaderboard state
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    // Call both functions
    fetchLeaderboardData();
  }, []); // The effect runs when `user` changes

  useEffect(() => {
    const fetchUserAwards = async () => {
      try {
        if (user?.userId) {
          console.log("User:", user); // Check if userId is present
          const userAwards = await fetchCollection(
            "users",
            user.userId,
            "awards"
          );
          console.log("Fetched user awards:", userAwards); // Log the fetched awards
          setAwards(userAwards || []);
        }
      } catch (error) {
        console.error("Error fetching awards:", error); // Log any error
      }
    };
    fetchUserAwards();
  }, []);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.monthDisplay}>{month}</div>

      <h2>Leaderboard</h2>
      <p>Check out the current leaderboard standings below!</p>

      {/* Top Part: Podium */}
      <div style={styles.podiumContainer}>
  <div style={styles.podium2}>
    <div style={styles.podiumPositionText}>🥈</div>
    <p>{leaderboard[1]?.residentName || "N/A"}</p>
    <p>{leaderboard[1]?.totalPoints || 0} pts</p>
  </div>
  <div style={styles.podium1}>
    <div style={styles.podiumPositionText}>🥇</div>
    <p>{leaderboard[0]?.residentName || "N/A"}</p>
    <p>{leaderboard[0]?.totalPoints || 0} pts</p>
  </div>
  <div style={styles.podium3}>
    <div style={styles.podiumPositionText}>🥉</div>
    <p>{leaderboard[2]?.residentName || "N/A"}</p>
    <p>{leaderboard[2]?.totalPoints || 0} pts</p>
  </div>
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
              <tr
                key={user.residentID}
                style={styles.tableRow}
                className={index % 2 === 0 ? "odd-row" : "even-row"}
              >
                <td style={styles.tableCell}>{index + 1}</td>
                <td style={styles.tableCell}>{user.residentName}</td>
                <td style={styles.tableCell}>
                  {user.residentClass ? user.residentClass : "N/A"}
                </td>
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
          {awards.map((award) => {
            const actualAward = AWARDS.find((a) => a.name === award.name);
            if (!actualAward) return null;

            const { Icon } = actualAward;
            return (
              <div
                key={award.id}
                style={styles.awardCard}
                onClick={() =>
                  setSelectedAward({
                    name: actualAward.name,
                    description: actualAward.description,
                  })
                }
              >
                {Icon && <Icon style={styles.awardIcon} />}
                <h4>{award.name}</h4>
              </div>
            );
          })}
        </div>

        {selectedAward && (
          <div
            style={styles.modalOverlay}
            onClick={() => setSelectedAward(null)}
          >
            <div
              style={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{selectedAward.name}</h2>
              <p>{selectedAward.description}</p>
              <button onClick={() => setSelectedAward(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: "20px",
    color: "white",
  },
  podiumContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: "20px",
    marginBottom: "40px",
    height: "200px", // Adjust height to fit podium design
  },
  podium1: {
    textAlign: "center",
    background: "#d4a531",
    color: "black",
    width: "120px",
    height: "160px", // Tallest podium
    borderRadius: "10px 10px 0 0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "10px",
    marginTop: "-20px", // Lower the podium slightly for visual balance
    position: "relative",
  },
  podium2: {
    textAlign: "center",
    background: "#c0c0c0",
    color: "black",
    width: "120px",
    height: "140px", // Medium height
    borderRadius: "10px 10px 0 0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "10px",
    position: "relative",
  },
  podium3: {
    textAlign: "center",
    background: "#a97142",
    color: "black",
    width: "120px",
    height: "120px", // Shortest podium
    borderRadius: "10px 10px 0 0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "10px",
    position: "relative",
  },
  podiumPositionText: {
    position: "absolute",
    top: "-20px",
    backgroundColor: "white",
    color: "black",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
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
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  awardsContainer: {
    marginTop: "20px",
  },
  awardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
    gap: "20px",
    justifyItems: "center",
  },
  awardCard: {
    textAlign: "center",
    padding: "10px",
    cursor: "pointer",
    transition: "transform 0.3s",
  },
  awardIcon: {
    width: "50px",
    height: "50px",
    margin: "10px auto",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: "white",
    color: "black",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    maxWidth: "400px",
    width: "80%",
  },
  monthDisplay: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "white",
  },
};

export default LeaderboardPage;
