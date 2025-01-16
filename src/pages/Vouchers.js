import React, { useEffect, useState } from "react";
import { fetchMainCollection, createMainRecord, uploadImage, fetchMainRecord } from "../utils/firebaseUtils";
import { DARK_PURPLE, RED } from "../constants/colors";
import SearchBar from "../components/SearchBar";
import styles from "../admin-pages/Tasks.module.css";
import NavigateTaskButton from "../components/NavigateTaskButton";
import { useAuth } from "../context/authContext";


const VoucherPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [voucherBalance, setVoucherBalance] = useState(100); // State for voucher balance
  const {user} = useAuth();
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
        setVoucherBalance(data.voucher_balance)
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);


  const handleCategorySelect = (category) => {
    setSelectedCategory(category.toLowerCase());
    console.log(category);
    const filtered = tasks.filter(
      (task) =>
        task.category.toLowerCase() === category.toLowerCase() || category === ""
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
    <div className={styles.container}>
      {/* Top Section with Search Bar and Voucher Balance */}
      <div className={styles.topSection}>
        <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearch} type={"tasks"} />
        {/* Voucher Balance */}
        <div className={styles.voucherBalanceContainer}>
          <span className={styles.voucherBalanceText}>Voucher Balance: {voucherBalance} points</span>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className={styles.categorySection}>
        <button
          className={`${styles.categoryButton}`}
          style={selectedCategory === "" ? pageStyles.selectedCategory : {}}
          onClick={() => handleCategorySelect("")}
        >
          All
        </button>
        <button
          className={`${styles.categoryButton}`}
          style={selectedCategory === "group" ? pageStyles.selectedCategory : {}}
          onClick={() => handleCategorySelect("Group")}
        >
          Group
        </button>
        <button
          className={`${styles.categoryButton}`}
          style={selectedCategory === "individual" ? pageStyles.selectedCategory : {}}
          onClick={() => handleCategorySelect("Individual")}
        >
          Individual
        </button>
      </div>

      {/* Render Filtered Tasks */}
      <div className={styles.tasksGrid}>
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={styles.taskCard}
            onClick={() => handleTaskClick(task)}
          >
            <div className={styles.taskImage}>
              {task.imageUrl ? (
                <img src={task.imageUrl} alt="task" className={styles.taskImage} />
              ) : (
                <div className={styles.grayImage}></div>
              )}
            </div>
            <div className={styles.taskPoints}>{task.points} pts</div>
            <div className={styles.taskTitle}>{task.title}</div>
          </div>
        ))}
      </div>

      {/* Modal for Task Details */}
      {isTaskDetailModalOpen && selectedTask && (
        <div className={styles.modalOverlayTaskDetails}>
          <div className={styles.modalTaskDetails}>
            <h2 className={styles.modalTaskDetailsHeader}>Task Overview</h2>
            <div className={styles.modalContent}>
              <div className={styles.modalLeft}>
                <div className={styles.taskImage}>
                  <img src={selectedTask.imageUrl} alt="Task Image" />
                </div>
              </div>
              <div className={styles.modalRight}>
                <div className={styles.taskDetails}>
                  <p style={{ color: DARK_PURPLE, fontWeight: "bold", fontSize: "18px" }}>
                    {selectedTask.title}
                  </p>
                  <p style={{ color: RED, fontWeight: "bold", marginTop: "0px" }}>
                    {selectedTask.points} pts
                  </p>
                  <hr style={{ color: DARK_PURPLE }} />
                  <p className={styles.taskDetail}>
                    <strong>Description:</strong> {selectedTask.description}
                  </p>
                  <p style={{ color: RED, fontWeight: "bold" }}>Due By: {selectedTask.dueDate}</p>
                  <NavigateTaskButton
                    task={selectedTask}
                    admin={false}
                    className="button"
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                      width: "100%",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
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
  selectedCategory: {
    backgroundColor: "#68180a",
    color: "white",
  },

};

export default VoucherPage;
