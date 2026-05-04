import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Profile response:", response.data);
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="text-white text-center mt-20">Loading Profile...</div>;

    return (
        // زودنا pt-24 عشان لو الـ Navbar ثابت ميتغطاش الكارت
        <div className="min-h-screen bg-gray-900 pt-24 pb-10 px-4">
            <div className="max-w-3xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-visible border border-gray-700">
                
                {/* Header/Cover */}
                <div className="h-40 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-t-2xl"></div>

                <div className="px-6 pb-8 relative">
                    {/* Profile Image / Avatar */}
                    <div className="relative flex justify-center md:justify-start">
                        {/* الـ z-10 والـ -mt-16 بيظبطوا مكان الصورة فوق الكفر */}
                        <div className="absolute -top-16 z-10">
                            <div className="w-32 h-32 bg-indigo-500 rounded-full border-4 border-gray-800 flex items-center justify-center text-5xl font-extrabold text-white shadow-2xl">
                                {user?.FullName?.charAt(0).toUpperCase() || "M"}
                            </div>
                        </div>
                    </div>

                    {/* User Info - زودنا mt-20 عشان الاسم ينزل تحت الصورة */}
                    <div className="mt-20 text-center md:text-left">
                        <h1 className="text-4xl font-bold text-white tracking-tight">
                            {user?.FullName || "User Name"}
                        </h1>
                        <p className="text-indigo-400 text-lg font-medium mt-1">
                            {user?.UserRole || 'Member'}
                        </p>
                    </div>

                    {/* Information Grid */}
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email Card */}
                        <div className="bg-gray-900/40 p-5 rounded-xl border border-gray-700 hover:border-indigo-500 transition-colors">
                            <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Email Address</p>
                            <p className="text-gray-100 font-medium mt-1 break-all">{user?.Email || "Not Available"}</p>
                        </div>

                        {/* Phone Card */}
                        <div className="bg-gray-900/40 p-5 rounded-xl border border-gray-700 hover:border-indigo-500 transition-colors">
                            <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Phone Number</p>
                            <p className="text-gray-100 font-medium mt-1">{user?.PhoneNumber || 'Not Provided'}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-12 flex flex-col sm:flex-row gap-4">
                        <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-500/25">
                            Edit Profile
                        </button>
                        <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95">
                            Account Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;