# Discord Music Bot Dashboard

A professional web dashboard for monitoring and managing your Discord Music Bot.

## Features

### 📊 Real-time Monitoring
- Live bot statistics (servers, users, voice connections)
- System status monitoring (Lavalink, database)
- Command usage tracking
- Music session analytics

### ⚡ Command Reference
- Complete list of all bot commands
- Usage examples and syntax
- Available audio filters and effects
- Permission requirements

### 🏠 Server Management
- 24/7 voice channel monitoring
- Server activity tracking
- Bot configuration overview
- Management tools

### 🎨 Modern Interface
- Responsive design for all devices
- Real-time updates via WebSocket
- Professional gradient styling
- Interactive components

## Setup

The dashboard starts automatically with the Discord bot and runs on port 3000.

### Accessing the Dashboard

1. **Local Development**: http://localhost:3000
2. **Production**: Your server's domain on port 3000

### Environment Variables

The dashboard uses the same environment as the bot:
- `DISCORD_BOT_TOKEN` - Bot authentication
- `DASHBOARD_PORT` - Dashboard port (default: 3000)

## Pages

### 📊 Overview
- Real-time bot statistics
- System information
- Active 24/7 channels
- Performance metrics

### ⚡ Commands
- Music commands reference
- Audio effects documentation
- Usage examples
- Permission requirements

### 🏠 Servers
- 24/7 channel management
- Server activity monitoring
- Configuration settings
- Management tools

## Technology Stack

- **Backend**: Express.js + Socket.IO
- **Frontend**: EJS templates + Vanilla JavaScript
- **Styling**: Modern CSS with gradients
- **Real-time**: WebSocket connections
- **Data**: JSON file storage

## API Endpoints

- `GET /` - Main dashboard
- `GET /commands` - Commands reference
- `GET /servers` - Server management
- `GET /api/stats` - Bot statistics API

## File Structure

```
Dashboard/
├── server.js          # Main server file
├── package.json       # Dependencies
├── views/             # EJS templates
│   ├── dashboard.ejs  # Main dashboard
│   ├── commands.ejs   # Commands page
│   └── servers.ejs    # Server management
├── public/           # Static assets
│   ├── css/
│   │   └── dashboard.css
│   └── js/
│       └── dashboard.js
└── README.md         # This file
```

## Development

To modify the dashboard:

1. Edit templates in `views/`
2. Update styles in `public/css/dashboard.css`
3. Add functionality in `public/js/dashboard.js`
4. Restart the bot to see changes

## Features to Implement

- [ ] Chart.js integration for analytics
- [ ] User authentication system
- [ ] Advanced server management
- [ ] Error log viewing
- [ ] Configuration editing
- [ ] Export functionality
- [ ] Mobile app-like PWA features

## Security

- Dashboard runs on localhost by default
- No authentication implemented (add authentication for production)
- Only reads bot data, no control commands
- Uses secure WebSocket connections

## Support

For dashboard issues or feature requests, contact the bot support team through the `/support` command.