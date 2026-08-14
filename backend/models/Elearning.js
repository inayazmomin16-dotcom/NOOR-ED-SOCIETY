const mongoose = require("mongoose");

const eLearningSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    classNumber: {
        type: Number,
        required: true,
        min: 5,
        max: 12
    },

    category: {
        type: String,
        enum: [
            "Notes",
            "Assignment",
            "Question Paper",
            "Syllabus"
        ],
        required: true
    },

    file: {
        type: String,
        required: true
    },

    publicId: {
        type: String,
        default: null
    },

    resourceType: {
        type: String,
        default: "raw"
    },

    description: {
        type: String,
        default: ""
    },

    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("ELearning", eLearningSchema);