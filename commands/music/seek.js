const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const { getQueue } = require('../../utils/queue');
const config = require('../../config');

module.exports = {
    name: 'seek',
    description: 'Seek to a specific time in the current track',
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seek to a specific time in the current track')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Time to seek to (e.g., 1:30, 90s, 2m)')
                .setRequired(true)),

    async execute(message, args, client) {
        const timeString = args[0];
        if (!timeString) {
            const embed = createEmbed('error', `${config.emojis.error} Please provide a time to seek to! (e.g., 1:30, 90s, 2m)`);
            return message.reply({ embeds: [embed] });
        }
        return await this.handleSeek(message, client, false, timeString);
    },

    async executeSlash(interaction, client) {
        const timeString = interaction.options.getString('time');
        return await this.handleSeek(interaction, client, true, timeString);
    },

    parseTime(timeString) {
        // Parse time formats: "1:30", "90s", "2m", "1m30s"
        let totalSeconds = 0;
        
        // Handle MM:SS format
        if (timeString.includes(':')) {
            const parts = timeString.split(':');
            if (parts.length === 2) {
                const minutes = parseInt(parts[0]) || 0;
                const seconds = parseInt(parts[1]) || 0;
                totalSeconds = (minutes * 60) + seconds;
            }
        }
        // Handle formats with 'm' and 's'
        else if (timeString.includes('m') || timeString.includes('s')) {
            const minuteMatch = timeString.match(/(\d+)m/);
            const secondMatch = timeString.match(/(\d+)s/);
            
            const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
            const seconds = secondMatch ? parseInt(secondMatch[1]) : 0;
            
            totalSeconds = (minutes * 60) + seconds;
        }
        // Handle pure number (assume seconds)
        else {
            totalSeconds = parseInt(timeString) || 0;
        }
        
        return totalSeconds * 1000; // Convert to milliseconds
    },

    formatTime(ms) {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor(ms / (1000 * 60 * 60));
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },

    async handleSeek(context, client, isSlash, timeString) {
        const member = isSlash ? context.member : context.member;
        const guild = isSlash ? context.guild : context.guild;

        if (!member.voice.channel) {
            const embed = createEmbed('error', `${config.emojis.error} You need to be in a voice channel to use this command!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        const queue = getQueue(guild.id);
        if (!queue || !queue.currentTrack) {
            const embed = createEmbed('error', `${config.emojis.error} There is no music playing right now!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        if (queue.voiceChannel && member.voice.channel.id !== queue.voiceChannel.id) {
            const embed = createEmbed('error', `${config.emojis.error} You need to be in the same voice channel as the bot!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        const seekTime = this.parseTime(timeString);
        const duration = queue.currentTrack.info.length;

        if (seekTime <= 0) {
            const embed = createEmbed('error', `${config.emojis.error} Invalid time format! Use formats like: 1:30, 90s, 2m`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        if (seekTime > duration) {
            const embed = createEmbed('error', `${config.emojis.error} Cannot seek beyond the track duration! (${this.formatTime(duration)})`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        try {
            await queue.player.seekTo(seekTime);

            const embed = createEmbed('success', 
                `${config.emojis.success || '✅'} Seeked to **${this.formatTime(seekTime)}**`
            );

            embed.addFields(
                {
                    name: 'Now Playing',
                    value: `**[${queue.currentTrack.info.title}](${queue.currentTrack.info.uri})**`,
                    inline: false
                },
                {
                    name: 'Position',
                    value: `${this.formatTime(seekTime)} / ${this.formatTime(duration)}`,
                    inline: true
                }
            );

            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Seek error:', error);
            const embed = createEmbed('error', `${config.emojis.error} Failed to seek to the specified time. The track may not support seeking.`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }
    }
};