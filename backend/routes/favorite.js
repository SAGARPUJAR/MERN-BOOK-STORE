const express = require('express');
const router = express.Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");


//Add to favorites
router.put("/addtofav", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const isBookFav = userData.favorites.includes(bookid);
        if (!isBookFav) {
            return res.status(200).json({ message: "Book is already in favorites" })
        }
        await User.findByIdAndUpdate(id, { $push: { favorites: bookid } })
        return res.status(200).json({ message: "Book is added to favorites" })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
});


//Remove Favorites
router.put("/deletefav", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const isBookFav = userData.favorites.includes(bookid);
        if (!isBookFav) {
            await User.findByIdAndUpdate(id, { $pull: { favorites: bookid } })
        }
        return res.status(200).json({ message: "Book is removed from favorites" })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
});

//get favotite books of particular user.
router.get("/favbyuser", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate("favorites");
        const favBooks = await userData.favorites;
        return res.status(200).json({ status: "Success", data: favBooks })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
});

module.exports = router;