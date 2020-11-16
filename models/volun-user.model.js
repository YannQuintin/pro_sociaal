const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
      name : String,
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
        image : {type: String, default: "https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png"},
        skill : String,
        role : {type : String , default: "volunteer" }

    },
    {
        timestamps : true
    }
);

const User = mongoose.model("User",userSchema);
module.exports = User;