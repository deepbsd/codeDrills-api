'use strict';
const bcrypt = require('bcryptjs');

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
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
  dateOfQuiz: {type: String, required: true},
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
    user: userSchema,
    userData: quizDataSchema,
    lastQuizData: lastQuizDataSchema,
    chartData: chartDataSchema
  }
});

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

userDataSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    currentUser: {
      username: this.username || '',
      user: this.currentUser.user,
      userData: this.currentUser.userData,
      lastQuizData: this.currentUser.lastQuizData,
      chartData: this.currentUser.chartData
    }
  }
}

const UserData = mongoose.model('UserData', userDataSchema);

module.exports = {UserData};

// ==========
