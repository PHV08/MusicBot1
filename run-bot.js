#!/usr/bin/env node

// Simple script to run the Discord bot
console.log('🚀 Starting Discord Music Bot...');

try {
    require('./index.js');
} catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
}