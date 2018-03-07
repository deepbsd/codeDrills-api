const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.use(jsonParser);

const {UserData} = require('./userDataModel');
const {User} = require('../../users/models');

router.get('/', (req, res) => {
  return UserData
  .find()
  .exec()
  .then(userdata => {
    console.log("API  --userData: ", userdata);
    res.json({
      userdata: userdata
    })
  })
  .catch(err => {
    console.log('MESSAGE: ', err.message);
    console.error('DETAILS: ',err);
    res.status(500).json({error: 'something went terribly wrong'});
  });
});

// To create a new userData entry
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ["user", "userData", "lastQuizData"];
    const keys = Object.keys(req.body["currentUser"]);
    console.log("*****KEYS: ",keys)
    for (let i=0; i<requiredFields.length; i++){
      const field = keys[i];
    if (!(field in req.body["currentUser"])){
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = UserData.create(req.body);
  res.status(201).json(item);
})

// This is the skeleton for a new users userData endpoint
// Not sure if I'm gonna use this yet...
const userDataSkeleton = {
  "currentUser": {
    "user": {
      "username": "Joe",
      "firstName": "Joe",
      "lastName": "Blow",
      "email": "joeblow@whatever.com",
      "password": "sonorapass"
    },
    "userData": {
      "missedQuestions": [],
      "numberOfQuizzes": 0,
      "totalQuestions": 0,
      "totalCorrect": 0,
      "jsQuestionsAnswered": 0,
      "jsQuestionsCorrect": 0,
      "cssQuestionsAnswered": 0,
      "cssQuestionsCorrect": 0,
      "htmlQuestionsAnswered": 0,
      "htmlQuestionsCorrect": 0,
      "nodeQuestionsAnswered": 0,
      "nodeQuestionsCorrect": 0,
      "apiQuestionsAnswered": 0,
      "apiQuestionsCorrect": 0,
      "mongoQuestionsAnswered": 0,
      "mongoQuestionsCorrect": 0
    },
    "lastQuizData": {
      "totalQuestions": 0,
      "dateOfQuiz": "1776-04-07T09:30:00",
      "totalCorrect": 0
    }
  }
}

// This is a delete endpoint for deleting userData's
router.delete('/:id', (req, res) => {
  UserData
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      console.log("It's deleted!")
      res.status(204).json({ message: "Success! UserData Removed."});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: "Delete Failed! Big problem here..."});
    });
});



// This join endpoint isn't working yet, but I'm trying to spitball
//  a function to create a new userData structure for when a user
// registers a new account
// As this stands it won't work now because it's not getting the user
// info from that endpoint.  This should probably be in
// server.js

// ******THIS DOES NOT WORK*****  It's just an idea marker...
router.get('/join', (req, res) => {
  let newUser;
  return User
  .forEach(
    function (data) {
      newUser.username = data.user.username;
      newUser.firstName = data.user.firstName;
      newUser.lastName = data.user.lastName;
      return newUser = {
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    }
  )
  .findOne()
  .exec()
  .then(userdata => {
    res.json({
      userdata: userdata.apiRepr()
    })
  })
  .catch(err => {
    console.log('MESSAGE: ', err.message);
    console.error('DETAILS: ',err);
    res.status(500).json({error: 'something went terribly wrong'});
  });
});


module.exports = router;
