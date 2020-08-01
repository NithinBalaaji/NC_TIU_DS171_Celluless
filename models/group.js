var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var groupSchema = new Schema({
    name: String,
    members: [{type:Schema.Types.ObjectId, ref: "User"}],
})

module.exports= mongoose.model("Group", groupSchema);
