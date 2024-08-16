const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/lafyu")
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log("Error connecting", err);
    });

module.exports = mongoose;
