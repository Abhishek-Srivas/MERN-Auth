const User = require("../models/users");
const googleUser = require("../models/googleUser");
const Otp = require("../models/otps");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const emailSender = require("../utils/mailsender.js");
const { OAuth2Client } = require("google-auth-library");
const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const client = new OAuth2Client(
  "277609826086-e51snulj2eqgj20kurchcae927meok7f.apps.googleusercontent.com"
);

exports.signup = (req, res) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  bcrypt
    .hash(password, 12)
    .then((hashedPass) => {
      const user = new User({
        isverified: "false",
        email: email,
        password: hashedPass,
        name: name,
      });

      user
        .save()
        .then((result) => {
          console.log("User Saved");
        })
        .catch((err) => {
          res.status(400).json({ message: "User Not Saved", error: err });
        });

      const OTP = otpGenerator.generate(4, {
        upperCase: false,
        specialChars: false,
        alphabets: false,
      });

      const otp = new Otp({
        otp: OTP,
        email: email,
      });

      otp
        .save()
        .then((result) => {
          console.log("Otp saved in database");
        })
        .catch((err) => {
          res.json("Otp not Saved in database");
        });

      res.send("OTP SEND CHECK YOUR EMAIL");
      return emailSender.sendemail(email, OTP);
    })
    .catch((err) => {
      console.log("here");
      next(err);
    });
};

exports.checkOTP = (req, res, next) => {
  const email = req.body.email;
  const checkOtp = req.body.otp;

  Otp.findOne({ email: email })
    .then((otpResult) => {
      if (otpResult.otp === checkOtp) {
        User.findOne({ email: email })
          .then((user) => {
            user.isverified = "True";

            // const signAccessToken = signAccessToken(user.email,user._id.toString());
            const signAccessToken = JWT.sign(
              {
                email: user.email,
                userId: user._id.toString(),
              },
              process.env.ACCESS_TOKEN_KEY,
              { expiresIn: "1s" }
            );

            const verifyAccessToken = JWT.sign(
              {
                email: user.email,
                userId: user._id.toString(),
              },
              process.env.REFRESH_TOKEN_KEY,
              { expiresIn: "1y" }
            );

            user.save();

            res.json({
              message: "Otp Verified",
              signAccessToken,
              refreshToken: verifyAccessToken,
              userId: user._id,
            });
          })
          .catch((err) => {
            res.json({ message: "Provide a registered Email" });
          });
      } else {
        res.json("otp Entered is incorrect");
      }
    })
    .catch((err) => {
      res.json("Otp expire, Please resend the email");
    });
};

exports.login = (req, res, next) => {
  // const errors = validationResult(req);
  // console.log(errors);
  // if (!errors.isEmpty()) {
  //   const error = new Error("Validation Failed");
  //   error.statusCode = 422;
  //   error.data = errors.array();
  //   throw error;
  // }
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      console.log(user);
      if (user.isverified === "false") {
        //Checking if user is verified or not
        let OTP = otpGenerator.generate(4, {
          upperCase: false,
          specialChars: false,
          alphabets: false,
        });

        const otp = new Otp({
          otp: OTP,
          email: email,
        });

        otp.save();

        res.json(
          "This Email is not verified,OTP has been sent to your email please verify"
        );
        return emailSender.sendemail(email, OTP);
      }

      bcrypt
        .compare(password, user.password) // to compare the stored and entered password, returning because this will give us a promise
        .then((equal) => {
          //will get a true or false
          if (!equal) {
            const error = new Error("wrong password");
            res.status(401).json({ message: "wrong password" });
            error.statusCode = 401;
            throw error;
          }

          const signAccessToken = JWT.sign(
            {
              email: user.email,
              userId: user._id.toString(),
            },
            process.env.ACCESS_TOKEN_KEY,
            { expiresIn: "1h" }
          );

          const verifyAccessToken = JWT.sign(
            {
              email: user.email,
              userId: user._id.toString(),
            },
            process.env.REFRESH_TOKEN_KEY,
            { expiresIn: "1y" }
          );

          res.json({
            message: "User loggedin",
            signAccessToken,
            refreshToken: verifyAccessToken,
            userId: user._id,
          });
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    })
    .catch((err) => {
      res.json({ message: "Email Not Registered", error: err });
    });
};

exports.sendResetOtp = (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const error = new Error("Email not registered");
  //   error.statusCode = 422;
  //   error.data = {
  //     message: "Email not registered",
  //   };
  //   throw error;
  // }

  const email = req.body.email;
  console.log(email);

  let OTP = otpGenerator.generate(4, {
    upperCase: false,
    specialChars: false,
    alphabets: false,
  });

  const otp = new Otp({
    otp: OTP,
    email: email,
  });

  otp
    .save()
    .then((result) => {
      res.json({ message: "OTP Send,Check Your Email" });
    })
    .catch((err) => {
      res.json({ message: "Otp not saved ", error: err });
    });
  return emailSender.sendemail(email, OTP);
};

exports.checkResetOtp = (req, res, next) => {
  const otp = req.body.otp;
  const email = req.body.email;
  console.log(otp);
  Otp.findOne({ email: email }).then((data) => {
    if (!(data.otp === otp)) {
      res.status(400).json("Otp incorrect");
    } else {
      res.status(200).json("Otp correct");
    }
  });
};

exports.resetPassword = (req, res, next) => {
  const email = req.body.email;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;

  if (newPassword != confirmPassword) {
    const error = new Error("reset failed,fields do no match");
    error.statusCode = 422;
    error.data = {
      message: "Confirm password and new password do not match",
      param: "confirmPassword",
    };
    throw error;
  }

  bcrypt.hash(newPassword, 12).then((hashedPass) => {
    User.findOne({ email: email })
      .then((user) => {
        user.password = hashedPass;
        user
          .save()
          .then((result) => {
            res.json({ messsage: "new password saved", updatedUser: result });
          })
          .catch((err) => {
            res.json(err);
          });
      })
      .catch((err) => {
        res.json({ error: err, message: "password not saved" });
      });
  });
};

exports.googleSignup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const { token, name, email } = req.body;
  const user = new googleUser({
    email: email,
    name: name,
    token: token,
  });

  client
    .verifyIdToken({
      idToken: token,
      audience:
        "277609826086-e51snulj2eqgj20kurchcae927meok7f.apps.googleusercontent.com",
    })
    .then((result) => {
      const { email_verified } = result.payload;
      if (email_verified) {
        user
          .save()
          .then((result) => {
            res.json({ message: "User Saved" });
          })
          .catch((err) => {
            res.json("Internal Server Error");
          });
      } else {
        res.status(401).json("Email not authorized");
      }
    })
    .catch((error) => {
      res.json("Something went wrong");
    });
};

exports.googleLogin = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { token } = req.body;
  client
    .verifyIdToken({
      idToken: token,
      audience:
        "277609826086-e51snulj2eqgj20kurchcae927meok7f.apps.googleusercontent.com",
    })
    .then((response) => {
      const { email_verified, name, email } = response.payload;

      if (email_verified) {
        googleUser.findOne({ email: email }).exec((err, user) => {
          if (err) {
            return res.status(400).json({ message: "Something went wrong" });
          } else {
            if (user) {
              res.json({ message: "loggedIn" });
            } else {
              res.status(401).json("User not registered");
            }
          }
        });
      }
    });
};
