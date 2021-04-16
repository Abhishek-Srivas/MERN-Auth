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
 token:{
    type: String,
    require:true
 }
  
});

module.exports = mongoose.model("googlewishUsers", userSchema); //stored in users collection  and uses user schema
