'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Send login request to backend
      const response = await axios.post(`https://lms-backend-virid-eight.vercel.app/api/login/${role}`, {
        identifier: email,
        password,
      });

      const token = response.data.accessToken;

      // ✅ Save token to localStorage
      localStorage.setItem('token', token);

      // ✅ Redirect to dashboard based on role
      router.push(`/${role}/dashboard`);
    } catch (err) {
      alert('Login failed. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
    >
      <h2 className="text-2xl font-bold mb-2">Login</h2>

      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
        <option value="instructor">Instructor</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  );
}
