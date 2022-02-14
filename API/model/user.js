const mongoose = require("mongoose");
// import { isEmail } from 'validator';
const validator = require('validator');
const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true , validate: [ validator.isEmail, 'invalid email' ]},
  password: { type: String },
  token: { type: String },
});

module.exports = mongoose.model("user", userSchema);
