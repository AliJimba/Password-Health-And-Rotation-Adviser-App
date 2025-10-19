const express = require('express');
const router = express.Router();
const {
    analyzePasswords,
    getSecurityScore
} = require('../controllers/securityController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/analyze', analyzePasswords);
router.get('/score', getSecurityScore);

module.exports = router;
