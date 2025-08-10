const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config');
const { createEmbed } = require('../../utils/embeds');
const { getQueue } = require('../../utils/queue');

module.exports = {
    name: 'stop',
    description: 'Stop the music and clear the queue',
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the music and clear the queue'),

    async execute(message, args, client) {
        return await this.handleStop(message, client, false);
    },

    async executeSlash(interaction, client) {
        return await this.handleStop(interaction, client, true);
    },

    async handleStop(context, client, isSlash) {
        const member = isSlash ? context.member : context.member;
        const guild = isSlash ? context.guild : context.guild;

        // Check if user is in voice channel
        if (!member.voice.channel) {
            const embed = createEmbed('error', `${config.emojis.error} You need to be in a voice channel!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        const queue = getQueue(guild.id);
        if (!queue) {
            const embed = createEmbed('error', `${config.emojis.error} No music is currently playing!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        // Check if user is in same voice channel
        if (member.voice.channel.id !== queue.voiceChannel.id) {
            const embed = createEmbed('error', `${config.emojis.error} You need to be in the same voice channel as me!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        queue.stop();
        client.musicPlayer.delete(guild.id);

        const embed = createEmbed('success', `${config.emojis.stop} Music stopped and queue cleared!`);
        return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
    }
};
