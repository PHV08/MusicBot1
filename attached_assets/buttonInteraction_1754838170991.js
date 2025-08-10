const { createEmbed } = require('../utils/embeds');
const { getQueue } = require('../utils/queue');
const config = require('../config');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isButton()) return;

        const queue = getQueue(interaction.guild.id);
        if (!queue) {
            return interaction.reply({ 
                embeds: [createEmbed('error', `${config.emojis.error} No music is currently playing!`)], 
                flags: 64 
            });
        }

        const member = interaction.member;
        if (!member.voice.channel) {
            return interaction.reply({ 
                embeds: [createEmbed('error', `${config.emojis.error} You must be in a voice channel!`)], 
                flags: 64 
            });
        }

        if (member.voice.channel.id !== queue.voiceChannel.id) {
            return interaction.reply({ 
                embeds: [createEmbed('error', `${config.emojis.error} You must be in the same voice channel as the bot!`)], 
                flags: 64 
            });
        }

        try {
            switch (interaction.customId) {
                case 'music_pause':
                    if (queue.paused) {
                        await queue.resume();
                        await interaction.reply({ 
                            embeds: [createEmbed('success', `${config.emojis.play} Music resumed!`)], 
                            flags: 64 
                        });
                    } else {
                        await queue.pause();
                        await interaction.reply({ 
                            embeds: [createEmbed('success', `${config.emojis.pause} Music paused!`)], 
                            flags: 64 
                        });
                    }
                    break;

                case 'music_skip':
                    if (queue.tracks.length === 0 && !queue.currentTrack) {
                        return interaction.reply({ 
                            embeds: [createEmbed('error', `${config.emojis.error} No more tracks to skip!`)], 
                            flags: 64 
                        });
                    }
                    await queue.skip();
                    await interaction.reply({ 
                        embeds: [createEmbed('success', `${config.emojis.skip} Track skipped!`)], 
                        flags: 64 
                    });
                    break;

                case 'music_stop':
                    await queue.stop();
                    queue.destroy();
                    client.musicPlayer.delete(interaction.guild.id);
                    await interaction.reply({ 
                        embeds: [createEmbed('success', `${config.emojis.stop} Music stopped and queue cleared!`)], 
                        ephemeral: true 
                    });
                    break;

                case 'music_queue':
                    if (queue.tracks.length === 0) {
                        return interaction.reply({ 
                            embeds: [createEmbed('info', `${config.emojis.music} Queue is empty!`)], 
                            ephemeral: true 
                        });
                    }

                    let queueString = '';
                    for (let i = 0; i < Math.min(10, queue.tracks.length); i++) {
                        const track = queue.tracks[i];
                        queueString += `${i + 1}. **[${track.info.title}](${track.info.uri})**\n`;
                    }

                    if (queue.tracks.length > 10) {
                        queueString += `\n*... and ${queue.tracks.length - 10} more tracks*`;
                    }

                    const embed = createEmbed('info', 
                        `${config.emojis.music} Queue (${queue.tracks.length} tracks)`,
                        queueString
                    );
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                    break;

                case 'music_loop':
                    const loopModes = ['off', 'track', 'queue'];
                    const currentIndex = loopModes.indexOf(queue.loop);
                    const nextMode = loopModes[(currentIndex + 1) % loopModes.length];
                    queue.setLoop(nextMode);

                    const loopEmojis = {
                        'off': '📴 Loop disabled',
                        'track': '🔂 Looping current track',
                        'queue': '🔁 Looping queue'
                    };

                    await interaction.reply({ 
                        embeds: [createEmbed('success', `${loopEmojis[nextMode]}`)], 
                        ephemeral: true 
                    });
                    break;

                case 'music_volume_down':
                    const newVolumeDown = Math.max(0, queue.volume - 10);
                    await queue.setVolume(newVolumeDown);
                    await interaction.reply({ 
                        embeds: [createEmbed('success', `🔉 Volume set to ${newVolumeDown}%`)], 
                        flags: 64 
                    });
                    break;

                case 'music_volume_up':
                    const newVolumeUp = Math.min(100, queue.volume + 10);
                    await queue.setVolume(newVolumeUp);
                    await interaction.reply({ 
                        embeds: [createEmbed('success', `🔊 Volume set to ${newVolumeUp}%`)], 
                        flags: 64 
                    });
                    break;

                case 'music_shuffle':
                    if (queue.tracks.length < 2) {
                        return interaction.reply({ 
                            embeds: [createEmbed('error', `${config.emojis.error} Need at least 2 tracks in queue to shuffle!`)], 
                            flags: 64 
                        });
                    }
                    
                    queue.shuffle();
                    await interaction.reply({ 
                        embeds: [createEmbed('success', `🔀 Queue shuffled! (${queue.tracks.length} tracks)`)], 
                        flags: 64 
                    });
                    break;

                case 'music_clear_queue':
                    if (queue.tracks.length === 0) {
                        return interaction.reply({ 
                            embeds: [createEmbed('error', `${config.emojis.error} Queue is already empty!`)], 
                            flags: 64 
                        });
                    }
                    
                    const clearedCount = queue.tracks.length;
                    queue.clearTracks();
                    await interaction.reply({ 
                        embeds: [createEmbed('success', `🗑️ Cleared ${clearedCount} tracks from queue!`)], 
                        flags: 64 
                    });
                    break;

                case 'music_disconnect':
                    await queue.stop();
                    queue.destroy();
                    client.musicPlayer.delete(interaction.guild.id);
                    await interaction.reply({ 
                        embeds: [createEmbed('success', `👋 Disconnected from voice channel!`)], 
                        flags: 64 
                    });
                    break;

                case 'music_clear_filter':
                    try {
                        await queue.clearFilters();
                        await interaction.reply({ 
                            embeds: [createEmbed('success', `🔄 All filters cleared!`)], 
                            ephemeral: true 
                        });
                    } catch (error) {
                        await interaction.reply({ 
                            embeds: [createEmbed('error', `${config.emojis.error} Failed to clear filters!`)], 
                            ephemeral: true 
                        });
                    }
                    break;

                default:
                    await interaction.reply({ 
                        embeds: [createEmbed('error', `${config.emojis.error} Unknown button action!`)], 
                        ephemeral: true 
                    });
            }
        } catch (error) {
            console.error('Button interaction error:', error);
            await interaction.reply({ 
                embeds: [createEmbed('error', `${config.emojis.error} An error occurred!`)], 
                ephemeral: true 
            }).catch(() => {});
        }
    }
};