const User = require('../models/User/User')

module.exports = function verifyEmail(id, res) {
    User.findById(id)
    .then(user => {
        user.verified = true
        user.save()
        return res.redirect('http://localhost:3000/emailverified')
    })
}