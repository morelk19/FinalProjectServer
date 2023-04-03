//import mongoose library
const mongoose = require("mongoose");
const { randomUUID } = require('crypto');
const { v4: uuidv4, v4 } = require("uuid");

//create a blogSchema 
const userSchema = new mongoose.Schema({
        date:   Date,
        userId: "UUID", 
        scope: String,
		email: String,
        password: String
}); 

//register model to collection
const UserInfo = mongoose.model("userInfo", userSchema);

//make our model accessible to outside files 
module.exports = UserInfo;