const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const {Question} = require('../src/js/models');
const mongoose = require('mongoose');
const expect = chai.expect;

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

// Return one single JSON question
function generateSingleQuestion(){
  let categories = ["mongo","html","node","js","api","css"];
  let types = ["image","video","null"];
  let answers = generateAnswers();
  let answerArr = [];
  let questionObj = {}
  for (i=100; i<110; i++){
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
  return questionObj;
}

// insert 10 Questions in the database
function seedFakeQuestions(num=10) {
  console.info('seeding fake questions...');
  let newData;
  const seedData = [];
  for (let i=1; i<=num.length; i++) {
    newData = generateSingleQuestion();
    seedData.push(newData);
  }
  // this will return a promise
  return Question.insertMany(seedData)
  // .catch(err => {
  //   console.log("Seeding Error: ",err)
  // })
}


// Test the endpoints for /api/questions
describe('Question API', function() {

  before(function() {
    console.log("Starting server...")
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function(){
    seedFakeQuestions();
  })

  afterEach(function(){
    tearDownDb();
  })

  after(function() {
    return closeServer();
  });

  it.only('should get 200 on GET requests and return correct objects and keys', function() {
    return chai.request(app)
      .get('/api/questions/')
      .then(function(res) {
        console.log("BODY: ",res.body.questions);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.all.keys('questions');
        expect(res.body.questions).to.be.a('array');
        // expect(res.body.questions.length).to.be.above(0);
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
              // console.log(res.body.answers[i]);
              // expect(res.body.answers[i]).to.equal(newQuestion.answers[i]);
            }
            expect(res.body.question).to.equal(newQuestion.question);
            expect(res.body.number).to.equal(newQuestion.number);
            expect(res.body.category).to.equal(newQuestion.category);
            expect(res.body.assetUrl).to.equal(newQuestion.assetUrl);
            expect(res.body.type).to.equal(newQuestion.type);

        })
    });


});
