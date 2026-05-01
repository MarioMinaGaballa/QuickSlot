const sql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
  try{
    const { Email, NewPassword } = req.body;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(NewPassword, salt);  
    const pool = await sql.connect();
    const result = await pool.request()
      .input('Email', sql.NVarChar, Email)
      .query(`SELECT * FROM Users WHERE Email = @Email`);
    const user = result.recordset[0];

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }else{

    const pool = await sql.connect();
    await pool.request()
      .input('Email', sql.NVarChar, Email)
      .input('PasswordHash', sql.NVarChar, passwordHash)
      .query(`UPDATE Users SET PasswordHash = @PasswordHash WHERE Email = @Email`);
      console.log('Password reset successfully!' , Email);
    res.status(200).json({ message: 'Password reset successfully' });
    }

  }catch(error){ 
    res.status(500).json({message: 'Error resetting password', error: error.message})
  }
}




module.exports = {
  getAllUsers,
  signUp,
  login,
  resetPassword
}