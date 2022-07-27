const express = require('express')
const cors = require('cors')
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const PostRoute = require("./routes/PostRoute");
const UserRoute = require("./routes/UserRoutes");

app.use(cors());



const port = (process.env.PORT || "3000")

app.listen(port, () => {
  mongoose.connect("mongodb://localhost:27017/tourMeApp", () => {
      console.log(`Server is running on port: ${port}`);
  });
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.use("/api/v1/post", PostRoute);
app.use("/api/v1/user", UserRoute);
