var express = require("express"),
    app = express(),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    Group = require("./models/group"),
    routes = require("./routes"),
    config = require("./config"),
    seeder = require("./seeders/seeder")
    mongoose = require("mongoose");


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use(express.json());
mongoose.connect(config.DB_URI, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("Connected to db.");
    }
});

app.use(require("express-session")({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

app.use(routes);
app.get('/seed',seeder.seedDB )
app.get('/template', (req, res)=>{
    res.render('template')
})
app.get('/logout', (req, res)=>{
    res.redirect('/auth/user/logout')
})

app.use(express.static(__dirname + "/public/ElaAdmin"));
app.use(express.static(__dirname + "/public"));

app.listen(config.PORT, () => {
    console.log(`Server has started on ${config.PORT}`);
})
