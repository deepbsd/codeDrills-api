
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const passport = require('passport');
const jsonParser = bodyParser.json();
const jwt = require('jsonwebtoken');
const config = require('../config');
const app = express();
const router = express.Router();
// const {User, UserData} = require('../src/js/userDataModel');
const {UserData} = require('../src/js/userDataModel');
const {User} = require('../users/models');


app.use(cookieParser());


// app.post('/', (req, res) => {
router.post('/', (req, res) => {
	let {username, password} = req.body;
  console.log('USERNAME: ',username);
  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({  //c033
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      return User.hashPassword(password);  //c034
    })
    .then(hash => {
      console.log('HASH: ', hash);
      return User.create({
        username,
        password: hash
      });
    })
    .then(user => {
      res.json({
        username: username,
        password: password
      })
    })
    .catch(err => {  //c035
        if (err.reason === 'ValidationError') {
          return res.status(err.code).json(err);
        }
        res.status(500).json({code: 500, message: 'Internal server error'});
    });
})


module.exports = {router};
