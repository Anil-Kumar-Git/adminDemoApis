const express = require("express");
const router = express.Router();
const { auth, adminAuth, beforeAuth } = require("../../middleware/auth");
const {
  getAllPage,
  getPageById,
  createPage,
  updatePage,
  multerPage,
} = require("../../controllers/admin/page.js");
const { validatePage } = require("../../validators/page.js");
const multer = require("multer");
const { validateContent } = require("../../middleware/contentValidation");

const DIR = "./uploads/";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const date = Date.now();
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    req.body.fileName = date + "-" + fileName;
    cb(null, date + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

router.get("/get-all", auth, adminAuth, getAllPage);
router.get("/:id", auth, adminAuth, getPageById);
router.post("/", auth, adminAuth, validatePage, createPage);
router.patch("/:id", auth, adminAuth, validateContent,updatePage);
router.post("/uplode-multer",auth, adminAuth,  upload.single('image'), multerPage);

module.exports = router;
