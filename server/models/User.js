const {Schema, model} = require('mongoose');

const User = new Schema({
  login: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  pass: {type: String, required: true}
});

module.exports = model('User', User, 'Users');