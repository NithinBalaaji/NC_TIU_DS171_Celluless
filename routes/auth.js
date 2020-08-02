const authRouter = require('express').Router();
const passport = require('passport');
const User = require('../models/user');
//===SHOW REGISTER FORM=====

authRouter.get("/register",(req,res)=>{
	res.render("register");
})




//=====REGISTER USER=======

authRouter.post("/register",(req,res)=>{

		User.register(new User({
			username:req.body.username,
			name: req.body.name,
			email: req.body.email,
			mobile: req.body.mobile,
			password: req.body.password,
			idFaculty: req.body.isFaculty,
			isAdmin: req.body.isAdmin
		}),req.body.password,(err,newUser)=>{
			if (err) {
				console.log(err)
				return res.redirect("/register")
			} else {
				passport.authenticate("local")(req,res,()=>{
					res.redirect("/");
				});
			}
		})
		
})


//======SHOW LOGIN FORM=======

authRouter.get("/login",(req,res)=>{
	res.render("login");
})


//======LOGIN THE USER========

authRouter.post("/login",passport.authenticate("local",
	{
		failureRedirect:"/login"
	}),(req,res)=>{
		const redirectTo = req.session.redirectTo || "/";
		req.session.redirectTo = null;
		res.redirect(redirectTo);
	}
);


//========LOGOUT ROUTE==============

authRouter.get("/logout",(req,res)=>{
	req.logout();
	res.redirect("/");
})


module.exports = authRouter;