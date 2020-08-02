var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    name: String,
    email: String,
    mobile: String,
    password: String,
    idFaculty: Boolean,
    isAdmin: Boolean,
    otp:Number,
    pubKey: String
})

userSchema.plugin(passportLocalMongoose);
module.exports= mongoose.model("User", userSchema);
