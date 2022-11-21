const express = require("express");
const router = express.Router();
const userController=require("../controllers/users")
const {beforeAuth,auth} =require("../middleware/auth")

// const { check } = require("express-validator");
// const {authmiddleware}=require("../helpers/users")

router.post("/login", userController.login);
router.post(
    "/initiate/register",
    userController.initiateRegister
  );

router.post("/", userController.create);

router.post(
    "/initiate/forgot",
    // validateVerifyInit,
    userController.initiateForgotPassword
  );

  router.post(
    "/verify/forgot/token",
    // validateVerifyInit,
    // validateForgot,
    userController.verifyForgotPasswordCode
  );
  router.put("/update/password",
  beforeAuth,
   userController.updatePassword);
  router.get("/fetch/profile", auth, userController.get);

  router.put("/reset/password", auth, userController.resetPassword);
  router.get("/:id", auth, userController.get);
  router.delete("/delete/account", auth, userController.deletePermanently);
//   router.post("/google",validateGooglelogin, userController.googleLogInToken);
//   router.put("/update-profile", auth, userController.updateProfile);

// Router.get("/allUsers",authmiddleware,userController.allUsers)
// Router.get("/getSingleUser/:id",authmiddleware,userController.singleUser)
// Router.get("/deleteUser/:id",authmiddleware,userController.deleteUser)

// Router.post("/singup",check("email").isEmail().withMessage({message:"Please enter correct email"}),userController.singup);
// Router.post("/forgotPassword",userController.forgotPwd)
// Router.post("/resetPassword",userController.resetPwd)
// Router.put("/updateUser/:id",authmiddleware,userController.updateUser)
// Router.put("/changePassword",authmiddleware,userController.changePwd)

module.exports = router;
