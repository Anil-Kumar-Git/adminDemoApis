const express = require("express");

const router = express.Router();
const { auth } = require("../middleware/auth");
const {getAllPage , getPageById, createPage} =require("../controllers/page")

router.get("/:id", auth, getPageById);
router.get("/", getAllPage);
router.post("/add", auth, createPage);

module.exports = router;
