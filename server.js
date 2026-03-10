require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/students', require('./routes/studentRoutes'));

// Health check
app.get('/', (req, res) => res.json({ message: 'Students API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
