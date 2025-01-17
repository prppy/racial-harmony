import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { App } from "../App.css";
import { DARK_PURPLE, RED } from "../constants/colors";
import { database } from "../firebase";
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
} from "firebase/firestore";

const HomePage = () => {
    const { user } = useAuth();

    const fetchApprovedApplications = async () => {
        try {
            const applicationsRef = collection(database, "applications");
            const q = query(
                applicationsRef,
                where("residentID", "==", user.userId),
                where("status", "==", "approved"),
                orderBy("id", "desc"), // Assuming `id` is sortable for the most recent
                limit(5)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        } catch (error) {
            console.error("Error fetching recent applications:", error);
            throw error;
        }
    };

    const RecentTransactions = () => {
        const [applications, setApplications] = useState([]);

        useEffect(() => {
            const getApplications = async () => {
                try {
                    const data = await fetchApprovedApplications();
                    setApplications(data);
                } catch (error) {
                    console.error(error);
                }
            };
            getApplications();
        }, []);

        if (applications.length === 0) {
            return <div>No approved applications found.</div>;
        }

        return (
            <div style={styles.container}>
                {applications.map((app) => (
                    <div key={app.id} style={styles.card}>
                        <div style={styles.details}>
                            <span style={styles.text}>
                                <strong>Task ID:</strong> {app.taskId}
                            </span>
                            <span style={styles.text}>
                                <strong>Class:</strong> {app.class}
                            </span>
                        </div>
                        <span
                            style={{
                                ...styles.statusBadge,
                                backgroundColor:
                                    app.status === "approved"
                                        ? "#4CAF50"
                                        : "#A52A2A",
                            }}
                        >
                            {app.status.toUpperCase()}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div style={styles.pageContainer}>
            <h2 className="large-heading">
                Welcome back Resident {user.name}!
            </h2>
            <hr className="line"></hr>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <div style={styles.left}>
                    <h2 className="large-heading">Vouchers</h2>
                </div>

                <div style={styles.right}>
                    <h2 className="large-heading">Voucher Balance:</h2>
                    <span style={{ fontSize: 50 }}>5000</span>
                    <span style={{ fontSize: 20 }}>pts</span>
                    <hr className="line"></hr>
                    <h3 style={{ justifySelf: "start" }}>
                        Recent Transactions:
                    </h3>
                    <RecentTransactions></RecentTransactions>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageContainer: {
        padding: "50px",
    },
    left: {
        width: "50%",
        border: "2px solid black",
    },
    right: {
        border: `2px solid ${DARK_PURPLE}`,
        marginLeft: "50px",
        width: "40%",
        justifyItems: "center",
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "25px",
        boxSizing: "border-box",
        color: DARK_PURPLE,
    },
    recentTransactions: {
        width: "calc(100% - 100px)",
        border: "2px solid black",
    },
};

export default HomePage;
