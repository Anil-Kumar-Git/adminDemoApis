const express = require("express");
const router = express.Router();
const userController=require("../controllers/users")
const {beforeAuth,auth} =require("../middleware/auth");
const {validateVerifyInit,validateAuthenticate,validateCreateUser,validateForgot} = require("../validators/users")

router.post("/login",
validateVerifyInit,
validateAuthenticate,
 userController.login);
router.post(
    "/initiate/register",
    validateVerifyInit,
    userController.initiateRegister
  );

router.post("/",
validateCreateUser,
 userController.create);

router.post(
    "/initiate/forgot",
    validateVerifyInit,
    userController.initiateForgotPassword
  );

  router.post(
    "/verify/forgot/token",
    validateVerifyInit,
    validateForgot,
    userController.verifyForgotPasswordCode
  );
  router.put("/update/password",
  beforeAuth,
   userController.updatePassword);
  router.get("/fetch/profile", auth, userController.get);
  router.put("/reset/password", auth, userController.resetPassword);
  router.get("/:id", auth, userController.get);
  router.delete("/delete/account", auth, userController.deletePermanently);
  router.put("/update-profile", auth, userController.updateProfile);

//   router.post("/google",validateGooglelogin, userController.googleLogInToken);

module.exports = router;
