const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const tokens = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");

//Sign up
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, address } = req.body;
        // Check username lenght
        if (username.length < 4) {
            return res.status(400).json({ message: "UserName length should be more than 4" })
        }

        //check username aleray exists?
        const existingUserName = await User.findOne({ username: username });
        if (existingUserName) {
            return res.status(400).json({ message: "UserName already exists" })
        }

        //check Email aleray exists?
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }

        //chcek password lenght
        if (password.length < 4) {
            return res.status(400).json({ message: "Password length should be more than 4" })
        }

        const hasPass = await bcrypt.hash(password, 10);

        const newUser = new User({ username: username, email: email, password: hasPass, address: address });
        await newUser.save();
        return res.status(200).json({ message: "Signedup Successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
});


//Sign In
router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            res.status(400).json({ message: "Invalid Credentials" });
        }

        await bcrypt.compare(password, existingUser.password, (err, data) => {
            if (data) {
                const authClaims = [
                    { name: existingUser.username },
                    { role: existingUser.role }
                ]
                const token = tokens.sign({ authClaims }, "bookStore123", { expiresIn: "30d" })
                res.status(200).json(
                    {
                        id: existingUser.id,
                        role: existingUser.role,
                        token: token
                    });
            } else {
                res.status(400).json({ message: "Invalid Credentials" });
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
});

//Get User Information
router.get("/get-user-info", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const data = await User.findById(id).select("-password");
        return res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
});

//Update Address
router.put("/updateaddress", authenticateToken, async (req, res) => {
    try {
        const { id } = req.header;
        const { address } = req.body;
        await User.findByIdAndUpdate(id, { address: address });
        return res.status(200).json({ message: "Address Updated Successfully.." })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
});



module.exports = router;