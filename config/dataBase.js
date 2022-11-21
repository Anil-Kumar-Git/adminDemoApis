const mongoose= require("mongoose");
//db Connection
mongoose.connect(process.env.DB_URL,{useNewUrlParser:true});
const db=mongoose.connection;

db.on("error",()=>{console.log("error in connection");})
db.once("open",()=>{ console.log("connected") })
