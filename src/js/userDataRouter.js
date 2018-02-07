const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.use(jsonParser);

const {UserData} = require('./userDataModel');


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

// router.get('/', (req, res) => {
//     return User.find()
//         .then(users => res.json(users.map(user => user.apiRepr())))
//         .catch(err => res.status(500).json({message: 'Internal server error'}));
// });





module.exports = router;
