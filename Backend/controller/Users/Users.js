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
//add send email to user after registration
const signUp = async (req, res) => {
    try {
        const { FullName, Email, Password, UserRole, PhoneNumber } = req.body;

        // 1. تشفير الباسورد
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(Password, salt);

        const pool = await sql.connect(); 
        await pool.request()
            .input('FullName', sql.NVarChar, FullName)
            .input('Email', sql.NVarChar, Email)
            .input('PasswordHash', sql.NVarChar, passwordHash)
            .input('UserRole', sql.NVarChar, UserRole || 'Customer')
            .input('PhoneNumber', sql.NVarChar, PhoneNumber)
            .query(`
                INSERT INTO Users (FullName, Email, PasswordHash, UserRole, PhoneNumber)
                VALUES (@FullName, @Email, @PasswordHash, @UserRole, @PhoneNumber)
            `);

        console.log('User registered successfully!', Email);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS 
            }
        });

        const mailOptions = {
            from: `"QuickSlot Support" <${process.env.EMAIL_USER}>`,
            to: Email,
            subject: 'Welcome to QuickSlot!',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h2 style="color: #4f46e5;">Welcome to QuickSlot, ${FullName}!</h2>
                    <p>Thank you for registering with us. We're excited to have you on board.</p>
                    <p>You can now log in to your account and start booking your slots.</p>
                    <p>Best regards,<br/><strong>The QuickSlot Team</strong></p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ message: "User registered successfully and welcome email sent!" });

    } catch (err) {
        if (err.message.includes('UNIQUE KEY')) {
            return res.status(400).json({ error: "Email already exists!" });
        }
        console.error("Signup Error:", err);
        if (!res.headersSent) {
            return res.status(500).json({ error: "Registration failed" });
        }
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
    const { token, NewPassword } = req.body;
    
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

  
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(NewPassword, salt);

    
    const pool = await sql.connect();
    
    const userQuery = await pool.request()
      .input('UserID', sql.Int, userId)
      .query(`SELECT Email FROM Users WHERE UserID = @UserID`);

    if (userQuery.recordset.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userEmail = userQuery.recordset[0].Email;

    // تنفيذ التحديث
    const updateResult = await pool.request()
      .input('UserID', sql.Int, userId)
      .input('PasswordHash', sql.NVarChar, passwordHash)
      .query(`UPDATE Users SET PasswordHash = @PasswordHash WHERE UserID = @UserID`);

    if (updateResult.rowsAffected[0] === 0) {
      return res.status(400).json({ message: 'Error updating password' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
      }
    });

    const mailOptions = {
      from: `"QuickSlot Support" <${process.env.EMAIL_USER}>`,
      to: userEmail, // استخدمنا الإيميل اللي جبناه من القاعدة
      subject: 'Password Reset Successful',
      html: `<h2>Password Reset Successful</h2><p>Your password has been reset successfully.</p>`
    };

    await transporter.sendMail(mailOptions); 
    return res.status(200).json({ message: 'Password reset successfully and email sent' });

  } catch (error) {
    console.log("Full Error:", error);
    // نتحقق إذا كان الرد قد أرسل بالفعل أم لا لتجنب خطأ Headers
    if (!res.headersSent) {
      return res.status(400).json({ 
        message: 'Invalid or expired token', 
        error: error.message 
      });
    }
  }
};


//forget password (هتكون endpoint منفصلة بتستقبل الإيميل وبترسل إيميل فيه رابط لتغيير الباسورد مع توكين خاص بيه)
const forgotPassword = async (req, res) => {
  console.log("Request received for email:", req.body.Email);
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
    const token = jwt.sign({ id: user.UserID }, process.env.JWT_SECRET, { expiresIn: '1h' });
console.log("Token received:", token);
console.log("Secret used:", process.env.JWT_SECRET);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
      }
    });

    const resetUrl = `http://localhost:3000/resetPassword/${token}`;

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