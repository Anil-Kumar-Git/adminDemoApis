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

app.use("/users",require("./routers/users"));
app.use("/admin/user",require("./routers/admin/user_router"))

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  });

  app.get("/", (req, res) => {
    res.status(200).json({
      message: "Demo Apis are running....",
    });
  });
  
  /** catch 404 and forward to error handler */
  app.get("*", (req, res) => {
    res.status(404).json({
      message: "Url Does not exit",
    });
  });
  

const port= process.env.PORT || 5000;
app.listen(port, () => {
  console.log("app is listening on port " + port);
});