const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users"); //fetch model class

passport.serializeUser((user, done) => {
  console.log("serializing");
  done(null, user.id); // error, identification
});

passport.deserializeUser((id, done) => {
  console.log("deserializing");
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser); // user passed to serializeUser
      }
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
  )
);
