const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.use(jsonParser);

router.get('/', (req, res) => {
  res.json({
    "userData": {
      "questions": [],
      "currentQuiz": {
        "correct": [],
        "incorrect": [],
        "js": [],
        "js_right": [],
        "html": [],
        "html_right": [],
        "css": [],
        "css_right": [],
        "node": [],
        "node_right": [],
        "api": [],
        "api_right": [],
        "mongo": [],
        "mongo_right": []
      },
      "missedQuestions": [],
      "correctQuestions": [],
      "currentUser": {
        "user": {
          "username": "Joe",
          "firstName": "Joe",
          "lastName": "Blow",
          "email": "joeblow@whatever.com",
          "password": "sonorapass"
        },
        "userData": {
          "missedQuestions": [],
          "numberOfQuizzes": 20,
          "totalQuestions": 200,
          "totalCorrect": 187,
          "jsQuestionsAnswered": 60,
          "jsQuestionsCorrect": 50,
          "cssQuestionsAnswered": 45,
          "cssQuestionsCorrect": 42,
          "htmlQuestionsAnswered": 35,
          "htmlQuestionsCorrect": 35,
          "nodeQuestionsAnswered": 30,
          "nodeQuestionsCorrect": 28,
          "apiQuestionsAnswered": 30,
          "apiQuestionsCorrect": 29,
          "mongoQuestionsAnswered": 5,
          "mongoQuestionsCorrect": 5
        },
        "lastQuizData": {
          "totalQuestions": 10,
          "dateOfQuiz": "2017-06-12T16:08:00",
          "totalCorrect": 9,
          "timeOnQuiz": 1000340
        },
        "missedMost": {
          "category": "Vanilla Javascript",
          "moreThan3": [5, 18, 45],
          "neverCorrect": {
            "question": "What's the difference between \"let\" and \"var\"?",
            "lastAnswer": "\"let\" is not a constant",
            "choices": ["\"let\" is ES5", "\"var\" is ES5", "\"let\" is ES6", "\"let\" pollutes the parent namespace", "\"var\" is not what the cool kids do anymore"],
            "correctAnswer": "\"let\" is ES6"
          }
        },
        "chartData": {
          "labels": ["JS Questions Answered", "JS Questions Correct", "CSS Questions Answered", "CSS Questions Correct", "HTML Questions Answered", "HTML Questions Correct", "Node Questions Answered", "Node Questions Correct", "API Questions Answered", "API Questions Correct"],
          "datasets": [{
            "label": "Questions Correctly Answered",
            "data": [60, 50, 45, 42, 35, 35, 30, 28, 30, 29],
            "backgroundColor": ["purple", "thistle", "orange", "yellow", "#0033ff", "cyan", "crimson", "#ff0066", "green", "lime"]
          }]
        },
        "radarData": {
          "labels": ["JS Pct", "CSS Pct", "HTML Pct", "Node Pct", "API Pct"],
          "datasets": [
            {
              "label": "Overall Percentages",
              "backgroundColor": "rgba(255, 204, 204,0.7)",
              "borderColor": "rgba(255,99,132,1)",
              "pointBackgroundColor": "rgba(255,99,132,1)",
              "pointBorderColor": "#fff",
              "pointHoverBackgroundColor": "#fff",
              "pointHoverBorderColor": "rgba(255,99,132,1)",
              "data": [50, 42, 35, 28, 29]
            },
            {
              "label": "Latest Percentages",
              "backgroundColor": "rgba(255, 200, 132,0.7)",
              "borderColor": "rgba(255,99,132,1)",
              "pointBackgroundColor": "rgba(255,99,132,1)",
              "pointBorderColor": "#fff",
              "pointHoverBackgroundColor": "#fff",
              "pointHoverBorderColor": "rgba(255,99,132,1)",
              "data": [50, 42, 35, 28, 29]
            }
          ]
        },
        "polarData": {
          "labels": ["JS Pct", "CSS Pct", "HTML Pct", "Node Pct", "API Pct"],
          "datasets": [{
            "label": "Questions Correctly Answered",
            "backgroundColor": ["purple", "thistle", "orange", "yellow", "#0033ff", "cyan", "crimson", "#ff0066", "green", "lime"],
            "borderColor": "rgba(255,99,132,1)",
            "pointBackgroundColor": "rgba(255,99,132,1)",
            "pointBorderColor": "#fff",
            "pointHoverBackgroundColor": "#fff",
            "pointHoverBorderColor": "rgba(255,99,132,1)",
            "data": [50, 42, 35, 28, 29]
          }]
        }
      }
    }
  });
});







module.exports = router;