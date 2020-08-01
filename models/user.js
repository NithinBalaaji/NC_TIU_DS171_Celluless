var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    email: String,
    mobile: String,
    password: String,
    isStudent: Boolean,
    
    college: {type: String, default: null},
    branch: {type: String, default: null},
    year: {type: String, default: null},
    resume: {type: String, default: null},
    projectOwned: [{
        type: Schema.Types.ObjectId,
        ref: "Project"
    }],
    projectPartOf: [{
        type: Schema.Types.ObjectId,
        ref: "Project"
    }],
    isClub: Boolean,
    problemStatementPartOf: [{
        type: Schema.Types.ObjectId,
        ref: "ProblemStatement"
    }],


    
    problemStatementsCreated: [{
        type: Schema.Types.ObjectId,
        ref: "ProblemStatement"
    }],
    projectsFunded: [{
        type: Schema.Types.ObjectId,
        ref: "Project"
    }],
    
})

userSchema.plugin(passportLocalMongoose);
module.exports= mongoose.model("User", userSchema);
