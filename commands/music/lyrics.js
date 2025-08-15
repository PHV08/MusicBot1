const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const { getQueue } = require('../../utils/queue');
const config = require('../../config');

module.exports = {
    name: 'lyrics',
    description: 'Get lyrics for the current track or search for lyrics',
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Get lyrics for the current track or search for lyrics')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Song name to search for (optional - uses current track if not provided)')
                .setRequired(false)),

    async execute(message, args, client) {
        const searchQuery = args.join(' ');
        return await this.handleLyrics(message, client, false, searchQuery);
    },

    async executeSlash(interaction, client) {
        const searchQuery = interaction.options.getString('song');
        return await this.handleLyrics(interaction, client, true, searchQuery);
    },

    async handleLyrics(context, client, isSlash, searchQuery) {
        const member = isSlash ? context.member : context.member;
        const guild = isSlash ? context.guild : context.guild;

        let songTitle = searchQuery;
        
        // If no search query provided, use current track
        if (!songTitle) {
            const queue = getQueue(guild.id);
            if (!queue || !queue.currentTrack) {
                const embed = createEmbed('error', `${config.emojis.error} No music is currently playing and no song was specified!`);
                return isSlash ? context.reply({ embeds: [embed] }) : context.reply({ embeds: [embed] });
            }
            songTitle = queue.currentTrack.info.title;
        }

        // Create initial response
        const loadingEmbed = createEmbed('info', `${config.emojis.loading || '🔍'} Searching for lyrics: **${songTitle}**...`);
        const response = isSlash ? await context.reply({ embeds: [loadingEmbed] }) : await context.reply({ embeds: [loadingEmbed] });

        try {
            // For now, we'll show a placeholder since we don't have a lyrics API
            // In a real implementation, you would use APIs like Genius, Musixmatch, etc.
            
            const embed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle(`🎵 Lyrics: ${songTitle}`)
                .setDescription('**Lyrics functionality is currently being developed.**\n\n' +
                    'This feature will be integrated with lyrics APIs like:\n' +
                    '• Genius API\n' +
                    '• Musixmatch API\n' +
                    '• LyricsGenius\n\n' +
                    'For now, you can search for lyrics manually at:\n' +
                    `[Genius.com](https://genius.com/search?q=${encodeURIComponent(songTitle)})\n` +
                    `[AZLyrics](https://search.azlyrics.com/search.php?q=${encodeURIComponent(songTitle)})`)
                .addFields(
                    {
                        name: 'Song Title',
                        value: songTitle,
                        inline: true
                    },
                    {
                        name: 'Status',
                        value: 'Coming Soon',
                        inline: true
                    }
                )
                .setFooter({ text: 'Lyrics feature will be implemented with proper API integration' })
                .setTimestamp();

            if (isSlash) {
                await response.edit({ embeds: [embed] });
            } else {
                await response.edit({ embeds: [embed] });
            }

        } catch (error) {
            console.error('Lyrics error:', error);
            const errorEmbed = createEmbed('error', `${config.emojis.error} Failed to fetch lyrics for **${songTitle}**`);
            
            if (isSlash) {
                await response.edit({ embeds: [errorEmbed] });
            } else {
                await response.edit({ embeds: [errorEmbed] });
            }
        }
    }
};