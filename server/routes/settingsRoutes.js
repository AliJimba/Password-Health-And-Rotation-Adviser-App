const express = require('express');
const router = express.Router();
const {
    getSettings,
    saveSettings,
    startScanning,
    stopScanning
} = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/', getSettings);
router.post('/', saveSettings);
router.post('/scanning/start', startScanning);
router.post('/scanning/stop', stopScanning);

module.exports = router;
