const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all available commands and features')
        .addStringOption(option =>
            option
                .setName('category')
                .setDescription('Choose a command category')
                .addChoices(
                    { name: 'Music Commands', value: 'music' },
                    { name: 'Info Commands', value: 'info' },
                    { name: 'Filters', value: 'filters' }
                )
                .setRequired(false)
        ),

    async execute(interaction, client) {
        return this.executeSlash(interaction, client);
    },

    async executeSlash(interaction, client) {
        await interaction.deferReply();

        const category = interaction.options.getString('category');

        if (!category) {
            // Main help embed
            const embed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle(`${config.emojis.music} Discord Music Bot - Help`)
                .setDescription('A powerful music bot with advanced features and high-quality audio playback')
                .addFields(
                    {
                        name: '🎵 Music Commands',
                        value: '`/play` - Play music from YouTube, Spotify, SoundCloud\n' +
                               '`/pause` - Pause the current track\n' +
                               '`/resume` - Resume playback\n' +
                               '`/skip` - Skip to the next track\n' +
                               '`/stop` - Stop playback and clear queue\n' +
                               '`/queue` - View the current queue\n' +
                               '`/nowplaying` - Show current track info\n' +
                               '`/volume` - Adjust playback volume\n' +
                               '`/loop` - Toggle loop modes\n' +
                               '`/shuffle` - Shuffle the queue\n' +
                               '`/seek` - Jump to specific time\n' +
                               '`/remove` - Remove track from queue\n' +
                               '`/clear` - Clear the entire queue\n' +
                               '`/disconnect` - Leave voice channel',
                        inline: false
                    },
                    {
                        name: '🎛️ Audio Filters',
                        value: '`/filter` - Apply audio effects (40+ filters)\n' +
                               'Bass boost, Nightcore, 8D, Vaporwave, and more!',
                        inline: false
                    },
                    {
                        name: '⚙️ Server Management',
                        value: '`/247` - Toggle 24/7 mode (bot stays in voice channel)',
                        inline: false
                    },
                    {
                        name: 'ℹ️ Information',
                        value: '`/help` - Show this help menu\n' +
                               '`/botinfo` - Bot statistics and info\n' +
                               '`/invite` - Get bot invite link\n' +
                               '`/support` - Get support server link',
                        inline: false
                    },
                    {
                        name: '🎮 Interactive Controls',
                        value: 'Use the buttons on the Now Playing embed for quick controls:\n' +
                               '⏸️ Pause/Resume • ⏭️ Skip • 📜 Queue • ⏹️ Stop • 🔁 Loop\n' +
                               '🔉 Volume- • 🔊 Volume+ • ⏪ Seek -5s • ⏩ Seek +5s',
                        inline: false
                    }
                )
                .setFooter({ text: 'Made with ❤️ & JavaScript' })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        // Category-specific help
        let embed;
        switch (category) {
            case 'music':
                embed = createEmbed('info', 
                    '🎵 Music Commands',
                    '**Basic Controls:**\n' +
                    '`/play <song>` - Play music from multiple sources\n' +
                    '`/pause` - Pause current track\n' +
                    '`/resume` - Resume playback\n' +
                    '`/skip` - Skip to next track\n' +
                    '`/stop` - Stop and clear queue\n\n' +
                    '**Queue Management:**\n' +
                    '`/queue` - View current queue\n' +
                    '`/shuffle` - Shuffle queue order\n' +
                    '`/remove <position>` - Remove track from queue\n' +
                    '`/clear` - Clear entire queue\n\n' +
                    '**Playback Controls:**\n' +
                    '`/volume <1-100>` - Set volume level\n' +
                    '`/loop <off/track/queue>` - Set loop mode\n' +
                    '`/seek <time>` - Jump to specific time\n' +
                    '`/nowplaying` - Current track info\n' +
                    '`/disconnect` - Leave voice channel'
                );
                break;

            case 'info':
                embed = createEmbed('info',
                    'ℹ️ Information Commands',
                    '`/help` - Show all commands and features\n' +
                    '`/botinfo` - Bot statistics and system info\n' +
                    '`/invite` - Get bot invite link with permissions\n' +
                    '`/support` - Get support server link for help\n\n' +
                    '**Usage Tips:**\n' +
                    '• Use `/help <category>` for detailed command info\n' +
                    '• Interactive buttons provide quick access to common actions\n' +
                    '• Bot supports YouTube, Spotify, and SoundCloud'
                );
                break;

            case 'filters':
                embed = createEmbed('info',
                    '🎛️ Audio Filters',
                    '**Popular Filters:**\n' +
                    '`bassboost` - Enhanced bass response\n' +
                    '`nightcore` - High-pitched, fast tempo\n' +
                    '`vaporwave` - Slowed and reverbed\n' +
                    '`8d` - Simulated 8D audio effect\n' +
                    '`karaoke` - Vocal isolation\n' +
                    '`tremolo` - Volume modulation\n\n' +
                    '**Usage:**\n' +
                    '`/filter <filter_name>` - Apply audio filter\n' +
                    '`/filter clear` - Remove all filters\n\n' +
                    '**Note:** 40+ filters available! Use `/filter` to see all options.'
                );
                break;

            default:
                embed = createEmbed('error', `${config.emojis.error} Invalid category!`);
        }

        return interaction.editReply({ embeds: [embed] });
    }
};