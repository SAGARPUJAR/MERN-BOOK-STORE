const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Book = require("../models/book");
const tokens = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");

//Add Book  --admin
router.post("/addbook", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const user = await User.findById(id);
        if (user.role !== "admin") {
            return res
                .status(400)
                .json({ message: "You are not allowed to perform the admin Operation" })
        }
        const book = new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language
        });
        await book.save();
        res.status(200).json({ message: "Book Added Successfully" })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})


//Update Book --admin
router.put("/updatebook", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        await Book.findByIdAndUpdate(bookid, {
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language
        });
        return res.status(200).json({
            message: "Book Updated Successfully"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
});

//delete book
router.delete("/deletebook", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.header;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({
            message: "Book Deleted Successfully"
        })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
});

//get All Books
router.get("/getallbooks", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: 1 });
        return res.status(200).json({ status: "Success", data: books })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
});


//get Recently added books
router.get("/getrecentbooks", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: 1 }).limit(4);
        return res.status(200).json({ status: "Success", data: books })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
});

//get Book by Id
router.get("/getbookbyid/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        res.status(200).json({
            status: "Success",
            data: book
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
});


module.exports = router;