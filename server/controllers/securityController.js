const { getContract } = require('../utils/blockchain');
const passwordAnalyzer = require('../utils/passwordAnalyzer');

// @desc    Analyze all passwords security
// @route   GET /api/security/analyze
// @access  Private
exports.analyzePasswords = async (req, res) => {
    try {
        const contract = getContract();
        
        if (!contract) {
            return res.status(503).json({
                success: false,
                message: 'Blockchain service unavailable'
            });
        }

        // Get all passwords from blockchain
        const passwords = await contract.getAllPasswords();

        if (passwords.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No passwords to analyze',
                data: {
                    totalPasswords: 0,
                    analysis: []
                }
            });
        }

        // Format passwords
        const passwordList = passwords.map((pwd, index) => ({
            index,
            service: pwd.service,
            encryptedPassword: pwd.encryptedPassword,
            timestamp: pwd.timestamp.toNumber()
        }));

        // Analyze passwords using worker threads
        console.log(`Analyzing ${passwordList.length} passwords using worker threads...`);
        const startTime = Date.now();
        
        const analyzedPasswords = await passwordAnalyzer.analyzeMultiple(passwordList);
        
        const duration = Date.now() - startTime;
        console.log(`Analysis completed in ${duration}ms`);

        // Calculate overall statistics
        const stats = calculateSecurityStats(analyzedPasswords);

        res.status(200).json({
            success: true,
            message: 'Password analysis completed',
            data: {
                totalPasswords: analyzedPasswords.length,
                analysisTime: `${duration}ms`,
                statistics: stats,
                passwords: analyzedPasswords
            }
        });
    } catch (error) {
        console.error('Password analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Error analyzing passwords',
            error: error.message
        });
    }
};

// @desc    Get security score
// @route   GET /api/security/score
// @access  Private
exports.getSecurityScore = async (req, res) => {
    try {
        const contract = getContract();
        
        if (!contract) {
            return res.status(503).json({
                success: false,
                message: 'Blockchain service unavailable'
            });
        }

        const passwords = await contract.getAllPasswords();

        if (passwords.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    score: 0,
                    grade: 'N/A',
                    message: 'No passwords to analyze'
                }
            });
        }

        const passwordList = passwords.map((pwd, index) => ({
            index,
            service: pwd.service,
            encryptedPassword: pwd.encryptedPassword
        }));

        const analyzedPasswords = await passwordAnalyzer.analyzeMultiple(passwordList);
        const stats = calculateSecurityStats(analyzedPasswords);

        // Calculate overall security score (0-100)
        const score = stats.averageScore;
        const grade = getSecurityGrade(score);

        res.status(200).json({
            success: true,
            data: {
                score: Math.round(score),
                grade,
                totalPasswords: passwords.length,
                weakPasswords: stats.weakPasswords,
                strongPasswords: stats.strongPasswords,
                recommendations: generateRecommendations(stats)
            }
        });
    } catch (error) {
        console.error('Security score error:', error);
        res.status(500).json({
            success: false,
            message: 'Error calculating security score',
            error: error.message
        });
    }
};

// Helper functions
function calculateSecurityStats(passwords) {
    const scores = passwords
        .filter(p => p.analysis && !p.analysis.error)
        .map(p => p.analysis.score);

    if (scores.length === 0) {
        return {
            averageScore: 0,
            weakPasswords: 0,
            mediumPasswords: 0,
            strongPasswords: 0,
            veryStrongPasswords: 0,
            commonPasswords: 0,
            repeatingPatterns: 0,
            sequentialPatterns: 0
        };
    }

    return {
        averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
        weakPasswords: passwords.filter(p => p.analysis?.score < 40).length,
        mediumPasswords: passwords.filter(p => p.analysis?.score >= 40 && p.analysis?.score < 60).length,
        strongPasswords: passwords.filter(p => p.analysis?.score >= 60 && p.analysis?.score < 80).length,
        veryStrongPasswords: passwords.filter(p => p.analysis?.score >= 80).length,
        commonPasswords: passwords.filter(p => p.analysis?.isCommon).length,
        repeatingPatterns: passwords.filter(p => p.analysis?.hasRepeating).length,
        sequentialPatterns: passwords.filter(p => p.analysis?.hasSequential).length
    };
}

function getSecurityGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
}

function generateRecommendations(stats) {
    const recommendations = [];

    if (stats.weakPasswords > 0) {
        recommendations.push(`Update ${stats.weakPasswords} weak password(s) to improve security`);
    }

    if (stats.commonPasswords > 0) {
        recommendations.push(`Replace ${stats.commonPasswords} common password(s) with unique ones`);
    }

    if (stats.repeatingPatterns > 0) {
        recommendations.push('Avoid using repeating characters in passwords');
    }

    if (stats.sequentialPatterns > 0) {
        recommendations.push('Avoid using sequential patterns (abc, 123)');
    }

    if (recommendations.length === 0) {
        recommendations.push('Your passwords are secure! Keep up the good work.');
    }

    return recommendations;
}

module.exports = exports;
