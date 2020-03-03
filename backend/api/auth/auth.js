const router = require('express').Router()
const passport = require('passport')


// GOOGLE OAUTH LOGIN

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    failureRedirect: '/fail' 
}))

router.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: '/fail'
    }),
    function(req, res) {
    res.redirect('/');
});

// FACEBOOK AUTHENTICATE

router.get('/facebook',
  passport.authenticate('facebook', {
       scope : ['email'],
       failureRedirect: '/fail'
    }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { 
        failureRedirect: '/fail' 
  }),
  function(req, res) {
    res.redirect('/');
});


// Login by credentials
router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/fail' }),
  function(req, res) {
    console.log(req.user)
    res.json(req.user);
  });

module.exports = router