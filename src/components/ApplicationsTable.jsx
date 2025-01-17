import React, { useEffect, useState } from 'react';
import { fetchMainRecord, fetchMainCollection } from '../utils/firebaseUtils';  // Add necessary fetch functions
import { FaCheck, FaTimes } from 'react-icons/fa';

const ApplicationsTable = ({ user, taskId }) => {
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    // Fetch all users and admins (admins have userData.admin = true)
    const fetchData = async () => {
      try {
        const userData = await fetchMainCollection('users');
        setUsers(userData);

        // Filter for admins
        const adminData = userData.filter(user => user.admin);
        setAdmins(adminData);

        // Fetch applications based on user's class or all if no class
        const allApplications = await fetchMainCollection('applications').filter(app => app.taskId === taskId);
        
        if (user?.class) {
          // Filter applications by class if the admin has one
          const filteredApplications = allApplications.filter(app => app.class === user.class);
          setApplications(filteredApplications);
        } else {
          // Show all applications if no class
          setApplications(allApplications);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (applicationId) => {
    // Handle approval logic here (update the application record in Firestore)
    console.log(`Application ${applicationId} approved`);
  };

  const handleReject = async (applicationId) => {
    // Handle rejection logic here (delete the application record in Firestore)
    console.log(`Application ${applicationId} rejected`);
  };

  const getResidentName = (residentId) => {
    const resident = users.find(user => user.userId === residentId);
    return resident ? resident.name : 'Unknown';
  };

  const getFormTeacher = (className) => {
    const formTeacher = admins.find(admin => admin.class === className);
    return formTeacher ? formTeacher.name : 'No form teacher';
  };

  return (
    <div style={pageStyles.outerContainer}>
      <h2>Applications</h2>
      {applications.length === 0 && <p>No applications</p>}







      <table>
        <thead>
          <tr>
            <th>Resident Name</th>
            <th>Class</th>
            <th>Form Teacher</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td>{getResidentName(application.residentID)}</td>
              <td>{application.class}</td>
              <td>{getFormTeacher(application.class)}</td>
              <td>
                <button onClick={() => handleApprove(application.id)}>
                  <FaCheck /> Approve
                </button>
                <button onClick={() => handleReject(application.id)}>
                  <FaTimes /> Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const pageStyles = {
    outerContainer: {

        color: 'black',
      },
}

export default ApplicationsTable;
