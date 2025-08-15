const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const { getQueue } = require('../../utils/queue');
const config = require('../../config');

module.exports = {
    name: 'previous',
    aliases: ['prev', 'back'],
    description: 'Play the previous track in the queue',
    data: new SlashCommandBuilder()
        .setName('previous')
        .setDescription('Play the previous track in the queue'),

    async execute(message, args, client) {
        return await this.handlePrevious(message, client, false);
    },

    async executeSlash(interaction, client) {
        return await this.handlePrevious(interaction, client, true);
    },

    async handlePrevious(context, client, isSlash) {
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

        // Check if there's a previous track
        if (!queue.previousTracks || queue.previousTracks.length === 0) {
            const embed = createEmbed('error', `${config.emojis.error} There are no previous tracks to play!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        try {
            // Get the previous track
            const previousTrack = queue.previousTracks.pop();
            
            // Add current track back to the front of the queue
            if (queue.currentTrack) {
                queue.tracks.unshift(queue.currentTrack);
            }
            
            // Set the previous track as current and play it
            queue.currentTrack = previousTrack;
            await queue.player.playTrack({ track: previousTrack.encoded });

            const embed = createEmbed('success', `${config.emojis.success || '⏮️'} Playing previous track`);
            embed.addFields({
                name: 'Now Playing',
                value: `**[${previousTrack.info.title}](${previousTrack.info.uri})**\nBy: ${previousTrack.info.author}`,
                inline: false
            });

            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Previous track error:', error);
            const embed = createEmbed('error', `${config.emojis.error} Failed to play the previous track!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }
    }
};