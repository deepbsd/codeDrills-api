const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const {app, runServer, closeServer} = require('../server');
const {UserData} = require('../src/js/userDataModel');

const expect = chai.expect;
const {TEST_DATABASE_URL} = require('../config');
const faker = require('faker');

chai.use(chaiHttp);


// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

// We'll need an "average" user's data sample to start with
function createUserData(){
  let MAXQUIZZES = 20;
  let numOfQuizzes = Math.floor(Math.random() * MAXQUIZZES);
  let avgPctg = Math.random();
  let avgAnswered = Math.round((numOfQuizzes*10)/6);
  let leftOver = 10-avgAnswered;

  let data = {
    missedQuestions: Math.round((numOfQuizzes * 10) * avgPctg),
    numberOfQuizzes: numOfQuizzes,
    totalQuestions: 10*numOfQuizzes,
    totalCorrect: (10*numOfQuizzes)-Math.round((numOfQuizzes*10)*avgPctg),
    jsQuestionsAnswered: avgAnswered+leftOver,
    jsQuestionsCorrect: Math.round(avgAnswered*avgPctg),
    cssQuestionsAnswered: avgAnswered,
    cssQuestionsCorrect: Math.round(avgAnswered*avgPctg),
    htmlQuestionsAnswered: avgAnswered,
    htmlQuestionsCorrect: Math.round(avgAnswered*avgPctg),
    nodeQuestionsAnswered: avgAnswered,
    nodeQuestionsCorrect: Math.round(avgAnswered*avgPctg),
    apiQuestionsAnswered: avgAnswered,
    apiQuestionsCorrect: Math.round(avgAnswered*avgPctg),
    mongoQuestionsAnswered: avgAnswered,
    mongoQuestionsCorrect: Math.round(avgAnswered*avgPctg)
  }
  return data;
}

function generateUserData(){
  return {
    user: {
      username: faker.internet.userName(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName()
    },
    userData: createUserData(),
    lastQuizData: {
      totalQuestions: 100,
      dateOfQuiz: new Date().toString(),
      totalCorrect: 89
    }
  };
}



function seedUserData() {
  console.info('seeding user data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateUserData());
  }
  // this will return a promise
  // mday commented this out console.log("*** seedData: ", seedData);
  return UserData.insertMany(seedData);
}




describe('Userdata API', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedUserData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function(){
    return closeServer();
  });

  it('should get 200 on GET requests and return correct objects and keys', function() {
    return chai.request(app)
      .get('/api/userdata/')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.all.keys('userdata');
        // mday commented this out console.log("**res.body: ",res.body);
        expect(res.body.userdata).to.be.a('array');
        expect(res.body.userdata.length).to.be.above(0);
        // res.body.userdata.forEach(function(item){
        //   expect(item).to.be.a('object');
        //   // mday commented this out console.log("**item: ",item);
        // //   expect(item.currentUser).to.contain.all.keys(
        // //     'user', 'userData', 'lastQuizData'
        // //   )
        // });
      });
  });


   // it('POST: should add 10 new userData sets', function() {
   //
   //   const newDataSet = seedUserData();
   //
   //   return chai.request(app)
   //     .post('/userdata')
   //     .send(newDataSet)
   //     .then(function(res) {
   //       expect(res).to.have.status(201);
   //       expect(res).to.be.json;
   //       expect(res.body).to.be.a('object');
   //       // expect(res.body).to.include.keys(
   //       //   'id', 'name', 'cuisine', 'borough', 'grade', 'address');
   //       // expect(res.body.name).to.equal(newRestaurant.name);
   //       // // cause Mongo should have created id on insertion
   //       // expect(res.body.id).to.not.be.null;
   //       // expect(res.body.cuisine).to.equal(newRestaurant.cuisine);
   //       // expect(res.body.borough).to.equal(newRestaurant.borough);
   //       //
   //       // mostRecentGrade = newRestaurant.grades.sort(
   //       //   (a, b) => b.date - a.date)[0].grade;
   //       //
   //       // expect(res.body.grade).to.equal(mostRecentGrade);
   //       // return Restaurant.findById(res.body.id);
   //     })
   //     // .then(function(restaurant) {
   //     //   expect(restaurant.name).to.equal(newRestaurant.name);
   //     //   expect(restaurant.cuisine).to.equal(newRestaurant.cuisine);
   //     //   expect(restaurant.borough).to.equal(newRestaurant.borough);
   //     //   expect(restaurant.grade).to.equal(mostRecentGrade);
   //     //   expect(restaurant.address.building).to.equal(newRestaurant.address.building);
   //     //   expect(restaurant.address.street).to.equal(newRestaurant.address.street);
   //     //   expect(restaurant.address.zipcode).to.equal(newRestaurant.address.zipcode);
   //     // });
   // });



});
