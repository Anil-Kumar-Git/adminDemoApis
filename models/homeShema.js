const mongoose=require("mongoose");
const schema=mongoose.Schema;

const userSchema=new schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    address:{
        type:String,
    }
},
{collection:"users",timestamps:{createdAt:true,updatedAt:true}}
);

module.exports = mongoose.model("users",userSchema)