const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const { getQueue } = require('../../utils/queue');
const config = require('../../config');

module.exports = {
    name: 'replay',
    aliases: ['restart'],
    description: 'Restart the current track from the beginning',
    data: new SlashCommandBuilder()
        .setName('replay')
        .setDescription('Restart the current track from the beginning'),

    async execute(message, args, client) {
        return await this.handleReplay(message, client, false);
    },

    async executeSlash(interaction, client) {
        return await this.handleReplay(interaction, client, true);
    },

    async handleReplay(context, client, isSlash) {
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

        try {
            // Seek to the beginning of the track
            await queue.player.seekTo(0);

            const embed = createEmbed('success', 
                `${config.emojis.success || '🔄'} Restarted the current track from the beginning`
            );

            embed.addFields({
                name: 'Now Playing',
                value: `**[${queue.currentTrack.info.title}](${queue.currentTrack.info.uri})**\nBy: ${queue.currentTrack.info.author}`,
                inline: false
            });

            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Replay error:', error);
            const embed = createEmbed('error', `${config.emojis.error} Failed to restart the track! The track may not support seeking.`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }
    }
};