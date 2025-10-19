const Settings = require('../models/Settings');
const realtimeScannerService = require('../services/realtimeScannerService');

// @desc    Get user settings
// @route   GET /api/settings
// @access  Private
exports.getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne({ userId: req.user.id });
        
        if (!settings) {
            // Create default settings if none exist
            settings = await Settings.create({
                userId: req.user.id,
                alertThreshold: 50,
                reminderEnabled: false,
                reminderInterval: '1month',
                realtimeScanning: false
            });
        }

        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving settings',
            error: error.message
        });
    }
};

// @desc    Save/update user settings
// @route   POST /api/settings
// @access  Private
exports.saveSettings = async (req, res) => {
    try {
        const { alertThreshold, reminderEnabled, reminderInterval, realtimeScanning } = req.body;

        let settings = await Settings.findOne({ userId: req.user.id });

        if (settings) {
            // Update existing settings
            settings.alertThreshold = alertThreshold !== undefined ? alertThreshold : settings.alertThreshold;
            settings.reminderEnabled = reminderEnabled !== undefined ? reminderEnabled : settings.reminderEnabled;
            settings.reminderInterval = reminderInterval || settings.reminderInterval;
            settings.realtimeScanning = realtimeScanning !== undefined ? realtimeScanning : settings.realtimeScanning;
            
            await settings.save();
        } else {
            // Create new settings
            settings = await Settings.create({
                userId: req.user.id,
                alertThreshold: alertThreshold || 50,
                reminderEnabled: reminderEnabled || false,
                reminderInterval: reminderInterval || '1month',
                realtimeScanning: realtimeScanning || false
            });
        }

        res.status(200).json({
            success: true,
            message: 'Settings saved successfully',
            data: settings
        });
    } catch (error) {
        console.error('Save settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving settings',
            error: error.message
        });
    }
};

// @desc    Start real-time scanning
// @route   POST /api/settings/scanning/start
// @access  Private
exports.startScanning = async (req, res) => {
    try {
        const settings = await Settings.findOne({ userId: req.user.id });
        
        if (!settings) {
            return res.status(404).json({
                success: false,
                message: 'Settings not found'
            });
        }

        settings.realtimeScanning = true;
        settings.scanningStartedAt = new Date();
        await settings.save();

        // Start the real-time scanner for this user
        realtimeScannerService.startScanningForUser(req.user.id, settings.alertThreshold);

        res.status(200).json({
            success: true,
            message: 'Real-time scanning started',
            data: {
                startedAt: settings.scanningStartedAt
            }
        });
    } catch (error) {
        console.error('Start scanning error:', error);
        res.status(500).json({
            success: false,
            message: 'Error starting real-time scanning',
            error: error.message
        });
    }
};

// @desc    Stop real-time scanning
// @route   POST /api/settings/scanning/stop
// @access  Private
exports.stopScanning = async (req, res) => {
    try {
        const settings = await Settings.findOne({ userId: req.user.id });
        
        if (!settings) {
            return res.status(404).json({
                success: false,
                message: 'Settings not found'
            });
        }

        settings.realtimeScanning = false;
        settings.scanningStartedAt = null;
        await settings.save();

        // Stop the real-time scanner for this user
        realtimeScannerService.stopScanningForUser(req.user.id);

        res.status(200).json({
            success: true,
            message: 'Real-time scanning stopped'
        });
    } catch (error) {
        console.error('Stop scanning error:', error);
        res.status(500).json({
            success: false,
            message: 'Error stopping real-time scanning',
            error: error.message
        });
    }
};

module.exports = exports;
