const jwt = require("jsonwebtoken");
const middlewareController = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.MY_ACCESS_KEY, (err, user) => {
                if (err) {
                    res.status(403).json("token is not valid");
                }
                req.user = user;
                next();
            });
        }
        else {
            res.status(401).json("you not auth");
        }
    },
    verifyTokenAdmin: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if(req.user.id == req.params.id || req.user.admin){
                next();
            }else{
                res.status(403).json("ban ko phai admin, ko dc xoa ngkhac");
            }
        });
    }
}
module.exports = middlewareController;