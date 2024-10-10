const passport = require("passport");
const User = require("../modals/userModal");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" }, // Configure the field names
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.isValidPassword(password))) {
          return done(null, false, {
            message: "Authentication Failed .Invalid Email or Password",
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(null, false, { message: "User not found" });
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
