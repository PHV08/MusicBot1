const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const { getQueue } = require('../../utils/queue');
const config = require('../../config');

module.exports = {
    name: 'loop',
    description: 'Set loop mode for the current track or queue',
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Set loop mode for the current track or queue')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Loop mode to set')
                .setRequired(true)
                .addChoices(
                    { name: 'Off', value: 'off' },
                    { name: 'Track', value: 'track' },
                    { name: 'Queue', value: 'queue' }
                )),

    async execute(message, args, client) {
        const mode = args[0]?.toLowerCase();
        if (!mode || !['off', 'track', 'queue'].includes(mode)) {
            const embed = createEmbed('error', `${config.emojis.error} Please specify a valid loop mode: \`off\`, \`track\`, or \`queue\``);
            return message.reply({ embeds: [embed] });
        }
        return await this.handleLoop(message, client, false, mode);
    },

    async executeSlash(interaction, client) {
        const mode = interaction.options.getString('mode');
        return await this.handleLoop(interaction, client, true, mode);
    },

    async handleLoop(context, client, isSlash, mode) {
        const member = isSlash ? context.member : context.member;
        const guild = isSlash ? context.guild : context.guild;

        // Check if user is in a voice channel
        if (!member.voice.channel) {
            const embed = createEmbed('error', `${config.emojis.error} You need to be in a voice channel to use this command!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        const queue = getQueue(guild.id);
        if (!queue || !queue.currentTrack) {
            const embed = createEmbed('error', `${config.emojis.error} There is no music playing right now!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        // Check if user is in the same voice channel as bot
        if (queue.voiceChannel && member.voice.channel.id !== queue.voiceChannel.id) {
            const embed = createEmbed('error', `${config.emojis.error} You need to be in the same voice channel as the bot!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        // Set loop mode
        queue.loop = mode;

        let description;
        let emoji;
        
        switch (mode) {
            case 'off':
                description = 'Loop mode has been **disabled**';
                emoji = '⏹️';
                break;
            case 'track':
                description = 'Now looping the **current track**';
                emoji = '🔂';
                break;
            case 'queue':
                description = 'Now looping the **entire queue**';
                emoji = '🔁';
                break;
        }

        const embed = createEmbed('success', `${emoji} ${description}`);
        embed.addFields({
            name: 'Current Track',
            value: `**[${queue.currentTrack.info.title}](${queue.currentTrack.info.uri})**`,
            inline: false
        });

        return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
    }
};