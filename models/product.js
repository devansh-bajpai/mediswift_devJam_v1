const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/mediswift');

const userData = mongoose.Schema({
    name: String,
    price: Number,
})

module.exports = mongoose.model("product", userData);