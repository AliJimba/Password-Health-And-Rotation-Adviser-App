const { Worker } = require('worker_threads');
const path = require('path');
const crypto = require('crypto');

/**
 * Analyzes password strength using worker threads
 */
class PasswordAnalyzer {
    constructor() {
        this.workerPath = path.join(__dirname, 'passwordWorker.js');
    }

    /**
     * Analyze password strength in parallel
     * @param {string} password - Plain text password
     * @returns {Promise<Object>} Analysis result
     */
    analyzePassword(password) {
        return new Promise((resolve, reject) => {
            const worker = new Worker(this.workerPath, {
                workerData: { password }
            });

            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Worker stopped with exit code ${code}`));
                }
            });

            // Timeout after 5 seconds
            setTimeout(() => {
                worker.terminate();
                reject(new Error('Password analysis timeout'));
            }, 5000);
        });
    }

    /**
     * Analyze multiple passwords in parallel
     * @param {Array} passwords - Array of password objects
     * @returns {Promise<Array>} Analysis results
     */
    async analyzeMultiple(passwords) {
        const promises = passwords.map(pwd => 
            this.analyzePassword(pwd.encryptedPassword)
                .then(analysis => ({
                    ...pwd,
                    analysis
                }))
                .catch(error => ({
                    ...pwd,
                    analysis: { error: error.message }
                }))
        );

        return Promise.all(promises);
    }

    /**
     * Check if password is in common password list (simulated)
     * @param {string} password 
     * @returns {boolean}
     */
    isCommonPassword(password) {
        const commonPasswords = [
            'password', '123456', '12345678', 'qwerty', 'abc123',
            'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
            'baseball', 'iloveyou', 'master', 'sunshine', 'ashley',
            'bailey', 'passw0rd', 'shadow', '123123', '654321'
        ];
        return commonPasswords.includes(password.toLowerCase());
    }

    /**
     * Calculate entropy of password
     * @param {string} password 
     * @returns {number}
     */
    calculateEntropy(password) {
        const charsetSize = this.getCharsetSize(password);
        return Math.log2(Math.pow(charsetSize, password.length));
    }

    /**
     * Get charset size based on character types used
     * @param {string} password 
     * @returns {number}
     */
    getCharsetSize(password) {
        let size = 0;
        if (/[a-z]/.test(password)) size += 26; // lowercase
        if (/[A-Z]/.test(password)) size += 26; // uppercase
        if (/[0-9]/.test(password)) size += 10; // digits
        if (/[^a-zA-Z0-9]/.test(password)) size += 32; // special chars
        return size;
    }
}

module.exports = new PasswordAnalyzer();
