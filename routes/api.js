const express = require('express');
const router = express.Router();
const Room = require('../models/room');
const User = require('../models/user');
const QuestionColection = require('../models/questionCollections');
const ActiveUsers = require('../models/activeUsers');
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

// ----- Room ROOM ROUTES (get, add, edit, delete)-----
router.get('/rooms', (req, res) => {
    Room.find({}).then((result) => {
        res.send(result);
    })
});

// get specific room
router.get('/rooms/:id', (req, res) => {
    Room.find({ roomId: req.params.id }).then((result) => {
        res.send(result);
    })
});

router.post('/rooms/add', passport.authenticate('jwt', { session: false}), (req, res, next) => {
    authCheck(req, (passed) => {
        if (passed) {
            Room.create(req.body).then((room) => {
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
router.put('/rooms/edit/:id', passport.authenticate('jwt', { session: false}), (req, res, next) => {
    authCheck(req, (passed) => {
        if (passed) {
            Room.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true}).then((updatedDoc) => {
               res.send(updatedDoc);
            });
        } else {
            res.status(403).send({success: false, msg: 'Unauthorized'});
        }
    })

});


router.delete('/rooms/delete/:id', passport.authenticate('jwt', { session: false}), (req, res, next) => {
    authCheck(req, (passed) => {
        if (passed) {
            Room.findByIdAndRemove({_id: req.params.id}).then((room) => {
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
router.get('/quiz-collection', passport.authenticate('jwt', { session: false}), function(req, res) {
  QuestionColection.find({}).then((result) => {
    res.send(result);
  })
});

// add
router.post('/quiz-collection/add', passport.authenticate('jwt', { session: false}), (req, res, next) => {
    authCheck(req, (passed) => {
        if (passed) {
            QuestionColection.create(req.body).then((collection) => {
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
router.put('/quiz-collection/update/:id', passport.authenticate('jwt', { session: false}), (req, res, next) => {
    authCheck(req, (passed) => {
        if (passed) {
            QuestionColection.findByIdAndUpdate({_id: req.params.id}, req.body).then((collection) => {
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
router.delete('/quiz-collection/delete/:id', passport.authenticate('jwt', { session: false}), (req, res, next) => {
    authCheck(req, (passed) => {
        if (passed) {
            QuestionColection.findByIdAndRemove({_id: req.params.id}).then((collection) => {
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

// ActivePLebs
// get specific room
router.get('/activeUsers/:id', (req, res) => {
    ActiveUsers.find({ roomId: req.params.id }).then((result) => {
        res.send(result);
    })
});
router.post('/activeUsers/add', (req, res) => {
    ActiveUsers.create(req.body).then((users) => {
        res.send({
            added: true,
            users
        });
    }).catch(next);
});
router.put('/activeUsers/edit/:id', (req, res) => {
    ActiveUsers.findByIdAndUpdate({_id: req.params.id}, req.body).then((users) => {
        res.send({
            added: true,
            users
        });
    }).catch(next);
});
router.delete('/activeUsers/:id', (req, res) => {
    ActiveUsers.findByIdAndRemove({_id: req.params.id}).then((users) => {
        res.send({
            deleted: true,
            users
        });
    }).catch(next);
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
