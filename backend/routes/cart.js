const express = require('express');
const router = express.Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

//add to cart
router.put("/addtocart", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const isBookInCart = userData.cart.includes(bookid);
        if (!isBookInCart) {
            return res.status(200).json({ status: "success", message: "Book is already in cart" })
        }
        await User.findByIdAndUpdate(id, {
            $push: { cart: bookid }
        })
        return res.status(200).json({ status: "Success", message: "Book added to cart" })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
});

//delete from cart
router.delete("/deletecart:/bookid", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.params;
        const { id } = req.headers;
        await User.findByIdAndUpdate(id, {
            $pull: { cart: bookid }
        });
        return res.status(200).json({ status: "success", message: "Book removed from cart" })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
});

//get cart of particular user
router.get("/getusercart", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate("cart");
        const cart = userData.cart.reverse();

        return res.status(200).json({
            status: "Success",
            cartItems: cart
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
});

module.exports = router;