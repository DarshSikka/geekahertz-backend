const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  uuid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  verified: {
    type: Boolean,
    required: false,
    default: false,
  },
  otp: {
    type: Number,
    required: false,
    default: -9,
  },
});
const model = mongoose.model("User", schema, "users");
module.exports = model;
