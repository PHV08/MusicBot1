const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Function to get bot statistics
function getBotStats() {
    try {
        // Try to get stats from the main bot process
        const statsPath = path.join(__dirname, '..', 'Data', 'bot-stats.json');
        if (fs.existsSync(statsPath)) {
            return JSON.parse(fs.readFileSync(statsPath, 'utf8'));
        }
    } catch (error) {
        console.error('Error reading bot stats:', error);
    }
    
    // Return default stats if file doesn't exist
    return {
        status: 'Online',
        uptime: '0m',
        guilds: 0,
        users: 0,
        voiceConnections: 0,
        songsPlayed: 0,
        commandsUsed: 0,
        lastRestart: new Date().toISOString()
    };
}

// Function to get 24/7 channels
function get247Channels() {
    try {
        const dataPath = path.join(__dirname, '..', 'Data', '247.json');
        if (fs.existsSync(dataPath)) {
            return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        }
    } catch (error) {
        console.error('Error reading 24/7 data:', error);
    }
    return { servers: [] };
}

// Routes
app.get('/', (req, res) => {
    const stats = getBotStats();
    const channels247 = get247Channels();
    
    res.render('dashboard', {
        stats,
        channels247: channels247.servers || [],
        pageTitle: 'Discord Music Bot Dashboard'
    });
});

app.get('/api/stats', (req, res) => {
    const stats = getBotStats();
    res.json(stats);
});

app.get('/commands', (req, res) => {
    res.render('commands', {
        pageTitle: 'Bot Commands'
    });
});

app.get('/servers', (req, res) => {
    const channels247 = get247Channels();
    res.render('servers', {
        channels247: channels247.servers || [],
        pageTitle: 'Server Management'
    });
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
    console.log('Dashboard client connected');
    
    // Send initial stats
    socket.emit('statsUpdate', getBotStats());
    
    // Send stats every 30 seconds
    const statsInterval = setInterval(() => {
        socket.emit('statsUpdate', getBotStats());
    }, 30000);
    
    socket.on('disconnect', () => {
        console.log('Dashboard client disconnected');
        clearInterval(statsInterval);
    });
});

const PORT = process.env.DASHBOARD_PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 Dashboard running on http://localhost:${PORT}`);
});

module.exports = { app, server, io };