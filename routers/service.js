const express = require("express");
const router = express.Router();
const { auth, beforeAuth, adminAuth } = require("../middleware/auth");

const {
  getServiceById,
  getAllService,
  createService,
} = require("../controllers/service");
const { validateCreateService } = require("../validators/services");

router.get("/all",beforeAuth , getAllService);
router.get("/:id",beforeAuth, getServiceById);
router.post("/add",beforeAuth ,validateCreateService, createService);

module.exports = router;
