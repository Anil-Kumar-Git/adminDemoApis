const mongoose= require("mongoose");
const CONFIG =  require("../config.json")
//db Connection
mongoose.connect(CONFIG.DB_URL,{useNewUrlParser:true});
const db=mongoose.connection;

db.on("error",()=>{console.log("error in connection");})
db.once("open",()=>{ console.log("connected") })
