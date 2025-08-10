const { filters } = require('./filters');

class Queue {
    constructor(guildId, voiceChannel, textChannel) {
        this.guildId = guildId;
        this.voiceChannel = voiceChannel;
        this.textChannel = textChannel;
        this.tracks = [];
        this.currentTrack = null;
        this.player = null;
        this.volume = 100;
        this.paused = false;
        this.loop = 'off'; // 'off', 'track', 'queue'
        this.currentFilter = null;
    }

    addTrack(track) {
        this.tracks.push(track);
    }

    removeTrack(index) {
        if (index >= 0 && index < this.tracks.length) {
            return this.tracks.splice(index, 1)[0];
        }
        return null;
    }

    clearTracks() {
        this.tracks = [];
    }

    async play(client) {
        if (this.tracks.length === 0) {
            this.currentTrack = null;
            return;
        }

        const track = this.tracks.shift();
        this.currentTrack = track;

        // Ensure player exists
        if (!this.player) {
            console.error('No player available for playback');
            this.playNext(client);
            return;
        }

        try {
            // Use the encoded track data for Shoukaku
            await this.player.playTrack({ 
                encodedTrack: track.encoded || track.track,
                noReplace: false 
            });
            
            if (this.volume !== 100) {
                await this.player.setGlobalVolume(this.volume);
            }
        } catch (error) {
            console.error('Error playing track:', error);
            console.error('Player state:', this.player ? 'exists' : 'null');
            console.error('Track data:', track);
            this.playNext(client);
        }
    }

    async playNext(client) {
        if (this.loop === 'track' && this.currentTrack) {
            // Replay current track
            try {
                await this.player.playTrack({ 
                    encodedTrack: this.currentTrack.encoded || this.currentTrack.track,
                    noReplace: false 
                });
            } catch (error) {
                console.error('Error replaying track:', error);
                this.playNext(client);
            }
            return;
        }

        if (this.loop === 'queue' && this.currentTrack) {
            // Add current track back to queue
            this.tracks.push(this.currentTrack);
        }

        if (this.tracks.length === 0) {
            this.currentTrack = null;
            
            // Check if 24/7 mode is enabled for this guild
            this.check247Mode(client);
            return;
        }

        await this.play(client);
    }

    pause() {
        this.paused = true;
        return this.player.setPaused(true);
    }

    resume() {
        this.paused = false;
        return this.player.setPaused(false);
    }

    skip() {
        return this.player.stopTrack();
    }

    stop() {
        this.tracks = [];
        this.currentTrack = null;
        return this.player.stopTrack();
    }

    async setVolume(volume) {
        this.volume = Math.max(0, Math.min(100, volume));
        return this.player.setGlobalVolume(this.volume);
    }

    setLoop(mode) {
        if (['off', 'track', 'queue'].includes(mode)) {
            this.loop = mode;
            return true;
        }
        return false;
    }

    async setFilter(filterName) {
        if (!filters[filterName]) {
            throw new Error(`Filter '${filterName}' not found`);
        }

        const filter = filters[filterName];
        this.currentFilter = filterName;

        try {
            await this.player.setFilters(filter);
            return true;
        } catch (error) {
            console.error('Error applying filter:', error);
            throw error;
        }
    }

    async clearFilters() {
        this.currentFilter = null;
        try {
            await this.player.setFilters({});
            return true;
        } catch (error) {
            console.error('Error clearing filters:', error);
            throw error;
        }
    }

    shuffle() {
        for (let i = this.tracks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
        }
    }

    isPlaying() {
        return this.currentTrack !== null && !this.paused;
    }

    async check247Mode(client) {
        try {
            const fs = require('fs').promises;
            const path = require('path');
            const dataPath = path.join(__dirname, '../Data/247.json');
            
            const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));
            const server247 = data.servers.find(s => s.guildId === this.guildId);
            
            if (!server247) {
                // Not in 24/7 mode, disconnect after 5 minutes
                setTimeout(() => {
                    if (!this.currentTrack && this.tracks.length === 0) {
                        this.destroy();
                        client.musicPlayer.delete(this.guildId);
                    }
                }, 300000); // 5 minutes
            }
            // If in 24/7 mode, stay connected
        } catch (error) {
            // File doesn't exist or error reading, use default behavior
            setTimeout(() => {
                if (!this.currentTrack && this.tracks.length === 0) {
                    this.destroy();
                    client.musicPlayer.delete(this.guildId);
                }
            }, 300000); // 5 minutes
        }
    }

    async seekTo(position) {
        if (!this.player || !this.currentTrack) {
            throw new Error('No track is currently playing');
        }
        
        try {
            const positionMs = Math.max(0, position * 1000);
            const trackDurationMs = this.currentTrack.info.length;
            const clampedPosition = Math.min(positionMs, trackDurationMs - 1000);
            
            // Use websocket message to Lavalink directly
            await this.player.node.ws.send(JSON.stringify({
                op: 'play',
                guildId: this.guildId,
                track: {
                    encoded: this.currentTrack.encoded,
                    userData: {}
                },
                position: clampedPosition
            }));
            
            return true;
        } catch (error) {
            console.error('Error seeking:', error);
            throw error;
        }
    }

    destroy() {
        this.tracks = [];
        this.currentTrack = null;
        if (this.player) {
            try {
                // Use correct disconnect method for Shoukaku
                if (typeof this.player.connection?.disconnect === 'function') {
                    this.player.connection.disconnect();
                } else if (typeof this.player.disconnect === 'function') {
                    this.player.disconnect();
                }
            } catch (error) {
                console.error('Error disconnecting player:', error);
            }
        }
    }

    clearTracks() {
        this.tracks = [];
    }

    shuffle() {
        for (let i = this.tracks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
        }
    }

    async join(voiceChannel, client) {
        if (!voiceChannel) {
            throw new Error('Voice channel is required');
        }
        
        try {
            // Create Shoukaku player using the correct method
            this.player = await client.shoukaku.joinVoiceChannel({
                guildId: voiceChannel.guild.id,
                channelId: voiceChannel.id,
                shardId: 0
            });
            
            console.log(`✅ Joined voice channel: ${voiceChannel.name}`);
            return this.player;
        } catch (error) {
            console.error('Error joining voice channel:', error);
            throw error;
        }
    }
}

// Global queue storage
const queues = new Map();

function getQueue(guildId) {
    return queues.get(guildId);
}

function createQueue(guildId, voiceChannel, textChannel) {
    const queue = new Queue(guildId, voiceChannel, textChannel);
    queues.set(guildId, queue);
    return queue;
}

function deleteQueue(guildId) {
    const queue = queues.get(guildId);
    if (queue) {
        queue.destroy();
        queues.delete(guildId);
    }
}

module.exports = {
    Queue,
    getQueue,
    createQueue,
    deleteQueue
};
