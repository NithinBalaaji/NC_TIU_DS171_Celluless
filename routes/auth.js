const authRouter = require('express').Router();
const passport = require('passport');
const User = require('../models/user');
const {upload} = require('../utils');
//===SHOW REGISTER FORM=====

authRouter.get("/register",(req,res)=>{
	res.render("register");
})




//=====REGISTER USER=======

authRouter.post("/register",(req,res)=>{

	upload(req,res,function(err){
		if(err){
			console.log("Error in file upload");
			console.log(err);
			res.redirect("/register");
		}
		else{
			const resume = (req.body.isStudent=="true")?("/"+req.file.path.toString()):null;
			User.register(new User({
				username:req.body.username,
				college:req.body.college,
				year:req.body.year,
				branch:req.body.branch,
				mobile:req.body.mobile,
				isStudent:(req.body.isStudent=="true"),
				resume,
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
		successRedirect:"/",
		failureRedirect:"/login"
	}),(req,res)=>{}
);


//========LOGOUT ROUTE==============

authRouter.get("/logout",(req,res)=>{
	req.logout();
	res.redirect("/");
})


module.exports = authRouter;