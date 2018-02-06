'use strict';

const mongoose = require('mongoose');

// this is our schema to represent a restaurant
const questionSchema = mongoose.Schema({
  number: {type: Number, required: true},
  question: {type: String, required: true},
  category: {type: String, required: true},
  assetUrl: {type: String, required: false},
  type: {type: String, required: true},
  answers: [
    {answerText: {type: String, required: true}, chosen: {type: Boolean, required: false}, correct: {type: Boolean, required: false}},
    {answerText: {type: String, required: true}, chosen: {type: Boolean, required: false}, correct: {type: Boolean, required: false}},
    {answerText: {type: String, required: true}, chosen: {type: Boolean, required: false}, correct: {type: Boolean, required: false}},
    {answerText: {type: String, required: true}, chosen: {type: Boolean, required: false}, correct: {type: Boolean, required: false}},
    {answerText: {type: String, required: true}, chosen: {type: Boolean, required: false}, correct: {type: Boolean, required: false}}
  ],
});


// // *virtuals* (http://mongoosejs.com/docs/guide.html#virtuals)
// // allow us to define properties on our object that manipulate
// // properties that are stored in the database. Here we use it
// // to generate a human readable string based on the address object
// // we're storing in Mongo.
// restaurantSchema.virtual('addressString').get(function() {
//   return `${this.address.building} ${this.address.street}`.trim()});
//
// // this virtual grabs the most recent grade for a restaurant.
// restaurantSchema.virtual('grade').get(function() {
//   const gradeObj = this.grades.sort((a, b) => {return b.date - a.date})[0] || {};
//   return gradeObj.grade;
// });

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data

questionSchema.methods.apiRepr = function() {

  return {
    id: this._id,
    number: this.number,
    question: this.question,
    category: this.category,
    assetUrl: this.assetUrl,
    type: this.type,
    answers: this.answers
  };
}


// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const Question = mongoose.model('Question', questionSchema);

module.exports = {Question};
