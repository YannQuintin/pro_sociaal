const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const ProjectSchema = new Schema(
    {
      name : {type: String, required: [true, "Name of project is required"]},
      publisher : { type: Schema.Types.ObjectId, ref: "User" },
      description : {type: String, required: true},
      skillRequired : {type: String, required: true},
      moneySaved : {type: Number, required: true}, 
      status: {type: String},       
    },
    {
        timestamps : true
    }
);

module.exports = model("Project", ProjectSchema);