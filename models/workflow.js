var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var workflowSchema = new Schema({
    name: String,
    fields: [{
        desc: String,
        htmlId: String
    }],
    approvers: [{
        grp: {type:Schema.Types.ObjectId, ref: "Group"},
        level: Number
    }],
    path:String,
})

module.exports= mongoose.model("Workflow", workflowSchema);
