var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var projectSchema = new Schema({
    isPublic: Boolean,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    members: [{type: Schema.Types.ObjectId, ref: "User"}],
    tags: [String],
    desc: String,
    name: String,
    fundRecv: Number,
    funders: [{type: Schema.Types.ObjectId, ref: "User"}],
    requests: [{type: Schema.Types.ObjectId, ref: "User"}],
    fundProp: [{
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        amount: Number,
        desc: String,
    }],
    thread: [{
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        message: String,
    }]
})

module.exports= mongoose.model("Project", projectSchema);
