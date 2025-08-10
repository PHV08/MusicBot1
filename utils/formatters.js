/**
 * Format milliseconds to MM:SS or HH:MM:SS format
 */
function formatTime(ms) {
    if (!ms || ms < 0) return '0:00';
    
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Create a visual progress bar with proper Unicode characters
 */
function formatProgressBar(percentage, length = 20) {
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    
    const filledLength = Math.round((percentage / 100) * length);
    const emptyLength = length - filledLength;
    
    // Use proper Unicode characters for better visual representation
    const filledChar = '█';
    const emptyChar = '░';
    const currentChar = '🔘';
    
    let bar = '';
    
    if (filledLength === 0) {
        bar = currentChar + emptyChar.repeat(length - 1);
    } else if (filledLength === length) {
        bar = filledChar.repeat(length);
    } else {
        bar = filledChar.repeat(filledLength - 1) + currentChar + emptyChar.repeat(emptyLength);
    }
    
    return `\`${bar}\``;
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format number with commas
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Truncate string to specified length with ellipsis
 */
function truncateString(str, maxLength = 50) {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + '...';
}

/**
 * Format duration from seconds to human readable format
 */
function formatDuration(seconds) {
    if (seconds < 60) {
        return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (remainingSeconds === 0) {
            return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        }
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
    } else {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        
        let result = `${hours} hour${hours !== 1 ? 's' : ''}`;
        if (minutes > 0) {
            result += ` ${minutes} minute${minutes !== 1 ? 's' : ''}`;
        }
        if (remainingSeconds > 0) {
            result += ` ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
        }
        return result;
    }
}

module.exports = {
    formatTime,
    formatProgressBar,
    formatBytes,
    formatNumber,
    truncateString,
    formatDuration
};
