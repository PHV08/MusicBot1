const { createEmbed } = require('./embeds');
const config = require('../config');

class MusicPlayer {
    constructor() {
        this.players = new Map();
    }

    async createPlayer(guild, voiceChannel, textChannel, node) {
        try {
            const player = await node.joinChannel({
                guildId: guild.id,
                channelId: voiceChannel.id,
                shardId: guild.shardId
            });

            const playerData = {
                guild,
                voiceChannel,
                textChannel,
                player,
                queue: [],
                currentTrack: null,
                volume: 100,
                paused: false,
                loop: false,
                filters: {},
                currentFilter: null
            };

            this.players.set(guild.id, playerData);
            this.setupPlayerEvents(playerData);

            return playerData;
        } catch (error) {
            console.error('Error creating player:', error);
            throw error;
        }
    }

    setupPlayerEvents(playerData) {
        const { player, textChannel } = playerData;

        player.on('end', data => {
            if (data.reason === 'replaced') return;
            this.handleTrackEnd(playerData);
        });

        player.on('closed', data => {
            this.destroyPlayer(playerData.guild.id);
        });

        player.on('exception', exception => {
            console.error('Player exception:', exception);
            const embed = createEmbed('error', `${config.emojis.error} An error occurred while playing music!`);
            textChannel.send({ embeds: [embed] }).catch(console.error);
        });
    }

    async handleTrackEnd(playerData) {
        const { guild, player, queue, loop } = playerData;

        if (loop === 'track' && playerData.currentTrack) {
            await this.playTrack(playerData, playerData.currentTrack);
            return;
        }

        if (queue.length === 0) {
            if (loop === 'queue' && playerData.currentTrack) {
                queue.push(playerData.currentTrack);
            } else {
                playerData.currentTrack = null;
                return;
            }
        }

        const nextTrack = queue.shift();
        if (loop === 'queue' && playerData.currentTrack) {
            queue.push(playerData.currentTrack);
        }

        await this.playTrack(playerData, nextTrack);
    }

    async playTrack(playerData, track) {
        const { player, textChannel } = playerData;

        try {
            playerData.currentTrack = track;
            await player.playTrack({ track: track.track });

            const embed = createEmbed('success',
                `${config.emojis.play} Now Playing`,
                `**[${track.info.title}](https://discord.gg/5J6QdeQwnB)**\n` +
                `${config.emojis.music} Duration: \`${this.formatTime(track.info.length)}\`\n` +
                `👤 Requested by: ${track.requester}`
            );

            textChannel.send({ embeds: [embed] }).catch(console.error);
        } catch (error) {
            console.error('Error playing track:', error);
            const embed = createEmbed('error', `${config.emojis.error} Failed to play: **${track.info.title}**`);
            textChannel.send({ embeds: [embed] }).catch(console.error);
        }
    }

    getPlayer(guildId) {
        return this.players.get(guildId);
    }

    destroyPlayer(guildId) {
        const playerData = this.players.get(guildId);
        if (playerData) {
            try {
                playerData.player.disconnect();
            } catch (error) {
                console.error('Error disconnecting player:', error);
            }
            this.players.delete(guildId);
        }
    }

    formatTime(ms) {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor(ms / (1000 * 60 * 60));
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

module.exports = new MusicPlayer();
