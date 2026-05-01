const sql = require('mssql'); // ده السطر اللي ناقصك!

require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: 1433, 
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false, // Local مش محتاج تشفير
        trustServerCertificate: true,
        enableArithAbort: true
    }
};
async function connectDB() {
    try {
        const pool = await sql.connect(dbConfig);
        console.log('Connected to SQL Server');
        return pool;
    } catch (error) {
        console.error('Error connecting to SQL Server:', error);
        throw error;
    }
}
module.exports = { sql, connectDB };