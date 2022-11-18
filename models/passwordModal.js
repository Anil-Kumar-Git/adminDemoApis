const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const passwordSchema=new Schema({
    token:{type:String},
    userId:{type:Schema.Types.ObjectId,ref:"users"}
},
{collection:"authPassword",timestamps:{createdAt:true,updatedAt:true}}
);

module.exports=mongoose.model("Password",passwordSchema)