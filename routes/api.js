const express = require('express');
const router = express.Router();
const QuizRoom = require('../models/room');
const User = require('../models/user');
const QuizCollection = require('../models/quizCollection');
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

// ----- QuizRoom ROOM ROUTES (get, add, edit, delete)-----
router.get('/quiz-rooms', (req, res) => {
    QuizRoom.find({}).then((result) => {
        res.send(result);
    })
});

router.post('/quiz-rooms/add', passport.authenticate('jwt', { session: false}), (req, res, next) => {
    authCheck(req, (passed) => {
        if (passed) {
            QuizRoom.create(req.body).then((room) => {
                res.send({
                    added: true,
                    room
                });
            }).catch(next);
        } else {
            res.status(403).send({success: false, msg: 'Unauthorized'});
        }
    });
});
router.put('/quiz-rooms/edit/:id', passport.authenticate('jwt', { session: false}), (req, res, next) => {
    authCheck(req, (passed) => {
        if (passed) {
            QuizRoom.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true}).then((updatedDoc) => {
               res.send(updatedDoc);
            });
        } else {
            res.status(403).send({success: false, msg: 'Unauthorized'});
        }
    })

});


router.delete('/quiz-rooms/delete/:id', passport.authenticate('jwt', { session: false}), (req, res, next) => {
    authCheck(req, (passed) => {
        if (passed) {
            QuizRoom.findByIdAndRemove({_id: req.params.id}).then((room) => {
                res.send({
                    deleted: true,
                    room
                });
            });
        } else {
            res.status(403).send({success: false, msg: 'Unauthorized'});
        }
    });
});

router.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
    authCheck(req, (what) => {
        if (what) {
         res.json({success:true});
        } else {
            res.status(403).send({success: false, msg: 'Unauthorized'});
        }
    });
});


// retrive
router.get('/quiz-collection/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
  QuizCollection.find({req.params.id}).then((result) => {
    res.send(result);
  })
});

// add
router.post('/quiz-collection', passport.authenticate('jwt', { session: false}), (req, res, next) => {
    authCheck(req, (passed) => {
        if (passed) {
            QuizCollection.create(req.body).then((collection) => {
                res.send({
                    added: true,
                    collection
                });
            }).catch(next);
        } else {
            res.status(403).send({success: false, msg: 'Unauthorized'});
        }
    });
});

// update
router.put('/quiz-collection/:id', passport.authenticate('jwt', { session: false}), (req, res, next) => {
    authCheck(req, (passed) => {
        if (passed) {
            QuizCollection.findByIdAndUpdate({_id: req.params.id, req.body}).then((collection) => {
                res.send({
                    added: true,
                    collection
                });
            }).catch(next);
        } else {
            res.status(403).send({success: false, msg: 'Unauthorized'});
        }
    });
});


// delete
router.delete('/quiz-collection/:id', passport.authenticate('jwt', { session: false}), (req, res, next) => {
    authCheck(req, (passed) => {
        if (passed) {
            QuizCollection.findByIdAndRemove({_id: req.params.id}).then((collection) => {
                res.send({
                    deleted: true,
                    collection
                });
            });
        } else {
            res.status(403).send({success: false, msg: 'Unauthorized'});
        }
    });
});


const authCheck = (req, callback) => {
    const token = getToken(req.headers);
    if (token) {
        const decoded = jwt.decode(token, secret);
        User.findOne({
            name: decoded.name
        }, (err, user) => {
            if (!err && user) {
                callback(true);
            }
        });
    } else {
        return false
    }
}

const getToken = (headers) => {
    if (headers && headers.authorization) {
        const parted = headers.authorization.split(' ');
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
