


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import the modular API routes
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Middlewares
app.use(cors({ origin: '*' }));
// Limit increased to 50mb to comfortably handle Base64 PDF and Image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Mount API Routes
app.use('/api', apiRoutes);

// ==========================================
// CPANEL DEPLOYMENT / PRODUCTION SETUP
// ==========================================
// When running in production (like on cPanel), the Node server acts as both 
// the API backend AND the file server for the React frontend.
if (process.env.NODE_ENV === 'production') {
    // Point to the Vite 'dist' folder (one level up from backend into frontend)
    const frontendDistPath = path.join(__dirname, '../frontend/dist');

    // Serve the static files from the React build
    app.use(express.static(frontendDistPath));

    // Handle React Router: Send all other requests to index.html so React can take over routing
    // ✅ FIX: Changed the string '*' to a Regular Expression /.*/ to prevent path-to-regexp crashes
    app.get(/.*/, (req, res) => {
        res.sendFile(path.resolve(frontendDistPath, 'index.html'));
    });
} else {
    // Development fallback message if accessing root directly
    app.get('/', (req, res) => {
        res.send('Ngo API is running in Development mode...');
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    if (process.env.NODE_ENV === 'production') {
        console.log(`🌍 Running in Production Mode (Ready for cPanel/Internet)`);
    }
});