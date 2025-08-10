module.exports = {
    // Bot configuration
    botToken: process.env.DISCORD_TOKEN || process.env.BOT_TOKEN || '',
    clientId: process.env.CLIENT_ID || '',
    guildId: process.env.GUILD_ID || '',
    
    // Embed colors
    embedColor: '#1DB954', // Spotify green
    colors: {
        success: '#00ff00',
        error: '#ff0000',
        warning: '#ffff00',
        info: '#0099ff',
        primary: '#1DB954',
        secondary: '#5865f2'
    },
    
    // Emojis
    emojis: {
        play: '▶️',
        pause: '⏸️',
        stop: '⏹️',
        skip: '⏭️',
        previous: '⏮️',
        music: '🎵',
        queue: '📃',
        volume: '🔊',
        loop: '🔄',
        shuffle: '🔀',
        error: '❌',
        success: '✅',
        warning: '⚠️',
        info: 'ℹ️',
        loading: '⏳',
        progress: '⏯️'
    },
    
    // Music settings
    music: {
        maxVolume: 100,
        defaultVolume: 75,
        maxQueueSize: 100,
        maxTrackLength: 3600000, // 1 hour in milliseconds
        searchLimit: 10,
        autoLeave: true,
        autoLeaveTimeout: 300000 // 5 minutes
    },
    
    // Links and support information
    links: {
        support: 'https://discord.gg/musicbot-support',
        documentation: 'https://docs.musicbot.dev',
        github: 'https://github.com/musicbot/issues',
        premium: 'https://musicbot.dev/premium',
        website: 'https://musicbot.dev',
        invite: 'https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=3165184&scope=bot%20applications.commands'
    },
    
    // Contact information
    contact: {
        email: 'support@musicbot.dev',
        twitter: '@MusicBotSupport'
    },
    
    // Bot statistics (these would typically be fetched from a database)
    stats: {
        servers: '1,200+',
        uptime: '98.5%',
        songsPlayed: '50K+',
        rating: '4.9/5'
    },
    
    // Permission requirements
    permissions: {
        voice: ['CONNECT', 'SPEAK', 'USE_VAD'],
        text: ['SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGE_HISTORY'],
        required: ['CONNECT', 'SPEAK', 'SEND_MESSAGES', 'EMBED_LINKS']
    }
};
