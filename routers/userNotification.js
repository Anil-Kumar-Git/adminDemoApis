const express = require("express");

const router = express.Router();
const { auth, beforeAuth } = require("../middleware/auth");
const {
  validateCreateUserNotification,
} = require("../validators/notification.js");
const {
  getUserNotificationByUserId,
  createUserNotification,
  deleteUserNotificationByUserId,
  updateUserNotificationByUserId,
  deleteSingleNotification,
  deleteAllReadedNotification
} = require("../controllers/userNotification.js");

router.get("/get", auth, getUserNotificationByUserId);
router.delete("/", auth, deleteAllReadedNotification);
router.delete("/:id", auth, deleteSingleNotification);
router.post("/", auth, validateCreateUserNotification, createUserNotification);
router.delete("/delete", auth, deleteUserNotificationByUserId);
router.patch("/update", auth, updateUserNotificationByUserId);

module.exports = router;
