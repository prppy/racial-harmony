import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
// eslint-disable-next-line no-unused-vars
import { App } from "../App.css";
import { DARK_GREEN, DARK_PURPLE, PALE_PURPLE } from "../constants/colors";
import { fetchMainCollection, fetchMainRecord } from "../utils/firebaseUtils";
import { useNavigate } from "react-router-dom";
import {
    VoucherSliderComp,
    ProductSliderComp,
} from "../components/SliderComps";
import ApplicationsTable from "../components/ApplicationsTable";
import ProductTable from "../components/ProductTable";
import { Line } from "react-chartjs-2";

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [userData, setUserData] = useState(null);
    const [voucherBalance, setVoucherBalance] = useState();
    const [favouriteTask, setFavouriteTask] = useState([]);
    const [favouriteProduct, setFavouriteProduct] = useState([]);

    const [type, setType] = useState("products");
    const [category, setCategory] = useState("food");
      const [timeFrame, setTimeFrame] = useState("monthly");

    const data = {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                label: `${type} data for ${category}`,
                data: [12, 19, 3, 5, 2, 3],
                borderColor: PALE_PURPLE,
                backgroundColor: DARK_PURPLE,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
            },
        },
    };

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
                setTasks(taskData);
                setFavouriteTask(filteredTasks);
                console.log(filteredTasks);
            } catch (error) {
                console.error(error);
            }
        };

        const getFavouriteProduct = async () => {
            try {
                const productData = await fetchMainCollection("products");
                const userFavourites = (
                    await fetchMainRecord("users", user.userId)
                ).favouriteProducts;
                const filteredProducts = productData.filter((product) =>
                    userFavourites.includes(product.id)
                );
                setFavouriteProduct(filteredProducts);
                console.log("Favourite Products: ", filteredProducts);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchData = async () => {
            try {
                const userData = await fetchMainRecord("users", user.userId);
                setUserData(userData);
                setVoucherBalance(userData.voucher_balance);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchData();
        if (!user?.admin) {
            getTasks();
            getFavouriteTask();
            getFavouriteProduct();
            getApplications();
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
                    display: "flex",
                    flexDirection: "column", // For vertical stacking
                    alignItems: "flex-start", // Adjust alignment of list items
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >
                {applications.map((app) => {
                    const myTask = tasks.find((task) => task.id === app.taskId);
                    if (!myTask) return null;
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
                                style={{ flex: 1 }}
                            >{`Completed "${myTask.title}" Task`}</li>
                            <div style={styles.points}>+{myTask.points}</div>
                        </div>
                    );
                })}
            </ul>
        );
    };

    return (
        <div style={styles.pageContainer}>
            <text
                className="large-heading"
                style={{
                    color: DARK_PURPLE,
                    backgroundColor: "white",
                    borderRadius: "10px",
                }}
            >
                Welcome back {user?.admin ? "Admin" : "Resident"} {user.name}!
            </text>
            <hr className="line"></hr>

            {user?.admin ? (
                <div style={styles.dashboard}>
                    <div style={styles.dashboardItem}>
                        <h2 className="large-heading">
                            Pending Applications ({userData?.class})
                        </h2>
                        <ApplicationsTable
                            user={user}
                            columns={["residentName", "actions", "taskName"]} // Only show Resident Name and Actions
                        />
                    </div>
                    <div style={styles.dashboardItem}>
                        <h2 className="large-heading">
                            Pending Requests ({userData?.class})
                        </h2>
                    </div>
                    <div style={styles.dashboardItem}>
                        <h2 className="large-heading">Leaderboard</h2>

                        <div style={styles.podiumContainer}>
                            <div
                                style={{
                                    ...styles.podium,
                                    ...styles.secondPlace,
                                }}
                            >
                                <span style={styles.podiumText}>2</span>
                            </div>
                            <div
                                style={{
                                    ...styles.podium,
                                    ...styles.firstPlace,
                                }}
                            >
                                <span style={styles.podiumText}>1</span>
                            </div>
                            <div
                                style={{
                                    ...styles.podium,
                                    ...styles.thirdPlace,
                                }}
                            >
                                <span style={styles.podiumText}>3</span>
                            </div>
                        </div>
                    </div>
                    <div style={styles.dashboardItem}>
                        <h2 className="large-heading">Low Stock Alert</h2>
                        <ProductTable
                            filterCategory=""
                            searchQuery=""
                            showLimitedColumns={true} // Show only limited columns for the homepage
                        />
                    </div>
                    <div style={styles.dashboardItem}>
                        <h2 className="large-heading">
                            Voucher Trends for the Week
                        </h2>
                        <div style={styles.selectContainer}>
                            <div style={styles.selectItem}>
                                <label>Type:</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option value="products">Products</option>
                                    <option value="requests">Requests</option>
                                </select>
                            </div>

                            <div style={styles.selectItem}>
                                <label>Category:</label>
                                <select
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                >
                                    <option value="food">Food</option>
                                    <option value="entertainment">
                                        Entertainment
                                    </option>
                                    <option value="transport">Transport</option>
                                </select>
                            </div>

                            <div style={styles.selectItem}>
                                <label>Time Frame:</label>
                                <select
                                    value={timeFrame}
                                    onChange={(e) =>
                                        setTimeFrame(e.target.value)
                                    }
                                >
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                        </div>
                        <div style={styles.chartContainer}>
                            <Line data={data} options={options} />
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={styles.left}>
                        <h2 className="large-heading">
                            My Favourite Vouchers:
                        </h2>
                        <div style={styles.slide}>
                            <VoucherSliderComp vouchers={favouriteTask} />
                        </div>
                        <h2 className="large-heading">
                            My Favourite Products:
                        </h2>
                        <div style={styles.slide}>
                            <ProductSliderComp products={favouriteProduct} />
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
            )}
        </div>
    );
};

const styles = {
    pageContainer: {
        padding: "25px",
    },
    dashboard: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        gap: "25px",
    },
    dashboardItem: {
        border: `2px solid ${DARK_PURPLE}`,
        backgroundColor: "white",
        color: DARK_PURPLE,
        padding: "25px",
        borderRadius: "10px",
    },
    left: {
        width: "60%",
        flexDirection: "column",
        boxSizing: "border-box",
    },
    right: {
        width: "35%",
        border: `2px solid ${DARK_PURPLE}`,
        justifyItems: "center",
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "25px",
        boxSizing: "border-box",
        color: DARK_PURPLE,
        position: "sticky", // Stick to the viewport
        top: "50px", // Distance from the top of the screen
        alignSelf: "flex-start", // Align to the top
    },
    points: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "80px", // Fixed width for uniform size
        height: "40px", // Fixed height for uniform size
        backgroundColor: DARK_GREEN,
        borderRadius: "20px", // Half of height for circular/rounded look
        color: "white",
        fontSize: "16px",
        fontWeight: "bold", // Optional for better appearance
        margin: "0 10px", // Optional spacing between elements
        boxSizing: "border-box",
    },

    slide: {
        width: "100%", // Use full width of the parent container
    },
    podiumContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        height: "200px", // Adjust as needed
        gap: "10px", // Space between podiums
    },
    podium: {
        width: "60px", // Fixed width for podiums
        backgroundColor: DARK_PURPLE,
        borderRadius: "5px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontWeight: "bold",
        fontSize: "20px",
    },

    firstPlace: {
        height: "120px", // Tallest podium
        backgroundColor: "#d4a531", // Gold color
    },

    secondPlace: {
        height: "100px", // Medium height
        backgroundColor: "#C0C0C0", // Silver color
    },

    thirdPlace: {
        height: "80px", // Shortest podium
        backgroundColor: "#a97142", // Bronze color
    },

    podiumText: {
        position: "absolute",
        top: "-25px", // Position the number above the podium
        fontSize: "24px",
        fontWeight: "bold",
        color: DARK_PURPLE,
    },
};

export default Home;
