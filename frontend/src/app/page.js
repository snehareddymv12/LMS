'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-2 text-blue-800">Welcome to Zapcom 🚀</h1>
      <p className="text-lg text-gray-600 mb-6">Please log in or register to continue</p>

      <div className="flex gap-4">
        <button
          onClick={() => router.push('/login')}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          🔐 Login
        </button>

        <button
          onClick={() => router.push('/register')}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
        >
          📝 Register
        </button>
      </div>
    </div>
  );
}
