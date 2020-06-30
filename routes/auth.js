const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/protect');
const { registerUser, loginUser, getMe } = require('../controllers/auth');
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/me').get(protect, getMe);
module.exports = router;
