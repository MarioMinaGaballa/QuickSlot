import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/navbar'; // اتأكد إن الاسم مطابق للملف ع الديسك
import SignUp from './pages/signUp';     // اتأكد إن الاسم مطابق للملف ع الديسك
import Login from './pages/login';
import ResetPassword from './pages/resetPassword';


function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <Routes>
          <Route path="/" element={<div className="text-center mt-20 text-2xl">Welcome to QuickSlot</div>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;