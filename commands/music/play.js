const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../../config");
const { createEmbed } = require("../../utils/embeds");
const { getQueue, createQueue } = require("../../utils/queue");

module.exports = {
    name: "play",
    description: "Play music from YouTube, Spotify, or SoundCloud",
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription(
            "Play music from YouTube, Spotify, SoundCloud or direct URL",
        )
        .addStringOption((option) =>
            option
                .setName("query")
                .setDescription(
                    "Song name, URL, or search with prefix (ytsearch:, spsearch:, scsearch:)",
                )
                .setRequired(true),
        ),

    async execute(message, args, client) {
        const query = args.join(" ");
        return await this.handlePlay(message, query, client, false);
    },

    async executeSlash(interaction, client) {
        const query = interaction.options.getString("query");
        return await this.handlePlay(interaction, query, client, true);
    },

    async handlePlay(context, query, client, isSlash) {
        const member = isSlash ? context.member : context.member;
        const guild = isSlash ? context.guild : context.guild;
        const channel = isSlash ? context.channel : context.channel;

        // Check if user is in voice channel
        if (!member.voice.channel) {
            const embed = createEmbed(
                "error",
                `${config.emojis.error} You need to be in a voice channel!`,
            );
            return isSlash
                ? context.reply({ embeds: [embed] })
                : context.reply({ embeds: [embed] });
        }

        // Check bot permissions
        const permissions = member.voice.channel.permissionsFor(client.user);
        if (!permissions.has(["Connect", "Speak"])) {
            const embed = createEmbed(
                "error",
                `${config.emojis.error} I need permissions to join and speak in your voice channel!`,
            );
            return isSlash
                ? context.reply({ embeds: [embed] })
                : context.reply({ embeds: [embed] });
        }

        if (!query) {
            const embed = createEmbed(
                "error",
                `${config.emojis.error} Please provide a URL or search query!`,
            );
            return isSlash
                ? context.reply({ embeds: [embed] })
                : context.reply({ embeds: [embed] });
        }

        // Defer reply for search time
        if (isSlash) await context.deferReply();

        try {
            const node = client.shoukaku.options.nodeResolver(
                client.shoukaku.nodes,
            );
            if (!node) {
                const embed = createEmbed(
                    "error",
                    `${config.emojis.error} No Lavalink nodes available!`,
                );
                return isSlash
                    ? context.editReply({ embeds: [embed] })
                    : context.reply({ embeds: [embed] });
            }

            // Smart search with multiple sources
            let searchQuery = query;
            let searchSources = [];

            if (query.startsWith("http")) {
                // Direct URL - let Lavalink handle it
                searchQuery = query;
            } else if (
                query.startsWith("ytsearch:") ||
                query.startsWith("scsearch:") ||
                query.startsWith("spsearch:")
            ) {
                // User specified search type
                searchQuery = query;
            } else {
                // Smart search - try multiple sources
                searchSources = [
                    `ytsearch:${query}`, // YouTube first
                    `spsearch:${query}`, // Spotify second
                    `scsearch:${query}`, // SoundCloud third
                ];
                searchQuery = searchSources[0]; // Start with YouTube
            }

            // Try searching with fallback sources
            let result = null;
            let tracks = [];
            let searchedSource = "";

            if (searchSources.length > 0) {
                // Try multiple sources
                for (const source of searchSources) {
                    result = await node.rest.resolve(source);

                    // Handle different result formats from Lavalink
                    tracks = [];
                    if (result?.loadType === "search" && result?.data?.length) {
                        tracks = result.data;
                    } else if (result?.tracks?.length) {
                        tracks = result.tracks;
                    } else if (result?.loadType === "track" && result?.data) {
                        tracks = [result.data];
                    } else if (
                        result?.loadType === "playlist" &&
                        result?.data?.tracks?.length
                    ) {
                        tracks = result.data.tracks;
                    }

                    if (tracks.length > 0) {
                        searchedSource = source.split(":")[0];
                        break; // Found tracks, stop searching
                    }
                }
            } else {
                // Single search
                console.log(`Searching for: ${searchQuery}`);
                result = await node.rest.resolve(searchQuery);

                // Handle different result formats from Lavalink
                if (result?.loadType === "search" && result?.data?.length) {
                    tracks = result.data;
                } else if (result?.tracks?.length) {
                    tracks = result.tracks;
                } else if (result?.loadType === "track" && result?.data) {
                    tracks = [result.data];
                } else if (
                    result?.loadType === "playlist" &&
                    result?.data?.tracks?.length
                ) {
                    tracks = result.data.tracks;
                }

                searchedSource = searchQuery.includes(":")
                    ? searchQuery.split(":")[0]
                    : "direct";
            }

            if (!tracks.length) {
                console.log(`No tracks found after searching all sources`);
                const embed = createEmbed(
                    "error",
                    `${config.emojis.error} No tracks found for: \`${query}\`\nSearched: YouTube, Spotify, SoundCloud\nTry a different query.`,
                );
                return isSlash
                    ? context.editReply({ embeds: [embed] })
                    : context.reply({ embeds: [embed] });
            }

            const track = tracks[0];
            track.requester = member.user;

            // Get or create queue
            let queue = getQueue(guild.id);
            if (!queue) {
                queue = createQueue(guild.id, member.voice.channel, channel);
                client.musicPlayer.set(guild.id, queue);
            }

            // Create or get player
            let player = client.shoukaku.players.get(guild.id);
            if (!player) {
                // Join voice channel and get player
                try {
                    player = await client.shoukaku.joinVoiceChannel({
                        guildId: guild.id,
                        channelId: member.voice.channel.id,
                        shardId: guild.shardId,
                    });

                    // Wait for player to be ready
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    // Get the actual player object
                    player = client.shoukaku.players.get(guild.id);

                    if (!player) {
                        throw new Error(
                            "Failed to create player after joining voice channel",
                        );
                    }

                    queue.player = player;
                } catch (error) {
                    console.error("Error creating player:", error);
                    const embed = createEmbed(
                        "error",
                        `${config.emojis.error} Failed to join voice channel!`,
                    );
                    return isSlash
                        ? context.editReply({ embeds: [embed] })
                        : context.reply({ embeds: [embed] });
                }
            } else {
                queue.player = player;

                // Player event listeners
                player.on("end", (data) => {
                    if (data.reason === "replaced") return;
                    queue.playNext(client);
                });

                player.on("closed", () => {
                    queue.destroy();
                    client.musicPlayer.delete(guild.id);
                });
            }

            // Add to queue
            queue.addTrack(track);

            // Get source emoji
            const sourceEmoji = //not using this cuz this shit casuses copyright issues instead of giving credits.
                {
                    ytsearch: "🎬 YouTube",
                    spsearch: "🎵 Spotify",
                    scsearch: "🧡 SoundCloud",
                    direct: "🔗 Direct URL",
                }[searchedSource] || "🎵 Music";

            if (queue.isPlaying()) {
                const embed = createEmbed(
                    "success",
                    `${config.emojis.success} Added to queue`,
                    `**[${track.info.title}](${track.info.uri})**\n` +
                        `${config.emojis.music} Duration: \`${this.formatTime(track.info.length)}\`\n` +
                        `👤 Requested by: ${track.requester}\n` +
                        `📍 Position: \`${queue.tracks.length}\`\n`,
                        
                );
                return isSlash
                    ? context.editReply({ embeds: [embed] })
                    : context.reply({ embeds: [embed] });
            } else {
                await queue.play(client);

                const embed = createEmbed(
                    "success",
                    `${config.emojis.play} Now Playing`,
                    `**[${track.info.title}](https://discord.gg/5J6QdeQwnB)**\n` +
                        `${config.emojis.music} Duration: \`${this.formatTime(track.info.length)}\`\n` +
                        `👤 Requested by: ${track.requester}\n`,
                     
                );

                // Create interactive buttons
                const {
                    ActionRowBuilder,
                    ButtonBuilder,
                    ButtonStyle,
                } = require("discord.js");

                const row1 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("music_pause")
                        .setLabel("⏸️ Pause")
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
                        .setLabel("🔁 Loop")
                        .setStyle(ButtonStyle.Secondary),
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

                return isSlash
                    ? context.editReply({
                          embeds: [embed],
                          components: [row1, row2],
                      })
                    : context.reply({
                          embeds: [embed],
                          components: [row1, row2],
                      });
            }
        } catch (error) {
            console.error("Play command error:", error);
            const embed = createEmbed(
                "error",
                `${config.emojis.error} An error occurred while playing music!`,
            );
            return isSlash
                ? context.editReply({ embeds: [embed] })
                : context.reply({ embeds: [embed] });
        }
    },

    formatTime(ms) {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor(ms / (1000 * 60 * 60));

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    },
};
