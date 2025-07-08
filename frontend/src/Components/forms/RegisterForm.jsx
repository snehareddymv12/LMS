'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://lms-bcnd.onrender.com/api/login/${form.role}/signup`,
        form
      );

      alert('Registration successful!');
      router.push('/login');
    } catch (err) {
      alert('Registration failed. Please check your inputs.');
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
    >
      <h2 className="text-2xl font-bold mb-2">Register</h2>

      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
        <option value="instructor">Instructor</option>
      </select>

      <button
        type="submit"
        className="bg-green-600 text-white py-2 rounded w-full"
      >
        Register
      </button>
    </form>
  );
}
