const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const ProjectSchema = new Schema(
    {
      name : {type: String, required: [true, "Name of project is required"]},
      publisher : [{ type: Schema.Types.ObjectId, ref: "User" }],
      description : {type: String, required: true},
      skillRequired : {type: String, required: true},
      moneySaved : {type: Number, required: true},        
    },
    {
        timestamps : true
    }
);

module.exports = model("project", ProjectSchema);