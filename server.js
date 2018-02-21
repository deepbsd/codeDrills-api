const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

mongoose.Promise = global.Promise;

const {DATABASE_URL, PORT} = require('./config');


app.use(morgan('common'));
app.use(bodyParser.json());
app.use(cors());



const {Question} = require('./src/js/models');
const {UserData} = require('./src/js/userDataModel');


// app.use( '/api/js', express.static(__dirname + '/src/js') );

// We need database schemas for each endpoints
const questionRouter = require('./src/js/questionRouter');
app.use('/api/questions', questionRouter);
const userDataRouter = require('./src/js/userDataRouter');
app.use('/api/userdata', userDataRouter);

//**
const {router} = require('./auth/router');
app.use('/api/userdata/register', router);

// app.post('/api/userdata/login', (req, res) => {
//     	let {username, password} = req.body;
//       res.json({
//         username: username,
//         password: password
//       })
// })



// app.use('*', function(req, res) {
//   res.status(404).json({message: 'Not Found'});
// });


// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}



// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};
