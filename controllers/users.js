const User = require("../models/user.js");

// GET /signup
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

// POST /signup
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to WanderDev!");
      return res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/signup");
  }
};

// GET /login
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

// POST /login
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  return res.redirect(redirectUrl);
};

// GET /logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully!");
    return res.redirect("/listings");
  });
};
