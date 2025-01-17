import React, { useEffect, useState } from 'react';
import { fetchMainCollection, fetchMainRecord } from '../utils/firebaseUtils'; // Import the necessary functions
import { FaCheck, FaTimes } from 'react-icons/fa';
import { RED } from '../constants/colors';
import { GiCheckMark } from 'react-icons/gi';
import "../styles/tableStyles.css"
import { useAuth } from '../context/authContext';

const AuditLogTable = () => {
  const { user } = useAuth();
  const [completedTasks, setCompletedTasks] = useState([]);
  const [users, setUsers] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await fetchMainCollection('users');
        setUsers(users)

        // Fetch applications and filter by status
        const allApplications = await fetchMainCollection('applications');
        const completedApplications = allApplications.filter(app => app.status === 'approved');

        if (user?.class) {
          // If the user has a class, filter by class
          const filteredApplications = completedApplications.filter(app => app.class === user.class);
          setCompletedTasks(await getTaskDetails(filteredApplications));
        } else {
          // Otherwise, show all completed applications
          setCompletedTasks(await getTaskDetails(completedApplications));
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [user]);

  // Helper function to fetch task details for each application
  const getTaskDetails = async (applications) => {
    const tasksDetails = [];
    for (let application of applications) {
      try {
        const task = await fetchMainRecord('tasks', application.taskId);
        console.log("task", task)
        tasksDetails.push({
          completedDate: application.applicationDate.toDate().toISOString().split("T")[0],
          residentName: getResidentName(application.residentID),
          taskTitle: task.title,
          taskType: task.category,
          points: task.points,
        });
      } catch (error) {
        console.error('Error fetching task details: ', error);
      }
    }
    return tasksDetails;
  };

  // Helper function to get resident name by residentID
  const getResidentName = (residentId) => {
    const resident = users.find(user => user.userId === residentId);
    return resident ? resident.name : 'Unknown';
  };

  return (
    <div style={pageStyles.outerContainer}>
      <h2>Completed Tasks</h2>

      <div style={{ overflow: 'auto', maxHeight: '400px', marginTop: '20px' }}>
        <table style={pageStyles.table}>
          <thead>
            <tr>
              <th style={pageStyles.th}>Completed Date</th>
              <th style={pageStyles.th}>Resident Name</th>
              <th style={pageStyles.th}>Task Title</th>
              <th style={pageStyles.th}>Task Type</th>
              <th style={pageStyles.th}>Points</th>
            </tr>
          </thead>
          <tbody>
            {completedTasks.length > 0 ? completedTasks.map((task, index) => (
              <tr key={index} className={index % 2 === 0 ? "odd-row" : "even-row"}>
                <td style={pageStyles.td}>{task.completedDate}</td>
                <td style={pageStyles.td}>{task.residentName}</td>
                <td style={pageStyles.td}>{task.taskTitle}</td>
                <td style={pageStyles.td}>{task.taskType}</td>
                <td style={pageStyles.td}>{task.points}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={pageStyles.td}>No completed tasks found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const pageStyles = {
  outerContainer: {
    color: 'black',
    padding: '20px',
    overflow: 'auto',
    maxHeight: '400px',
    width: '100%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#f4f4f4',
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left',
  }
};

export default AuditLogTable;
