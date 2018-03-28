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
router.put('/:id', jsonParser, (req, res) => {
  // ## user ids must match  user id must be same for params and db record
  if (!(req.params.id && req.body._id && req.params.id === req.body._id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  // ## The new object that we'll construct from the req.body
  // let updated = {};

  // ## these are the required keys for each object we're receiving
  const requiredUserDataObjects = ["user", "userData", "lastQuizData"];
  const requiredUserObjects = ["username", "firstName", "lastName"];
  const userDataRequiredFields = ["missedQuestions", "numberOfQuizzes", "totalQuestions", "totalCorrect", "jsQuestionsAnswered", "jsQuestionsCorrect", "cssQuestionsAnswered", "cssQuestionsCorrect", "htmlQuestionsAnswered", "htmlQuestionsCorrect", "nodeQuestionsAnswered", "nodeQuestionsCorrect", "apiQuestionsAnswered", "apiQuestionsCorrect", "mongoQuestionsAnswered", "mongoQuestionsCorrect"];
  const userLastQuizDataRequiredFields = ["totalQuestions", "dateOfQuiz", "totalCorrect"];

  // ## req.body must contain the three main userData components
  requiredUserDataObjects.forEach(name => {
    if (!(Object.keys(req.body.currentUser).includes(name))){
      const message = `Missing ${name} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  })

  // ## req.body.user must contain the correct keys
  requiredUserObjects.forEach(name => {
    if (!(Object.keys(req.body.currentUser.user))) {
      const message = `Missing ${name} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  })

  // ## req.body.userData must contain the correct keys
  userDataRequiredFields.forEach(name => {
    if (!(Object.keys(req.body.currentUser.userData))) {
      const message = `Missing ${name} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  })

  // ## req.body.lastQuizData must contain the correct keys
  userLastQuizDataRequiredFields.forEach(name => {
    if (!(Object.keys(req.body.currentUser.lastQuizData))) {
      const message = `Missing ${name} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  })


  //
  // function getUserInfo(id){
  //   User.findById(id).exec(function(err, user){
  //     info.username = user.username,
  //     info.firstName = user.firstName
  //   });
  //   console.log('user: ',info );
  //
  // }
  //
  // Get the userdata
  // const userDataUserQuery = getUserInfo(req.params.id);
  // userDataUserQuery.exec(function(err, user){
  //   if (err) { return console.log(err)}
  //   return user
  // })

  // Modify the user info so that it doesn't have password hashes
  // and other needless stuff for this object
  // const updatedUserInfo = {
  //   "username": userDataUserQuery.username,
  //   "firstName": userDataUserQuery.firstName,
  //   "lastName": userDataUserQuery.lastName
  // }

  // Looks like all the pieces are present, so let's assemble the new object
  const updatedUserData = {
        "numberOfQuizzes": req.body.currentUser.userData.numberOfQuizzes,
        "totalQuestions": req.body.currentUser.userData.totalQuestions,
        "totalCorrect": req.body.currentUser.userData.totalCorrect,
        "jsQuestionsAnswered": req.body.currentUser.userData.jsQuestionsAnswered,
        "jsQuestionsCorrect": req.body.currentUser.userData.jsQuestionsCorrect,
        "cssQuestionsAnswered": req.body.currentUser.userData.cssQuestionsAnswered,
        "cssQuestionsCorrect": req.body.currentUser.userData.cssQuestionsCorrect,
        "htmlQuestionsAnswered": req.body.currentUser.userData.htmlQuestionsAnswered,
        "htmlQuestionsCorrect": req.body.currentUser.userData.htmlQuestionsCorrect,
        "nodeQuestionsAnswered": req.body.currentUser.userData.nodeQuestionsAnswered,
        "nodeQuestionsCorrect": req.body.currentUser.userData.nodeQuestionsCorrect,
        "apiQuestionsAnswered": req.body.currentUser.userData.apiQuestionsAnswered,
        "apiQuestionsCorrect": req.body.currentUser.userData.apiQuestionsCorrect,
        "mongoQuestionsAnswered": req.body.currentUser.userData.mongoQuestionsAnswered,
        "mongoQuestionsCorrect": req.body.currentUser.userData.mongoQuestionsCorrect,
        "missedQuestions": req.body.currentUser.userData.missedQuestions
    };

  const updatedLastQuizData = {
        "totalQuestions": req.body.currentUser.lastQuizData.totalQuestions,
        "dateOfQuiz": req.body.currentUser.lastQuizData.dateOfQuiz,
        "totalCorrect": req.body.currentUser.lastQuizData.totalCorrect
      }

  let info = {};


  // Function to get the user data
  User.findOne({"username":req.body.currentUser.user.username}).then( user => {
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
    console.log("***USER ",user);
    return UserData
      .findByIdAndUpdate(req.params.id, {$set: newCurrentUser}, {new: true})
  })
  .then(updatedData => {
    console.log("** updatedData ", updatedData)
    res.status(201).json(updatedData)
  })
  .catch(err => res.status(500).json( {message: "Error: Data NOT Updated!"}));



  //
  // //Log this stuff out...
  // console.log("***newCurrentUser ", userDataUserQuery);


  // Now lets submit the new object to the database
//   UserData
//     .findByIdAndUpdate(req.params.id, {$set: newCurrentUser}, {upsert: true, new: true})
//     .exec()
//     .then(updatedData => res.status(201).json(updatedData))
//     .catch(err => res.status(500).json( {message: "Error: Data NOT Updated!"}));
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
