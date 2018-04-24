const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('User API', function() {

  before(function() {
    return runServer();
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
});


it('should add an item on POST', function() {
  const newItem = {username: "joe3", password: "password99", firstName: "joseph", lastName: "blow"};
  return chai.request(app)
    .post('/api/users/')
    .send(JSON.stringify(newItem))
    .then(function(res) {
      expect(res).to.have.status(201);
      expect(res).to.be.json;
      expect(res.body).to.be.a('object');
      expect(res.body).to.include.keys('username', 'password', 'firstName', 'lastName');
      expect(res.body.id).to.not.equal(null);
      // response should be deep equal to `newItem` from above if we assign
      // `id` to it from `res.body.id`
      expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
    })
    .catch(err => {
      console.log("There was an error!", err)
    })
});
