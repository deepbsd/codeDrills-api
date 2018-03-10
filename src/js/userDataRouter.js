const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.use(jsonParser);

const {UserData} = require('./userDataModel');
const {User} = require('../../users/models');

// GET all UserData
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

// GET userData file for specific userId
router.get('/:id', (req, res) => {
  return UserData
  .findById(req.params.id)
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

// This is the skeleton for a new users userData endpoint
// Not sure if I'm gonna use this yet...
const userDataSkeleton = {
  "currentUser": {
    "user": {
      "username": "Joe",
      "firstName": "Joe",
      "lastName": "Blow"
    },
    "userData": {
      "missedQuestions": [0],
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

// To create a new userData entry
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ["username", "firstName", "lastName"];
    const keys = Object.keys(req.body);
    console.log("*****KEYS: ",keys)
    for (let i=0; i<requiredFields.length; i++){
      const field = keys[i];
    if (!(field in req.body)){
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const newEntry = userDataSkeleton;
  userDataSkeleton.currentUser.user = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  }
  const item = UserData.create(newEntry);
  console.log("SUCCESS!  You have created an entry!", item);
  res.status(201).json(item);
});


// Update a user's userData file in the database
// router.put('/', jsonParser, (req, res) => {
//   const requiredFields = ["missedQuestions", "numberOfQuizzes", "totalQuestions", "totalCorrect", "jsQuestionsAnswered", "jsQuestionsCorrect", "cssQuestionsAnswered", "cssQuestionsCorrect", "htmlQuestionsAnswered", "htmlQuestionsCorrect", "nodeQuestionsAnswered", "nodeQuestionsCorrect", "apiQuestionsAnswered", "apiQuestionsCorrect", "mongoQuestionsAnswered", "mongoQuestionsCorrect"];
//     const quizData = Object.keys(req.body);
//     console.log("***** QuizData KEYS: ",keys)
//     for (let i=0; i<requiredFields.length; i++){
//       const field = keys[i];
//     if (!(field in req.body)){
//       const message = `Missing \`${field}\` in request body`;
//       console.error(message);
//       return res.status(400).send(message);
//     }
//   }
//
//   const updatedUserData =
// })


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





module.exports = router;
