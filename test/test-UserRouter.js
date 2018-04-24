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

  it('should get 200 on GET requests', function() {
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


// it('should get 200 on GET requests', function() {
//   return chai.request(app)
//     .get('/api/users/')
//     .then(function(res) {
//       expect(res).to.have.status(200);
//       expect(res).to.be.json;
//       expect(res.body).to.be.a('object');
//       expect(res.body).to.have.all.keys('userdata');
//       expect(res.body.userdata).to.be.a('array');
//       expect(res.body.userdata.length).to.be.above(0);
//       res.body.userdata.forEach(function(item){
//         expect(item).to.be.a('object');
//         expect(item).to.contain.all.keys(
//           '_id', 'currentUser'
//         )
//         expect(item.currentUser).to.contain.all.keys(
//           'user', 'userData', 'lastQuizData'
//         )
//       });
//     });
// });
// });
