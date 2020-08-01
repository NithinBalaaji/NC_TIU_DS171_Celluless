var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var requestSchema = new Schema({
    blockchain_id: String,
    workflow_id: {type:Schema.Types.ObjectId, ref: "Workflow"},
    approvers: [{
        approverId: {type:Schema.Types.ObjectId, ref: "User"},
        level: Number
    }],
    approvedBy:[{
        approverId: {type:Schema.Types.ObjectId, ref: "User"},
        level: Number
    }],
    ownerId: {type: Schema.Types.ObjectId, ref: "User"}
})

module.exports= mongoose.model("Request", requestSchema);
