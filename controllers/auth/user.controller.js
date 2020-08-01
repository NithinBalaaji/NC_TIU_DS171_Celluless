
// Importing config/env variables

// Importing models

//Importing utils


exports.registerUser = async (req, res) => {
    try{
        res.render('home')
    } catch(error){
        console.log(error.toString());
    }
}

exports.renderRegisterUser = async (req, res) => {
    try{
        res.render('register');
    } catch(error){
        console.log(error.toString());
    }
}

exports.loginUser = async (req, res) => {
    try{
        res.render('home')
    } catch(error){
        console.log(error.toString());
    }
}

exports.renderLoginUser = async (req, res) => {
    try{
        res.render('login');
    } catch(error){
        console.log(error.toString());
    }
}

exports.logoutUser = async (req, res) => {
    try{
        res.render('home')
    } catch(error){
        console.log(error.toString());
    }
}

exports.renderLogoutUser = async (req, res) => {
    try{
        res.render('login')
    } catch(error){
        console.log(error.toString());
    }
}