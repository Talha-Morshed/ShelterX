import './UserList.css';

const UserList = ({ users, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return <div className="loading">Loading users...</div>;
  }

  if (!users || users.length === 0) {
    return <div className="no-data">No users found. Add one to get started!</div>;
  }

  return (
    <div className="user-list">
      <h2>Users</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.phone || '—'}</td>
                <td>{user.role}</td>
                <td className="actions-cell">
                  <button className="btn btn-edit" onClick={() => onEdit(user)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${user.full_name}"?`)) {
                        onDelete(user.user_id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
