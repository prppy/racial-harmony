import React, { useEffect, useState } from "react";
import { fetchMainCollection, createMainRecord, uploadImage} from "../utils/firebaseUtils";
import { DARK_PURPLE, RED } from "../constants/colors";
import SearchBar from "../components/SearchBar";
import styles from "./Tasks.module.css"; // Import the styles

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false); // State for task detail modal
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    points: "",
    dueDate: "",
  });
  const [selectedTask, setSelectedTask] = useState(null); // State to hold the selected task for detail modal

  useEffect(() => {
    fetchMainCollection("tasks")
      .then((data) => {
        setTasks(data);
        setFilteredTasks(data);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

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
      const savedTask = await createMainRecord("tasks", { ...newTask, imageUrl: newTask.imageUrl });
  
      const updatedTasks = [...tasks, { id: savedTask.id, ...newTask }];
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
  
      setNewTask({ title: "", description: "", points: "", dueDate: "", imageUrl: "" });
      setIsModalOpen(false);
    } catch (e) {
      console.error("Error saving task:", e);
    }
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
      {/* Search Bar */}
      <div className={styles.topSection}>
        <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearch} type={"tasks"} />
      </div>
      <div className={styles.tasksGrid}>
        {/* Add Button */}
        <div className={styles.addButton} onClick={() => setIsModalOpen(true)}>
          <span className={styles.addButtonText}>+</span>
        </div>

        {/* Render Filtered Tasks */}
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={styles.taskCard}
            onClick={() => handleTaskClick(task)} // Open task detail modal on click
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
                Description:
                <textarea
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  className={styles.textarea}
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
            <p style={{color:DARK_PURPLE, fontWeight:'bold', fontSize:'18px'}}> {selectedTask.title}</p>
            <p style={{color:RED, fontWeight:'bold', marginTop:'0px'}}>{selectedTask.points} pts</p>
            <hr style={{color:DARK_PURPLE, }} />

            <p className={styles.taskDetail}><strong>Description:</strong> {selectedTask.description}</p>
            <p style={{color:RED, fontWeight:'bold'}}>Due By: {selectedTask.dueDate}</p>
           <button className='button' style={{fontWeight:'bold', fontSize:20, width:'100%', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',}}>View Details</button>
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

export default Tasks;
