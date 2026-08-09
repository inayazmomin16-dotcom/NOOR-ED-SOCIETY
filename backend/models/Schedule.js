const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["class", "teacher"],
            required: true
        },

        classNumber: {
            type: Number,
            min: 5,
            max: 10,
            required: function () {
                return this.type === "class";
            }
        },

        pdf: {
            type: String,
            required: true
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Schedule", scheduleSchema);