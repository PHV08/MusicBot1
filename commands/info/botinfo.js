const { SlashCommandBuilder, EmbedBuilder, version: djsVersion } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const config = require('../../config');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Display bot statistics and system information'),

    async execute(interaction, client) {
        return this.executeSlash(interaction, client);
    },

    async executeSlash(interaction, client) {
        await interaction.deferReply();

        try {
            // Calculate uptime
            const uptime = process.uptime();
            const days = Math.floor(uptime / 86400);
            const hours = Math.floor((uptime % 86400) / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);
            
            const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

            // Memory usage
            const memoryUsage = process.memoryUsage();
            const memoryUsed = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
            const memoryTotal = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
            const memoryFree = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);

            // Bot statistics
            const guilds = client.guilds.cache.size;
            const users = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
            const channels = client.channels.cache.size;
            const activeConnections = client.shoukaku.players.size;

            // System info
            const platform = os.platform();
            const architecture = os.arch();
            const nodeVersion = process.version;
            const cpuCount = os.cpus().length;
            const loadAvg = os.loadavg()[0].toFixed(2);

            // Bot version and features
            const botVersion = '2.0.0';
            const features = [
                'Multi-source music (YouTube, Spotify, SoundCloud)',
                '40+ Audio filters and effects',
                'Interactive button controls',
                '24/7 voice channel mode',
                'Queue management system',
                'High-quality Lavalink audio'
            ];

            const embed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle(`${config.emojis.music} Bot Information`)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    {
                        name: '🤖 Bot Statistics',
                        value: `**Servers:** ${guilds.toLocaleString()}\n` +
                               `**Users:** ${users.toLocaleString()}\n` +
                               `**Channels:** ${channels.toLocaleString()}\n` +
                               `**Active Music Sessions:** ${activeConnections}`,
                        inline: true
                    },
                    {
                        name: '⚡ Performance',
                        value: `**Uptime:** ${uptimeString}\n` +
                               `**Memory Usage:** ${memoryUsed} MB\n` +
                               `**System RAM:** ${memoryFree}GB / ${memoryTotal}GB\n` +
                               `**CPU Load:** ${loadAvg}%`,
                        inline: true
                    },
                    {
                        name: '🛠️ Technical Info',
                        value: `**Bot Version:** v${botVersion}\n` +
                               `**Discord.js:** v${djsVersion}\n` +
                               `**Node.js:** ${nodeVersion}\n` +
                               `**Platform:** ${platform} (${architecture})\n` +
                               `**CPU Cores:** ${cpuCount}`,
                        inline: true
                    },
                    {
                        name: '✨ Key Features',
                        value: features.map(feature => `• ${feature}`).join('\n'),
                        inline: false
                    },
                    {
                        name: '🔗 Useful Links',
                        value: `[Invite Bot](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=3148800&scope=bot%20applications.commands) • ` +
                               `[Support Server](https://discord.gg/support) • ` +
                               `[Documentation](https://musicbot.dev/docs)`,
                        inline: false
                    }
                )
                .setFooter({ 
                    text: `Made with ❤️ & JavaScript | Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Botinfo command error:', error);
            const embed = createEmbed('error', `${config.emojis.error} An error occurred while fetching bot information!`);
            return interaction.editReply({ embeds: [embed] });
        }
    }
};