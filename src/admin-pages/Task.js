import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DARK_PURPLE, RED } from '../constants/colors';
import { FaRegTrashCan } from 'react-icons/fa6';
import { updateMainRecord, deleteMainRecord } from '../utils/firebaseUtils';
import ApplicationsTable from '../components/ApplicationsTable';
import { useAuth } from '../context/authContext';
const Task = () => {
  const location = useLocation();
  const task = location.state?.task;
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const {user} = useAuth();

  if (!task) {
    return <div>Task not found.</div>;
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleSave = async () => {
    try {
      // Save the edited task in the database
      await updateMainRecord('tasks', editedTask.id, editedTask);
      alert('Task successfully updated!');
      
      // Optionally, navigate or refresh the task
      navigate(`/task/${editedTask.id}`, { state: { task: editedTask } });
      
      // Set editing to false, or do other logic here
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
      alert('There was an issue updating the task. Please try again.');
    }
  };
  

  const deleteTask = async () => {
    try {
      await deleteMainRecord('tasks', task.id);
      alert('Task successfully deleted!');
      setTimeout(() => navigate('/tasks'), 100);
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('There was an issue deleting the task. Please try again.');
    }
  };

  return (
    <div>
    <div style={styles.container}>
      <div style={styles.leftContainer}>
        {task.imageUrl ? (
          <img src={task.imageUrl} alt={task.title} style={styles.image} />
        ) : (
          <div style={{ ...styles.image, ...styles.placeholder }}></div>
        )}
      </div>
      <div style={styles.rightContainer}>
        {isEditing ? (
          <>
            <input
              type="text"
              name="title"
              value={editedTask.title}
              onChange={handleChange}
              style={styles.editInput}
            />
            <textarea
              name="description"
              value={editedTask.description}
              onChange={handleChange}
              style={styles.editTextarea}
              maxLength={1000}
              placeholder='max 1000 char'
            />
            <input
              type="number"
              name="points"
              value={editedTask.points}
              onChange={handleChange}
              style={styles.editInput}
            />
            <input
              type="date"
              name="dueDate"
              value={new Date(editedTask.dueDate).toISOString().split('T')[0]}
              onChange={handleChange}
              style={styles.editInput}
            />
            <button onClick={handleSave} style={styles.saveButton}>
              Save
            </button>
          </>
        ) : (
          <>
            <h1 style={styles.title}>{task.title}</h1>
            <hr style={styles.divider} />
            <p style={styles.points}>
              <strong>{task.points} pts</strong>
            </p>
            <p style={styles.description}>
              <strong>Description:</strong> {task.description}
            </p>
            <p style={styles.dueDate}>
              <strong>Due By:</strong> {new Date(task.dueDate).toLocaleDateString()}
            </p>
            <div style={styles.buttonContainer}>
              <button style={styles.editButton} onClick={handleEditToggle}>
                Edit
              </button>
              <FaRegTrashCan style={styles.trashIcon} onClick={deleteTask} />
            </div>
          </>
        )}
      </div>
    </div>
    <div style={styles.container}>
      <ApplicationsTable user={user} taskId={task.id}/>

    </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px',
    maxWidth: '80%',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #ccc',
    marginTop: '20px',
  },
  leftContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#868bbd',
    borderRadius: '8px',
    padding: '10px',
  },
  rightContainer: {
    flex: 2,
    marginLeft: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: '250px',
    borderRadius: '8px',
    objectFit: 'contain',
  },
  placeholder: {
    backgroundColor: '#868bbd',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2a2a72',
    marginBottom: '10px',
  },
  divider: {
    width: '100%',
    border: '1px solid #2a2a72',
    margin: '10px 0',
  },
  points: {
    fontSize: '20px',
    color: RED,
    marginBottom: '10px',
  },
  description: {
    fontSize: '16px',
    marginBottom: '10px',
    color: '#333',
  },
  dueDate: {
    fontSize: '16px',
    marginBottom: '20px',
    color: RED,
    fontWeight: 'bold',
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  editButton: {
    backgroundColor: DARK_PURPLE,
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  trashIcon: {
    fontSize: '20px',
    color: RED,
    cursor: 'pointer',
  },
  editInput: {
    width: '80%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  editTextarea: {
    width: '80%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    height: '100px',
    resize: 'none',
  },
  saveButton: {
    backgroundColor: DARK_PURPLE,
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Task;
