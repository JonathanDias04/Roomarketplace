function adminAuth(req, res, next) {
    if(req.session.usuarioData != undefined) {
        next();
    } else {
        res.redirect("/auth/login");
    }
}

module.exports = adminAuth;