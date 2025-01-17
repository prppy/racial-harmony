import React, { useEffect, useState } from "react";
import {
  fetchMainRecord,
  fetchCollection,
  fetchMainCollection,
} from "../utils/firebaseUtils";
import { useAuth } from "../context/authContext";
import { DARK_PURPLE } from "../constants/colors";
import AWARDS from "../constants/awards";

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [awards, setAwards] = useState([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const users = await fetchMainCollection("users");
        if (users) {
          const sortedUsers = Object.entries(users)
            .map(([id, data]) => ({ id, ...data }))
            .sort((a, b) => b.voucher_balance - a.voucher_balance);
          setLeaderboard(sortedUsers);
        }
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

    fetchLeaderboardData();
    fetchUserAwards();
  }, [user]);

  return (
    <div style={styles.pageContainer}>
      <h2>Leaderboard</h2>
      <p>Check out the current leaderboard standings below!</p>

      {/* Top Part: Podium */}
      <div style={styles.podiumContainer}>
        {leaderboard.slice(0, 3).map((user, index) => (
          <div key={user.userId} style={styles[`podium${index + 1}`]}>
            <h3>{index + 1 === 1 ? "🥇" : index + 1 === 2 ? "🥈" : "🥉"}</h3>
            <p>{user.name}</p>
            <p>{user.voucher_balance} pts</p>
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
              <th style={styles.tableHeader}>Voucher Balance</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.slice(3).map((user, index) => (
              <tr key={user.id} style={styles.tableRow}>
                <td style={styles.tableCell}>{index + 4}</td>
                <td style={styles.tableCell}>{user.name}</td>
                <td style={styles.tableCell}>{user.voucher_balance} pts</td>
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
};

export default LeaderboardPage;
