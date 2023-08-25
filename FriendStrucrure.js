const mongoose = require("mongoose");
const schema = mongoose.Schema;

const friendSchema = new schema({
        name:String,
        age:Number,
        address:String,
        email:String,
        phoneNUmber:Number,
        dateOfBirth:Date
})
const Friend = mongoose.model("friends",friendSchema);
module.exports = Friend;