'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
  });

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  // Fetch courses
  useEffect(() => {
    if (!token) return;

    axios
      .get('http://localhost:4000/api/course/instructor', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setCourses(res.data.courses))
      .catch((err) => console.error(err));
  }, [token]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost:4000/api/course/upload',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Course uploaded successfully');
      setCourses([res.data.course, ...courses]); // Add new course to top
      setForm({ title: '', description: '', videoUrl: '' }); // Clear form
    } catch (err) {
      console.error(err);
      alert('Failed to upload course');
    }
  };

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Delete course
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      await axios.delete(`http://localhost:4000/api/course/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCourses((prev) => prev.filter((c) => c._id !== id));
      alert('Course deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to delete course');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📚 Instructor Dashboard</h2>

      {/* Upload Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow space-y-4 mb-6"
      >
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Course Title"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Course Description"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="url"
          name="videoUrl"
          value={form.videoUrl}
          onChange={handleChange}
          placeholder="Video URL (e.g., YouTube link)"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Upload Course
        </button>
      </form>

      {/* Display Uploaded Courses */}
      <ul className="space-y-4">
        {courses.map((course) => (
          <li key={course._id} className="border p-3 rounded bg-white shadow">
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <p>{course.description}</p>
            <a
              href={course.videoUrl}
              className="text-blue-500 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch Video
            </a>
            <br />
            <button
              onClick={() => handleDelete(course._id)}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InstructorDashboard;
