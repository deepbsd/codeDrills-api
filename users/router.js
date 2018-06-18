'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {User} = require('./models');

const {UserData} = require('../src/js/userDataModel');

const router = express.Router();

const jsonParser = bodyParser.json();

// Post to register a new user
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  // If the username and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the users know what's happening, rather than silently
  // trimming them and expecting the user to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 10,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, firstName = '', lastName = '', email = ''} = req.body;
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this
  firstName = firstName.trim();
  lastName = lastName.trim();
  email = email.trim();

  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        firstName,
        lastName,
        email
      });
    })
    .then(user => {
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});


// *** EXPERIMENTAL ENDPOINT ****
// Used when creating a new user and creating new userData
// Right now there is no endpoint that returns only user info
// for /:username
//router.get('/:username', (req,res) => {
//  const username = req.params.username;
//
//  return UserData.findOne({ "currentUser.user.username": username })
//    .then( data => {
//      res.json(data)
//    })
//    .catch( err => res.status(500).json( {message: 'bore me to tears!'}));
//});


// Need to make sure nothing calls this method that is expecting a username

//GET a user by id
router.get('/:id', (req,res) => {

  return User
    .findById(req.params.id)
    .exec()
    .then( data => {
      //console.log("***API: ",data)
      res.json(data)
    })
    .catch( err => res.status(500).json( {message: 'No such user!'}));
});

// *** UPDATE a user ***
router.put('/:id', (req, res) => {

    if (!(req.params.id && req.body.id && req.params.id === req.body.id)){
        return res.status(400).json({
            error: 'Request path id and request body id values must match'
        });
    }
    // Required keys for user object we're updating
    const changeableUserFields = ["firstName","lastName","email"];
    const updatedUserFields = Object.keys(req.body);
    const fieldsToUpdate = {};

    // req.body must contain all the required fields
    updatedUserFields.forEach(name => {
        if (name === "id"){
            return;
        } else if (!(changeableUserFields.includes(name))) {
            const message = `Missing ${name} not able to be updated.`;
            console.error(message);
            return res.status(400).send(message);
        } else {
            fieldsToUpdate[name] = req.body[name];
        }
    })

    console.log("Updating for: ",req.body.id," values: ", fieldsToUpdate);

  return User
    .findByIdAndUpdate(req.params.id, {$set: fieldsToUpdate}, {new: true})
    .then(() => {
      console.log("It's updated!")
      res.status(204).json({ message: "Success! User Updated."});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: "User Update Failed! Big problem here..."});
    });
});



// *** DELETE a user ***
router.delete('/:id', (req, res) => {

  User
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      console.log("It's deleted!")
      res.status(204).json({ message: "Success! User Removed."});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: "User Delete Failed! Big problem here..."});
    });

});


// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
router.get('/', (req, res) => {
  return User.find()
    .then(users => res.json(users.map(user => user.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};
