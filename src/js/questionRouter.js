const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.use(jsonParser);

const {Question} = require('./models');


router.get('/', (req,res) => {
  Question
  .find()
  .exec()
  .then(questions => {
    // // mday commented this out console.log('Yo! Dude!',questions);
    res.json({
      questions: questions.map(question => question.apiRepr())
    });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'something went terribly wrong'});
  });
});







module.exports = router;
