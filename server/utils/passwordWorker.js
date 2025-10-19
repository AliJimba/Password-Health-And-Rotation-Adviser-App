const { parentPort, workerData } = require('worker_threads');
const crypto = require('crypto');

/**
 * Worker thread for password analysis
 * Performs CPU-intensive password strength calculations
 */

function analyzePassword(password) {
    const result = {
        length: password.length,
        strength: 'weak',
        score: 0,
        suggestions: [],
        patterns: {},
        entropy: 0,
        crackTime: '',
        hasUppercase: false,
        hasLowercase: false,
        hasNumbers: false,
        hasSpecialChars: false,
        hasRepeating: false,
        hasSequential: false,
        isCommon: false
    };

    // Decode if base64
    let decodedPassword = password;
    try {
        decodedPassword = Buffer.from(password, 'base64').toString('utf-8');
    } catch (e) {
        // Not base64, use as-is
    }

    // Character type checks
    result.hasUppercase = /[A-Z]/.test(decodedPassword);
    result.hasLowercase = /[a-z]/.test(decodedPassword);
    result.hasNumbers = /[0-9]/.test(decodedPassword);
    result.hasSpecialChars = /[^a-zA-Z0-9]/.test(decodedPassword);

    // Pattern detection
    result.hasRepeating = /(.)\1{2,}/.test(decodedPassword);
    result.hasSequential = hasSequentialChars(decodedPassword);
    result.isCommon = isCommonPassword(decodedPassword);

    // Calculate score
    let score = 0;
    
    if (result.length >= 8) score += 20;
    if (result.length >= 12) score += 10;
    if (result.length >= 16) score += 10;
    
    if (result.hasUppercase) score += 15;
    if (result.hasLowercase) score += 15;
    if (result.hasNumbers) score += 15;
    if (result.hasSpecialChars) score += 15;

    // Penalties
    if (result.hasRepeating) score -= 10;
    if (result.hasSequential) score -= 10;
    if (result.isCommon) score -= 30;

    result.score = Math.max(0, Math.min(100, score));

    // Determine strength
    if (result.score >= 80) {
        result.strength = 'very strong';
    } else if (result.score >= 60) {
        result.strength = 'strong';
    } else if (result.score >= 40) {
        result.strength = 'medium';
    } else if (result.score >= 20) {
        result.strength = 'weak';
    } else {
        result.strength = 'very weak';
    }

    // Calculate entropy
    result.entropy = calculateEntropy(decodedPassword);

    // Estimate crack time
    result.crackTime = estimateCrackTime(result.entropy);

    // Generate suggestions
    result.suggestions = generateSuggestions(result, decodedPassword);

    return result;
}

function hasSequentialChars(password) {
    const sequences = [
        'abcdefghijklmnopqrstuvwxyz',
        '0123456789',
        'qwertyuiop',
        'asdfghjkl',
        'zxcvbnm'
    ];

    for (const seq of sequences) {
        for (let i = 0; i < seq.length - 2; i++) {
            const substring = seq.substring(i, i + 3);
            if (password.toLowerCase().includes(substring)) {
                return true;
            }
        }
    }
    return false;
}

function isCommonPassword(password) {
    const common = [
        'password', '123456', '12345678', 'qwerty', 'abc123',
        'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
        'baseball', 'iloveyou', 'master', 'sunshine', 'ashley'
    ];
    return common.includes(password.toLowerCase());
}

function calculateEntropy(password) {
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;
    
    return Math.log2(Math.pow(charsetSize, password.length));
}

function estimateCrackTime(entropy) {
    // Assuming 10 billion attempts per second
    const attemptsPerSecond = 10000000000;
    const combinations = Math.pow(2, entropy);
    const seconds = combinations / (2 * attemptsPerSecond);

    if (seconds < 60) return 'Instant';
    if (seconds < 3600) return `${Math.ceil(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.ceil(seconds / 3600)} hours`;
    if (seconds < 2592000) return `${Math.ceil(seconds / 86400)} days`;
    if (seconds < 31536000) return `${Math.ceil(seconds / 2592000)} months`;
    return `${Math.ceil(seconds / 31536000)} years`;
}

function generateSuggestions(result, password) {
    const suggestions = [];

    if (result.length < 12) {
        suggestions.push('Increase password length to at least 12 characters');
    }

    if (!result.hasUppercase) {
        suggestions.push('Add uppercase letters');
    }

    if (!result.hasLowercase) {
        suggestions.push('Add lowercase letters');
    }

    if (!result.hasNumbers) {
        suggestions.push('Add numbers');
    }

    if (!result.hasSpecialChars) {
        suggestions.push('Add special characters (!@#$%^&*)');
    }

    if (result.hasRepeating) {
        suggestions.push('Avoid repeating characters');
    }

    if (result.hasSequential) {
        suggestions.push('Avoid sequential patterns (abc, 123, qwerty)');
    }

    if (result.isCommon) {
        suggestions.push('This is a commonly used password - choose something unique');
    }

    if (suggestions.length === 0) {
        suggestions.push('Excellent password strength!');
    }

    return suggestions;
}

// Execute analysis and send result back to main thread
try {
    const result = analyzePassword(workerData.password);
    parentPort.postMessage(result);
} catch (error) {
    parentPort.postMessage({ error: error.message });
}
