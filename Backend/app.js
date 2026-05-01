const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT;
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');

app.use(cors());
app.use(express.json());
connectDB();

app.use('/api/users',userRoutes)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
