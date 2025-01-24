import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
// eslint-disable-next-line no-unused-vars
import { App } from "../App.css";
import { DARK_GREEN, DARK_PURPLE, } from "../constants/colors";
import { fetchMainCollection, fetchMainRecord } from "../utils/firebaseUtils";
import { useNavigate } from "react-router-dom";
import { VoucherSliderComp, ProductSliderComp } from "../components/SliderComps";

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [voucherBalance, setVoucherBalance] = useState();
    const [favouriteTask, setFavouriteTask] = useState([]);
    const [favouriteProduct, setFavouriteProduct] = useState([]);


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
            getFavouriteProduct();
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
                        <li style={{ flex: 1 }}>{`Completed "${myTask.title}" Task`}</li>
                        <div style={styles.points}>+{myTask.points}</div>
                    </div>
                );
            })}
        </ul>
        
        );
    };

    return (
        <div style={styles.pageContainer}>
            <h2 className="large-heading" style={{color: DARK_PURPLE}}>Welcome back {user?.admin ? "Admin" : "Resident"} {user.name}!
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
        </div>
    );
};

const styles = {
    pageContainer: {
        padding: "25px",
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
};

export default Home;
