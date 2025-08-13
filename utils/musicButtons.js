const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function createMusicButtons(queue) {
    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("music_pause")
            .setLabel(queue.paused ? "▶️ Resume" : "⏸️ Pause")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("music_skip")
            .setLabel("⏭️ Skip")
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId("music_queue")
            .setLabel("📜 Queue")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("music_stop")
            .setLabel("⏹️ Stop")
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId("music_loop")
            .setLabel(getLoopLabel(queue.loop))
            .setStyle(getLoopStyle(queue.loop)),
    );

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("music_volume_down")
            .setLabel("🔉 Vol-")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("music_volume_up")
            .setLabel("🔊 Vol+")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("music_shuffle")
            .setLabel("🔀 Shuffle")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("music_clear_queue")
            .setLabel("🗑️ Clear")
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId("music_disconnect")
            .setLabel("👋 Leave")
            .setStyle(ButtonStyle.Secondary),
    );

    return [row1, row2];
}

function getLoopLabel(loopMode) {
    switch (loopMode) {
        case 'track':
            return '🔂 Track';
        case 'queue':
            return '🔁 Queue';
        default:
            return '📴 Loop';
    }
}

function getLoopStyle(loopMode) {
    switch (loopMode) {
        case 'track':
        case 'queue':
            return ButtonStyle.Success;
        default:
            return ButtonStyle.Secondary;
    }
}

module.exports = {
    createMusicButtons
};