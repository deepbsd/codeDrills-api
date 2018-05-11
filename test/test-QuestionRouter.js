const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const {app, runServer, closeServer} = require('../server');
const {Question} = require('../src/js/models');

const expect = chai.expect;
const {TEST_DATABASE_URL} = require('../config');
const faker = require('faker');

chai.use(chaiHttp);


// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
  console.warn('Deleting database...');
  return mongoose.connection.dropDatabase();
}

// Generate a single question
function generateQuestion(){
  let question = faker.lorem.sentence();
  question = question.slice(0, question.length-1);
  question += "?";
  return question;
}

// Generate the 5 answers for a single question
function generateAnswers(){
  let answers = [];
  for (let i=0; i<5; i++){
    answers[i] = faker.lorem.sentence();
  }
  // console.log("***answers: ",answers);
  return answers;
}

// Return one single JSON question object
function generateSingleQuestion(){
  let categories = ["mongo","html","node","js","api","css"];
  let types = ["image","video","null"];
  let answers = generateAnswers();
  let answerArr = [];
  let questionObj = {}
  for (i=100; i<101; i++){
    questionObj.number = i;
    questionObj.question = generateQuestion();
    questionObj.category = categories[Math.floor(Math.random()*categories.length)];
    questionObj.assetUrl = faker.internet.url();
    questionObj.type = types[Math.floor(Math.random()*types.length)];
    questionObj.answers = [];
    for (let i=0; i<5; i++){
      questionObj.answers[i] = {
        answerText: answers[i],
        chosen: false,
        correct: false,
      }
    }
    questionObj.answers[0].correct = true;
    answerArr.push(questionObj);
  }
  // console.log("**QUESTIONOBJ: ",questionObj);
  return questionObj;
}

// insert 10 Questions in the database
function seedFakeQuestions(num=10) {
  console.info('seeding fake questions...' );
  let newData;
  const seedData = [];
  for (let i=0; i<num; i++) {
    newData = generateSingleQuestion();
    seedData.push(newData);
  }
  console.log("##returning Question.insertMany seedData: ")
  // this will return a promise
  return Question.insertMany(seedData)
  .then( data => {
    console.log("**seedData made it: ");
  })
  .catch(err => {
    console.log("Seeding Error: ",err);
  })
}


// Test the endpoints for /api/questions
describe('Question API', function() {

  before(function() {
    console.log("Starting test server...")
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function(){
    console.log("calling seedFakeQuestions() from beforeEach()...")
    return seedFakeQuestions();
  })

  afterEach(function(){
    return tearDownDb();
  })

  after(function() {
    return closeServer();
  });

  it('should get 200 on GET requests and return correct objects and keys', function() {
    let res;
    return chai.request(app)
	  .get('/api/questions/')
      .then(function(_res) {
		res = _res;
        //console.log("BODY: ",res.body);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.all.keys('questions');
        expect(res.body.questions).to.be.a('array');
        expect(res.body.questions.length).to.be.above(0);
        res.body.questions.forEach(function(item){
          expect(item).to.be.a('object');
          expect(item).to.contain.all.keys(
            'number', 'question', 'category', 'assetUrl', 'type', 'answers'
          )
          expect(item.answers).to.be.a('array');
          expect(item.answers.length).to.equal(5);
          item.answers.forEach(function(item){
            expect(item).to.be.a('object');
            expect(item).to.contain.all.keys(
              'answerText', 'chosen'
            )
          })
        });
      });
  });



  // Get single question
  it('should return a single question by id', function() {
  // strategy:
  //    1. Get a question from db
  //    2. Prove you can retrieve it by id at `/questions/:id`
  let question;
    return Question
    .findOne()
    .then(_question => {
      question = _question
      return chai.request(app)
        .get(`/api/questions/${question.id}`);
    })
   .then(res => {
     expect(res).to.have.status(200);
     expect(res.body.id).to.equal(question.id);
   })
  })



  it('should POST a single question', function() {
      // strategy:
      //    1. Post a single question with answers to endpoint
      //    2. Make sure the res object is identical
      let newQuestion = generateSingleQuestion();
      // console.log("newQuestion: ",newQuestion)
      return chai.request(app)
        .post('/api/questions')
        .send(newQuestion)
        .then(function(res){
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body.id).to.not.equal('null');
            expect(res.body).to.contain.all.keys(
              'number', 'question','category','assetUrl','type','answers'
            );
            expect(res.body.answers.length).to.equal(5);
            expect(res.body.answers[0].correct).to.equal(true);
            for(let i=0; i<5; i++){
              expect(res.body.answers[i]).to.contain.all.keys(
                'answerText','chosen','correct'
              );
              // res.body will have a fresh new _id key...
              expect(res.body.answers[i].answerText).to.equal(newQuestion.answers[i].answerText);
              expect(res.body.answers[i].correct).to.equal(newQuestion.answers[i].correct);
              expect(res.body.answers[i].chosen).to.equal(newQuestion.answers[i].chosen);
            }
            expect(res.body.question).to.equal(newQuestion.question);
            expect(res.body.number).to.equal(newQuestion.number);
            expect(res.body.category).to.equal(newQuestion.category);
            expect(res.body.assetUrl).to.equal(newQuestion.assetUrl);
            expect(res.body.type).to.equal(newQuestion.type);
            //console.log("Question: ",res.body);
      })
  });

  // strategy:
  //  1. Get an existing question from db
  //  2. Make a PUT request to update that question
  //  3. Prove question returned by request contains data we sent
  //  4. Prove question in db is correctly updated
  it('PUT: should update /question fields you send over', function() {
    const updateData = {
      question: generateQuestion(),
      assetUrl: faker.internet.url()
    };

    return Question
      .findOne()
      .then(function(question) {
        updateData.id = question.id;
        // make request then inspect it to make sure it reflects
        // data we sent
        return chai.request(app)
          .put(`/api/questions/${question.id}`)
          .send(updateData);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
        return Question.findById(updateData.id);
      })
      .then(function(updatedQuestion) {
        expect(updatedQuestion.question).to.equal(updateData.question);
        expect(updatedQuestion.assetUrl).to.equal(updateData.assetUrl);
      });
  });


  describe('DELETE endpoint', function() {
    // strategy:
    //  1. get a question
    //  2. make a DELETE request for that question's id
    //  3. assert that response has right status code
    //  4. prove that question with the id doesn't exist in db anymore
    it('delete a question by id', function() {

      let question;

      return Question
        .findOne()
        .then(function(_question) {
          question = _question;
          return chai.request(app).delete(`/api/questions/${question.id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return Question.findById(question.id);
        })
        .then(function(_question) {
          // when a variable's value is null, chaining `expect`
          // doesn't work. so `expect(_question).to.be.null` would raise
          // an error. `should.be.null(_question)` is how we can
          // make assertions about a null value.
          expect(_question).to.not.exist;
        });
    });
  });



});


