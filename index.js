const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Shoukaku, Connectors } = require('shoukaku');
const fs = require('fs');
const path = require('path');
const config = require('./config');

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Initialize collections
client.commands = new Collection();
client.slashCommands = new Collection();
client.musicPlayer = new Collection();

// Initialize Shoukaku
const LavalinkServer = [{
    name: 'main',
    url: process.env.LAVALINK_URL || 'lavalink.jirayu.net:13592',
    auth: process.env.LAVALINK_PASSWORD || 'youshallnotpass',
    secure: false
}];

client.shoukaku = new Shoukaku(new Connectors.DiscordJS(client), LavalinkServer, {
    moveOnDisconnect: false,
    resumable: false,
    resumableTimeout: 30,
    reconnectTries: 2,
    restTimeout: 10000
});

// Load commands
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
        if (command.data) {
            client.slashCommands.set(command.data.name, command);
        }
    }
}

// Load events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Shoukaku events
client.shoukaku.on('ready', (name) => {
    console.log(`✅ Lavalink ${name} is ready!`);
});

client.shoukaku.on('error', (name, error) => {
    console.error(`❌ Lavalink ${name} error:`, error);
});

client.shoukaku.on('disconnect', (name, players, moved) => {
    if (moved) return;
    console.log(`🔌 Lavalink ${name} disconnected`);
});

// Login
client.login(process.env.DISCORD_TOKEN || config.token);
