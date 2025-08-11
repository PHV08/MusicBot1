const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const { getQueue } = require('../../utils/queue');
const config = require('../../config');

module.exports = {
    name: 'remove',
    aliases: ['r'],
    description: 'Remove a specific song from the queue',
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a specific song from the queue')
        .addIntegerOption(option =>
            option.setName('position')
                .setDescription('Position of the song to remove (1-based)')
                .setRequired(true)
                .setMinValue(1)),

    async execute(message, args, client) {
        const position = parseInt(args[0]);
        if (!position || position < 1) {
            const embed = createEmbed('error', `${config.emojis.error} Please provide a valid position number!`);
            return message.reply({ embeds: [embed] });
        }
        return await this.handleRemove(message, client, false, position);
    },

    async executeSlash(interaction, client) {
        const position = interaction.options.getInteger('position');
        return await this.handleRemove(interaction, client, true, position);
    },

    async handleRemove(context, client, isSlash, position) {
        const member = isSlash ? context.member : context.member;
        const guild = isSlash ? context.guild : context.guild;

        if (!member.voice.channel) {
            const embed = createEmbed('error', `${config.emojis.error} You need to be in a voice channel to use this command!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        const queue = getQueue(guild.id);
        if (!queue || queue.tracks.length === 0) {
            const embed = createEmbed('error', `${config.emojis.error} There are no songs in the queue!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        if (queue.voiceChannel && member.voice.channel.id !== queue.voiceChannel.id) {
            const embed = createEmbed('error', `${config.emojis.error} You need to be in the same voice channel as the bot!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        if (position > queue.tracks.length) {
            const embed = createEmbed('error', `${config.emojis.error} Invalid position! The queue only has **${queue.tracks.length}** songs.`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        const removedTrack = queue.tracks.splice(position - 1, 1)[0];

        const embed = createEmbed('success', 
            `${config.emojis.success || '✅'} Removed song from position **${position}**`
        );

        embed.addFields(
            {
                name: 'Removed Track',
                value: `**[${removedTrack.info.title}](${removedTrack.info.uri})**\nBy: ${removedTrack.info.author}`,
                inline: false
            },
            {
                name: 'Queue Info',
                value: `**${queue.tracks.length}** songs remaining in queue`,
                inline: true
            }
        );

        return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
    }
};