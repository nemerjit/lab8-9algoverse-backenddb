const express = require('express');
const User = require('../models/user');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const auth = require("../middleware/auth")

const router = express.Router();

router.post(
    "/signup",
    async(req, res) => {
        const {username, email, password} = req.body;
        try {
            let user = await User.findOne({email});
            if (user) {
                res.status(400).json({message: "User already exists"});
            }
            user = new User({username, email, password})

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload, 
                "randomString",
                {
                    expiresIn: 10000,
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    })
                }
            )

        } catch (e) {
            console.log(e);
            res.status(500).send("Error in Saving");
        }
    }
)

router.post(
    "/login",
    async(req, res) => {
        const {email, password} = req.body;
        try {
            let user = await User.findOne({email});
            if (!user) {
                res.status(400).json({message: "User doesn't exist, please sign up"});
            }
            const isMatch = bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({message:"Incorrect password"})
            }

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload, 
                "randomString",
                {
                    expiresIn: 3600,
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    })
                }
            )

        } catch (e) {
            console.log(e);
            res.status(500).send("Error in Logging in");
        }
    }
)

router.get(
    "/me", auth, async(req, res) => {
        try {
            const user = await User.findById(req.user.id);
            res.json(user);
        } catch (e) {
            res.status(500).json({message: "Error in fetching"})
        }

    }
)

module.exports = router;



