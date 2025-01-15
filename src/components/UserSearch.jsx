import React, { useState } from 'react';
import { fetchMainCollection } from '../utils/firebaseUtils'; // Import the fetchCollection function
import { LIGHT_PURPLE } from '../constants/colors';

const UserSearch = ({ setUserId, setMessage }) => {
  const [users, setUsers] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Search button click
  const handleSearch = async () => {
    setLoading(true);
    setError('');

    try {
      const filters = {};
      if (nameFilter) filters.name = nameFilter.toLowerCase();
      if (classFilter) filters.class = classFilter.toLowerCase();

      const result = await fetchMainCollection('users'); // Ensure the correct collection name

      // Safely filter users
      const filteredUsers = result.filter((user) => {
        const nameMatch =
          filters.name && user.name ? user.name.toLowerCase().includes(filters.name) : true;
        const classMatch =
          filters.class && user.class ? user.class.toLowerCase().includes(filters.class) : true;
        return nameMatch && classMatch;
      });

      setUsers(filteredUsers); // Update the state with filtered users
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={styles.subHeading}>Search Users</h2>

      {/* Search Filters */}
      <div>
        <label style={{color: 'black', fontWeight: 'bold'}}>Name: </label>
        <input
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="Search by Name"
        />
      </div>

      <div>
        <label style={{color: 'black', fontWeight: 'bold'}}>Class: </label>
        <input
          type="text"
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          placeholder="Search by Class"
        />
      </div>

      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display Search Results */}
      <div>
        <h3>Users</h3>
        <ul>
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user.id}>
                <strong style={{color:'black'}}>{user.name} {user.userId}</strong> 
                <button onClick={() => setUserId(user.id)}>Manage</button>
              </li>
            ))
          ) : (
            <p style={{color:'black'}}>No users found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  subHeading: {
    color: LIGHT_PURPLE,
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'left', // Align the text to the left
  },
};

export default UserSearch;
