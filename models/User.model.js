const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const userSchema = new Schema(
    {
      name : {type: String, required: [true, "Name is required"]},
      email: {
        type: String,
        required: [true, "Email is required."],
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
        unique: true,
        lowercase: true,
        trim: true,
      },
        password: { type: String, required: [true, "Password is required."] },
        profession: {type : String , required: true},
        description : String,
        imageUrl : String, 
        skill : String,
        projects : [{ type: Schema.Types.ObjectId, ref: "Project" }],
    },
    {
        timestamps : true
    }
);

module.exports = model("User", userSchema);