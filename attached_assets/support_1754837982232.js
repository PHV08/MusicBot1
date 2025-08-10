const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('Get help, resources, and contact links'),

    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor('#00AE86')
            .setTitle('🆘 Need Help?')
            .setDescription(`We're here to help you with **${client.user.username}**!\n\n` +
                `• Join our **Support Server**\n` +
                `• Read the **Documentation**\n` +
                `• Report bugs or request features`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ 
                text: `${client.user.username} Support Team`,
                iconURL: client.user.displayAvatarURL({ dynamic: true })
            });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('🆘 Support Server')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/example'),
            new ButtonBuilder()
                .setLabel('📚 Documentation')
                .setStyle(ButtonStyle.Link)
                .setURL('https://yourbotdocs.com'),
            new ButtonBuilder()
                .setLabel('🐛 Report Bug')
                .setStyle(ButtonStyle.Link)
                .setURL('https://github.com/yourbot/issues')
        );

        await interaction.reply({ embeds: [embed], components: [row] });
    }
};
