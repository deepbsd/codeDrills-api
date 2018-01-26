const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.use(jsonParser);

const {Questions} = require('./models');

// get request at /guns
router.get('/', (req,res) => {
  Questions
  .find()
  .exec()
  .then(question => {
    res.json(question.map(question => gun.apiRepr()));
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'something went terribly wrong'});
  });
});







module.exports = router;
