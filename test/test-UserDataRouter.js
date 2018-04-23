const chai = require('chai');
const chaiHttp = require('chai-http');

// const {app} = require('../server');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Userdata API', function() {

  before(function() {
    return runServer();
  });

  after(function(){
    return closeServer();
  });

  it('should get 200 on GET requests', function() {
    return chai.request(app)
      .get('/api/userdata/')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.all.keys('userdata');
        expect(res.body.userdata).to.be.a('array');
        // expect(res.body.userdata.length).to.be.above(0);
        // res.body.userdata.forEach(function(item){
        //   expect(item).to.be.a('object');
          // expect(item).to.have.all.keys(
          //   '_id', 'currentUser'
          // )
        // })
      });
  });
});



// describe('Users', function() {
//   // Before our tests run, we activate the server. Our `runServer`
//   // function returns a promise, and we return the promise by
//   // doing `return runServer`. If we didn't return a promise here,
//   // there's a possibility of a race condition where our tests start
//   // running before our server has started.
//   before(function() {
//     return runServer();
//   });
//
//   // Close server after these tests run in case
//   // we have other test modules that need to
//   // call `runServer`. If server is already running,
//   // `runServer` will error out.
//   after(function() {
//     return closeServer();
//   });
//   // `chai.request.get` is an asynchronous operation. When
//   // using Mocha with async operations, we need to either
//   // return an ES6 promise or else pass a `done` callback to the
//   // test that we call at the end. We prefer the first approach, so
//   // we just return the chained `chai.request.get` object.
//   it('should list users on GET', function() {
//     return chai.request(app)
//       .get('/users')
//       .then(function(res) {
//         expect(res).to.have.status(200);
//         expect(res).to.be.json;
//         expect(res.body).to.be.a('array');
//         expect(res.body.length).to.be.above(0);
//         res.body.forEach(function(item) {
//           expect(item).to.be.a('object');
//           expect(item).to.have.all.keys(
//             'id', 'firstName', 'lastName', 'birthYear');
//         });
//       });
//   });
// });
