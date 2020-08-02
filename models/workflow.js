var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var workflowSchema = new Schema({
    name: String,
    fields: Array,
    approvers: [{
        grp: {type:Schema.Types.ObjectId, ref: "Group"},
        level: Number
    }],
    path: String,
    templatePath: String,
    generatedPath: String,
})

module.exports= mongoose.model("Workflow", workflowSchema);
