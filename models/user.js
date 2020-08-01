var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    email: String,
    mobile: String,
    password: String,
    idFaculty: Boolean,
    isAdmin: Boolean
})

userSchema.plugin(passportLocalMongoose);
module.exports= mongoose.model("User", userSchema);
