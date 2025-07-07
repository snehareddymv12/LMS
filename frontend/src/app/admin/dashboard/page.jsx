'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const AdminDashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'admin') {
        router.push('/login');
      }
    } catch (error) {
      console.error('Invalid token:', error);
      router.push('/login');
    }
  }, []);

  const handleGroupNavigation = () => {
    router.push('/admin/group');
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-blue-800">Welcome Admin 🛠️</h1>

      <button
        onClick={handleGroupNavigation}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow"
      >
        ➕ Create or Manage Groups
      </button>
    </div>
  );
};

export default AdminDashboard;
