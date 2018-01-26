const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

const {DATABASE_URL, PORT} = require('./config');


app.use(morgan('common'));
app.use(bodyParser.json());
app.use(cors());



const {question} = require('./src/js/models');



// app.use( '/api/js', express.static(__dirname + '/src/js') );

// We need database schemas for each endpoints
const questionRouter = require('./src/js/questionRouter');
app.use('/api/questions', questionRouter);


mongoose.Promise = global.Promise;


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


// app.get('/api/questions', (req, res, next) => {
//   res.json(
//     {
//       questions:  [
//       {
//         number: 1,
//         category: 'html',
//         assetUrl: null,
//         type: 'multipleChoice',
//         question: "Why is it generally a good idea to position CSS <link>s between <head></head> and JS <script>s just before </body>?",
//         answers: [
//           {answerText: "To have the CSS ready so the page can render properly yet not try to execute the JS until the page elements have fully rendered", chosen: false, correct: true},
//           {answerText: "blah", chosen: false},
//           {answerText: "blah", chosen: false},
//           {answerText: "blah", chosen: false},
//           {answerText: "blah", chosen: false}
//         ]
//       },
//       {
//         number: 2,
//         category: 'html',
//         assetUrl: null,
//         type: 'multipleChoice',
//         question: "What does a doctype declaration do?",
//         answers: [
//           {answerText: "Specifies the Document Type Definition (DTD) and its version", chosen: false, correct: true},
//           {answerText: "blah", chosen: false},
//           {answerText: "blah", chosen: false},
//           {answerText: "blah", chosen: false},
//           {answerText: "blah", chosen: false}
//         ]
//       },
//       {
//         number: 3,
//         category: 'html',
//         assetUrl: null,
//         type: 'multipleChoice',
//         question: "Identify which of the following are HTML5 elements?",
//         answers: [
//           {answerText: "article, aside, section, main, nav, aside, summary, time, figure, figcaption, footer, header, mark, details", chosen: false, correct: true},
//           {answerText: "blah", chosen: false},
//           {answerText: "blah", chosen: false},
//           {answerText: "blah", chosen: false},
//           {answerText: "blah", chosen: false}
//           ]
//         }
//       ]
//     }
//   )
// });

// app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// app.listen(PORT,  () => console.log(`CORS-enabled web server listening on port ${PORT}`));
//
// module.exports = {app};

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};
