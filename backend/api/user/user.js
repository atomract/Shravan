const router = require('express').Router();
const passport = require('passport')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = require('../../models/User/User')
const sendEmailFunction = require('../../resolvers/sendEmail')
const verifyEmailFunction = require('../../resolvers/verifyEmail')
const jwt  = require('jsonwebtoken')
/* ---------------------------------------------------- */

/*
    @route   GET api/user/test
    @desc    Tests user route
    @access  Public   
*/
router.get('/test', (req, res) => {
    res.json({
        msg:'Route tested api/user/test'
    })
})



/*
    @route   POST api/user/signup
    @desc    Add User to the application
    @access  Public   
*/

const signupUserValidation = require('../../validation/signupUserValidation')
router.post('/signup', (req, res) => {
    console.log("SIGNUP ROUTE >>")
    
    const {errors, isValid} = signupUserValidation(req.body);
    
    if(!isValid) {
        console.log(errors)
        return res.status(400).json(errors)
    }

    User.findOne({email: req.body.email})
        .then((user)=>{
            if(user) {
                // already existing user
                errors.username = 'Already existing user, Kindly login'
                return res.status(400).json(errors)
            }

            const newUser = new User({
                username: req.body.email,
                email: req.body.email,
                password: req.body.password,
                isBuyer: req.body.isBuyer,
                isSeller: req.body.isSeller,
                isCourier: req.body.isCourier,
            })

            bcrypt.genSalt(10, (err, salt)=>{
                if(err){
                   return res.status(500).json({
                        err: 'Something went wrong on our side.'
                    })
                }
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if(err){
                        return  res.status(400).json(err)
                    }
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            //console.log("EMAIL SEND", sendEmail)
                           
                           sendEmailFunction(user.email, user.id)
                           return res.json(user)
                            
                        })
                        .catch(err => {
                            console.log("ERROR OCCURED")
                           return  res.status(400).json(err)
                        })
                })
            })


        }) 
        .catch((err)=>{
            return res.status(400).json(err)
        })


})



/*
    @route   POST api/user/update/:id
    @desc    Update the info of the user
    @access  Private   
*/



router.post('/update/:id', (req, res) => {
    /* 
        1. Check id the id of logged in user and id send are equal
        2. Check for the fields to be updated 
        3. Update fields and send update user to the client side
    */
    const loggedInUser = req.user
    const userId = mongoose.Types.ObjectId(req.params.id)

    console.log("<< UPDATE ROUTE >>")
    console.log(loggedInUser)
    console.log("ID >",userId)
    //  check if user is logged in or not
    if(!loggedInUser) {
        return res
                .status(401)
                .json({
                    err: 'User not logged in'
                })
    }

    const loggedInUserId = mongoose.Types.ObjectId(loggedInUser.id)
    

    // check if logged in user is same as the updated profile user
    if(! loggedInUserId.equals(userId)) {
        return res
                .status(401)
                .json({
                    err: 'User don\'t have permissions to update this profile'
                })
    }    

    // validate if user updation
    const {errors, isValid} = signupUserValidation(req.body);
    
    if(!isValid) {
        return res.status(400).json(errors)
    }

    User.findById(userId)
        .then(user=>{
            if(!user){
                return res.status(400)
                          .json({
                             err: 'No user found'
                          })
            }

            // check if username or email are changed
            User.findOne({username: req.body.username})
                .then(foundUserName => {
                    if(foundUserName){
                        if( ! mongoose.Types.ObjectId(foundUserName.id).equals(userId)) {
                            return res.status(400)
                            .json({
                               err: 'User with same username exists'
                            })
                        }
                    }


                    User.findOne({email: req.body.email})
                        .then(foundUserEmail => {
                            if(foundUserEmail) {
                                if( ! mongoose.Types.ObjectId(foundUserEmail.id).equals(userId)) {
                                    return res.status(400)
                                    .json({
                                       err: 'User with same Email exists'
                                    })
                                }
                            }

                            
                            if(user.email != req.body.email) {
                                user.verified = false
                                sendEmailFunction(req.body.email, user.id)
                            }
                            user.email = req.body.email
                            user.username = req.body.username
                            user.save()
                                .then(user => {
                                   return res.status(200).json(user)
                                })
                                .catch(err => {
                                    return res.status(500).json(err)
                                })

                        })// Email


                })// Username


        }) // Update User



})


/*
    @route   GET api/user/confirmation/:token
    @desc    Gets the current logged in user
    @access  Private   
*/
const EMAIL_SECRET = 'asdf1093KMnzxcvnkljvasdu09123nlasdasdf';
router.get('/confirmation/:token', (req, res) => {
    console.log("VERIFYING TOKEN >>> ", req.params.token)
    try {
      const data = jwt.verify(req.params.token, EMAIL_SECRET);
      return verifyEmailFunction(data.user, res)
    } catch (e) {
      res.send('error');
    }
  });

/*
    @route   GET api/user/sms
    @desc    Sends sms to user
    @access  Public   
*/
const sendSms = require('../../resolvers/sendSms')
router.get('/sms', (req,res)=>{
    console.log("SEND SMS")
    sendSms()
    res.json({
        msg: 'here we come'
    })
})



/*
    @route   GET api/user/current
    @desc    Gets the current logged in user
    @access  Private   
*/
router.get('/current', (req, res)=>{
    res.json(req.user)
})


/*
    @route   GET api/user/logout
    @desc    Logout logged in user
    @access  Private   
*/
router.get('/logout', (req, res)=>{
    req.logout()
    res.json(req.user)
})


/*
    @route   GET api/user/id/:id
    @desc    Send ALl info of user using id
    @access  Public
*/
router.get('/id/:id', (req, res)=>{
    User.findOne({_id: req.params.id}).then((user) => {
        res.json(user)
    }).catch((err) => {
        return res.status(400).json(err)
    });
})

/*
    @route   GET api/user/email/:email
    @desc    Send ALl info of user using email
    @access  Public
*/
router.get('/email/:email', (req, res)=>{
    User.findOne({email: req.params.email}).then((user) => {
        res.json(user)
    }).catch((err) => {
        return res.status(400).json(err)
    });
})



/*
    @route   GET api/user/seller
    @desc    Gets all seller on database
    @access  Public   
*/
router.get('/seller', (req, res) => {
    User.find({isSeller: true})
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(400).json(err)
        })
})


/*
    @route   GET api/user/buyer
    @desc    Gets all buyer on database
    @access  Public   
*/
router.get('/buyer', (req, res) => {
    User.find({isBuyer: true})
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(400).json(err)
        })
})

/*
    @route   GET api/user/courier
    @desc    Gets all courier on database
    @access  Public   
*/
router.get('/courier', (req, res) => {
    User.find({isSeller: true})
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(400).json(err)
        })
})

module.exports = router