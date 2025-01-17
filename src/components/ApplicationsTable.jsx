import React, { useEffect, useState } from 'react';
import { fetchMainCollection, updateMainRecord } from '../utils/firebaseUtils'; // Add necessary fetch functions
import { FaCheck, FaTimes } from 'react-icons/fa';
import { RED } from '../constants/colors';
import { GiCheckMark } from 'react-icons/gi';
const ApplicationsTable = ({ user, taskId }) => {
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending'); // Default filter is 'pending'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchMainCollection('users');
        setUsers(userData);

        // Filter for admins
        const adminData = userData.filter(user => user.admin);
        setAdmins(adminData);

        // Fetch applications based on user's class or all if no class
        const allApplications = await fetchMainCollection('applications');
        const taskApplications = allApplications.filter(app => app.taskId === taskId);

        if (user?.class) {
          // Filter applications by class if the admin has one
          const filteredApplications = taskApplications.filter(app => app.class === user.class);
          setApplications(filteredApplications);
        } else {
          // Show all applications if no class
          setApplications(taskApplications);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (applicationId) => {
    await updateMainRecord('applications', applicationId, {
      status: 'approved',
      statusUpdateDate: new Date().toISOString(),
    });
    alert('Application approved successfully!');
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? { ...app, status: 'approved', statusUpdateDate: new Date().toISOString() }
          : app
      )
    );
  };

  const handleReject = async (applicationId) => {
    await updateMainRecord('applications', applicationId, {
      status: 'rejected',
      statusUpdateDate: new Date().toISOString(),
    });
    alert('Application rejected successfully!');
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? { ...app, status: 'rejected', statusUpdateDate: new Date().toISOString() }
          : app
      )
    );
  };

  const getResidentName = (residentId) => {
    const resident = users.find((user) => user.userId === residentId);
    return resident ? resident.name : 'Unknown';
  };

  const getFormTeacher = (className) => {
    const formTeacher = admins.find((admin) => admin.class === className);
    return formTeacher ? formTeacher.name : 'No form teacher';
  };

  const filteredApplications = applications.filter(
    (application) => application.status === statusFilter || statusFilter === 'all'
  );

  return (
    <div style={pageStyles.outerContainer}>
      <h2>Applications</h2>

      <label>
        Filter by Status:
        <select
        style={{marginLeft:'10px'}}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </label>


      <div style={{ overflow: 'auto', maxHeight: '400px', marginTop:'20px' }}>
        <table style={pageStyles.table}>
          <thead>
            <tr>
            <th style={pageStyles.th}>Resident Name</th>
        <th style={pageStyles.th}>Class</th>
        <th style={pageStyles.th}>Form Teacher</th>
        <th style={pageStyles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((application) => (
              <tr key={application.id}>
 <td style={pageStyles.td}>{getResidentName(application.residentID)}</td>
          <td style={pageStyles.td}>{application.class}</td>
          <td style={pageStyles.td}>{getFormTeacher(application.class)}</td>
          <td style={pageStyles.td}>
  {application.status === 'pending' ? (
    <div style={pageStyles.actionButtons}>
      <button
        style={{ ...pageStyles.button, backgroundColor: '#1c660d' }}
        onClick={() => handleApprove(application.id)}
      >
        <GiCheckMark style={pageStyles.icon} /> Approve
      </button>
      <button
        style={{ ...pageStyles.button, backgroundColor: RED }}
        onClick={() => handleReject(application.id)}
      >
        <FaTimes style={{ marginRight: '8px' }} /> Reject
      </button>
    </div>
  ) : (
    <button style={pageStyles.disabledButton} disabled>
      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
    </button>
  )}
</td>

              </tr>
            ))}
          </tbody>
        </table>
        {filteredApplications.length === 0 && <p>No applications</p>}

      </div>
    </div>
  );
};
const pageStyles = {
  outerContainer: {
    color: 'black',
    padding: '20px',
    overflow:'auto',
    maxHeight:'400px',
    width:'100%'
  },
  actionButtons: {
    display: 'flex',
    gap: '10px', // Space between buttons
  },
  button: {
    backgroundColor: '#1c660d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '115px', 
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: 'gray',
    color: 'white',
    cursor: 'not-allowed',
    width: '115px', 
    textAlign: 'center',
  },
  icon: {
    fontSize: '12px', // Adjust icon size independently
    marginRight: '8px', // Space between icon and text
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

export default ApplicationsTable;
