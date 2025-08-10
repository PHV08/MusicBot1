const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../../utils/embeds');
const config = require('../../config');
const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '../../Data/247.json');

async function loadData() {
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { servers: [] };
    }
}

async function saveData(data) {
    try {
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving 24/7 data:', error);
        return false;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('247')
        .setDescription('Toggle 24/7 mode - bot stays in voice channel')
        .addSubcommand(subcommand =>
            subcommand
                .setName('enable')
                .setDescription('Enable 24/7 mode')
                .addChannelOption(option =>
                    option
                        .setName('channel')
                        .setDescription('Voice channel to stay in')
                        .addChannelTypes(ChannelType.GuildVoice)
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('disable')
                .setDescription('Disable 24/7 mode')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Check 24/7 mode status')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction, client) {
        return this.executeSlash(interaction, client);
    },

    async executeSlash(interaction, client) {
        await interaction.deferReply();

        const { guild, member } = interaction;
        const subcommand = interaction.options.getSubcommand();

        try {
            const data = await loadData();
            const serverIndex = data.servers.findIndex(s => s.guildId === guild.id);
            const isEnabled = serverIndex !== -1;

            switch (subcommand) {
                case 'enable':
                    if (isEnabled) {
                        const embed = createEmbed('error', `${config.emojis.error} 24/7 mode is already enabled!`);
                        return interaction.editReply({ embeds: [embed] });
                    }

                    const voiceChannel = interaction.options.getChannel('channel') || member.voice.channel;
                    
                    if (!voiceChannel) {
                        const embed = createEmbed('error', `${config.emojis.error} You must be in a voice channel or specify one!`);
                        return interaction.editReply({ embeds: [embed] });
                    }

                    if (voiceChannel.type !== ChannelType.GuildVoice) {
                        const embed = createEmbed('error', `${config.emojis.error} Please specify a valid voice channel!`);
                        return interaction.editReply({ embeds: [embed] });
                    }

                    // Check bot permissions
                    const botMember = guild.members.cache.get(client.user.id);
                    if (!voiceChannel.permissionsFor(botMember).has(['Connect', 'Speak'])) {
                        const embed = createEmbed('error', `${config.emojis.error} I don't have permission to join that voice channel!`);
                        return interaction.editReply({ embeds: [embed] });
                    }

                    // Check if bot is already connected
                    const existingPlayer = client.shoukaku.players.get(guild.id);
                    let targetChannelId = voiceChannel.id;
                    
                    if (existingPlayer) {
                        // Bot is already connected, use current channel
                        const currentChannel = guild.channels.cache.get(existingPlayer.voiceChannelId);
                        if (currentChannel) {
                            targetChannelId = currentChannel.id;
                        }
                    } else {
                        // Join the voice channel
                        try {
                            await client.shoukaku.joinVoiceChannel({
                                guildId: guild.id,
                                channelId: voiceChannel.id,
                                shardId: guild.shardId
                            });
                        } catch (error) {
                            console.error('Error joining voice channel for 24/7:', error);
                            const embed = createEmbed('error', `${config.emojis.error} Failed to join voice channel!`);
                            return interaction.editReply({ embeds: [embed] });
                        }
                    }

                    // Save to data
                    data.servers.push({
                        guildId: guild.id,
                        channelId: targetChannelId,
                        enabledAt: new Date().toISOString(),
                        enabledBy: member.user.id
                    });

                    await saveData(data);

                    const targetChannel = guild.channels.cache.get(targetChannelId);
                    const embed = createEmbed('success', 
                        `${config.emojis.success} 24/7 Mode Enabled`,
                        `Bot will stay connected to ${targetChannel}\n` +
                        `${config.emojis.music} The bot will remain in the voice channel even when not playing music\n` +
                        `⚙️ Use \`/247 disable\` to turn off 24/7 mode`
                    );
                    return interaction.editReply({ embeds: [embed] });

                case 'disable':
                    if (!isEnabled) {
                        const embed = createEmbed('error', `${config.emojis.error} 24/7 mode is not enabled!`);
                        return interaction.editReply({ embeds: [embed] });
                    }

                    // Remove from data
                    data.servers.splice(serverIndex, 1);
                    await saveData(data);

                    // Leave voice channel if no music is playing
                    const queue = client.musicPlayer.get(guild.id);
                    if (!queue || !queue.isPlaying()) {
                        try {
                            await client.shoukaku.leaveVoiceChannel(guild.id);
                        } catch (error) {
                            console.error('Error leaving voice channel:', error);
                        }
                    }

                    const disableEmbed = createEmbed('success', 
                        `${config.emojis.success} 24/7 Mode Disabled`,
                        `The bot will now leave voice channels when not playing music`
                    );
                    return interaction.editReply({ embeds: [disableEmbed] });

                case 'status':
                    if (!isEnabled) {
                        const embed = createEmbed('info', 
                            `${config.emojis.music} 24/7 Status`,
                            `❌ 24/7 mode is **disabled**\n` +
                            `Use \`/247 enable\` to enable it`
                        );
                        return interaction.editReply({ embeds: [embed] });
                    }

                    const serverData = data.servers[serverIndex];
                    const channel = guild.channels.cache.get(serverData.channelId);
                    const enabledUser = guild.members.cache.get(serverData.enabledBy);
                    const enabledDate = new Date(serverData.enabledAt).toLocaleString();

                    const statusEmbed = createEmbed('success', 
                        `${config.emojis.success} 24/7 Status`,
                        `✅ 24/7 mode is **enabled**\n` +
                        `🔊 Channel: ${channel || 'Unknown channel'}\n` +
                        `👤 Enabled by: ${enabledUser || 'Unknown user'}\n` +
                        `📅 Enabled on: ${enabledDate}`
                    );
                    return interaction.editReply({ embeds: [statusEmbed] });

                default:
                    const errorEmbed = createEmbed('error', `${config.emojis.error} Unknown subcommand!`);
                    return interaction.editReply({ embeds: [errorEmbed] });
            }

        } catch (error) {
            console.error('247 command error:', error);
            const embed = createEmbed('error', `${config.emojis.error} An error occurred while managing 24/7 mode!`);
            return interaction.editReply({ embeds: [embed] });
        }
    }
};