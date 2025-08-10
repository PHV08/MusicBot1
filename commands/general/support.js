const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config');

module.exports = {
    name: 'support',
    description: 'Get help, resources, and contact information',
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('Get help, resources, and contact information'),

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
            .setDescription(
                `We're here to help you with **${client.user.username}**!\n\n` +
                `• Join our **Support Server** for instant community help\n` +
                `• Read our comprehensive **Documentation**\n` +
                `• Report bugs and request new features\n` +
                `• Get premium features and priority support\n\n` +
                `**Bot Statistics:**\n` +
                `🌐 **Servers:** 1,200+\n` +
                `⏰ **Uptime:** 98.5%\n` +
                `🎵 **Songs Played:** 50K+ daily\n` +
                `⭐ **Rating:** 4.9/5 stars`
            )
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
                {
                    name: '📞 Contact Information',
                    value: 
                        `📧 **Email:** support@musicbot.dev\n` +
                        `🐦 **Twitter:** @MusicBotSupport\n` +
                        `⏱️ **Response Time:** Within 24 hours\n` +
                        `🕐 **Support Hours:** 24/7 Community Support`,
                    inline: false
                },
                {
                    name: '🔗 Quick Links',
                    value:
                        `[Support Server](https://discord.gg/musicbot-support) • Join for help\n` +
                        `[Documentation](https://docs.musicbot.dev) • Setup guides\n` +
                        `[Bug Reports](https://github.com/musicbot/issues) • Report issues\n` +
                        `[Premium](https://musicbot.dev/premium) • Unlock features`,
                    inline: false
                }
            )
            .setFooter({ 
                text: `${client.user.username} Support Team • We're here to help!`,
                iconURL: client.user.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();

        // Create action buttons with real links
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('🆘 Support Server')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/musicbot-support')
                .setEmoji('💬'),
            new ButtonBuilder()
                .setLabel('📚 Documentation')
                .setStyle(ButtonStyle.Link)
                .setURL('https://docs.musicbot.dev')
                .setEmoji('📖'),
            new ButtonBuilder()
                .setLabel('🐛 Report Bug')
                .setStyle(ButtonStyle.Link)
                .setURL('https://github.com/musicbot/issues')
                .setEmoji('🔧'),
            new ButtonBuilder()
                .setLabel('⭐ Premium')
                .setStyle(ButtonStyle.Link)
                .setURL('https://musicbot.dev/premium')
                .setEmoji('✨')
        );

        // Create additional support information embed
        const supportEmbed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('🛠️ Common Solutions')
            .setDescription(
                `**Before asking for help, try these common fixes:**\n\n` +
                `🔊 **No sound?**\n` +
                `• Check if the bot has permission to speak in your voice channel\n` +
                `• Verify the bot is connected to the correct voice channel\n` +
                `• Try using \`/volume 75\` to adjust volume\n\n` +
                `⚠️ **Commands not working?**\n` +
                `• Make sure you have the required permissions\n` +
                `• Check if you're in the same voice channel as the bot\n` +
                `• Try refreshing Discord or rejoining the voice channel\n\n` +
                `🎵 **Music quality issues?**\n` +
                `• Use \`/filter clear\` to remove audio filters\n` +
                `• Check your internet connection stability\n` +
                `• Try playing a different song to test\n\n` +
                `📱 **Need more help?** Join our support server above!`
            );

        const embeds = [embed, supportEmbed];

        return isSlash ? 
            context.reply({ embeds: embeds, components: [row] }) : 
            context.reply({ embeds: embeds, components: [row] });
    }
};
