const { EmbedBuilder } = require('discord.js');
const config = require('../config');

function createEmbed(type, title, description = '', fields = []) {
    const embed = new EmbedBuilder();
    
    switch (type) {
        case 'success':
            embed.setColor(config.colors.success);
            break;
        case 'error':
            embed.setColor(config.colors.error);
            break;
        case 'warning':
            embed.setColor(config.colors.warning);
            break;
        case 'info':
            embed.setColor(config.colors.info);
            break;
        default:
            embed.setColor(config.embedColor);
    }
    
    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);
    
    if (fields && fields.length > 0) {
        embed.addFields(fields);
    }
    
    embed.setTimestamp();
    
    return embed;
}

function createMusicEmbed(track, queue) {
    const embed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle(`${queue.paused ? config.emojis.pause : config.emojis.play} Now Playing`)
        .setDescription(`**[${track.info.title}](${track.info.uri})**`)
        .addFields(
            {
                name: 'Artist',
                value: track.info.author || 'Unknown',
                inline: true
            },
            {
                name: 'Duration',
                value: formatTime(track.info.length),
                inline: true
            },
            {
                name: 'Requested by',
                value: track.requester || 'Unknown',
                inline: true
            }
        );
    
    if (track.info.artworkUrl || track.info.thumbnail) {
        embed.setThumbnail(track.info.artworkUrl || track.info.thumbnail);
    }
    
    embed.setTimestamp();
    
    return embed;
}

function formatTime(ms) {
    if (!ms || ms < 0) return '0:00';
    
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
    formatTime
};
