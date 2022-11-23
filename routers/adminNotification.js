const express = require("express");

const router = express.Router();
const { auth, beforeAuth } = require("../middleware/auth");
const {
    validateCreateAdminNotification
} = require("../validators/notification.js");
const {
    getadminNotificationById,
    createAdminNotification,
    deleteAdminNotificationById,
    updateAdminNotificationById,
    fetchSgTemplates,
    getAllNotification
} = require("../controllers/adminNotification.js");


router.get("/get/:id", getadminNotificationById);
router.post("/", validateCreateAdminNotification , createAdminNotification);
router.delete("/delete/:id", deleteAdminNotificationById);
router.patch("/update/:id", updateAdminNotificationById);
router.get("/gettamplate", fetchSgTemplates);
router.get("/get-all", getAllNotification);


module.exports = router;
