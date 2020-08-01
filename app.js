var express = require("express"),
    app = express(),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    routes = require("./routes"),
    config = require("./config"),
    mongoose = require("mongoose");


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(`mongodb://${config.DB_SERVER}/${config.DB_NAME}`);

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

app.use(express.static(__dirname + "/public/ElaAdmin"));
app.use(express.static(__dirname + "/public"));

app.listen(config.PORT, () => {
    console.log(`Server has started on ${config.PORT}`);
})
