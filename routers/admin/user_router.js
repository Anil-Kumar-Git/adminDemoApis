const express = require("express");

const router = express.Router();
// const userController = require("../../controllers/users");
// const { auth, adminAuth, beforeAuth } = require("../../middlewares/auth");
const {
  // getAllUser,
  // deleteUser,
  // updateUser,
  // handleDashBordStats,
  addUser,
  // getUserByid,
  // resetPassword
} = require("../../controllers/admin/user_controller.js");

// router.post("/create", auth, adminAuth, addUser);
router.post("/create", addUser);


// router.get("/service-count", auth, adminAuth, handleDashBordStats);
// router.post("/get-all", auth, adminAuth, getAllUser);
// router.get("/get/:id", auth, adminAuth, getUserByid);
// router.delete("/delete-user/:id", auth, adminAuth, deleteUser);
// router.patch("/update-user/:id", auth, adminAuth, updateUser);
// router.put("/resetpassword/:id", auth, adminAuth, resetPassword);

module.exports = router;
