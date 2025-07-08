'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const UserDashboard = () => {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState({});

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'user') {
        router.push('/login');
        return;
      }

      axios
        .get('https://lms-bcnd.onrender.com/api/course/assigned', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setCourses(res.data.courses))
        .catch((err) => {
          console.error('Error loading courses', err);
          setError('❌ Failed to load courses');
        });

      const stored = JSON.parse(localStorage.getItem('completedCourses') || '{}');
      setCompleted(stored);
    } catch (err) {
      console.error('Invalid token:', err);
      router.push('/login');
    }
  }, [router]);

  const toggleComplete = (courseId) => {
    const updated = { ...completed, [courseId]: !completed[courseId] };
    setCompleted(updated);
    localStorage.setItem('completedCourses', JSON.stringify(updated));
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">🎓 Welcome Learner</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {courses.length === 0 ? (
        <p className="text-gray-600">No assigned courses yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className={`bg-white p-5 rounded-xl shadow border ${
                completed[course._id] ? 'border-green-500' : 'border-gray-300'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-blue-700">{course.title}</h3>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={completed[course._id] || false}
                    onChange={() => toggleComplete(course._id)}
                    className="mr-2"
                  />
                  Done
                </label>
              </div>

              <p className="text-sm text-gray-600 mb-2">{course.description}</p>

              {course.uploadedBy?.name && (
                <p className="text-xs text-gray-500 mb-2">
                  Instructor: {course.uploadedBy.name}
                </p>
              )}

              <div className="relative pt-[56.25%]">
                {course.videoUrl.includes('youtube.com/embed') ? (
                  <iframe
                    src={course.videoUrl}
                    title={course.title}
                    className="absolute top-0 left-0 w-full h-full rounded"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={course.videoUrl}
                    controls
                    className="absolute top-0 left-0 w-full h-full rounded bg-black"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
