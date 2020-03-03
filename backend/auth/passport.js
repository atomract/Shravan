const passport = require('passport')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


const User = require('../models/User/User')

const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const LocalStrategy = require('passport-local').Strategy


const keys = require('../keys/keys')


passport.serializeUser((user, done)=> {
    done(null, user.id)
})

passport.deserializeUser((id, done)=>{
    User.findById(id).then((user)=>{
        done(null, user)
    })
})


module.exports = passport => {
    passport.use(new GoogleStrategy({
        clientID: keys.GoogleClientId,
        clientSecret: keys.GoogelClientSecret,
        callbackURL: "http://localhost:5000/auth/google/callback"
      },
      (accessToken, refreshToken, profile, cb) => {
        console.log("ACCESS TOKEN : ", accessToken)
        console.log("PROFILE : ", profile)
        
        User.findOne({googleId: profile.id})
            .then((user)=>{
                if(user){
                    cb(null, user)
                }else{
                    new User ({googleId : profile.id, email: profile.emails[0].value, verified: true, username: profile.emails[0].value})
                        .save()
                        .then(user => {
                            cb(null, user)
                        })
                }
            })


      }
    ));


    passport.use(new FacebookStrategy({
        clientID: keys.FacebookClientId,
        clientSecret: keys.FacebookClientSecret,
        callbackURL: "http://localhost:5000/auth/facebook/callback",
        profileFields: ['id', 'email', 'name']
      },
      function(accessToken, refreshToken, profile, cb) {
        console.log("ACCESS TOKEN FB: ", accessToken)
        console.log("PROFILE FB: ", profile)
        
        User.findOne({facebookId: profile.id})
            .then((user)=>{
                if(user){
                    cb(null, user)
                }else{
                    let isVerified = true
                    let username = ''

                    if(! (profile.emails || profile.emails.length == 0) ) {
                        isVerified = false
                        //username = profile.emails[0].value
                        const error = {
                            msg: 'No email provided by facebook'
                        }
                        return cb(error, false)
                    }
                    new User ({facebookId : profile.id, email: profile.emails[0].value, verified: isVerified, username})
                        .save()
                        .then(user => {
                            cb(null, user)
                        })
                }
            })
      }
    ));

    passport.use(new LocalStrategy({
        usernameField : 'email', 
    },
        function(email, password, done) {
            console.log("INSIDE MIDDLEWARE ", email, password)
          User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }

            bcrypt.compare(password, user.password)
            .then(isMatched => {
                if(!isMatched){
                    return done(null, false)
                }
                return done(null, user);
            })
          });
        }
      ));

}
