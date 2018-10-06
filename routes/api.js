const express = require('express');
const router = express.Router();
const Playlist = require('../models/quiz');
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
            res.send({success: true, msg: 'Successful created new user.'});
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

// Serve music urls from db
router.get('/quiz-questions', (req, res) => {
    let response = {
        type: 'GET',
    };
    res.send(response);
});

// Add playlist
router.post('/quiz-questions', (req, res, next) => {
    Playlist.create(req.body).then((playlist) => {
        res.send(playlist);
    }).catch(next);
});

// Change
router.put('/quiz-questions/:id', (req, res, next) => {
    Playlist.findByIdAndUpdate({_id: req.params.id}, req.body).then(() => {
        Playlist.findOne({_id: req.params.id}).then((playlist) => {
            res.send(playlist);
        })
    });
});

// Delete music url from db
router.delete('/quiz-questions/:id', (req, res, next) => {
    Playlist.findByIdAndRemove({_id: req.params.id}).then((playlist) => {
        res.send(playlist);
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