'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true}
});

const quizDataSchema = mongoose.Schema({
  missedQuestions: {type: Array, required: true},
  numberOfQuizzes: {type: Number, required: true},
  totalQuestions: {type: Number, required: true},
  totalCorrect: {type: Number, required: true},
  jsQuestionsAnswered: {type: Number, required: true},
  jsQuestionsCorrect: {type: Number, required: true},
  cssQuestionsAnswered: {type: Number, required: true},
  cssQuestionsCorrect: {type: Number, required: true},
  htmlQuestionsAnswered: {type: Number, required: true},
  htmlQuestionsCorrect: {type: Number, required: true},
  nodeQuestionsAnswered: {type: Number, required: true},
  nodeQuestionsCorrect: {type: Number, required: true},
  apiQuestionsAnswered: {type: Number, required: true},
  apiQuestionsCorrect: {type: Number, required: true},
  mongoQuestionsAnswered: {type: Number, required: true},
  mongoQuestionsCorrect: {type: Number, required: true}
});

const lastQuizDataSchema = mongoose.Schema({
  totalQuestions: {type: Number, required: true},
  dateOfQuiz: {type: Date, required: true},
  totalCorrect: {type: Number, required: true}
});

const chartDatasetSchema = mongoose.Schema({
  label: {type: String, required: true},
  data: {type: Array, required: true},
  backgroundColor: {type: Array, required: true}
})

const chartDataSchema = mongoose.Schema({
  labels: {type: Array, required: true},
  datasets: [ chartDatasetSchema ]
})

const userDataSchema = mongoose.Schema({
  currentUser: {
    user: { userSchema },
    userData: { quizDataSchema },
    lastQuizData: { lastQuizDataSchema },
    chartData: { chartDataSchema }
  }
});

userSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    password: this.password
  }
}

quizDataSchema.methods.apiRepr = function() {
  return {
    missedQuestions: this.missedQuestions,
    numberOfQuizzes: this.numberOfQuizzes,
    totalQuestions: this.totalQuestions,
    totalCorrect: this.totalCorrect,
    jsQuestionsAnswered: this.jsQuestionsAnswered,
    jsQuestionsCorrect: this.jsQuestionsCorrect,
    cssQuestionsAnswered: this.cssQuestionsAnswered,
    cssQuestionsCorrect: this.cssQuestionsCorrect,
    htmlQuestionsAnswered: this.htmlQuestionsAnswered,
    htmlQuestionsCorrect: this.htmlQuestionsCorrect,
    nodeQuestionsAnswered: this.nodeQuestionsAnswered,
    nodeQuestionsCorrect: this.nodeQuestionsCorrect,
    apiQuestionsAnswered: this.apiQuestionsAnswered,
    apiQuestionsCorrect: this.apiQuestionsCorrect,
    mongoQuestionsAnswered: this.mongoQuestionsAnswered,
    mongoQuestionsCorrect: this.mongoQuestionsCorrect
  }
}

lastQuizDataSchema.methods.apiRepr = function() {
  return {
    totalQuestions: this.totalQuestions,
    dateOfQuiz: this.dateOfQuiz,
    totalCorrect: this.totalCorrect
  }
}

chartDatasetSchema.methods.apiRepr = function() {
  return {
    label: this.label,
    data: this.data,
    backgroundColor: this.backgroundColor
  }
}

userDataSchema.methods.apiRepr = function() {
  return {
    currentUser: {
      id: this._id,
      user: this.user,
      userData: this.userData,
      lastQuizData: this.lastQuizData,
      chartData: this.chartData
    }
  }
}



const UserData = mongoose.model('UserData', userDataSchema);

module.exports = {UserData};
