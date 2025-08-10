const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');
const { createEmbed } = require('../../utils/embeds');
const { getQueue } = require('../../utils/queue');

module.exports = {
    name: 'queue',
    description: 'Show the current music queue',
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the current music queue')
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('Page number to view')
                .setMinValue(1)
        ),

    async execute(message, args, client) {
        const page = parseInt(args[0]) || 1;
        return await this.handleQueue(message, page, client, false);
    },

    async executeSlash(interaction, client) {
        const page = interaction.options.getInteger('page') || 1;
        return await this.handleQueue(interaction, page, client, true);
    },

    async handleQueue(context, page, client, isSlash) {
        const guild = isSlash ? context.guild : context.guild;

        const queue = getQueue(guild.id);
        if (!queue || !queue.currentTrack) {
            const embed = createEmbed('error', `${config.emojis.error} No music is currently playing!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        const tracksPerPage = 10;
        const totalPages = Math.ceil(queue.tracks.length / tracksPerPage) || 1;

        if (page > totalPages) {
            const embed = createEmbed('error', `${config.emojis.error} Page ${page} doesn't exist! Total pages: ${totalPages}`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        const start = (page - 1) * tracksPerPage;
        const end = start + tracksPerPage;
        const tracks = queue.tracks.slice(start, end);

        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle(`${config.emojis.queue} Music Queue`)
            .setDescription(
                `**Now Playing:**\n` +
                `${queue.paused ? config.emojis.pause : config.emojis.play} **[${queue.currentTrack.info.title}](${queue.currentTrack.info.uri})**\n` +
                `👤 Requested by: ${queue.currentTrack.requester}\n\n` +
                (tracks.length > 0 ? 
                    `**Up Next:**\n${tracks.map((track, i) => 
                        `\`${start + i + 1}.\` **[${track.info.title}](${track.info.uri})**\n` +
                        `${config.emojis.music} \`${this.formatTime(track.info.length)}\` | 👤 ${track.requester}`
                    ).join('\n\n')}` : 
                    '**No tracks in queue**'
                )
            )
            .setFooter({ 
                text: `Page ${page}/${totalPages} • ${queue.tracks.length} track${queue.tracks.length !== 1 ? 's' : ''} in queue` 
            })
            .setTimestamp();

        return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
    },

    formatTime(ms) {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor(ms / (1000 * 60 * 60));
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
};
