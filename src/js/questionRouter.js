const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.use(jsonParser);

const {Question} = require('./models');

// get all questions
//////////////////////
router.get('/', (req,res) => {
  Question
  .find()
  .exec()
  .then(questions => {
    res.json({
      questions: questions.map(question => question.apiRepr())
    });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'something went terribly wrong'});
  });
});

// can also request by ID
//////////////////////////
router.get('/questions/:id', (req, res) => {
  Question
    // this is a convenience method Mongoose provides for searching
    // by the object _id property
    .findById(req.params.id)
    .then(question => res.json(question.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// Add new questions to db
////////////////////////////
router.post('/questions', (req, res) => {

  const requiredFields = ['number', 'question', 'category', 'assetUrl', 'type', 'answers'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  // All answers must have required fields
  // All answers lists must have only one correct answer
  const answerFields = ['answerText', 'chosen']
  const answers = req.body.answers;
  const hasCorrect = false;
  for (let i = 0; i<answers.length; i++){
    const correctAnswer = 0;
    const answer = answers[i];
    let field1 = answerFields[0];
    let field2 = answerFields[1];
    if (!(field1 in req.body.answers[i]) || !(field2 in req.body.answers[i])){
      const message = `Missing \`${field1} or \`${field2} in answer number ${i}`;
      console.log("question post error: ",message);
      return res.status(400).send(message);
    }
    // Answers must have only 1 correct answer
    if (answer.correct){
      hasCorrect = true;
      correctAnswer++;
    }
    if (correctAnswer > 1){
      const message = `More than one correct answer in Question`;
      console.log("question post error: ",message);
      return res.status(400).send(message);
    }
  }
  if (!hasCorrect){
    const message = "Question must contain a correct answer."
    console.log("Question Post Error: ",message);
    return res.status(400).send(message)
  }

  Question
    .create({
      number: req.body.number,
      question: req.body.question,
      category: req.body.category,
      assetUrl: req.body.assetUrl,
      type: req.body.type,
      answers: req.body.answers
    })
    .then(question => res.status(201).json(question.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// Update a question
///////////////////////
router.put('/questions/:id', (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({ message: message });
  }

  //**********************************************************
  //*** Need to add checks for 5 answers and 1 correct answer
  //*** on each of req.body.answers
  //**********************************************************

  // we only support a subset of fields being updateable.
  // if the user sent over any of the updatableFields, we udpate those values
  // in document
  const toUpdate = {};
  const updateableFields = ['question', 'category', 'assetUrl', 'answers'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Question
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(question => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});


// Delete a Question
//////////////////////
router.delete('/questions/:id', (req, res) => {
  Question
    .findByIdAndRemove(req.params.id)
    .then(question => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});


module.exports = router;
