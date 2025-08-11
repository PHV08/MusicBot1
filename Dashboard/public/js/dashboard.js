// Dashboard JavaScript
const socket = io();

// Real-time stats updates
socket.on('statsUpdate', (stats) => {
    updateStatsDisplay(stats);
});

function updateStatsDisplay(stats) {
    // Update status indicator
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    if (statusDot && statusText) {
        if (stats.status === 'Online') {
            statusDot.style.background = '#10b981';
            statusText.textContent = 'Bot is Online';
        } else {
            statusDot.style.background = '#ef4444';
            statusText.textContent = 'Bot is Offline';
        }
    }

    // Update stat cards
    updateStatCard('uptime-value', stats.uptime || '0m');
    updateStatCard('guilds-value', stats.guilds || 0);
    updateStatCard('users-value', stats.users || 0);
    updateStatCard('voice-value', stats.voiceConnections || 0);
    updateStatCard('songs-value', stats.songsPlayed || 0);
    updateStatCard('commands-value', stats.commandsUsed || 0);
    
    // Update last restart
    if (stats.lastRestart) {
        const lastRestart = new Date(stats.lastRestart);
        const timeAgo = getTimeAgo(lastRestart);
        updateStatCard('restart-value', timeAgo);
    }
}

function updateStatCard(id, value) {
    const element = document.getElementById(id);
    if (element) {
        // Add animation on value change
        if (element.textContent !== value.toString()) {
            element.style.transform = 'scale(1.1)';
            element.style.color = '#667eea';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                element.style.color = '';
            }, 200);
        }
        element.textContent = value;
    }
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
}

// Tab navigation
function switchTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    // Hide all content sections
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Show selected content
    const targetContent = document.getElementById(tabName + '-content');
    if (targetContent) {
        targetContent.style.display = 'block';
    }
}

// Initialize charts (placeholder for future implementation)
function initializeCharts() {
    // Command usage chart
    const commandCtx = document.getElementById('commandChart');
    if (commandCtx) {
        // Chart.js implementation would go here
        commandCtx.innerHTML = '<p class="text-center">Command Usage Chart<br><small>Coming Soon</small></p>';
    }
    
    // Server growth chart
    const serverCtx = document.getElementById('serverChart');
    if (serverCtx) {
        serverCtx.innerHTML = '<p class="text-center">Server Growth Chart<br><small>Coming Soon</small></p>';
    }
}

// Refresh data manually
function refreshData() {
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.innerHTML = '<span class="loading"></span> Refreshing...';
        refreshBtn.disabled = true;
    }
    
    fetch('/api/stats')
        .then(response => response.json())
        .then(stats => {
            updateStatsDisplay(stats);
            if (refreshBtn) {
                refreshBtn.innerHTML = '🔄 Refresh';
                refreshBtn.disabled = false;
            }
        })
        .catch(error => {
            console.error('Error refreshing data:', error);
            if (refreshBtn) {
                refreshBtn.innerHTML = '❌ Error';
                setTimeout(() => {
                    refreshBtn.innerHTML = '🔄 Refresh';
                    refreshBtn.disabled = false;
                }, 2000);
            }
        });
}

// Copy command to clipboard
function copyCommand(command) {
    navigator.clipboard.writeText(command).then(() => {
        // Show tooltip or notification
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = '#10b981';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 1500);
    });
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Initialize charts
    initializeCharts();
    
    // Set up auto-refresh every 30 seconds
    setInterval(() => {
        fetch('/api/stats')
            .then(response => response.json())
            .then(stats => updateStatsDisplay(stats))
            .catch(error => console.error('Auto-refresh error:', error));
    }, 30000);
    
    // Add click handlers for command copying
    document.querySelectorAll('.copy-command').forEach(btn => {
        btn.addEventListener('click', () => {
            const command = btn.dataset.command;
            copyCommand(command);
        });
    });
});

// Error handling for socket connection
socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    // Show offline indicator
    const statusDot = document.querySelector('.status-dot');
    if (statusDot) {
        statusDot.style.background = '#ef4444';
    }
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
    // Show reconnecting indicator
    const statusText = document.querySelector('.status-text');
    if (statusText) {
        statusText.textContent = 'Reconnecting...';
    }
});

socket.on('reconnect', () => {
    console.log('Reconnected to server');
    // Refresh data after reconnection
    refreshData();
});