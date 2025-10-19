const { getContract } = require('../utils/blockchain');

// @desc    Add password to blockchain
// @route   POST /api/passwords
// @access  Private
exports.addPassword = async (req, res) => {
    try {
        const { service, encryptedPassword } = req.body;

        if (!service || !encryptedPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide service and encrypted password'
            });
        }

        const contract = getContract();
        
        if (!contract) {
            return res.status(503).json({
                success: false,
                message: 'Blockchain service unavailable. Please ensure Ganache is running and contract is deployed.'
            });
        }

        // Add password to blockchain
        const tx = await contract.addPassword(service, encryptedPassword);
        const receipt = await tx.wait();

        res.status(201).json({
            success: true,
            message: 'Password added successfully',
            data: {
                transactionHash: receipt.transactionHash,
                service,
                blockNumber: receipt.blockNumber,
                gasUsed: receipt.gasUsed.toString()
            }
        });
    } catch (error) {
        console.error('Add password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding password to blockchain',
            error: error.message
        });
    }
};

// @desc    Get password count
// @route   GET /api/passwords/count
// @access  Private
exports.getPasswordCount = async (req, res) => {
    try {
        const contract = getContract();
        
        if (!contract) {
            return res.status(503).json({
                success: false,
                message: 'Blockchain service unavailable'
            });
        }

        const count = await contract.getPasswordCount();

        res.status(200).json({
            success: true,
            data: {
                count: count.toNumber()
            }
        });
    } catch (error) {
        console.error('Get password count error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting password count',
            error: error.message
        });
    }
};

// @desc    Get single password by index
// @route   GET /api/passwords/:index
// @access  Private
exports.getPassword = async (req, res) => {
    try {
        const { index } = req.params;
        const contract = getContract();
        
        if (!contract) {
            return res.status(503).json({
                success: false,
                message: 'Blockchain service unavailable'
            });
        }

        const [service, encryptedPassword, timestamp] = await contract.getPassword(index);

        res.status(200).json({
            success: true,
            data: {
                index: parseInt(index),
                service,
                encryptedPassword,
                timestamp: timestamp.toNumber(),
                date: new Date(timestamp.toNumber() * 1000).toISOString()
            }
        });
    } catch (error) {
        console.error('Get password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving password',
            error: error.message
        });
    }
};

// @desc    Get all passwords
// @route   GET /api/passwords
// @access  Private
exports.getAllPasswords = async (req, res) => {
    try {
        const contract = getContract();
        
        if (!contract) {
            return res.status(503).json({
                success: false,
                message: 'Blockchain service unavailable'
            });
        }

        const passwords = await contract.getAllPasswords();

        const formattedPasswords = passwords.map((pwd, index) => ({
            index,
            service: pwd.service,
            encryptedPassword: pwd.encryptedPassword,
            timestamp: pwd.timestamp.toNumber(),
            date: new Date(pwd.timestamp.toNumber() * 1000).toISOString()
        }));

        res.status(200).json({
            success: true,
            count: formattedPasswords.length,
            data: formattedPasswords
        });
    } catch (error) {
        console.error('Get all passwords error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving passwords',
            error: error.message
        });
    }
};

// @desc    Delete password
// @route   DELETE /api/passwords/:index
// @access  Private
exports.deletePassword = async (req, res) => {
    try {
        const { index } = req.params;
        const contract = getContract();
        
        if (!contract) {
            return res.status(503).json({
                success: false,
                message: 'Blockchain service unavailable'
            });
        }

        const tx = await contract.deletePassword(index);
        const receipt = await tx.wait();

        res.status(200).json({
            success: true,
            message: 'Password deleted successfully',
            data: {
                transactionHash: receipt.transactionHash,
                blockNumber: receipt.blockNumber,
                gasUsed: receipt.gasUsed.toString()
            }
        });
    } catch (error) {
        console.error('Delete password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting password',
            error: error.message
        });
    }
};
