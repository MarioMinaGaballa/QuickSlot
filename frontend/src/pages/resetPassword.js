import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/api';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { token } = useParams(); // بياخد التوكين من رابط الإيميل أوتوماتيك
  const navigate = useNavigate();

console.log("Token from URL:", token); // لو ظهر undefined هنا يبقى المشكلة في الـ Route في App.js
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // لازم تبعت التوكين والباسورد الجديد زي ما الـ Backend مستني
          const response = await resetPassword(token, newPassword);
       console.log("API Response:", response); // عشان نشوف الرد من الـ Backend

      setMessage(response.data.message);
      // لو نجح، واديه لصفحة الـ login بعد ثانيتين
      setTimeout(() => navigate('/login'), 2000);
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
          Create New Password
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">
              New Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full rounded-md bg-white/5 border-gray-600 py-1.5 text-white shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600"
          >
            {loading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-indigo-400">{message}</p>
        )}
      </div>
    </div>
  );
}