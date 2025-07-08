'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminGroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  useEffect(() => {
    if (!token) return;

    axios
      .get('https://lms-bcnd.onrender.com/api/admin/groups', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setGroups(res.data.groups))
      .catch((err) => console.error('Failed to load groups:', err));
  }, [token]);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">👥 Admin - Created Groups</h2>

      {groups.length === 0 ? (
        <p className="text-gray-600">No groups found.</p>
      ) : (
        <ul className="grid md:grid-cols-2 gap-6">
          {groups.map((group) => (
            <li key={group._id} className="bg-white border p-5 rounded-xl shadow">
              <h3 className="text-xl font-semibold text-blue-700 mb-2">{group.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Total Users: {group.users?.filter(Boolean).length || 0}
              </p>

              {group.users?.filter(Boolean).length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  {group.users.filter(Boolean).map((user, index) => (
                    <li key={user._id || index}>
                      <span className="font-medium">{user.name || 'Unknown'}</span> ({user.email || 'N/A'})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-red-500">No users assigned.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminGroupsPage;
