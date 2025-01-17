import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/authContext";
import { App } from "../App.css";
import { DARK_GREEN, DARK_PURPLE, RED } from "../constants/colors";
import { fetchMainCollection, fetchMainRecord } from "../utils/firebaseUtils";
import { useNavigate } from "react-router-dom";
import { VoucherSliderComp } from "../components/SliderComps";

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [voucherBalance, setVoucherBalance] = useState();
    const [favouriteTask, setFavouriteTask] = useState([]);

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

        const getFavouriteTask = async () => {
            try {
                const taskData = await fetchMainCollection("tasks");
                const userFavourites = (
                    await fetchMainRecord("users", user.userId)
                ).favouriteTasks;
                const filteredTasks = taskData.filter((task) =>
                    userFavourites.includes(task.id)
                );
                console.log("Data Fetched: ", filteredTasks);
                setTasks(taskData);
                setFavouriteTask(filteredTasks);
                console.log("Fav Task Set: ", filteredTasks);
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

        if (!user?.admin) {
            getTasks();
            getFavouriteTask();
            getApplications();
            getVoucherBalance();
        }
    }, [user]);

    const RecentTransactions = () => {
        if (applications.length === 0) {
            return (
                <div style={{ justifySelf: "start", marginBottom: "25px" }}>
                    No approved applications found.
                </div>
            );
        }

        return (
            <ul
                style={{
                    justifySelf: "start",
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >
                {applications.map((app) => {
                    const myTask = tasks.find((task) => task.id === app.taskId);
                    if (!myTask) {
                        // Skip rendering if myTask is not found
                        return null;
                    }
                    return (
                        <div
                            key={app.id}
                            style={{
                                display: "flex",
                                width: "100%",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "25px",
                            }}
                        >
                            <li
                                style={{
                                    width: "70%",
                                }}
                            >
                                {`Completed "${myTask.title}" Task`}
                            </li>
                            <div style={styles.points}>+{myTask.points}</div>
                        </div>
                    );
                })}
            </ul>
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
                    <h2 className="large-heading">My Favourite Vouchers:</h2>
                    <div style={styles.slide}>
                        <VoucherSliderComp vouchers={favouriteTask} />
                    </div>
                    <h2 className="large-heading">My Favourite Products:</h2>
					<div style={styles.slide}>
                        <VoucherSliderComp vouchers={favouriteTask} />
                    </div>
                    <h2 className="large-heading">Ongoing Auctions:</h2>
					<div style={styles.slide}>
                        <VoucherSliderComp vouchers={favouriteTask} />
                    </div>
                </div>

                <hr className="vertical-line"></hr>
                <div style={styles.right}>
                    <h2 className="large-heading">Voucher Balance:</h2>
                    <span style={{ fontSize: 50 }}>{voucherBalance}</span>
                    <span style={{ fontSize: 20 }}>pts</span>
                    <hr className="line"></hr>
                    <h3 style={{ justifySelf: "start" }}>
                        Recent Transactions:
                    </h3>
                    <RecentTransactions />
                    <u
                        style={{ cursor: "pointer", alignSelf: "end" }}
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
        width: "60%",
        flexDirection: "column",
        boxSizing: "border-box",
    },
    right: {
        border: `2px solid ${DARK_PURPLE}`,
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
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "end",
        fontSize: "16px",
        padding: "10px",
        boxSizing: "border-box",
    },
    slide: {
        width: "100%",
    },
};

export default Home;
