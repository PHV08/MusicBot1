const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config');
const { createEmbed } = require('../../utils/embeds');
const { formatTime, formatProgressBar } = require('../../utils/formatters');
const { getQueue } = require('../../utils/queue');

module.exports = {
    name: 'nowplaying',
    description: 'Show the currently playing track with progress',
    aliases: ['np', 'current'],
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Show the currently playing track with progress'),

    async execute(message, args, client) {
        return await this.handleNowPlaying(message, client, false);
    },

    async executeSlash(interaction, client) {
        return await this.handleNowPlaying(interaction, client, true);
    },

    async handleNowPlaying(context, client, isSlash) {
        const member = isSlash ? context.member : context.member;
        const guild = isSlash ? context.guild : context.guild;

        const queue = getQueue(guild.id);
        if (!queue || !queue.currentTrack) {
            const embed = createEmbed('error', `${config.emojis.error} No music is currently playing!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        const track = queue.currentTrack;
        
        // Get current position with proper null checks and error handling
        let currentPosition = 0;
        let trackDuration = track.info.length || 0;
        
        try {
            if (queue.player && typeof queue.player.position === 'number') {
                currentPosition = Math.max(0, queue.player.position);
            } else if (queue.player && queue.player.state && typeof queue.player.state.position === 'number') {
                currentPosition = Math.max(0, queue.player.state.position);
            }
            
            // Clamp position to not exceed track duration
            if (trackDuration > 0) {
                currentPosition = Math.min(currentPosition, trackDuration);
            }
        } catch (error) {
            console.error('Error getting player position:', error);
            currentPosition = 0;
        }

        // Calculate progress percentage with safety checks
        let progressPercentage = 0;
        if (trackDuration > 0 && currentPosition >= 0) {
            progressPercentage = Math.min(100, (currentPosition / trackDuration) * 100);
        }

        // Format times with proper error handling
        const currentTimeFormatted = formatTime(currentPosition);
        const totalTimeFormatted = formatTime(trackDuration);
        const progressBar = formatProgressBar(progressPercentage);

        // Create enhanced embed with proper error handling
        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`${queue.paused ? config.emojis.pause : config.emojis.play} Now Playing`)
            .setDescription(
                `**[${track.info.title}](${track.info.uri || '#'})**\n` +
                `${config.emojis.music} **Artist:** ${track.info.author || 'Unknown'}\n` +
                `👤 **Requested by:** ${track.requester || 'Unknown'}\n\n` +
                `${progressBar}\n` +
                `\`${currentTimeFormatted}\` ${config.emojis.progress} \`${totalTimeFormatted}\`\n\n` +
                `**Progress:** ${progressPercentage.toFixed(1)}% (${Math.floor(currentPosition / 1000)}/${Math.floor(trackDuration / 1000)} seconds)`
            )
            .addFields(
                {
                    name: `${config.emojis.volume} Player Info`,
                    value: 
                        `**Volume:** ${queue.volume}%\n` +
                        `**Loop:** ${queue.loop === 'off' ? 'Disabled' : queue.loop === 'track' ? 'Track' : 'Queue'}\n` +
                        `**Filter:** ${queue.currentFilter || 'None'}\n` +
                        `**Paused:** ${queue.paused ? 'Yes' : 'No'}`,
                    inline: true
                },
                {
                    name: `${config.emojis.queue} Queue Info`,
                    value:
                        `**Next up:** ${queue.tracks.length > 0 ? queue.tracks[0].info.title : 'Nothing'}\n` +
                        `**Total tracks:** ${queue.tracks.length}\n` +
                        `**Queue length:** ${this.calculateQueueDuration(queue.tracks)}\n` +
                        `**Source:** ${this.getTrackSource(track.info.uri)}`,
                    inline: true
                }
            )
            .setThumbnail(track.info.artworkUrl || track.info.thumbnail || null)
            .setFooter({ 
                text: `${guild.name} • ${queue.voiceChannel ? `Connected to ${queue.voiceChannel.name}` : 'Not connected'}`,
                iconURL: guild.iconURL({ dynamic: true })
            })
            .setTimestamp();

        // Create control buttons
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('music_previous')
                .setEmoji('⏮️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(queue.tracks.length === 0 && queue.loop !== 'queue'),
            new ButtonBuilder()
                .setCustomId('music_playpause')
                .setEmoji(queue.paused ? '▶️' : '⏸️')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('music_stop')
                .setEmoji('⏹️')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('music_skip')
                .setEmoji('⏭️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(queue.tracks.length === 0 && queue.loop !== 'track'),
            new ButtonBuilder()
                .setCustomId('music_queue')
                .setEmoji('📃')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(queue.tracks.length === 0)
        );

        return isSlash ? 
            context.reply({ embeds: [embed], components: [row] }) : 
            context.reply({ embeds: [embed], components: [row] });
    },

    calculateQueueDuration(tracks) {
        if (!tracks || tracks.length === 0) return '0:00';
        
        const totalMs = tracks.reduce((total, track) => {
            return total + (track.info.length || 0);
        }, 0);
        
        return formatTime(totalMs);
    },

    getTrackSource(uri) {
        if (!uri) return 'Unknown';
        
        if (uri.includes('youtube.com') || uri.includes('youtu.be')) {
            return 'YouTube';
        } else if (uri.includes('soundcloud.com')) {
            return 'SoundCloud';
        } else if (uri.includes('spotify.com')) {
            return 'Spotify';
        } else if (uri.includes('bandcamp.com')) {
            return 'Bandcamp';
        }
        
        return 'Other';
    }
};
