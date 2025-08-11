const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const { getQueue } = require('../../utils/queue');
const config = require('../../config');

module.exports = {
    name: 'clear',
    description: 'Clear the entire music queue',
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear the entire music queue'),

    async execute(message, args, client) {
        return await this.handleClear(message, client, false);
    },

    async executeSlash(interaction, client) {
        return await this.handleClear(interaction, client, true);
    },

    async handleClear(context, client, isSlash) {
        const member = isSlash ? context.member : context.member;
        const guild = isSlash ? context.guild : context.guild;

        if (!member.voice.channel) {
            const embed = createEmbed('error', `${config.emojis.error} You need to be in a voice channel to use this command!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        const queue = getQueue(guild.id);
        if (!queue || queue.tracks.length === 0) {
            const embed = createEmbed('error', `${config.emojis.error} The queue is already empty!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        if (queue.voiceChannel && member.voice.channel.id !== queue.voiceChannel.id) {
            const embed = createEmbed('error', `${config.emojis.error} You need to be in the same voice channel as the bot!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        const clearedCount = queue.tracks.length;
        queue.tracks = [];

        const embed = createEmbed('success', 
            `${config.emojis.success || '✅'} Cleared **${clearedCount}** songs from the queue!`
        );

        if (queue.currentTrack) {
            embed.addFields({
                name: 'Currently Playing',
                value: `**[${queue.currentTrack.info.title}](${queue.currentTrack.info.uri})**\n*This song will continue playing*`,
                inline: false
            });
        }

        return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
    }
};