const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    category:{
        type:String,
        default:"General"
    },

    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("Notice", noticeSchema);