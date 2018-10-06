const express = require('express');
const router = express.Router();
const QuizRoom = require('../models/room');
const User = require('../models/user');
const jwt = require('jwt-simple');
const passport = require('passport');

const secret = require('../config/database').secret;

// Authentication
router.post('/signup', function(req, res) {
    console.log(req.body);
    if (!req.body.name || !req.body.password) {
        res.status(422).send({success: false, msg: 'Please pass name and password.'});
    } else {
        let newUser = new User({
            name: req.body.name,
            password: req.body.password
        });
        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.status(400).send({success: false, msg: 'Username already exists.'});
            }
            res.send({success: true, msg: 'Successfully created new user.'});
        });
    }
});



router.post('/authenticate', function(req, res) {
    User.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.status(404).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    let token = jwt.encode(user, secret);
                    // return the information including token as JSON
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.status(401).send({success: false, msg: 'Authentication failed. Wrong credentials.'});
                }
            });
        }
    });
});

// ----- QuizRoom ROOM ROUTES (get, add, change, delete)-----
router.get('/quiz-rooms', (req, res) => {
    let response = {
        type: 'GET',
    };
    res.send(response);
});

router.post('/quiz-rooms/add', (req, res, next) => {
    QuizRoom.create(req.body).then((room) => {
        res.send(room);
    }).catch(next);
});
router.put('/quiz-rooms/change/:id', (req, res, next) => {
    QuizRoom.findByIdAndUpdate({_id: req.params.id}, req.body).then(() => {
        Quiz.findOne({_id: req.params.id}).then((room) => {
            res.send(room);
        })
    });
});


router.delete('/quiz-rooms/delete/:id', (req, res, next) => {
    QuizRoom.findByIdAndRemove({_id: req.params.id}).then((room) => {
        res.send(room);
    });
});



router.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
    const token = getToken(req.headers);
    if (token) {
        const decoded = jwt.decode(token, secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = router;