const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authController = {
    // reg
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            // create user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });
            //    save db
            const user = await newUser.save();
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin
        }, process.env.MY_ACCESS_KEY, {
            expiresIn: "30s",
        }
        );
    },
    generateRefeshToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin
        }, process.env.MY_REFESH_KEY, {
            expiresIn: "365d",
        }
        );
    },
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                res.status(404).json("username bị sai");
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (!validPassword) {

                res.status(404).json("sai pass roi");
            }
            if (user && validPassword) {
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefeshToken(user);
                res.cookie("refeshToken", refreshToken, {
                    httpOnly: true,
                    path: "/",
                    samSite: "strict",
                    secure: false
                });
                const { password, ...others } = user._doc;
                res.status(200).json({ ...others, accessToken });
            }

        } catch (err) {
            res.status(500).json(err);

        }
    },
    requestRefeshToken: async (req, res) => {
        // lay refresh token user
        const refeshToken = req.cookie.refeshToken;
        res.status(200).json( refeshToken );

    }
}
// store token
//1) Local storage
//
module.exports = authController;