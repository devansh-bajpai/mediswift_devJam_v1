const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/mediswift');

const userData = mongoose.Schema({
    name: String,
    email:String,
    institute: String,
    field: String,
    city: String,
    language: String,
    experience: String,
    img: {
        data: Buffer,
        contentType: String
    },
    password: String,
    desc: String
})

module.exports = mongoose.model("doctor", userData);