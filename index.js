const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const app = express();
dotenv.config();
mongoose.connect(process.env.MONGODB_URL, () => {
    console.log("connect mongodb")
}
);
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.listen(8000, () => {
    console.log("ngon cơm");
})
// ROUTE
app.use('/v1/auth', authRoute);
app.use('/v1/user', userRoute);
//  AUTHENTCATION
// AUTHORIZATION
// json web token