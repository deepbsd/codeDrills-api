const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.use(jsonParser);

const {UserData} = require('./userDataModel');


router.get('/', (req, res) => {
  UserData
  .find()
  .exec()
  .then(userdata => {
    console.log('Yo! Da Data, Dude!',userdata);
    res.json({
      userdata: userdata.map(userdata => userdata.apiRepr())
    });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'something went terribly wrong'});
  });
});







module.exports = router;
