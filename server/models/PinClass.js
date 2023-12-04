const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            min: 1,
            max: 50,
        },
        description: {
            type: String,
            required: true,
            min: 1,
        },
        longitude: {
            type: Number,
            required: true,
        },
        latitude: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: false,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Pin", PinSchema);