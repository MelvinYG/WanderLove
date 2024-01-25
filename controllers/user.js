const User = require("../models/user");

module.exports.signupRender = (req, res) => {
    res.render("user/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const regUser = await User.register(newUser, password);
        req.login(regUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLove");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.loginRender = (req, res) => {
    res.render("user/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back wanderer");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out");
        res.redirect("/listings");
    });
}