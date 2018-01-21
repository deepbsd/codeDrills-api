const express = require('express');
const app = express();

const PORT = process.env.PORT || 4000;

// const cors = require('cors');
// const {CLIENT_ORIGIN} = require('./config');
//
// app.use(
//     cors({
//         origin: CLIENT_ORIGIN
//     })
// );
const cors = require('cors');

app.use(cors());

// app.get('/api/*', (req, res) => {
//   res.json({ok: true});
// });

app.get('/api/*', function (req, res, next) => {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

// app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

app.listen(PORT,  () => console.log(`CORS-enabled web server listening on port ${PORT}`));

module.exports = {app};
