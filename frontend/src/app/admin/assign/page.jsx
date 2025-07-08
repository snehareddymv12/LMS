'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminAssignPage = () => {
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [message, setMessage] = useState('');

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  useEffect(() => {
    if (!token) return;

    // Load all courses
    axios
      .get('https://lms-bcnd.onrender.com/api/course/all', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCourses(res.data.courses))
      .catch((err) => console.error('Courses error:', err));

    // Load all groups
    axios
      .get('https://lms-bcnd.onrender.com/api/admin/groups', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setGroups(res.data.groups))
      .catch((err) => console.error('Groups error:', err));
  }, [token]);

  const handleAssign = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post(
        'https://lms-bcnd.onrender.com/api/course-assign/assign', // ✅ UPDATED route
        {
          courseId: selectedCourse,
          groupId: selectedGroup,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('✅ Course assigned to group!');
    } catch (err) {
      console.error('Assignment error:', err);
      setMessage(
        err.response?.data?.message || '❌ Failed to assign course'
      );
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">
        📌 Assign Course to Group
      </h2>

      <form
        onSubmit={handleAssign}
        className="space-y-6 bg-white p-6 rounded shadow max-w-md"
      >
        {/* Course Selector */}
        <div>
          <label className="block mb-1 font-medium">Select Course</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            required
          >
            <option value="">-- Choose Course --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Group Selector */}
        <div>
          <label className="block mb-1 font-medium">Select Group</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            required
          >
            <option value="">-- Choose Group --</option>
            {groups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Assign Course
        </button>
      </form>

      {/* Success / Error Message */}
      {message && (
        <p
          className={`mt-4 font-medium ${
            message.startsWith('✅') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default AdminAssignPage;
