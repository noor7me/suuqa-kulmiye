const express       = require('express');
const router        = express.Router();
const bcrypt        = require('bcryptjs');
const jwt           = require('jsonwebtoken');
const passport      = require('passport');
const User          = require('../../model/User');
const key           = require('../../config/keys').secret;



/**
 * @route POST api/users/register
 * @desc register the user
 * @access public
 */

 router.post('/register', (req, res) => {
     // de-structure object
     let {

        name, 
        email,
        username,
        password,
        confirmed_password 

     } = req.body;
     if(password !== confirmed_password){
         return res.status(400).json({
             msg: "Password do not match"
         })
     };

     //check for unique username 
     User.findOne({username: username}).then(user => {
         if(user) {
             return res.status(400).json({
                 msg: "User name already taken, please choose another username"
             });
         }
     });

     //Check for unique email
     User.findOne({email: email}).then(email => {
         if(email) {
             return res.status(400).json({
                 msg: "Email Already exist, did you forget your password"
             });
         }
     });

     //Check for valid password

     // data is valid.. register the new user

    // constract new user object using the model consructor 
    let newUser = new User({
        name,
        username,
        email,
        password,
    });

    // hash the password
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save().then(user => {
                return res.status(201).json({
                    success: true,
                    msg: "User registration was succesfull"
                });
            });

        })
    })
 })

 /**
  * @route POST api/users/logig
  * @des   User login
  * @access public
  */
 router.post('/login', (req, res) => {
     // de-struce the request object
     let {
         name,
         username,
         password,
         email
     }  = req.body;

     User.findOne({username: username}).then(user => {
         if(!user) {
             return res.status(404).json({
                 msg: "Username not found",
                 success: false
             })
         };
         // given that you found the user, make sure passwords match
         bcrypt.compare(password, user.password).then(isMatch => {
             if(isMatch) {
                 //User's password is correct, send the JSON token for that user
                 const payload = {
                    name, 
                    username,
                     email,
                     _id: user._id,
                 }
                 jwt.sign(payload, key, {expiresIn: 604800}, (err, token) => {
                     if(err) {
                        return res.status(400).json({
                            msg: "Internal Error.. please check back again",
                            success: false
                        })
                     }
                     res.status(200).json({
                         success: true,
                         user: user,
                         token: `Bearer ${token}`,
                         msg: "Welcome, you are now logged in"
                     });
                     
                 })
             } else {
                 // User's password is incorrect
                 return res.status(404).json({
                     msg: "Incorrect Password",
                     success: false
                 });
             }
         })
     })
 })

 let authorize = passport.authenticate('jwt', {session: false});
 router.get('/profile', authorize, (req, res) => {
     return res.status(200).json({
         user: req.user
     })
 })

module.exports = router;