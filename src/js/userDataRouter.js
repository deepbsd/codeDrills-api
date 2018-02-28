const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.use(jsonParser);

const {UserData} = require('./userDataModel');
const {User} = require('../../users/models');

router.get('/', (req, res) => {
  return UserData
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


// This is the skeleton for a new users userData endpoint
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

// This join endpoint isn't working yet, but I'm trying to spitball
//  a function to create a new userData structure for when a user
// registers a new account
router.get('/join', (req, res) => {
  let newUser;
  return User
  .forEach(
    function (data) {
      newUser.username = data.user.username;
      newUser.firstName = data.user.firstName;
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
