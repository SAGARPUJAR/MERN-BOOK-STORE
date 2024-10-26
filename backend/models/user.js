    const mongoose = require("mongoose");
    const user = new mongoose.Schema({
        username: {
            type: String,
            requied: true,
            unique: true
        },
        email: {
            type: String,
            requied: true,
            unique: true
        },
        password: {
            type: String,
            requied: true
        },
        address: {
            type: String,
            requied: true
        },
        avatar: {
            type: String,
            default: 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png'
        },
        role: {
            type: String,
            default: 'user',
            enum: ['user', 'admin']
        },
        favorites: [{ type: mongoose.Types.ObjectId, ref: "books" }],
        cart: [{ type: mongoose.Types.ObjectId, ref: "books" }],
        orders: [{ type: mongoose.Types.ObjectId, ref: "order" }]
    }, { timestamps: true });

    module.exports = mongoose.model("user", user);