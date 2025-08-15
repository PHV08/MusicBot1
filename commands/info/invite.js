const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Get the bot invite link with proper permissions'),

    async execute(interaction, client) {
        return this.executeSlash(interaction, client);
    },

    async executeSlash(interaction, client) {
        await interaction.deferReply();

        try {
            // Required permissions for music bot functionality
            const permissions = [
                'ViewChannel',
                'SendMessages',
                'EmbedLinks',
                'AttachFiles', 
                'ReadMessageHistory',
                'UseExternalEmojis',
                'AddReactions',
                'Connect',
                'Speak',
                'UseVAD',
                'ManageMessages'
            ];

            // Create invite URLs with different permission levels
            const adminInvite = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;
            const musicInvite = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=3148800&scope=bot%20applications.commands`;
            const basicInvite = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=2150911040&scope=bot%20applications.commands`;

            const embed = new EmbedBuilder()
                .setColor(config.embedColor)
                .setTitle(`${config.emojis.success} Invite ${client.user.username} to Your Server!`)
                .setDescription('Choose the appropriate invite link based on your needs:')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    {
                        name: '🎵 Recommended: Music Bot Permissions',
                        value: 'Perfect for music functionality with all required permissions:\n' +
                               '• Connect and speak in voice channels\n' +
                               '• Send messages and embeds\n' +
                               '• Manage messages for clean chat\n' +
                               '• Use external emojis and reactions',
                        inline: false
                    },
                    {
                        name: '⚡ Administrator Permissions',
                        value: 'Full access for server management and advanced features:\n' +
                               '• All music bot features\n' +
                               '• Server management capabilities\n' +
                               '• Bypass channel permission restrictions\n' +
                               '• Recommended for trusted environments only',
                        inline: false
                    },
                    {
                        name: '🔒 Basic Permissions',
                        value: 'Minimal permissions for basic music functionality:\n' +
                               '• Essential voice and text permissions\n' +
                               '• Limited server access\n' +
                               '• Good for servers with strict permission policies',
                        inline: false
                    },
                    {
                        name: '📋 Required Permissions List',
                        value: permissions.map(perm => `• ${perm}`).join('\n'),
                        inline: false
                    },
                    {
                        name: '💡 Setup Tips',
                        value: '• Make sure the bot role is above music channel roles\n' +
                               '• Grant voice channel access where you want music\n' +
                               '• Use `/help` after inviting to see all commands\n' +
                               '• Configure 24/7 mode with `/247` if needed',
                        inline: false
                    }
                )
                .setFooter({ 
                    text: `Thank you for choosing ${client.user.username}! | Made with ❤️ & JavaScript`,
                    iconURL: client.user.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp();

            // Create action buttons for different invite links
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('🎵 Music Bot (Recommended)')
                        .setStyle(ButtonStyle.Link)
                        .setURL(musicInvite),
                    new ButtonBuilder()
                        .setLabel('⚡ Administrator')
                        .setStyle(ButtonStyle.Link)
                        .setURL(adminInvite),
                    new ButtonBuilder()
                        .setLabel('🔒 Basic Permissions')
                        .setStyle(ButtonStyle.Link)
                        .setURL(basicInvite)
                );

            const supportRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('📞 Support Server')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://discord.gg/support'),
                    new ButtonBuilder()
                        .setLabel('📚 Documentation')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://musicbot.dev/docs'),
                    new ButtonBuilder()
                        .setLabel('⭐ Rate on Top.gg')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://top.gg/bot/' + client.user.id)
                );

            return interaction.editReply({ 
                embeds: [embed], 
                components: [row, supportRow] 
            });

        } catch (error) {
            console.error('Invite command error:', error);
            const embed = createEmbed('error', `${config.emojis.error} An error occurred while generating invite links!`);
            return interaction.editReply({ embeds: [embed] });
        }
    }
};