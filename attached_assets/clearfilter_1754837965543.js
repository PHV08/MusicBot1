const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config');
const { createEmbed } = require('../../utils/embeds');
const { getQueue } = require('../../utils/queue');

module.exports = {
    name: 'clearfilter',
    description: 'Clear all audio filters',
    data: new SlashCommandBuilder()
        .setName('clearfilter')
        .setDescription('Clear all audio filters'),

    async execute(message, args, client) {
        return await this.handleClearFilter(message, client, false);
    },

    async executeSlash(interaction, client) {
        return await this.handleClearFilter(interaction, client, true);
    },

    async handleClearFilter(context, client, isSlash) {
        const member = isSlash ? context.member : context.member;
        const guild = isSlash ? context.guild : context.guild;

        // Check if user is in voice channel
        if (!member.voice.channel) {
            const embed = createEmbed('error', `${config.emojis.error} You need to be in a voice channel!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        const queue = getQueue(guild.id);
        if (!queue || !queue.isPlaying()) {
            const embed = createEmbed('error', `${config.emojis.error} No music is currently playing!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        // Check if user is in same voice channel
        if (member.voice.channel.id !== queue.voiceChannel.id) {
            const embed = createEmbed('error', `${config.emojis.error} You need to be in the same voice channel as me!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        queue.clearFilters();
        const embed = createEmbed('success', `${config.emojis.success} All filters cleared!`);
        return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
    }
};
