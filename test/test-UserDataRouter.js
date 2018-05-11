const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const {app, runServer, closeServer} = require('../server');
const {UserData} = require('../src/js/userDataModel');
const {User} = require('../users/models');

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
  let leftOver = (10*numOfQuizzes)%(avgAnswered*6);

  let data = {
    missedQuestions: Math.round((numOfQuizzes * 10) * avgPctg),
    numberOfQuizzes: numOfQuizzes,
    totalQuestions: 10*numOfQuizzes,
    // totalCorrect: (10*numOfQuizzes)-Math.round((numOfQuizzes*10)*avgPctg),
    totalCorrect: avgAnswered*5,
    jsQuestionsAnswered: avgAnswered+leftOver || 0,
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

// Users created by client will not have historical data, so API will give them a skeleton containing
// historical data
function generateUser(){
  return {
      username: faker.internet.userName(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName()
    };
}

// It's possible at some future point the client will POST complete data rather than just new users.
function generateUserData(){
  return {
      currentUser: {
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
    }
  };
}



function seedUserData() {
  // console.info('seeding user data');
  const seedData = [];
  const usersData = [];

  for (let i=1; i<=10; i++) {
    let newData = generateUserData();
    let usrData = newData.currentUser.user;
    usrData.password = "password99";
    seedData.push(newData);
    usersData.push(usrData);
  }
  // this will return a promise
  return UserData.insertMany(seedData)
  .then( () => {
    return User.insertMany(usersData)
  })
  .catch(err => {
    console.log("Seeding Error: ",err)
  })
}




describe('Userdata API', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    // console.log("***firing seedUserData...");
    return seedUserData();
  });

  afterEach(function() {
    // console.log("*** tearing down DB...");
    return tearDownDb();
  });

  after(function(){
    return closeServer();
  });



  it('GET: should get 200 on GET requests and return correct objects and keys', function() {
    let res;
    return chai.request(app)
      .get('/api/userdata')
      .then(function(_res) {
        res = _res;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.all.keys('userdata');
        expect(res.body.userdata).to.be.a('array');
        expect(res.body.userdata.length).to.be.above(0);
        res.body.userdata.forEach(function(item){
          expect(item).to.be.a('object');
          expect(item.currentUser).to.contain.all.keys(
            'user', 'userData', 'lastQuizData'
          )
        });
      });

  });


   it.only('GET: should return a single users dataset by username', function() {
     // strategy:
     //    1. Get a dataset from db
     //    2. Prove you can retrieve it by id at `/api/userdata/:id`
     let dataset;
     return UserData
       .findOne()
       .then(_dataset => {
         dataset = _dataset
         return chai.request(app)
           .get(`/api/userdata/${dataset.currentUser.user.username}`);
       })
       .then(res => {
	     console.log("RES.body.userdata.currentUser.user",res.body.userdata.currentUser.user);
	     console.log("dataset.currentUser.user",dataset.currentUser.user);
         expect(res).to.have.status(200);
         expect(res.body.userdata.currentUser.user.username).to.equal(dataset.currentUser.user.username);
		 //expect(res.body.userdata.currentUser.userData).to.deep.equal(dataset.currentUser.userData)
		 expect(res.body.userdata.currentUser.user).to.deep.equal(dataset.currentUser.user)
		 //expect(res.body.userdata.currentUser.userdata.lastQuizData).to.deep.equal(dataset..currentUser.lastQuizData)
       })
   })

  
   it('POST: should add 1 new userData sets', function() {
     const userDataFields = [
       'numberOfQuizzes', 'totalQuestions', 'totalCorrect', 'jsQuestionsAnswered', 'jsQuestionsCorrect',
       'cssQuestionsAnswered', 'cssQuestionsCorrect', 'htmlQuestionsAnswered', 'htmlQuestionsCorrect',
       'nodeQuestionsAnswered', 'nodeQuestionsCorrect', 'apiQuestionsAnswered', 'apiQuestionsCorrect',
       'mongoQuestionsAnswered', 'mongoQuestionsCorrect' ];
     const newDataSet = generateUser();
     return chai.request(app)
       .post('/api/userdata/')
       .send(newDataSet)
       .then(function(res) {
         expect(res).to.have.status(201);
         expect(res).to.be.json;
         expect(res.body).to.be.a('object');
         expect(res.body.currentUser).to.include.keys(
           'user', 'userData', 'lastQuizData');
         expect(res.body.currentUser.user).to.include.keys(
           'username', 'firstName', 'lastName'
         );
         expect(res.body.currentUser.lastQuizData).to.include.keys(
           'totalQuestions', 'totalCorrect', 'dateOfQuiz'
         );
         userDataFields.forEach(function(field){
           expect(res.body.currentUser.userData).to.include.key(field)
         });
         userDataFields.forEach(function(field){
            expect(res.body.currentUser.userData[field]).to.equal(0);
         });
       })
   });


    // strategy:
    //  1. Get an existing users data from db
    //  2. Make a PUT request to update that dataset
    //  3. Prove data set returned by request contains data we sent
    //  4. Prove data set in db is correctly updated
   it('PUT: should modify an existing users data set.', function(){
     const updateData = {
       user: {},
       userData: {},
       lastQuizData: {}
     }
     return UserData
      .findOne()
      .then(function(record){
        // console.log("Pre-record: ",record);
        updateData.id = record.id;
        updateData.user = record.currentUser.user;
        updateData.userData = record.currentUser.userData;
        updateData.lastQuizData = record.currentUser.lastQuizData;
        updateData.userData.totalCorrect = record.currentUser.userData.totalCorrect + 9;
        // console.log("**updateData: ", updateData);
        // console.log("**findRecord: ", record);
        return chai.request(app)
            .put(`/api/userdata/${updateData.id}`)
            .send(updateData)
      })
      .then(function(res){
        expect(res).to.have.status(204);
        return UserData.findById(updateData.id);
      })
      .then(function(usersData){
        expect(usersData.currentUser.userData.totalCorrect).to.equal(updateData.userData.totalCorrect);
        expect(usersData.currentUser.userData.totalQuestions).to.equal(updateData.userData.totalQuestions);
      })
      .catch(function(err){
        console.log("There was an error with the PUT test: ", err);
      })
   });


   // strategy:
   //  1. get a user's dataset
   //  2. make a DELETE request for that userdata's id
   //  3. assert that response has right status code
   //  4. prove that users dataset with the id doesn't exist in db anymore
     it('DELETE: delete a dataset by id', function() {
       let dataset;

       return UserData
         .findOne()
         .then(function(_dataset) {
           dataset = _dataset;
           return chai.request(app).delete(`/api/userdata/${dataset.id}`);
         })
         .then(function(res) {
           expect(res).to.have.status(204);
           return UserData.findById(dataset.id);
         })
         .then(function(_dataset) {
           expect(_dataset).to.be.null;
         });
     });



});
