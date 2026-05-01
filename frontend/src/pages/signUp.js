import React, { useState } from 'react';
import { signUp } from '../services/api';

const SignUp = () => {
    const [formData, setFormData] = useState({
        FullName: '', Email: '', Password: '', UserRole: 'Customer'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signUp(formData);
            alert("Registration successful!");
        } catch (err) {
            alert(err.response?.data?.error || "An error occurred");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create New Account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Join us and start booking your appointments
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input 
                                name="FullName" 
                                type="text" 
                                required 
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" 
                            />
                        </div>

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
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input 
                                name="Phone Number" 
                                type="tel" 
                                required 
                                onChange={handleChange}
                                placeholder="01012345678"
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700">User Role</label>
                            <select 
                                name="UserRole" 
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="Customer">Customer</option>
                                <option value="Provider">Provider</option>
                            </select>
                        </div>

                        <button 
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;