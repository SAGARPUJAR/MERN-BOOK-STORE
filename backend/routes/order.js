const { authenticateToken } = require("./userAuth");
const Book = require("../models/book");
const User = require("../models/user");
const Order = require("../models/order");
const express = require('express');
const order = require("../models/order");
const router = express.Router();


//Place the order
router.post("/placeorder", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { order } = req.body;
        for (const orderData of order) {
            const newOrder = new Order({
                user: id,
                book: orderData._id
            });
            const orderDataFromDb = await newOrder.save();


            //saving order in user model
            await User.findByIdAndUpdate(id, {
                $push: { orders: orderData._id }
            })

            //cleaing the cart
            await User.findByIdAndUpdate(id, {
                $pull: { cart: orderData._id }
            })
        }
        return res.status(200).json({
            status: "Success",
            message: "Order Placed Successfully"
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})

//get a history of particular user
router.get("/getuserhistory", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate({
            path: "orders",
            populate: { path: "book" }
        });

        const orderData = userData.orders.reverse();
        return res.status(200).json({
            status: "Success",
            data: orderData
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
});

//get a all history --admin
router.get("/getallorders", authenticateToken, async (req, res) => {
    try {
        const userData = await Order.find()
            .populate({
                path: "book"
            })
            .populate({
                path: "user"
            })
            .sort({ createdAt: -1 })
        return res.status(200).json({
            status: "Success",
            data: userData
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
});

//update order admin
router.put("/updateorderstatus/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await Order.findByIdAndUpdate(id, { status: req.body.status });
        return res.json({
            status: "Success",
            message: "Status Updated Successfully"
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
});
module.exports = router;