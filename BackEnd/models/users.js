var mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    
  },
  email: {
    type: String,
    require: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  isverified: {
    type: String,
    require: true,
  },
  
});

module.exports = mongoose.model("wishUsers", userSchema); //stored in users collection  and uses user schema
