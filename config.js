module.exports = {
    token: process.env.DISCORD_TOKEN || 'your_discord_bot_token',
    prefix: process.env.PREFIX || '!',
    embedColor: '#00d4ff',
    ownerIds: process.env.OWNER_IDS ? process.env.OWNER_IDS.split(',') : ['1277220097185808406'],
    lavalink: {
        host: process.env.LAVALINK_URL || 'lavalink.devxcode.in',
        port: process.env.LAVALINK_PORT || 443,
        password: process.env.LAVALINK_PASSWORD || 'DevamOP'
    },
    emojis: {
        play: '▶️',
        pause: '⏸️',
        stop: '⏹️',
        skip: '⏭️',
        previous: '⏮️',
        queue: '📋',
        volume: '🔊',
        filter: '🎛️',
        success: '✅',
        error: '❌',
        warning: '⚠️',
        music: '🎵',
        loading: '⏳',
        search: '🔍'
    }
};
