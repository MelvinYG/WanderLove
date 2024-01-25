const express = require("express");
const router = express.Router();
const asyncWrap = require("../utilities/asyncWrap.js");
const passport = require("passport");
const { saveUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

// SignUp Routes
router 
    .route("/signup")
    .get(userController.signupRender)
    .post(asyncWrap(userController.signup));

// Login Routes
router
    .route("/login")
    .get( userController.loginRender)
    .post(saveUrl, passport.authenticate("local",{
        failureRedirect: "/login",
        failureFlash: true
        }), asyncWrap(userController.login));

router.get("/logout", userController.logout);

module.exports = router;