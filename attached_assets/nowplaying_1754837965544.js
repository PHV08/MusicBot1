const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');
const { createEmbed } = require('../../utils/embeds');
const { getQueue } = require('../../utils/queue');

module.exports = {
    name: 'nowplaying',
    aliases: ['np'],
    description: 'Show the currently playing song',
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Show the currently playing song'),

    async execute(message, args, client) {
        return await this.handleNowPlaying(message, client, false);
    },

    async executeSlash(interaction, client) {
        return await this.handleNowPlaying(interaction, client, true);
    },

    async handleNowPlaying(context, client, isSlash) {
        const guild = isSlash ? context.guild : context.guild;

        const queue = getQueue(guild.id);
        if (!queue || !queue.currentTrack) {
            const embed = createEmbed('error', `${config.emojis.error} No music is currently playing!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        const track = queue.currentTrack;
        const position = queue.player.position || 0;
        const duration = track.info.length;

        // Create progress bar
        const progress = Math.round((position / duration) * 20);
        const progressBar = '▬'.repeat(progress) + '🔘' + '▬'.repeat(20 - progress);

        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`${queue.paused ? config.emojis.pause : config.emojis.play} Now Playing`)
            .setDescription(
                `**[${track.info.title}](${track.info.uri})**\n\n` +
                `${progressBar}\n` +
                `\`${this.formatTime(position)} / ${this.formatTime(duration)}\`\n\n` +
                `👤 **Requested by:** ${track.requester}\n` +
                `${config.emojis.volume} **Volume:** ${queue.volume}%\n` +
                `🔄 **Loop:** ${queue.loop === 'track' ? 'Track' : queue.loop === 'queue' ? 'Queue' : 'Off'}\n` +
                `🎛️ **Filter:** ${queue.currentFilter || 'None'}`
            )
            .setThumbnail(track.info.artworkUrl || null)
            .setTimestamp();

        return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
    },

    formatTime(ms) {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor(ms / (1000 * 60 * 60));
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
};
