'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const AdminGroupPage = () => {
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  // Fetch all users
  useEffect(() => {
    if (!token) return;

    axios
      .get('http://localhost:4000/api/group/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => setUsers(res.data.users))
      .catch((err) => {
        console.error(err);
        setMessage('❌ Failed to fetch users');
      });
  }, [token]);

  // Submit group creation
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        'http://localhost:4000/api/group/create',
        {
          name: groupName,
          userIds: selectedUsers
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      .then(() => {
        setMessage('✅ Group created successfully');
        setGroupName('');
        setSelectedUsers([]);
      })
      .catch((err) => {
        console.error(err);
        setMessage('❌ Group creation failed');
      });
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">👥 Create New Group</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow max-w-lg">
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <div>
          <h3 className="font-semibold mb-2">Select Users:</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto border p-2 rounded">
            {users.length === 0 ? (
              <p className="text-sm text-gray-500">No users found.</p>
            ) : (
              users.map((user) => (
                <label key={user._id} className="block">
                  <input
                    type="checkbox"
                    value={user._id}
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleUserSelect(user._id)}
                    className="mr-2"
                  />
                  {user.name} ({user.email})
                </label>
              ))
            )}
          </div>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Group
        </button>
      </form>

      {/* Message output */}
      {message && <p className="mt-4 font-semibold text-green-600">{message}</p>}

      {/* 🔗 Links section */}
      <div className="mt-6 flex space-x-6">
        <Link href="/admin/groups" className="text-blue-600 underline font-medium">
          📋 View Created Groups
        </Link>
        <Link href="/admin/assign" className="text-purple-600 underline font-medium">
          🎯 Assign Courses
        </Link>
      </div>
    </div>
  );
};

export default AdminGroupPage;
