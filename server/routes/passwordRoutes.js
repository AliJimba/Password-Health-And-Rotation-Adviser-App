const express = require('express');
const router = express.Router();
const {
    addPassword,
    getPasswordCount,
    getPassword,
    getAllPasswords,
    deletePassword
} = require('../controllers/passwordController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.post('/', addPassword);
router.get('/count', getPasswordCount);
router.get('/', getAllPasswords);
router.get('/:index', getPassword);
router.delete('/:index', deletePassword);

module.exports = router;
