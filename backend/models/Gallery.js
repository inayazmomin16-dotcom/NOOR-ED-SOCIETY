const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    category: {
        type: String,
        default: "School Event"
    },

    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Gallery", gallerySchema);