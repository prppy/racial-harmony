import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import {
    fetchMainCollection,
    fetchMainRecord,
} from "../utils/firebaseUtils";
import { DARK_PURPLE, RED } from "../constants/colors";
import styles from "../admin-pages/Tasks.module.css";
import NavigateTaskButton from "../components/NavigateTaskButton";
import { useAuth } from "../context/authContext";
import { VoucherSlide } from "../components/Slides";
import { useLocation } from "react-router-dom";
import CategoryTabs from "../components/CategoryTabs";

const VoucherPage = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [voucherBalance, setVoucherBalance] = useState(0); // State for voucher balance
    const { user } = useAuth();
    const location = useLocation();
    const defaultSearchQuery = location.state?.searchQuery || "";

    const [searchQuery, setSearchQuery] = useState(defaultSearchQuery);

    const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        fetchMainCollection("tasks")
            .then((data) => {
                setTasks(data);
            })
            .catch((error) => console.error("Error fetching tasks:", error));
    }, []);

    useEffect(() => {
        fetchMainRecord("users", user?.userId)
            .then((data) => {
                setVoucherBalance(data.voucher_balance);
                console.log("voucher balance", data.voucher_balance);
            })
            .catch((error) => console.error("Error fetching voucher balance:", error));
    }, [user?.userId]);

    const filteredTasks = tasks.filter(
        (task) =>
            (selectedCategory === "All" ||
                task.category.toLowerCase() === selectedCategory.toLowerCase()) &&
            task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsTaskDetailModalOpen(true);
    };

    const handleCloseTaskDetailModal = () => {
        setIsTaskDetailModalOpen(false);
        setSelectedTask(null); // Clear the selected task when closing
    };

    return (
        <div style={pageStyles.pageContainer}>
            <div className={styles.topSection}>
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    type={"tasks"}
                />
                {/* Voucher Balance */}
                <div className={styles.voucherBalanceContainer}>
                    <span className={styles.voucherBalanceText}>
                        Voucher Balance: {voucherBalance} points
                    </span>
                </div>
            </div>

            <CategoryTabs
                categories={[
                    "All",
                    "Group",
                    "Individual",
                ]}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            {/* Render Filtered Tasks */}
            <div className={styles.tasksGrid}>
                {filteredTasks.map((task) => (
                    <div key={task.id} onClick={() => handleTaskClick(task)}>
                        <VoucherSlide
                            voucher={task}
                            style={{ width: "100%" }}
                        />
                    </div>
                ))}
            </div>

            {/* Modal for Task Details */}
            {isTaskDetailModalOpen && selectedTask && (
                <div className={styles.modalOverlayTaskDetails}>
                    <div className={styles.modalTaskDetails}>
                        <h2 className={styles.modalTaskDetailsHeader}>
                            Task Overview
                        </h2>
                        <div className={styles.modalContent}>
                            <div className={styles.modalLeft}>
                                <div className={styles.taskImage}>
                                    <img
                                        src={selectedTask.imageUrl}
                                        alt="Task"
                                    />
                                </div>
                            </div>
                            <div className={styles.modalRight}>
                                <div>
                                    <p
                                        style={{
                                            color: DARK_PURPLE,
                                            fontWeight: "bold",
                                            fontSize: "20px",
                                            marginBottom: "5px",
                                            marginTop: "0",
                                        }}
                                    >
                                        {selectedTask.title}
                                    </p>
                                    <p
                                        style={{
                                            color: RED,
                                            fontWeight: "bold",
                                            fontSize: "20px",
                                            marginTop: "0px",
                                            marginBottom: "0px",
                                        }}
                                    >
                                        {selectedTask.points}pts
                                    </p>
                                    <hr className="line"></hr>
                                    <p style={{ color: "black" }}>
                                        <strong
                                            style={{
                                                color: DARK_PURPLE,
                                                fontSize: "16px",
                                                marginTop: "0px",
                                                marginBottom: "0px",
                                            }}
                                        >
                                            Description:
                                        </strong>{" "}
                                        {selectedTask.description}
                                    </p>
                                    <p style={{ color: "black" }}>
                                        <strong
                                            style={{
                                                color: DARK_PURPLE,
                                                fontSize: "16px",
                                                marginTop: "0px",
                                                marginBottom: "0px",
                                            }}
                                        >
                                            Category:
                                        </strong>{" "}
                                        {selectedTask.category.charAt(0).toUpperCase() + selectedTask.category.slice(1)}
                                    </p>
                                    <p
                                        style={{
                                            color: RED,
                                            fontWeight: "bold",
                                            marginTop: "0px",
                                        }}
                                    >
                                        Due By: {selectedTask.dueDate}
                                    </p>
                                    <NavigateTaskButton
                                        task={selectedTask}
                                        admin={false}
                                        className="button"
                                        style={{
                                            fontSize: 25,
                                            width: "100%",
                                            boxShadow:
                                                "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        View Details
                                    </NavigateTaskButton>
                                </div>
                            </div>
                        </div>
                        <div className={styles.taskButtonContainer}>
                            <button
                                type="button"
                                onClick={handleCloseTaskDetailModal}
                                className={styles.cancelButton}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const pageStyles = {
    pageContainer: {
        padding: "50px",
    },
    selectedCategory: {
        backgroundColor: "#68180a",
        color: "white",
    },
};

export default VoucherPage;
