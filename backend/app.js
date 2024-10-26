const express = require('express')
const app = express();
app.use(express.json());
require("dotenv").config();
require('./connection/conn');
const UserRouter = require("./routes/User");
const bookRouter = require("./routes/book");
const favoriteRouter = require("./routes/favorite");
const addToCartRouter = require("./routes/cart");
const ordertRouter = require("./routes/order");


//routes
app.use("/api/v1", UserRouter);
app.use("/api/v1", bookRouter);
app.use("/api/v1", favoriteRouter);
app.use("/api/v1", addToCartRouter);
app.use("/api/v1", ordertRouter);

app.get('/', (req, res) => {
    res.send('Hello from backednd..');
});

//Creating Port
app.listen(process.env.PORT, () => {
    console.log(`server started at ${process.env.PORT} `);
})
