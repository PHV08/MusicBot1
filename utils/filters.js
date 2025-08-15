// 40 Different Audio Filters for Lavalink
const filters = {
    // Bass and Low-End Filters
    bassboost: {
        equalizer: [
            { band: 0, gain: 0.6 },
            { band: 1, gain: 0.67 },
            { band: 2, gain: 0.67 },
            { band: 3, gain: 0.4 },
            { band: 4, gain: -0.5 },
            { band: 5, gain: 0.15 },
            { band: 6, gain: -0.45 },
            { band: 7, gain: 0.23 },
            { band: 8, gain: 0.35 },
            { band: 9, gain: 0.45 },
            { band: 10, gain: 0.55 },
            { band: 11, gain: 0.6 },
            { band: 12, gain: 0.55 },
            { band: 13, gain: 0 }
        ]
    },

    superbass: {
        equalizer: [
            { band: 0, gain: 0.75 },
            { band: 1, gain: 0.75 },
            { band: 2, gain: 0.75 },
            { band: 3, gain: 0.75 },
            { band: 4, gain: 0.5 },
            { band: 5, gain: 0.25 },
            { band: 6, gain: 0 },
            { band: 7, gain: 0 },
            { band: 8, gain: 0 },
            { band: 9, gain: 0 },
            { band: 10, gain: 0 },
            { band: 11, gain: 0 },
            { band: 12, gain: 0 },
            { band: 13, gain: 0 }
        ]
    },

    // Tempo and Pitch Filters
    nightcore: {
        timescale: { speed: 1.2, pitch: 1.2, rate: 1 }
    },

    vaporwave: {
        timescale: { speed: 0.8, pitch: 0.8, rate: 1 }
    },

    chipmunk: {
        timescale: { speed: 1.5, pitch: 1.5, rate: 1 }
    },

    slowmotion: {
        timescale: { speed: 0.5, pitch: 1, rate: 1 }
    },

    // Spatial Audio Filters
    '8d': {
        rotation: { rotationHz: 0.2 }
    },

    karaoke: {
        karaoke: {
            level: 1,
            monoLevel: 1,
            filterBand: 220,
            filterWidth: 100
        }
    },

    // Vibration Effects
    vibrato: {
        vibrato: { frequency: 10, depth: 0.9 }
    },

    tremolo: {
        tremolo: { frequency: 10, depth: 0.5 }
    },

    // Genre-Based Filters
    pop: {
        equalizer: [
            { band: 0, gain: -0.25 },
            { band: 1, gain: 0.48 },
            { band: 2, gain: 0.59 },
            { band: 3, gain: 0.72 },
            { band: 4, gain: 0.56 },
            { band: 5, gain: 0.15 },
            { band: 6, gain: -0.24 },
            { band: 7, gain: -0.24 },
            { band: 8, gain: -0.16 },
            { band: 9, gain: -0.16 },
            { band: 10, gain: 0.02 },
            { band: 11, gain: 0.02 },
            { band: 12, gain: 0.16 },
            { band: 13, gain: 0.16 }
        ]
    },

    rock: {
        equalizer: [
            { band: 0, gain: 0.3 },
            { band: 1, gain: 0.25 },
            { band: 2, gain: 0.2 },
            { band: 3, gain: 0.1 },
            { band: 4, gain: -0.05 },
            { band: 5, gain: -0.4 },
            { band: 6, gain: -0.4 },
            { band: 7, gain: -0.1 },
            { band: 8, gain: 0.25 },
            { band: 9, gain: 0.3 },
            { band: 10, gain: 0.3 },
            { band: 11, gain: 0.45 },
            { band: 12, gain: 0.4 },
            { band: 13, gain: 0.4 }
        ]
    },

    jazz: {
        equalizer: [
            { band: 0, gain: 0.25 },
            { band: 1, gain: 0.2 },
            { band: 2, gain: 0.15 },
            { band: 3, gain: 0.1 },
            { band: 4, gain: -0.1 },
            { band: 5, gain: -0.1 },
            { band: 6, gain: 0 },
            { band: 7, gain: 0.1 },
            { band: 8, gain: 0.15 },
            { band: 9, gain: 0.2 },
            { band: 10, gain: 0.25 },
            { band: 11, gain: 0.3 },
            { band: 12, gain: 0.3 },
            { band: 13, gain: 0.3 }
        ]
    },

    electronic: {
        equalizer: [
            { band: 0, gain: 0.375 },
            { band: 1, gain: 0.35 },
            { band: 2, gain: 0.125 },
            { band: 3, gain: 0 },
            { band: 4, gain: -0.125 },
            { band: 5, gain: 0.125 },
            { band: 6, gain: 0.25 },
            { band: 7, gain: 0.125 },
            { band: 8, gain: 0.25 },
            { band: 9, gain: 0.25 },
            { band: 10, gain: 0.25 },
            { band: 11, gain: 0.375 },
            { band: 12, gain: 0.5 },
            { band: 13, gain: 0.5 }
        ]
    },

    // Audio Quality Filters
    soft: {
        lowPass: { smoothing: 20 }
    },

    clear: {
        equalizer: [
            { band: 0, gain: 0 },
            { band: 1, gain: 0 },
            { band: 2, gain: 0 },
            { band: 3, gain: 0 },
            { band: 4, gain: 0 },
            { band: 5, gain: 0 },
            { band: 6, gain: 0 },
            { band: 7, gain: 0.25 },
            { band: 8, gain: 0.25 },
            { band: 9, gain: 0.25 },
            { band: 10, gain: 0.25 },
            { band: 11, gain: 0.25 },
            { band: 12, gain: 0.25 },
            { band: 13, gain: 0.25 }
        ]
    },

    // Environment Simulation
    tv: {
        equalizer: [
            { band: 0, gain: 0 },
            { band: 1, gain: -0.0975 },
            { band: 2, gain: -0.0975 },
            { band: 3, gain: 0 },
            { band: 4, gain: 0.0975 },
            { band: 5, gain: 0.0975 },
            { band: 6, gain: 0.0975 },
            { band: 7, gain: 0.0975 },
            { band: 8, gain: 0.0975 },
            { band: 9, gain: 0.0975 },
            { band: 10, gain: 0.195 },
            { band: 11, gain: 0.195 },
            { band: 12, gain: 0.195 },
            { band: 13, gain: 0.195 }
        ]
    },

    radio: {
        equalizer: [
            { band: 0, gain: 0.2 },
            { band: 1, gain: 0.15 },
            { band: 2, gain: 0.1 },
            { band: 3, gain: 0.05 },
            { band: 4, gain: 0.05 },
            { band: 5, gain: -0.05 },
            { band: 6, gain: -0.1 },
            { band: 7, gain: -0.05 },
            { band: 8, gain: 0.05 },
            { band: 9, gain: 0.1 },
            { band: 10, gain: 0.15 },
            { band: 11, gain: 0.15 },
            { band: 12, gain: 0.1 },
            { band: 13, gain: 0.05 }
        ]
    },

    // Party and Club Filters
    party: {
        equalizer: [
            { band: 0, gain: -0.25 },
            { band: 1, gain: 0 },
            { band: 2, gain: 0.25 },
            { band: 3, gain: 0.25 },
            { band: 4, gain: 0.25 },
            { band: 5, gain: 0.25 },
            { band: 6, gain: 0.25 },
            { band: 7, gain: 0.25 },
            { band: 8, gain: 0.25 },
            { band: 9, gain: 0.25 },
            { band: 10, gain: 0.25 },
            { band: 11, gain: 0.25 },
            { band: 12, gain: 0.25 },
            { band: 13, gain: 0.25 }
        ]
    },

    // Frequency-Specific Filters
    treble: {
        equalizer: [
            { band: 0, gain: -0.25 },
            { band: 1, gain: -0.25 },
            { band: 2, gain: -0.125 },
            { band: 3, gain: 0 },
            { band: 4, gain: 0.125 },
            { band: 5, gain: 0.25 },
            { band: 6, gain: 0.375 },
            { band: 7, gain: 0.5 },
            { band: 8, gain: 0.625 },
            { band: 9, gain: 0.75 },
            { band: 10, gain: 0.75 },
            { band: 11, gain: 0.75 },
            { band: 12, gain: 0.75 },
            { band: 13, gain: 0.75 }
        ]
    },

    // Distortion Effects
    distortion: {
        distortion: {
            sinOffset: 0,
            sinScale: 1,
            cosOffset: 0,
            cosScale: 1,
            tanOffset: 0,
            tanScale: 1,
            offset: 0,
            scale: 1
        }
    },

    // Speed Variations
    speed125: {
        timescale: { speed: 1.25, pitch: 1, rate: 1 }
    },

    speed150: {
        timescale: { speed: 1.5, pitch: 1, rate: 1 }
    },

    speed075: {
        timescale: { speed: 0.75, pitch: 1, rate: 1 }
    },

    // Pitch Variations
    pitch1_2: {
        timescale: { speed: 1, pitch: 1.2, rate: 1 }
    },

    pitch0_8: {
        timescale: { speed: 1, pitch: 0.8, rate: 1 }
    },

    // Advanced Effects
    echo: {
        echo: { delay: 1, decay: 0.5 }
    },

    reverb: {
        reverb: { 
            delays: [0.037, 0.042, 0.048, 0.053],
            gains: [0.84, 0.83, 0.82, 0.81]
        }
    },

    // Vocal Enhancement
    vocal: {
        equalizer: [
            { band: 0, gain: -0.2 },
            { band: 1, gain: -0.1 },
            { band: 2, gain: 0.1 },
            { band: 3, gain: 0.15 },
            { band: 4, gain: 0.1 },
            { band: 5, gain: 0.1 },
            { band: 6, gain: 0.15 },
            { band: 7, gain: 0.2 },
            { band: 8, gain: 0.2 },
            { band: 9, gain: 0.15 },
            { band: 10, gain: 0.1 },
            { band: 11, gain: 0.05 },
            { band: 12, gain: 0 },
            { band: 13, gain: -0.1 }
        ]
    },

    // Gaming Filters
    gaming: {
        equalizer: [
            { band: 0, gain: 0.35 },
            { band: 1, gain: 0.3 },
            { band: 2, gain: 0.25 },
            { band: 3, gain: 0.2 },
            { band: 4, gain: 0.15 },
            { band: 5, gain: 0.1 },
            { band: 6, gain: 0.05 },
            { band: 7, gain: 0 },
            { band: 8, gain: 0.05 },
            { band: 9, gain: 0.1 },
            { band: 10, gain: 0.15 },
            { band: 11, gain: 0.2 },
            { band: 12, gain: 0.25 },
            { band: 13, gain: 0.3 }
        ]
    },

    // Chill and Relaxing
    chill: {
        equalizer: [
            { band: 0, gain: 0.1 },
            { band: 1, gain: 0.05 },
            { band: 2, gain: 0 },
            { band: 3, gain: -0.05 },
            { band: 4, gain: -0.1 },
            { band: 5, gain: -0.05 },
            { band: 6, gain: 0 },
            { band: 7, gain: 0.05 },
            { band: 8, gain: 0.1 },
            { band: 9, gain: 0.05 },
            { band: 10, gain: 0 },
            { band: 11, gain: -0.05 },
            { band: 12, gain: -0.1 },
            { band: 13, gain: -0.15 }
        ]
    },

    // Classical Music
    classical: {
        equalizer: [
            { band: 0, gain: 0.375 },
            { band: 1, gain: 0.35 },
            { band: 2, gain: 0.125 },
            { band: 3, gain: 0 },
            { band: 4, gain: 0 },
            { band: 5, gain: 0.125 },
            { band: 6, gain: 0.25 },
            { band: 7, gain: 0.125 },
            { band: 8, gain: 0 },
            { band: 9, gain: 0.25 },
            { band: 10, gain: 0.25 },
            { band: 11, gain: 0.25 },
            { band: 12, gain: 0.375 },
            { band: 13, gain: 0.5 }
        ]
    },

    // Deep Bass
    deepbass: {
        equalizer: [
            { band: 0, gain: 0.6 },
            { band: 1, gain: 0.55 },
            { band: 2, gain: 0.5 },
            { band: 3, gain: 0.45 },
            { band: 4, gain: 0.4 },
            { band: 5, gain: 0.35 },
            { band: 6, gain: 0.3 },
            { band: 7, gain: 0.25 },
            { band: 8, gain: 0.2 },
            { band: 9, gain: 0.15 },
            { band: 10, gain: 0.1 },
            { band: 11, gain: 0.05 },
            { band: 12, gain: 0 },
            { band: 13, gain: 0 }
        ]
    },

    // Experimental Filters
    experimental1: {
        timescale: { speed: 1.1, pitch: 0.9, rate: 1 },
        equalizer: [
            { band: 0, gain: 0.2 },
            { band: 5, gain: -0.2 },
            { band: 10, gain: 0.2 },
            { band: 13, gain: -0.1 }
        ]
    },

    experimental2: {
        vibrato: { frequency: 5, depth: 0.5 },
        tremolo: { frequency: 3, depth: 0.3 },
        rotation: { rotationHz: 0.1 }
    },

    // Movie/Cinema
    cinema: {
        equalizer: [
            { band: 0, gain: 0.4 },
            { band: 1, gain: 0.3 },
            { band: 2, gain: 0.2 },
            { band: 3, gain: 0.1 },
            { band: 4, gain: 0 },
            { band: 5, gain: -0.1 },
            { band: 6, gain: -0.2 },
            { band: 7, gain: -0.1 },
            { band: 8, gain: 0 },
            { band: 9, gain: 0.1 },
            { band: 10, gain: 0.2 },
            { band: 11, gain: 0.3 },
            { band: 12, gain: 0.4 },
            { band: 13, gain: 0.5 }
        ]
    },

    // Workout/Gym
    workout: {
        equalizer: [
            { band: 0, gain: 0.5 },
            { band: 1, gain: 0.4 },
            { band: 2, gain: 0.3 },
            { band: 3, gain: 0.2 },
            { band: 4, gain: 0.1 },
            { band: 5, gain: 0 },
            { band: 6, gain: 0.1 },
            { band: 7, gain: 0.2 },
            { band: 8, gain: 0.3 },
            { band: 9, gain: 0.4 },
            { band: 10, gain: 0.5 },
            { band: 11, gain: 0.4 },
            { band: 12, gain: 0.3 },
            { band: 13, gain: 0.2 }
        ]
    },

    // Nostalgic/Vintage
    vintage: {
        equalizer: [
            { band: 0, gain: 0.2 },
            { band: 1, gain: 0.15 },
            { band: 2, gain: 0.1 },
            { band: 3, gain: 0.05 },
            { band: 4, gain: 0 },
            { band: 5, gain: -0.05 },
            { band: 6, gain: -0.1 },
            { band: 7, gain: -0.15 },
            { band: 8, gain: -0.2 },
            { band: 9, gain: -0.25 },
            { band: 10, gain: -0.3 },
            { band: 11, gain: -0.35 },
            { band: 12, gain: -0.4 },
            { band: 13, gain: -0.45 }
        ],
        lowPass: { smoothing: 10 }
    }
};

module.exports = { filters };
