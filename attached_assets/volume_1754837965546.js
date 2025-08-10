const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config');
const { createEmbed } = require('../../utils/embeds');
const { getQueue } = require('../../utils/queue');

module.exports = {
    name: 'volume',
    description: 'Set or view the current volume',
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Set or view the current volume')
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('Volume level (1-100)')
                .setMinValue(1)
                .setMaxValue(100)
        ),

    async execute(message, args, client) {
        const volume = parseInt(args[0]);
        return await this.handleVolume(message, volume, client, false);
    },

    async executeSlash(interaction, client) {
        const volume = interaction.options.getInteger('level');
        return await this.handleVolume(interaction, volume, client, true);
    },

    async handleVolume(context, volume, client, isSlash) {
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

        if (!volume) {
            const embed = createEmbed('info', 
                `${config.emojis.volume} Current Volume`,
                `Volume is set to **${queue.volume}%**`
            );
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        if (volume < 1 || volume > 100) {
            const embed = createEmbed('error', `${config.emojis.error} Volume must be between 1 and 100!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        queue.setVolume(volume);

        const volumeEmoji = volume <= 25 ? '🔈' : volume <= 75 ? '🔉' : '🔊';
        const embed = createEmbed('success', 
            `${volumeEmoji} Volume Changed`,
            `Volume set to **${volume}%**`
        );
        return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
    }
};
