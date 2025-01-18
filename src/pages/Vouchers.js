import React, { useEffect, useState } from "react";
import {
    fetchMainCollection,
    createMainRecord,
    uploadImage,
    fetchMainRecord,
} from "../utils/firebaseUtils";
import { DARK_PURPLE, RED } from "../constants/colors";
import SearchBar from "../components/SearchBar";
import styles from "../admin-pages/Tasks.module.css";
import NavigateTaskButton from "../components/NavigateTaskButton";
import { useAuth } from "../context/authContext";
import { VoucherSlide } from "../components/Slides";

const VoucherPage = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [voucherBalance, setVoucherBalance] = useState(100); // State for voucher balance
    const { user } = useAuth();
    useEffect(() => {
        fetchMainCollection("tasks")
            .then((data) => {
                setTasks(data);
                setFilteredTasks(data);
            })
            .catch((error) => console.error("Error fetching tasks:", error));
    }, []);

    useEffect(() => {
        fetchMainRecord("users", user?.userId)
            .then((data) => {
                setVoucherBalance(data.voucher_balance);
            })
            .catch((error) => console.error("Error fetching tasks:", error));
    }, []);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category.toLowerCase());
        console.log(category);
        const filtered = tasks.filter(
            (task) =>
                task.category.toLowerCase() === category.toLowerCase() ||
                category === ""
        );
        setFilteredTasks(filtered);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = tasks.filter((task) =>
            task.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredTasks(filtered);
    };

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
                    setSearchQuery={handleSearch}
                    type={"tasks"}
                />
                {/* Voucher Balance */}
                <div className={styles.voucherBalanceContainer}>
                    <span className={styles.voucherBalanceText}>
                        Voucher Balance: {voucherBalance} points
                    </span>
                </div>
            </div>

            {/* Category Filter Buttons */}
            <div className={styles.categorySection}>
                <button
                    className={`${styles.categoryButton}`}
                    style={
                        selectedCategory === ""
                            ? pageStyles.selectedCategory
                            : {}
                    }
                    onClick={() => handleCategorySelect("")}
                >
                    All
                </button>
                <button
                    className={`${styles.categoryButton}`}
                    style={
                        selectedCategory === "group"
                            ? pageStyles.selectedCategory
                            : {}
                    }
                    onClick={() => handleCategorySelect("Group")}
                >
                    Group
                </button>
                <button
                    className={`${styles.categoryButton}`}
                    style={
                        selectedCategory === "individual"
                            ? pageStyles.selectedCategory
                            : {}
                    }
                    onClick={() => handleCategorySelect("Individual")}
                >
                    Individual
                </button>
            </div>

            {/* Render Filtered Tasks */}
            <div className={styles.tasksGrid}>
                {filteredTasks.map((task) => (
                    <div key={task.id} onClick={() => handleTaskClick(task)}>
                        <VoucherSlide voucher={task} style={{ margin: "0" }} />
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
                                        alt="Task Image"
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
											marginTop: "0"
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
                                    <hr className="line" />
                                    <p style={{ color: "black"}}>
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
                                            fontSize: 20,
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
