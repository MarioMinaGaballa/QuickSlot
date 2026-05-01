const sql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();


const getAllUsers = async (req, res) => {
  try{
     const result = await sql.query `SELECT * FROM Users`;
        res.status(200).json(result.recordset); 
  }catch(error){
    res.status(500).json({message: 'Error fetching users', error: error.message})
  }
} 

// create user insert
const signUp = async (req, res) => {
    try {
        const { FullName, Email, Password, UserRole, PhoneNumber } = req.body;

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(Password, salt);

        const pool = await sql.connect(); 
        await pool.request()
            .input('FullName', sql.NVarChar, FullName)
            .input('Email', sql.NVarChar, Email)
            .input('PasswordHash', sql.NVarChar, passwordHash)
            .input('UserRole', sql.NVarChar, UserRole || 'Customer') // Default Customer
            .input('PhoneNumber', sql.NVarChar, PhoneNumber)
            .query(`
                INSERT INTO Users (FullName, Email, PasswordHash, UserRole, PhoneNumber)
                VALUES (@FullName, @Email, @PasswordHash, @UserRole, @PhoneNumber)
            `);

        console.log('User registered successfully!' , Email);

        res.status(201).json({ message: "User registered successfully!"  });
                    
    } catch (err) {
        if (err.message.includes('UNIQUE KEY')) {
            return res.status(400).json({ error: "Email already exists!" });
        }
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
};

//Login user
const login = async (req, res) => {
  try{
    const { Email, Password } = req.body;

    const pool = await sql.connect();
    const result = await pool.request()
      .input('Email', sql.NVarChar, Email)
      .query(`SELECT * FROM Users WHERE Email = @Email`);
    const user = result.recordset[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    } 

    const isMatch = await bcrypt.compare(Password, user.PasswordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

     console.log('User logged in successfully!' , Email);
    res.status(200).json({ message: 'Login successful', token, user: { id: user.Id, FullName: user.FullName, Email: user.Email, UserRole: user.UserRole } });

  }catch(error){
    res.status(500).json({message: 'Error logging in', error: error.message})
  }
}



//get user by id


// update user  
// delete user





// reset password
const resetPassword = async (req, res) => {
  try {
    const { token, NewPassword } = req.body; // بنستلم التوكين بدل الإيميل

    // 1. فك التوكين والتأكد من صحته ووقت انتهاء صلاحيته
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // بناخد الـ ID اللي خبيناه جوه التوكين في الـ forgotPassword

    // 2. تشفير الباسورد الجديد
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(NewPassword, salt);

    // 3. التحديث في SQL Server بناءً على الـ ID
    const pool = await sql.connect();
    const result = await pool.request()
      .input('Id', sql.Int, userId) // بنستخدم الـ ID لضمان الدقة
      .input('PasswordHash', sql.NVarChar, passwordHash)
      .query(`UPDATE Users SET PasswordHash = @PasswordHash WHERE id = @Id`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'User not found or error updating' });
    }

    console.log('Password reset successfully for User ID:', userId);
    res.status(200).json({ message: 'Password reset successfully' });

  } catch (error) {
    // لو التوكين منتهي الصلاحية أو ملعوب فيه، هيطلع error هنا
    res.status(400).json({ message: 'Invalid or expired token', error: error.message });
  }
}



//forget password (هتكون endpoint منفصلة بتستقبل الإيميل وبترسل إيميل فيه رابط لتغيير الباسورد مع توكين خاص بيه)
const forgotPassword = async (req, res) => {
  const { Email } = req.body;

  try {
    const pool = await sql.connect();
    const result = await pool.request()
      .input('Email', sql.NVarChar, Email)
      .query('SELECT UserID FROM Users WHERE Email = @Email');

    const user = result.recordset[0];
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Create a secure token valid for 15 minutes
    const token = jwt.sign({ id: user.UserID }, process.env.JWT_SECRET, { expiresIn: '15m' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
      }
    });

    const resetUrl = `http://localhost:3000/reset-password/${token}`;

    const mailOptions = {
      from: `"QuickSlot Support" <${process.env.EMAIL_USER}>`,
      to: Email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset</h2>
          <p>You requested to reset your password for your QuickSlot account.</p>
          <p>Please click the button below to set a new password. This link is valid for 15 minutes:</p>
          <a href="${resetUrl}" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reset link sent to your email" });

  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Error sending email", error: error.message });
  }
};




module.exports = {
  getAllUsers,
  signUp,
  login,
  resetPassword,
  forgotPassword
}