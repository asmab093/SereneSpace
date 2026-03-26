const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
const supportRoutes=require("./routes/supportRoutes");
// 1. Load Environment Variables
dotenv.config();

// 2. Connect to Database
connectDB();

const app = express();

// 3. Middleware
app.use(express.json()); // Allows server to accept JSON data
app.use(cors());         // Allows Frontend to talk to Backend
app.use(morgan('dev'));  // Logs API requests in terminal

app.use('/api/auth', authRoutes); 
app.use("/api/support", supportRoutes);

// 4. Test Route (The "Connectivity Test" endpoint)
app.get('/api/test', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: "SereneSpace Backend is Live and Connected! 🌱" 
    });
});

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});