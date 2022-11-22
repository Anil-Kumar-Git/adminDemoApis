require("dotenv").config();
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

app.use("/uploads", express.static("uploads"));
app.use("/service", require("./routers/service"));
app.use("/page", require("./routers/page"));
// app.use("/order", require("./routers/order"));
// // app.use("/user-notification", require("./routes/userNotification.js"));
// app.use("/admin-notification", require("./routes/adminNotification.js"));
// app.use("/order_details", require("./routes/order_details.js"));
app.use("/admin/order", require("./routers/admin/order"));
app.use("/admin/page", require("./routers/admin/page"));
// app.use("/notificationLogs", require("./routes/notificationLogs"));
// app.use("/card", require("./routes/payment.js"));
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