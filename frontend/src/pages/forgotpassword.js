import React, { useState } from 'react';
   import { forgotPassword } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // بننادي على الـ endpoint اللي عملناه في الـ Backend
      const response = await forgotPassword(email);
      
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-2xl font-bold text-white mb-8">
          Reset Your Password
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="Email" className="block text-sm/6 font-medium text-white">
              Email Address
            </label>
            <div className="mt-2">
              <div className="flex items-center rounded-md bg-white/5 pl-3 outline-1 -outline-offset-1 outline-gray-600 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                <input
                  id="Email"
                  name="Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-gray-600 transition duration-150"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-indigo-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}