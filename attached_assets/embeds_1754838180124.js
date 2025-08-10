const { EmbedBuilder } = require('discord.js');
const config = require('../config');

function createEmbed(type, title, description = null) {
    const embed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTimestamp();

    switch (type) {
        case 'success':
            embed.setColor('#00ff00');
            break;
        case 'error':
            embed.setColor('#ff0000');
            break;
        case 'warning':
            embed.setColor('#ffff00');
            break;
        case 'info':
            embed.setColor('#00d4ff');
            break;
        default:
            embed.setColor(config.embedColor);
    }

    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);

    return embed;
}

function createMusicEmbed(title, description, track = null) {
    const embed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle(title)
        .setTimestamp();

    if (description) embed.setDescription(description);
    if (track && track.info.artworkUrl) embed.setThumbnail(track.info.artworkUrl);

    return embed;
}

function createQueueEmbed(queue, page = 1) {
    const tracksPerPage = 10;
    const totalPages = Math.ceil(queue.tracks.length / tracksPerPage) || 1;
    const start = (page - 1) * tracksPerPage;
    const end = start + tracksPerPage;
    const tracks = queue.tracks.slice(start, end);

    const embed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle(`${config.emojis.queue} Music Queue`)
        .setTimestamp();

    let description = '';
    
    if (queue.currentTrack) {
        description += `**Now Playing:**\n`;
        description += `${queue.paused ? config.emojis.pause : config.emojis.play} **[${queue.currentTrack.info.title}](${queue.currentTrack.info.uri})**\n`;
        description += `👤 Requested by: ${queue.currentTrack.requester}\n\n`;
    }

    if (tracks.length > 0) {
        description += `**Up Next:**\n`;
        tracks.forEach((track, i) => {
            description += `\`${start + i + 1}.\` **[${track.info.title}](${track.info.uri})**\n`;
            description += `${config.emojis.music} \`${formatTime(track.info.length)}\` | 👤 ${track.requester}\n\n`;
        });
    } else {
        description += '**No tracks in queue**';
    }

    embed.setDescription(description);
    embed.setFooter({ 
        text: `Page ${page}/${totalPages} • ${queue.tracks.length} track${queue.tracks.length !== 1 ? 's' : ''} in queue` 
    });

    return embed;
}

function formatTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

module.exports = {
    createEmbed,
    createMusicEmbed,
    createQueueEmbed,
    formatTime
};
