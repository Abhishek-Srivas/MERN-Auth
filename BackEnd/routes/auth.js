const router = require("express").Router();
const authController = require('../controllers/auth');

router.post('/login',authController.login)

router.post('/signup',authController.signup)
router.post('/signup/check-otp',authController.checkOTP)

router.post('/send-reset-otp',authController.sendResetOtp)
router.post('/check-reset-otp',authController.checkResetOtp)
router.post('/reset-password',authController.resetPassword)

module.exports = router;