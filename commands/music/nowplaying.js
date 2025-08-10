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
        
        // Get current position with proper error handling
        let position = 0;
        try {
            if (queue.player && typeof queue.player.position === 'number') {
                position = Math.max(0, queue.player.position);
            } else if (queue.player && queue.player.state && typeof queue.player.state.position === 'number') {
                position = Math.max(0, queue.player.state.position);
            }
        } catch (error) {
            console.error('Error getting player position:', error);
            position = 0;
        }

        const duration = track.info.length || 0;

        // Create improved progress bar with better handling
        let progress = 0;
        if (duration > 0) {
            progress = Math.min(Math.round((position / duration) * 20), 20);
        }
        
        // Better progress bar visualization
        const filledBar = '█'.repeat(Math.max(0, progress - 1));
        const currentPos = progress > 0 ? '🔘' : '🔘';
        const emptyBar = '░'.repeat(Math.max(0, 20 - progress));
        const progressBar = filledBar + currentPos + emptyBar;

        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`${queue.paused ? config.emojis.pause : config.emojis.play} Now Playing`)
            .setDescription(
                `**[${track.info.title}](${track.info.uri})**\n` +
                `👤 **Requested by:** ${track.requester}\n\n` +
                `${progressBar}\n` +
                `\`${this.formatTime(position)} / ${this.formatTime(duration)}\``
            )
            .addFields(
                {
                    name: '🎵 Track Info',
                    value: `**Artist:** ${track.info.author || 'Unknown'}\n**Duration:** ${this.formatTime(duration)}`,
                    inline: true
                },
                {
                    name: '🔊 Player Settings',
                    value: `**Volume:** ${queue.volume}%\n**Loop:** ${queue.loop === 'track' ? 'Track' : queue.loop === 'queue' ? 'Queue' : 'Off'}`,
                    inline: true
                },
                {
                    name: '🎛️ Audio Effects',
                    value: `**Filter:** ${queue.currentFilter || 'None'}\n**Status:** ${queue.paused ? 'Paused' : 'Playing'}`,
                    inline: true
                }
            )
            .setThumbnail(track.info.artworkUrl || track.info.thumbnail || null)
            .setFooter({ 
                text: `Queue: ${queue.tracks.length} songs • ${guild.name}`,
                iconURL: guild.iconURL({ dynamic: true })
            })
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
