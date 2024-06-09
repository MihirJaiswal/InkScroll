// server.js
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const mangaRoutes = require('./routes/mangaRoutes');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json({ extended: false }));

// Static folder for images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mangas', mangaRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
