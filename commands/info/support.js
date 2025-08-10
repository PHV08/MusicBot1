const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config');

module.exports = {
    name: 'support',
    description: 'Get help, resources, and contact links',
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('Get help, resources, and contact links'),

    async execute(message, args, client) {
        return await this.handleSupport(message, client, false);
    },

    async executeSlash(interaction, client) {
        return await this.handleSupport(interaction, client, true);
    },

    async handleSupport(context, client, isSlash) {
        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setTitle('🆘 Need Help?')
            .setDescription(`We're here to help you with **${client.user.username}**!\n\n` +
                `• Join our **Support Server** for live help\n` +
                `• Read the **Documentation** and guides\n` +
                `• Report bugs or request new features\n` +
                `• Get premium support and updates\n\n` +
                `**Common Issues & Solutions:**\n` +
                `🔊 **No sound?** Check bot permissions in voice channel\n` +
                `⚠️ **Commands not working?** Make sure you're in the same voice channel\n` +
                `🎵 **Poor quality?** Try using \`/filter clear\` command`)
            .addFields(
                {
                    name: '📞 Contact Information',
                    value: `📧 **Email:** musicbot.support@gmail.com\n🐦 **Twitter:** @MusicBotHelp\n⏰ **Response Time:** Within 24 hours`,
                    inline: false
                },
                {
                    name: '📊 Bot Statistics',
                    value: `🌐 **Servers:** ${client.guilds.cache.size}\n👥 **Users:** ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}\n🎵 **Active Sessions:** ${client.shoukaku?.players?.size || 0}`,
                    inline: false
                }
            )
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ 
                text: `${client.user.username} Support Team • We're here to help!`,
                iconURL: client.user.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('🆘 Support Server')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/musicbot-support'),
            new ButtonBuilder()
                .setLabel('📚 Documentation')
                .setStyle(ButtonStyle.Link)
                .setURL('https://docs.musicbot.com'),
            new ButtonBuilder()
                .setLabel('🐛 Report Bug')
                .setStyle(ButtonStyle.Link)
                .setURL('https://github.com/musicbot/issues'),
            new ButtonBuilder()
                .setLabel('⭐ Rate Bot')
                .setStyle(ButtonStyle.Link)
                .setURL('https://top.gg/bot/' + client.user.id)
        );

        return isSlash ? 
            context.reply({ embeds: [embed], components: [row] }) : 
            context.reply({ embeds: [embed], components: [row] });
    }
};
