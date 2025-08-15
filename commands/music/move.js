const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const { getQueue } = require('../../utils/queue');
const config = require('../../config');

module.exports = {
    name: 'move',
    description: 'Move a song from one position to another in the queue',
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('Move a song from one position to another in the queue')
        .addIntegerOption(option =>
            option.setName('from')
                .setDescription('Current position of the song (1-based)')
                .setRequired(true)
                .setMinValue(1))
        .addIntegerOption(option =>
            option.setName('to')
                .setDescription('New position for the song (1-based)')
                .setRequired(true)
                .setMinValue(1)),

    async execute(message, args, client) {
        const from = parseInt(args[0]);
        const to = parseInt(args[1]);
        
        if (!from || !to || from < 1 || to < 1) {
            const embed = createEmbed('error', `${config.emojis.error} Please provide valid position numbers! Usage: \`move <from> <to>\``);
            return message.reply({ embeds: [embed] });
        }
        
        return await this.handleMove(message, client, false, from, to);
    },

    async executeSlash(interaction, client) {
        const from = interaction.options.getInteger('from');
        const to = interaction.options.getInteger('to');
        return await this.handleMove(interaction, client, true, from, to);
    },

    async handleMove(context, client, isSlash, from, to) {
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

        if (from > queue.tracks.length || to > queue.tracks.length) {
            const embed = createEmbed('error', `${config.emojis.error} Invalid position! The queue only has **${queue.tracks.length}** songs.`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        if (from === to) {
            const embed = createEmbed('error', `${config.emojis.error} The song is already at position **${from}**!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        // Move the track
        const track = queue.tracks.splice(from - 1, 1)[0];
        queue.tracks.splice(to - 1, 0, track);

        const embed = createEmbed('success', 
            `${config.emojis.success || '✅'} Moved song from position **${from}** to position **${to}**`
        );

        embed.addFields(
            {
                name: 'Moved Track',
                value: `**[${track.info.title}](${track.info.uri})**\nBy: ${track.info.author}`,
                inline: false
            },
            {
                name: 'New Queue Position',
                value: `Position **${to}** of **${queue.tracks.length}**`,
                inline: true
            }
        );

        return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
    }
};