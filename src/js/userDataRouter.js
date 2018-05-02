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
    // console.log("API  --userData: ", userdata);
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
    // console.log("API  --userData: ", userdata);
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
    // Turn this log on when you want to inspect the body...
    // console.log("***REQ.BODY: ",req.body)
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
  UserData.create(newEntry)
  .then(function(item){
    console.log("SUCCESS!  You have created an entry!");
    res.status(201).json(item);
  })
});


// Update a user's userData file in the database
router.put('/:id', jsonParser, (req, res) => {
  // ## user ids must match  user id must be same for params and db record
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    return res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }
  console.log("***API: hitting PUT method with userData.id: ", req.params.id);

  // ## these are the required keys for each object we're receiving
  const requiredUserDataObjects = ["user", "userData", "lastQuizData"];
  const requiredUserObjects = ["username", "firstName", "lastName"];
  const userDataRequiredFields = ["missedQuestions", "numberOfQuizzes", "totalQuestions", "totalCorrect", "jsQuestionsAnswered", "jsQuestionsCorrect", "cssQuestionsAnswered", "cssQuestionsCorrect", "htmlQuestionsAnswered", "htmlQuestionsCorrect", "nodeQuestionsAnswered", "nodeQuestionsCorrect", "apiQuestionsAnswered", "apiQuestionsCorrect", "mongoQuestionsAnswered", "mongoQuestionsCorrect"];
  const userLastQuizDataRequiredFields = ["totalQuestions", "dateOfQuiz", "totalCorrect"];

  // ## req.body must contain the three main userData components
  requiredUserDataObjects.forEach(name => {
    // console.log("### Suspect Obj: ", req.body);
    if (!(Object.keys(req.body).includes(name))){
      const message = `Missing ${name} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  })

  // ## req.body.user must contain the correct keys
  requiredUserObjects.forEach(name => {
    if (!(Object.keys(req.body.user))) {
      const message = `Missing ${name} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  })

  // ## req.body.userData must contain the correct keys
  userDataRequiredFields.forEach(name => {
    if (!(Object.keys(req.body.userData))) {
      const message = `Missing ${name} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  })

  // ## req.body.lastQuizData must contain the correct keys
  userLastQuizDataRequiredFields.forEach(name => {
    if (!(Object.keys(req.body.lastQuizData))) {
      const message = `Missing ${name} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  })

  const updatedUserData = {
        "numberOfQuizzes": req.body.userData.numberOfQuizzes,
        "totalQuestions": req.body.userData.totalQuestions,
        "totalCorrect": req.body.userData.totalCorrect,
        "jsQuestionsAnswered": req.body.userData.jsQuestionsAnswered,
        "jsQuestionsCorrect": req.body.userData.jsQuestionsCorrect,
        "cssQuestionsAnswered": req.body.userData.cssQuestionsAnswered,
        "cssQuestionsCorrect": req.body.userData.cssQuestionsCorrect,
        "htmlQuestionsAnswered": req.body.userData.htmlQuestionsAnswered,
        "htmlQuestionsCorrect": req.body.userData.htmlQuestionsCorrect,
        "nodeQuestionsAnswered": req.body.userData.nodeQuestionsAnswered,
        "nodeQuestionsCorrect": req.body.userData.nodeQuestionsCorrect,
        "apiQuestionsAnswered": req.body.userData.apiQuestionsAnswered,
        "apiQuestionsCorrect": req.body.userData.apiQuestionsCorrect,
        "mongoQuestionsAnswered": req.body.userData.mongoQuestionsAnswered,
        "mongoQuestionsCorrect": req.body.userData.mongoQuestionsCorrect,
        "missedQuestions": req.body.userData.missedQuestions
    };

  const updatedLastQuizData = {
        "totalQuestions": req.body.lastQuizData.totalQuestions,
        "dateOfQuiz": req.body.lastQuizData.dateOfQuiz,
        "totalCorrect": req.body.lastQuizData.totalCorrect
      }

  let info = {};


  // console.log("USERNAME: ",req.body.user.username);


  // Function to get the user data
  User.findOne({"username":req.body.user.username})
    .exec()
    .then( user => {
      const newCurrentUser = {
        currentUser: {
          "user": {
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
          },
          "userData": updatedUserData,
          "lastQuizData": updatedLastQuizData,
        }
      }
      // console.log("***USER ",user);
      return UserData
        .findByIdAndUpdate(req.params.id, {$set: newCurrentUser}, {new: true})
        .then(userdata => {
          res.status(204).end();
        })
        .catch(err => {
          console.log("ERROR: ",err);
          return res.status(500).json({ message: 'X---Internal server error' });
        })
    })
  .catch(err => {
    return res.status(500).json(
    {message: "Error: Data NOT Updated!", key: req.body.user.username}
  )});
});


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
