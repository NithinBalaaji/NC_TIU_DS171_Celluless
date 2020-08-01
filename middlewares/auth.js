
module.exports.isLoggedIn = (req,res,next)=>{
	if (req.user) {
		return next();
	} else {
		res.redirect('/login');
	}
}