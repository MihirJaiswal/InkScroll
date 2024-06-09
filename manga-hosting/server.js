// server.js
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const mangaRoutes = require('./routes/mangaRoutes');
const pdfRouter = require('./routes/pdfRouter');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();


const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Include OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Disposition'], // Include any headers you need
    preflightContinue: false, // Pass the CORS preflight response to the next handler
    optionsSuccessStatus: 204 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));


// Apply CORS middleware
app.use(cors(corsOptions));

// Connect to database
connectDB();

// Middleware
app.use(express.json({ extended: false }));

// Static folder for images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mangas', mangaRoutes);
app.use('/api', pdfRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Log the CORS headers for debugging
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Disposition');
    console.log('CORS Headers set:', res.getHeaders()['access-control-allow-headers']);
    next();
});
