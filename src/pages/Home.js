import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { App } from "../App.css";
import { DARK_GREEN, DARK_PURPLE, RED } from "../constants/colors";
import { fetchMainCollection, fetchMainRecord } from "../utils/firebaseUtils";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [voucherBalance, setVoucherBalance] = useState();

    useEffect(() => {
        const getApplications = async () => {
            try {
                let data = await fetchMainCollection("applications");
                data = data
                    .filter((app) => app.residentID === user.userId)
                    .filter((app) => app.status === "approved");
                setApplications(data);
            } catch (error) {
                console.error(error);
            }
        };

        const getTasks = async () => {
            try {
                const data = await fetchMainCollection("tasks");
                setTasks(data);
            } catch (error) {
                console.error(error);
            }
        };

        const getVoucherBalance = async () => {
            try {
                let data = await fetchMainRecord("users", user.userId);
                data = data.voucher_balance;
                setVoucherBalance(data);
            } catch (error) {
                console.error(error);
            }
        };
        getApplications();
        getTasks();
        getVoucherBalance();
    }, []);

    const RecentTransactions = () => {
        if (applications.length === 0) {
            return (
                <div style={{ justifySelf: "start", marginBottom: "25px" }}>
                    No approved applications found.
                </div>
            );
        }

        return (
            <ol style={{ justifySelf: "start" }}>
                {applications.map((app) => {
                    const myTask = tasks.find((task) => task.id === app.taskId);
                    return (
                        <div
                            key={app.id}
                            style={{
                                display: "flex",
                                width: "100%",
                                flexDirection: "row", // Horizontal alignment
                                alignItems: "center", // Vertically align items
                                justifyContent: "space-between",
                                marginBottom: "25px",
                            }}
                        >
                            <li
                                style={{
                                    width: "70%",
                                }}
                            >
                                {myTask
                                    ? `Completed "${myTask.title}" Task`
                                    : "Task not found"}
                            </li>
                            <div style={styles.points}>+ {myTask?.points}</div>
                        </div>
                    );
                })}
            </ol>
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

                <hr
                    className="vertical-line"
                ></hr>
                <div style={styles.right}>
                    <h2 className="large-heading">Voucher Balance:</h2>
                    <span style={{ fontSize: 50 }}>{voucherBalance}</span>
                    <span style={{ fontSize: 20 }}>pts</span>
                    <hr className="line"></hr>
                    <h3 style={{ justifySelf: "start" }}>
                        Recent Transactions:
                    </h3>
                    <RecentTransactions></RecentTransactions>
                    <u
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/history")}
                    >
                        All Transactions
                    </u>
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
        minWidth: "40%",
        border: "2px solid black",
    },
    right: {
        border: `2px solid ${DARK_PURPLE}`,
        minWidth: "40%",
        justifyItems: "center",
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "25px",
        boxSizing: "border-box",
        color: DARK_PURPLE,
    },
    points: {
        display: "flex",
        width: "100px",
        backgroundColor: DARK_GREEN,
        borderRadius: "10px",
        color: "white",
        justifyContent: "center", // Centers horizontally
        alignItems: "center", // Centers vertically
        fontSize: "16px",
        padding: "10px",
        boxSizing: "border-box",
    },
};

export default HomePage;
