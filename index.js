const express = require('express');
const app = express();

const { createServer } = require('node:http');
const { Server } = require("socket.io");
const server = createServer(app);
const io = new Server(server);

const path = require('path');
const cookieParser = require('cookie-parser');


var bcrypt = require('bcryptjs');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/signup', (req, res) => {
    res.render('signup');
})


app.listen(3000);