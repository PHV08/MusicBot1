const { REST, Routes } = require('discord.js');
const config = require('../config');
const fs = require('fs');
const path = require('path');
const { createQueue } = require('../utils/queue');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`✅ ${client.user.tag} is online!`);
        
        // Set bot activity
        client.user.setActivity('🎵 Music | /help', { type: 'LISTENING' });

        // Register slash commands
        const commands = [];
        client.slashCommands.forEach(command => {
            commands.push(command.data.toJSON());
        });

        const rest = new REST({ version: '10' }).setToken(client.token);

        try {
            console.log('🔄 Loading Slash Commands.');

            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands }
            );

            console.log('✅ Successfully reloaded Slash Commands.');
        } catch (error) {
            console.error('❌ Error refreshing commands:', error);
        }

        // Auto-reconnect to 24/7 voice channels with delay for Lavalink
        setTimeout(async () => {
            await reconnect247Channels(client);
        }, 5000); // Wait 5 seconds for Lavalink to be fully ready
    }
};

async function reconnect247Channels(client) {
    try {
        const dataPath = path.join(__dirname, '..', 'Data', '247.json');
        
        if (!fs.existsSync(dataPath)) {
            return; // No 24/7 data exists yet
        }
        
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        
        if (!data.servers || data.servers.length === 0) {
            return; // No servers have 24/7 enabled
        }
        
        // Check if Lavalink nodes are available
        if (!client.shoukaku || client.shoukaku.nodes.size === 0) {
            console.log('⚠️ No Lavalink nodes available, skipping 24/7 reconnection...');
            return;
        }
        
        console.log(`🔄 Reconnecting to ${data.servers.length} 24/7 voice channels...`);
        
        for (const server of data.servers) {
            try {
                const guild = client.guilds.cache.get(server.guildId);
                if (!guild) {
                    console.log(`⚠️ Guild ${server.guildId} not found, skipping...`);
                    continue;
                }
                
                const voiceChannel = guild.channels.cache.get(server.channelId);
                if (!voiceChannel) {
                    console.log(`⚠️ Voice channel ${server.channelId} not found in guild ${guild.name}, skipping...`);
                    continue;
                }
                
                // Check if bot has permissions
                if (!voiceChannel.joinable || !voiceChannel.speakable) {
                    console.log(`⚠️ No permissions to join/speak in ${voiceChannel.name} in ${guild.name}, skipping...`);
                    continue;
                }
                
                // Get a text channel for the queue (preferably the system channel or first available)
                const textChannel = guild.systemChannel || guild.channels.cache.find(ch => ch.type === 0 && ch.viewable);
                if (!textChannel) {
                    console.log(`⚠️ No accessible text channel found in guild ${guild.name}, skipping...`);
                    continue;
                }
                
                // Create queue and join voice channel with retry logic
                const queue = createQueue(guild.id, voiceChannel, textChannel);
                await queue.join(voiceChannel, client);
                console.log(`✅ Joined voice channel: ${voiceChannel.name}`);
                
            } catch (error) {
                console.error(`❌ Error reconnecting to guild ${server.guildId}:`, error.message);
            }
        }
        
    } catch (error) {
        console.error('❌ Error reading 24/7 data:', error);
    }
}
