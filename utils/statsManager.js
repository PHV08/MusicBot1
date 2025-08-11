const fs = require('fs');
const path = require('path');

class StatsManager {
    constructor() {
        this.statsPath = path.join(__dirname, '..', 'Data', 'bot-stats.json');
        this.stats = this.loadStats();
        this.startTime = Date.now();
        
        // Auto-save stats every 5 minutes
        setInterval(() => {
            this.saveStats();
        }, 5 * 60 * 1000);
    }

    loadStats() {
        try {
            if (fs.existsSync(this.statsPath)) {
                return JSON.parse(fs.readFileSync(this.statsPath, 'utf8'));
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
        
        return {
            status: 'Online',
            guilds: 0,
            users: 0,
            voiceConnections: 0,
            songsPlayed: 0,
            commandsUsed: 0,
            lastRestart: new Date().toISOString(),
            dailyStats: {
                commands: 0,
                songsPlayed: 0,
                date: new Date().toDateString()
            }
        };
    }

    saveStats() {
        try {
            // Ensure Data directory exists
            const dataDir = path.dirname(this.statsPath);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            
            fs.writeFileSync(this.statsPath, JSON.stringify(this.stats, null, 2));
        } catch (error) {
            console.error('Error saving stats:', error);
        }
    }

    updateBotStats(client) {
        if (!client || !client.guilds) return;
        
        this.stats.status = 'Online';
        this.stats.guilds = client.guilds.cache.size;
        this.stats.users = client.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0);
        this.stats.voiceConnections = client.shoukaku?.players?.size || 0;
        this.stats.uptime = this.formatUptime(Date.now() - this.startTime);
        
        // Reset daily stats if it's a new day
        const today = new Date().toDateString();
        if (this.stats.dailyStats.date !== today) {
            this.stats.dailyStats = {
                commands: 0,
                songsPlayed: 0,
                date: today
            };
        }
        
        this.saveStats();
    }

    incrementCommand() {
        this.stats.commandsUsed++;
        this.stats.dailyStats.commands++;
    }

    incrementSong() {
        this.stats.songsPlayed++;
        this.stats.dailyStats.songsPlayed++;
    }

    formatUptime(ms) {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));

        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m ${seconds}s`;
        }
    }

    getStats() {
        return { ...this.stats };
    }

    setOffline() {
        this.stats.status = 'Offline';
        this.saveStats();
    }
}

module.exports = StatsManager;