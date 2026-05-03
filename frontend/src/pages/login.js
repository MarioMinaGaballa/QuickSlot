import React, { useState } from 'react';
import { login } from '../services/api'; // اتأكد إن الـ api.js فيها function اسمها login
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        Email: '', Password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(formData);
            const { token, user } = response.data;
            // بنخزن بيانات المستخدم والـ Token عشان الـ NavBar والـ Auth
        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            alert("Login successful!");
            navigate('/'); // وديه على الصفحة الرئيسية بعد النجاح
            window.location.reload(); // عشان الـ NavBar يحس بالتغيير فوراً
        }
        } catch (err) {
            alert(err.response?.data?.error || "Invalid email or password");
        }
    };
    const handleSend = () => {
        navigate('/forgotPassword');
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Login to Your Account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}
                    <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                        create a new account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input 
                                name="Email" 
                                type="email" 
                                required 
                                onChange={handleChange}
                                placeholder="mario@example.com"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input 
                                name="Password" 
                                type="password" 
                                required 
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" 
                            />
                        </div>

                        <button 
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                        >
                            Login
                        </button>

                    
                    </form>
                    <br />
                        <button  onClick={handleSend}
                            type="button"
                            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-300 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                        >
                            Forgot password
                        </button>
                </div>
            </div>
        </div>
    );
};

export default Login;