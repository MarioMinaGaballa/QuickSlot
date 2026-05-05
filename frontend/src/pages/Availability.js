import React, { useState } from 'react';
import axios from 'axios';

const AddAvailability = () => {
    const [formData, setFormData] = useState({
        DayOfWeek: '',
        StartTime: '',
        EndTime: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Button Clicked! Data:", formData);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/availability/add', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Availability added successfully!')
        } catch (error) {
            console.error("Error adding availability:", error);
            alert('Error adding availability');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-2xl border border-gray-700 w-full max-w-md shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">Add Available Time</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-gray-400 block mb-1">Day</label>
                        <select 
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 outline-none focus:border-indigo-500"
                            onChange={(e) => setFormData({...formData, DayOfWeek: e.target.value})}
                        >
                            <option value="">Choose Day</option>
                            <option value="Sunday">Sunday</option>
                            <option value="Monday">Monday</option>
                              <option value="Tuesday">Tuesday</option>
                              <option value="Wednesday">Wednesday</option>
                              <option value="Thursday">Thursday</option>
                              <option value="Friday">Friday</option>
                              <option value="Saturday">Saturday</option>
                          
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-gray-400 block mb-1">From</label>
                            <input 
                                type="time" 
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3"
                                onChange={(e) => setFormData({...formData, StartTime: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-gray-400 block mb-1">To</label>
                            <input 
                                type="time" 
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3"
                                onChange={(e) => setFormData({...formData, EndTime: e.target.value})}
                            />
                        </div>
                    </div>

                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all mt-4" type="submit">
                        Add Availability
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAvailability;