const express = require("express");
const bodyParser=require("body-parser");
const cors=require("cors")

const app=express();

//db Connection
require("./config/dataBase.js")

app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use("/users",require("./routers/homeRouter"))

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  });
  
  /** catch 404 and forward to error handler */
  app.use("*", (req, res) => {
    return res.status(404).json({
      success: false,
      message: "API endpoint doesnt exist",
    });
  });

const port= process.env.PORT || 5000;
app.listen(port, () => {
  console.log("app is listening on port " + port);
});