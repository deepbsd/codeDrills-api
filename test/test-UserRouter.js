const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const {app, runServer, closeServer} = require('../server');
const {User} = require('../users/models');
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

// password must be between 10 - 75 characters long
function generatePassword(){
  let password = faker.internet.password();
  if (password.length >= 10 && password.length <= 65){
    return password;
  } else {
    return generatePassword();
  }
}


function generateUserData(){
  return {
    username: faker.internet.userName(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: generatePassword()
  };
}

const fakeUserData = {
	missedQuestions: [1,2,3],
	numberOfQuizzes: 1,
	totalQuestions:  10,
	totalQuestions:  7,
	jsQuestionsAnswered: 4,
	jsQuestionsCorrect: 4,
	cssQuestionsAnswered: 1,
	cssQuestionsAnswered: 1,
	htmlQuestionsAnswered: 1,
	htmlQuestionsCorrect: 1,
	nodeQuestionsAnswered: 4,
	nodeQuestionsCorrect: 1,
	apiQuestionsAnswered: 1,
	apiQuestionsCorrect: 1,
	mongoQuestionsAnswered: 0,
	mongoQuestionsCorrect: 0
}

const fakeLastQuizData = {
	totalQuestions: 10,
	dateOfQuiz: new Date(),
	totalCorrect: 7
}

// used to put randomish documents in db
// so we have data to work with and assert about.
// we use the Faker library to automatically
// generate placeholder values for author, title, content
// and then we insert that data into mongo
function seedUserData() {
  console.info('seeding user data');
  const seedData = [];
  const usersFakeData = [];
  let fakeUser;

  for (let i=0; i<10; i++) {
	fakeUser = generateUserData();
    seedData.push(fakeUser);
    let usrFakeData = {
  	  user: fakeUser,
      userData: fakeUserData,
      lastQuizData: fakeLastQuizData,
	 };
	usersFakeData.push(usrFakeData);
    //console.log("Are usernames same? ",usersFakeData[i].user.username, '; ',seedData[i].username);
  }
  // this will return a promise
  return User.insertMany(seedData)
    .then(function(){
	  //console.log("Fake User's Data: ", usersFakeData)
      return UserData.insertMany(usersFakeData)
   });
}


describe('User API', function() {

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
      .get('/api/users/')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.above(0);
        res.body.forEach(function(item){
          expect(item).to.be.a('object');
          expect(item).to.contain.all.keys(
            'username', 'firstName', 'lastName'
          )
        })
      });
  });

  // Method for getting username on /api/users involves getting object from /api/userdata
  // endpoint...
  it('should get 200 on GET request for individual username and return correct data for user', function(){
	// Fake users should already be in database for this test
	let user;
	return User
	  .findOne()
	  .then(_user => {
		user = _user
		//console.log("**User: ",user.username)
		return chai.request(app)
		  .get(`/api/users/${user.id}`)
	  })
	.then(res => {
	  expect(res).to.have.status(200);
	  //console.log("**res.body: ",res.body);
	  expect(res.body).to.be.a('object');
	  expect(res.body._id).to.equal(user.id);
	})
  });



  it('should add an item on POST', function() {
    const newUser = generateUserData();
    // console.log("**Payload: ",newUser)
    return chai.request(app)
      .post('/api/users/')
      .send(newUser)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('username', 'firstName', 'lastName');
        expect(res.body.id).to.not.equal(null);
        // response should be deep equal to `newItem` from above if we assign
        // `id` to it from `res.body.id`
        expect(res.body.username).to.equal(newUser.username);
        expect(res.body.firstName).to.equal(newUser.firstName);
        expect(res.body.lastName).to.equal(newUser.lastName);
      })
      .catch(err => {
        console.log("There was a POST error!", err)
      })
  });

  const newItem = generateUserData();

  it('should delete an item on DELETE', function() {
    // console.log("**Payload: ", newItem);
    return chai.request(app)
      .post('/api/users/')
      .send(newItem)
      .then(function(res) {
        // console.log("**Res: ", res.body);
        const newUser = res.body;
        expect(newUser.id).to.not.equal(null);
        return User.findById(newUser.id);
      })
      .then(function(newUser){
        // console.log("**newUser: ", newUser);
        return chai.request(app)
        .delete(`/api/users/${newUser.id}`)
      })
      .then(function(res){
        expect(res).to.have.status(204);
      })
      .catch( err => {
        console.log("Error with DELETE test!", err)
      })
  })

});
