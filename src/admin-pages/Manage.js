import React, { useEffect, useState } from "react";
import BatchCreateUsers from "../components/BatchCreateUsers";
import SearchBar from "../components/SearchBar";
import { LIGHT_PURPLE, DARK_PURPLE } from "../constants/colors";
import axios from "axios";
import { fetchMainCollection } from "../utils/firebaseUtils";

const Manage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterAdmin, setFilterAdmin] = useState("");
  const [message, setMessage] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    class: "",
    admission_date: "",
    birthday: "",
    admin: false,
    email: "",
  });
  

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await fetchMainCollection("users");
      setUsers(data || []);
    };
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/createUser", newUser);
      if (response.data.success) {
        alert("User added successfully!");
        setUsers((prev) => [...prev, response.data.user]);
        setNewUser({
          name: "",
          class: "",
          admission_date: "",
          birthday: "",
          admin: false,
          email: "",
        });
      } else {
        alert(response.data.error || "Failed to add user");
      }
    } catch {
      alert("Failed to add user");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(`http://localhost:5001/deleteUser/${userId}`);
      if (response.data.success) {
        alert("User deleted successfully!");
        setUsers((prev) => prev.filter((user) => user.userId !== userId));
      } else {
        alert(response.data.error || "Failed to delete user");
      }
    } catch {
      alert("Failed to delete user");
    }
  };

  const handleResetPassword = async (userId, newPassword) => {
    try {
      const response = await axios.post(`http://localhost:5001/resetPassword/${userId}`, {
        newPassword,
      });
      if (response.data.success) {
        alert("Password reset successfully!");
      } else {
        alert(response.data.error || "Failed to reset password");
      }
    } catch {
      alert("Failed to reset password");
    }
  };

  const filteredUsers = users
    .filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((user) => (filterClass ? user.class === filterClass : true))
    .filter((user) =>
      filterAdmin ? (filterAdmin === "admin" ? user.admin : !user.admin) : true
    );

  return (
    <div style={pageStyles.outerContainer}>
      <div style={pageStyles.innerContainer}>
        <h2 style={pageStyles.subHeading}> Manage Users</h2>

        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} type="user" />

        <div style={pageStyles.filterContainer}>
          <div style={pageStyles.filterGroup}>
            <label style={pageStyles.label}>Filter by Class:</label>
            <input
              type="text"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              placeholder="Enter class"
              style={pageStyles.input}
            />
          </div>
          <div style={pageStyles.filterGroup}>
            <label style={pageStyles.label}>Filter by Role:</label>
            <select
              value={filterAdmin}
              onChange={(e) => setFilterAdmin(e.target.value)}
              style={pageStyles.input}
            >
              <option value="">All</option>
              <option value="admin">Admin</option>
              <option value="resident">Resident</option>
            </select>
          </div>
        </div>

        <div style={pageStyles.tableWrapper}>
          <table style={pageStyles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Class</th>
                <th>Admission Date</th>
                <th>Birthday</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.userId}>
                  <td>{user.name}</td>
                  <td>{user.class || "N/A"}</td>
                  <td>{user.admissionDate || "N/A"}</td>
                  <td>{user.birthday || "N/A"}</td>
                  <td>{user.email || "N/A"}</td>
                  <td>{user.admin ? "Admin" : "Resident"}</td>
                  <td>
                    <div style={pageStyles.actionMenu}>
                      <button
                        style={pageStyles.button}
                        onClick={() =>
                          handleResetPassword(user.userId, prompt("Enter new password:"))
                        }
                      >
                        Change Password
                      </button>
                      <button
                        style={pageStyles.button}
                        onClick={() => handleDeleteUser(user.userId)}
                      >
                        Delete User
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={pageStyles.subHeading}>Create Users</h2>

     {/* Add New User Form */}
     <h3 >Add New User</h3>

<form style={pageStyles.form} onSubmit={handleAddUser}>
  <div style={pageStyles.formGroup}>
    <label style={pageStyles.label}>
      Name:
      <input
        type="text"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        style={pageStyles.input}
        required
      />
    </label>
    <label style={pageStyles.label}>
      Class:
      <input
        type="text"
        value={newUser.class}
        onChange={(e) => setNewUser({ ...newUser, class: e.target.value })}
        style={pageStyles.input}
      />
    </label>
    <label style={pageStyles.label}>
      Admission Date:
      <input
        type="date"
        value={newUser.admission_date}
        onChange={(e) =>
          setNewUser({ ...newUser, admission_date: e.target.value })
        }
        style={pageStyles.input}
      />
    </label>
    <label style={pageStyles.label}>
      Birthday:
      <input
        type="date"
        value={newUser.birthday}
        onChange={(e) =>
          setNewUser({ ...newUser, birthday: e.target.value })
        }
        style={pageStyles.input}
      />
    </label>
    <label style={pageStyles.label}>
      Email:
      <input
        type="email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        style={pageStyles.input}
        required
      />
    </label>
    <label style={pageStyles.label}>
      Role:
      <select
        value={newUser.admin ? "admin" : "resident"}
        onChange={(e) =>
          setNewUser({ ...newUser, admin: e.target.value === "admin" })
        }
        style={pageStyles.input}
      >
        <option value="resident">Resident</option>
        <option value="admin">Admin</option>
      </select>
    </label>
  </div>
  <div style={pageStyles.buttonContainer}>
    <button type="submit" style={pageStyles.button}>
      Add User
    </button>
  </div>
</form>

{message && <p style={pageStyles.message}>{message}</p>}


        <h3>Batch Create Users</h3>

        <div style={pageStyles.form}>
        <BatchCreateUsers />
        </div>

        {message && <p style={pageStyles.message}>{message}</p>}
      </div>
    </div>
  );
};

const pageStyles = {
  outerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    color: 'black',
  },
  innerContainer: {
    backgroundColor: '#fff',
    width: '80%',
    height: '80%',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20px',
  },
  subHeading: {
    color: LIGHT_PURPLE,
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    marginTop: '20px',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontSize: '14px',
    color: DARK_PURPLE,
  },
  input: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    marginLeft:'10px',
  },
  tableWrapper: {
    overflowX: 'auto',
    marginTop: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  actionMenu: {
    display: 'flex',
    gap: '10px',
  },
  button: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: LIGHT_PURPLE,
    color: '#fff',
    fontWeight: 'bold',
  },
  message: {
    color: 'red',
    marginTop: '10px',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
  },
  formGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  
};

export default Manage;
