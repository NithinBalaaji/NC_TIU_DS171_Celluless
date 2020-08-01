
// Importing config/env variables

// Importing models

//Importing utils


exports.registerAdmin = (req, res) => {
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
				return res.json({success: false, err: err});
			} else {
				passport.authenticate("local")(req,res,()=>{
					return res.json({success: true});
				});
			}
		})
}

exports.loginAdmin = async (req, res) => {
    try{

    } catch(error){
        console.log(error.toString());
    }
}

exports.logoutAdmin = async (req, res) => {
    try{

    } catch(error){
        console.log(error.toString());
    }
}
