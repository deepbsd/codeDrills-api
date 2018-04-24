const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Question API', function() {

  before(function() {
    return runServer();
  });

  after(function(){
    return closeServer();
  });

  it('should get 200 on GET requests and return correct objects and keys', function() {
    return chai.request(app)
      .get('/api/questions/')
      .then(function(res) {
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
            // expect(item).to.contain.all.keys(
            //   'answerText', 'chosen', 'correct'
            // )
          })
        });
      });
  });




});
