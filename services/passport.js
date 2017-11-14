const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users'); //fetch model class

passport.serializeUser((user, done) => {
  console.log('serializing');
  done(null, user.id); // error, identification
});

passport.deserializeUser((id, done) => {
  console.log('deserializing');
  User.findById(id)
    .then(user => {
      done(null, user);
    })
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id })
        .then((existingUser) => {
          if(existingUser) {
            //we already have a record with given profile id
            console.log('existing user');
            done(null, existingUser); // user passed to serializeUser
          } else {
            // no user record, make a new one
            console.log('new user');
            new User({ googleId: profile.id }).save().then(user => done(null,user)); // one record async
          }
        });
    }
  )
);
