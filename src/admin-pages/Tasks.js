import React, { useEffect, useState } from "react";
import {
    fetchMainCollection,
    createMainRecord,
    uploadImage,
} from "../utils/firebaseUtils";
import { DARK_PURPLE, RED } from "../constants/colors";
import SearchBar from "../components/SearchBar";
import styles from "./Tasks.module.css";
import NavigateTaskButton from "../components/NavigateTaskButton";
import { useNavigate } from "react-router-dom";
import { VoucherAdminSlide } from "../components/Slides";

const Tasks = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        points: 0,
        dueDate: "",
        category: "",
    });

    useEffect(() => {
        fetchMainCollection("tasks")
            .then((data) => {
                setTasks(data);
                setFilteredTasks(data);
            })
            .catch((error) => console.error("Error fetching tasks:", error));
    }, []);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category.toLowerCase());
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
        setSelectedTask(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadImage(file, "userId", "tasks")
                .then((result) => {
                    console.log("Image uploaded successfully", result);
                    setNewTask({ ...newTask, imageUrl: result.downloadURL }); // Store the image URL in state
                })
                .catch((error) => {
                    console.error("Error uploading image:", error);
                });
        }
    };

    const handleAddTask = async () => {
        try {
            const taskToSave = {
                ...newTask,
                points: Number(newTask.points),
                imageUrl: newTask.imageUrl ? newTask.imageUrl : "",
            };
            const savedTask = await createMainRecord("tasks", taskToSave);

            const updatedTasks = [...tasks, { id: savedTask.id, ...newTask }];
            setTasks(updatedTasks);
            setFilteredTasks(updatedTasks);

            setNewTask({
                title: "",
                description: "",
                points: 0,
                dueDate: "",
                imageUrl: "",
                category: "",
            });
            setIsModalOpen(false);
        } catch (e) {
            console.error("Error saving task:", e);
        }
    };

    return (
        <div style={pageStyles.pageContainer}>
            <div className={styles.topSection}>
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={handleSearch}
                    type={"tasks"}
                />
                <div
                    className={styles.voucherBalanceContainer}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/auditLog")}
                >
                    <span className={styles.voucherBalanceText}>Audit Log</span>
                </div>
            </div>

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

            <div className={styles.tasksGrid}>
                {/* Add Button */}
                <div
                    className={styles.addButton}
                    onClick={() => setIsModalOpen(true)}
                >
                    <span className={styles.addButtonText}>+</span>
                </div>
                {filteredTasks.map((task) => (
                    <div key={task.id}>
                        <VoucherAdminSlide
                            voucher={task}
                            onClick={() => handleTaskClick(task)}
                            style={{ width: "100%" }}
                        />
                    </div>
                ))}
            </div>

            {/* Modal to Add Task */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2 className={styles.modalHeader}>Add New Task</h2>
                        <form className={styles.form}>
                            <label className={styles.label}>
                                Title:
                                <input
                                    type="text"
                                    name="title"
                                    value={newTask.title}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </label>
                            <label className={styles.label}>
                                Image (optional):
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleImageChange}
                                    className={styles.input}
                                />
                            </label>
                            <label className={styles.label}>
                                Category:
                                <select
                                    name="category"
                                    value={newTask.category}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Group">Group</option>
                                    <option value="Individual">
                                        Individual
                                    </option>
                                    {/* Add more categories as needed */}
                                </select>
                            </label>
                            <label className={styles.label}>
                                Description:
                                <textarea
                                    name="description"
                                    value={newTask.description}
                                    onChange={handleInputChange}
                                    className={styles.textarea}
                                    maxLength={1000}
                                    placeholder="max 1000 char"
                                />
                            </label>
                            <label className={styles.label}>
                                Points:
                                <input
                                    type="number"
                                    name="points"
                                    value={newTask.points}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </label>
                            <label className={styles.label}>
                                Due Date:
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={newTask.dueDate}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                />
                            </label>
                            <div className={styles.buttonContainer}>
                                <button
                                    type="button"
                                    onClick={handleAddTask}
                                    className={styles.saveButton}
                                >
                                    Save Task
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className={styles.cancelButton}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                                    <hr className="line" />
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
                                        admin={true}
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

export default Tasks;
