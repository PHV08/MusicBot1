const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');
const { createEmbed } = require('../../utils/embeds');
const { getQueue } = require('../../utils/queue');
const { filters } = require('../../utils/filters');

module.exports = {
    name: 'filter',
    description: 'Apply audio filters to the music',
    data: new SlashCommandBuilder()
        .setName('filter')
        .setDescription('Apply audio filters to the music')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Filter type to apply')
                .setRequired(true)
                .addChoices(
                    { name: 'Bass Boost', value: 'bassboost' },
                    { name: 'Nightcore', value: 'nightcore' },
                    { name: 'Vaporwave', value: 'vaporwave' },
                    { name: '8D', value: '8d' },
                    { name: 'Karaoke', value: 'karaoke' },
                    { name: 'Vibrato', value: 'vibrato' },
                    { name: 'Tremolo', value: 'tremolo' },
                    { name: 'Pop', value: 'pop' },
                    { name: 'Soft', value: 'soft' },
                    { name: 'TV', value: 'tv' },
                    { name: 'Electronic', value: 'electronic' },
                    { name: 'Party', value: 'party' },
                    { name: 'Radio', value: 'radio' },
                    { name: 'Clear', value: 'clear' },
                    { name: 'List All', value: 'list' }
                )
        ),

    async execute(message, args, client) {
        const filterType = args[0]?.toLowerCase();
        return await this.handleFilter(message, filterType, client, false);
    },

    async executeSlash(interaction, client) {
        const filterType = interaction.options.getString('type');
        return await this.handleFilter(interaction, filterType, client, true);
    },

    async handleFilter(context, filterType, client, isSlash) {
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

        // List all filters
        if (filterType === 'list') {
            const filterList = Object.keys(filters).map(filter => `\`${filter}\``).join(', ');
            const embed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle(`${config.emojis.filter} Available Filters`)
                .setDescription(
                    `**Available filters:**\n${filterList}\n\n` +
                    `**Usage:** \`${config.prefix}filter <filter_name>\` or \`/filter <filter_name>\`\n` +
                    `**Clear filters:** \`${config.prefix}filter clear\` or \`/clearfilter\``
                )
                .setFooter({ text: `Total filters: ${Object.keys(filters).length}` });
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        if (!filterType) {
            const embed = createEmbed('error', `${config.emojis.error} Please specify a filter type! Use \`filter list\` to see available filters.`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        // Clear filters
        if (filterType === 'clear') {
            queue.clearFilters();
            const embed = createEmbed('success', `${config.emojis.success} All filters cleared!`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        // Check if filter exists
        if (!filters[filterType]) {
            const embed = createEmbed('error', `${config.emojis.error} Filter \`${filterType}\` not found! Use \`filter list\` to see available filters.`);
            return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
        }

        // Apply filter
        queue.setFilter(filterType);
        const embed = createEmbed('success', 
            `${config.emojis.filter} Filter Applied`,
            `Applied **${filterType}** filter to the music!`
        );
        return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
    }
};
