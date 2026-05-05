const sql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const addAvailability = async (req, res) => {
  try {
    const { DayOfWeek, StartTime, EndTime } = req.body;

    console.log("Full User Object from Middleware:", req.user);

    const providerId = req.user.id;

    // 2. اطبع الـ providerId لوحده
    console.log("Extracted Provider ID:", providerId);

    if (!providerId) {
      return res.status(400).json({ error: "Provider ID is missing from token" });
    }

    const pool = await sql.connect();

    // تأكد إن الترتيب هنا هو نفس الترتيب اللي في الـ Query تحت
    await pool.request()
      .input('ProviderID', sql.Int, providerId)           // ده رقم (5)
      .input('DayOfWeek', sql.NVarChar, DayOfWeek)        // ده نص ('Sunday')
      .input('StartTime', sql.VarChar, StartTime)         // ده نص ('12:00')
      .input('EndTime', sql.VarChar, EndTime)             // ده نص ('03:00')
      .query(`
        INSERT INTO Availability (ProviderID, DayOfWeek, StartTime, EndTime) 
        VALUES (@ProviderID, @DayOfWeek, @StartTime, @EndTime)
    `);

    res.status(201).json({ message: "Availability added successfully" });
  } catch (error) {
    console.error("SQL Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addAvailability
}