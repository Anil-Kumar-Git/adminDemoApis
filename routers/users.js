const express = require("express");

// const { check } = require("express-validator");
const Router = express.Router();
const userController=require("../controllers/users")
// const {authmiddleware}=require("../helpers/users")

Router.post("/login", userController.login);
// Router.get("/allUsers",authmiddleware,userController.allUsers)
// Router.get("/getSingleUser/:id",authmiddleware,userController.singleUser)
// Router.get("/deleteUser/:id",authmiddleware,userController.deleteUser)

// Router.post("/singup",check("email").isEmail().withMessage({message:"Please enter correct email"}),userController.singup);
// Router.post("/forgotPassword",userController.forgotPwd)
// Router.post("/resetPassword",userController.resetPwd)
// Router.put("/updateUser/:id",authmiddleware,userController.updateUser)
// Router.put("/changePassword",authmiddleware,userController.changePwd)

module.exports = Router;
