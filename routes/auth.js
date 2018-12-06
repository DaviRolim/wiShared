const express = require('express');

const authController = require('../controllers/auth');
const validationUtil = require('../util/validations')

const router = express.Router();

router.put('/signup', validationUtil.signUp, authController.signup);

router.post('/login', authController.login);

module.exports = router;
