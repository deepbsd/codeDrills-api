
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const passport = require('passport');
const jsonParser = bodyParser.json();
const jwt = require('jsonwebtoken');
const config = require('../config');
const app = express();
const {User} = require('../users/model');
app.use(cookieParser());


router.post('/login', (req, res) => {
    	let {username, password} = req.body;
      res.json({
        username: username,
        password: password
      })
})
