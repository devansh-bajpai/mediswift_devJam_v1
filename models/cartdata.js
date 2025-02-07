const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/mediswift');

const userData = mongoose.Schema({
    email: String,
    items: [String],
})

module.exports = mongoose.model("cartdata", userData);