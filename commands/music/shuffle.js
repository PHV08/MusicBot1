const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const { getQueue } = require('../../utils/queue');
const config = require('../../config');

module.exports = {
    name: 'shuffle',
    description: 'Shuffle the current music queue',
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the current music queue'),

    async execute(message, args, client) {
        return await this.handleShuffle(message, client, false);
    },

    async executeSlash(interaction, client) {
        return await this.handleShuffle(interaction, client, true);
    },

    async handleShuffle(context, client, isSlash) {
        const member = isSlash ? context.member : context.member;
        const guild = isSlash ? context.guild : context.guild;

        // Check if user is in a voice channel
        if (!member.voice.channel) {
            const embed = createEmbed('error', `${config.emojis.error} You need to be in a voice channel to use this command!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        const queue = getQueue(guild.id);
        if (!queue || queue.tracks.length === 0) {
            const embed = createEmbed('error', `${config.emojis.error} There are no songs in the queue to shuffle!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        // Check if user is in the same voice channel as bot
        if (queue.voiceChannel && member.voice.channel.id !== queue.voiceChannel.id) {
            const embed = createEmbed('error', `${config.emojis.error} You need to be in the same voice channel as the bot!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        // Shuffle the queue using Fisher-Yates algorithm
        const originalLength = queue.tracks.length;
        for (let i = queue.tracks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [queue.tracks[i], queue.tracks[j]] = [queue.tracks[j], queue.tracks[i]];
        }

        const embed = createEmbed('success', 
            `${config.emojis.shuffle || '🔀'} Successfully shuffled **${originalLength}** songs in the queue!`
        );

        if (queue.currentTrack) {
            embed.addFields({
                name: 'Currently Playing',
                value: `**[${queue.currentTrack.info.title}](${queue.currentTrack.info.uri})**`,
                inline: false
            });
        }

        embed.addFields({
            name: 'Next Up',
            value: queue.tracks.slice(0, 3).map((track, index) => 
                `**${index + 1}.** [${track.info.title}](${track.info.uri})`
            ).join('\n') || 'No upcoming songs',
            inline: false
        });

        return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
    }
};