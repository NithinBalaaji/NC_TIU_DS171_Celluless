var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var requestSchema = new Schema({
    blockchainId: String,
    workflowId: {type:Schema.Types.ObjectId, ref: "Workflow"},
    approvers: [{
        approverId: {type:Schema.Types.ObjectId, ref: "User"},
        level: Number
    }],
    approvedBy:[{
        approverId: {type:Schema.Types.ObjectId, ref: "User"},
        level: Number
    }],
    fields: [String],
    level: {type: Number, default: 0},
    isVerified: {
        type:Boolean, default:false
    },
    verificationKey: String,
    isRejected: {
        type:Boolean, default:false
    },
    ownerId: {type: Schema.Types.ObjectId, ref: "User"}
})

module.exports= mongoose.model("Request", requestSchema);
