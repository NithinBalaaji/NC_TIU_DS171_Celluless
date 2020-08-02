
module.exports.isLoggedIn = (req,res,next)=>{
	if (req.user) {
		return next();
	} else {
		req.session.redirectTo = req.originalUrl
		res.redirect('/auth/user/login');
	}
}
