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
  .then(userdata => res.json(userdata.apiRepr()))
  .catch(err => {
    console.error(err.message);
    res.status(500).json({error: 'something went terribly wrong'});
  });
});







module.exports = router;
