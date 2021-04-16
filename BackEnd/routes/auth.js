const router = require("express").Router();
const authController = require("../controllers/auth");
const User = require("../models/users");
const GoogleUsers = require("../models/googleUser");
const { body } = require("express-validator");

router.post("/login", authController.login);

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please Enter a Valid Email") //Stored in error object which can be retrived.
      .custom((value) => {
        //to check whether the email adress already exist or not.
        return User.findOne({ email: value }).then((UserDoc) => {
          console.log("userdoc = " + UserDoc);
          if (UserDoc) {
            // return a promise if validation done a async task
            return Promise.reject("E-mail Already Registered");
          }
        });
      })
      .normalizeEmail(), // check for  .. or + - in the email and remove it

    body("password").trim().isLength({ min: 6 }),

    // body('name')
    //     .isEmpty()
    //     .isLength({min:6})
  ],
  authController.signup
);
router.post("/signup/check-otp", authController.checkOTP);

router.post("/send-reset-otp", authController.sendResetOtp);
router.post("/check-reset-otp", authController.checkResetOtp);
router.post("/reset-password", authController.resetPassword);
router.post("/api/googlelogin",authController.googleLogin)
router.post(
  "/api/googleauth",
  [
    body("email")
      .isEmail()
      .withMessage("Please Enter a Valid Email") //Stored in error object which can be retrived.
      .custom((value) => {
        //to check whether the email adress already exist or not.
        return GoogleUsers.findOne({ email: value }).then((UserDoc) => {
          console.log("userdoc = " + UserDoc);
          if (UserDoc) {
            // return a promise if validation done a async task
            return Promise.reject("E-mail Already Registered");
          }
        });
      })
      .normalizeEmail(), // check for  .. or + - in the email and remove it
  ],
  authController.googleSignup
);

module.exports = router;
