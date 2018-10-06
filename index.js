const express = require('express');
const bodyParser = require('body-parser');
const mongoose =  require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const routes = require('./routes/api');
const config = require('./config/database');

const app = express();

mongoose.connect(config.database);
mongoose.Promise = global.Promise;

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use('/api', routes);
app.use((err, req, res, next) => {
    console.log(err);
    res.status(422).send({error: err.message});
});


// pass passport for configuration
require('./config/passport')(passport);


app.listen(4000, () => {
    console.log("Listening for requests..");
});