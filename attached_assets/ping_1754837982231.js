const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check bot latency and response time'),

    async execute(interaction, client) {
        return this.executeSlash(interaction, client);
    },

    async executeSlash(interaction, client) {
        const sent = await interaction.deferReply({ fetchReply: true });
        
        const botLatency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(client.ws.ping);
        
        // Determine latency quality
        const getBotLatencyStatus = (latency) => {
            if (latency < 100) return { emoji: '🟢', status: 'Excellent' };
            if (latency < 200) return { emoji: '🟡', status: 'Good' };
            if (latency < 500) return { emoji: '🟠', status: 'Fair' };
            return { emoji: '🔴', status: 'Poor' };
        };

        const getAPILatencyStatus = (latency) => {
            if (latency < 100) return { emoji: '🟢', status: 'Excellent' };
            if (latency < 200) return { emoji: '🟡', status: 'Good' };
            if (latency < 500) return { emoji: '🟠', status: 'Fair' };
            return { emoji: '🔴', status: 'Poor' };
        };

        const botStatus = getBotLatencyStatus(botLatency);
        const apiStatus = getAPILatencyStatus(apiLatency);

        // Get uptime
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const uptimeString = `${days}d ${hours}h ${minutes}m`;

        const embed = createEmbed('success',
            '🏓 Pong!',
            `${botStatus.emoji} **Bot Latency:** ${botLatency}ms *(${botStatus.status})*\n` +
            `${apiStatus.emoji} **API Latency:** ${apiLatency}ms *(${apiStatus.status})*\n` +
            `⏱️ **Uptime:** ${uptimeString}\n` +
            `🎵 **Active Sessions:** ${client.shoukaku.players.size}\n` +
            `📡 **Servers:** ${client.guilds.cache.size}`
        );

        embed.setFooter({ 
            text: `Requested by ${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        });
        embed.setTimestamp();

        return interaction.editReply({ embeds: [embed] });
    }
};