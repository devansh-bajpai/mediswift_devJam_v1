const express = require('express');
const app = express();

const { createServer } = require('node:http');
const { Server } = require("socket.io");
const server = createServer(app);
const io = new Server(server);

const path = require('path');
const cookieParser = require('cookie-parser');


var bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken')

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


const user = require('./models/user.js');
const doctor = require('./models/doctor.js');

const all_errors_nulled = {account_exist: null, right_pass: null, signupSuccess: null, already_exists: null, passLen_error: null, notconfirm_pass: null};

let generateError = (e, setVal) => {
    const newObj = Object.assign({}, all_errors_nulled);
    newObj[e] = setVal;
    return newObj;
}


app.get('/', async (req, res) => {
    // console.log(req.cookies.token);
    
    try {
        const decoded = jwt.verify(req.cookies.token, "testKey");
        // console.log(decoded);
        let userData = await user.findOne({email: decoded['email']});
        // console.log(userData);
        let firstName = userData.name.split(' ')[0];
        // console.log(firstName); 
        res.render('index', {firstName});
    } catch (err) {
        // console.error("Invalid token", err);
        // res.redirect('/');
        res.render('index', {firstName: ""});
    }

    // res.render('index');
});

app.get('/login', (req, res) => {

    let cookieData = req.cookies;

    if (Object.keys(cookieData).length > 0){
        res.cookie('all_errors', all_errors_nulled);
        res.render('login', cookieData.all_errors);
    }
    else {
        res.cookie('all_errors', all_errors_nulled);
        res.render('login', all_errors_nulled);
    }

})

app.get('/signup', (req, res) => {
    // console.log(req.cookies);
    let cookieData = req.cookies;
    if (Object.keys(cookieData).length > 0){
        res.cookie('all_errors', all_errors_nulled);
        res.render('signup', cookieData.all_errors);
    }
    else {
        res.cookie('all_errors', all_errors_nulled);
        res.render('signup', all_errors_nulled);
    }
})


app.post('/submit/signup', async (req, res) => {
    console.log(req.body);
    
    if(req.body.password.length >=8){

        let userData = await user.findOne({email: req.body.email});

        if(userData == null){

            if(req.body.password == req.body.confirmPassword){
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.password, salt);

                let userDetails = await user.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash
                })
                console.log('signup success')
                let token = jwt.sign({email: req.body.email}, "testKey")
                res.cookie('token', token);
                res.redirect('/');
            }
            else{
               console.log('passwords dont match');
               res.cookie('all_errors', generateError('notconfirm_pass', true));
               res.redirect('/signup');
            }


        }
        else {
            console.log('user already exists');
            res.cookie('all_errors', generateError('already_exists', true));
            res.redirect('/signup');
        }


    }
    else {
        console.log('password length error');
        res.cookie('all_errors', generateError('passLen_error', true));
        res.redirect('/signup');
    }
})


app.post('/submit/login', async(req, res) => {
    userDetails = await user.findOne({email: req.body.email});

    if (userDetails != null) {
        if (bcrypt.compareSync(req.body.password, userDetails.password)){
            console.log('logged in successfully');
            let token = jwt.sign({email: req.body.email}, "testKey")
            res.cookie('token', token);

            res.redirect('/');
        }
        else {
            res.cookie('all_errors', generateError('right_pass', false));
            res.redirect('/login');
        }
    }
    else {
        res.cookie('all_errors', generateError('account_exist', false));
        res.redirect('/login');
    }

})

app.get('/logout', (req, res) => {
    res.cookie('token', '');
    res.redirect('/');
})


app.get('/book', async(req, res) => {
    
    try {
        const decoded = jwt.verify(req.cookies.token, "testKey");
        // console.log(decoded);
        let userData = await user.findOne({email: decoded['email']});
        // console.log(userData);
        let firstName = userData.name.split(' ')[0];
        // console.log(firstName);
        let doctorData =  await doctor.find();
        // console.log(doctorData);
        // console.log(doctorData.length);
        // console.log(doctorData[0]);
        
        // for(x of doctorData){
        //     console.log(x.name);
        // }

        res.render('doctors', {firstName, doctorData});
    } catch (err) {
        // console.error("Invalid token", err);
        // res.redirect('/');

        // res.render('doctors', {firstName: ""});
        res.redirect('/login');
    }
})


app.get('/signup/doctor', (req, res) => {
    res.cookie('token', '');
    res.render('doctorSignup');
})

app.get('/view/profile/:id',async (req, res) => {
    try {
        const decoded = jwt.verify(req.cookies.token, "testKey");
        let userData = await user.findOne({email: decoded['email']});
        let firstName = userData.name.split(' ')[0];

        let doctorData = await doctor.findOne({_id: req.params.id});

        res.render('doctorProfile', {firstName, doctorData});
    } catch (err) {
        res.redirect('/login');
    }
})

app.get('/book/doctor/:id', async(req, res) => {

    try {
        const decoded = jwt.verify(req.cookies.token, "testKey");
        let userData = await user.findOne({email: decoded['email']});
        let firstName = userData.name.split(' ')[0];

        let doctorData = await doctor.findOne({_id: req.params.id});

        // let doctorData =  await doctor.find();
        // console.log(doctorData);
        // console.log(doctorData.length);
        // console.log(doctorData[0]);
        
        // for(x of doctorData){
        //     console.log(x.name);
        // }

        res.render('appointment', {firstName, doctorData});
    } catch (err) {
        // console.error("Invalid token", err);
        // res.redirect('/');

        // res.render('doctors', {firstName: ""});
        res.redirect('/login');
    }



})


app.listen(3000);