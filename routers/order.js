const express = require("express");

const router = express.Router();
const { auth, beforeAuth } = require("../middleware/auth");
const { validateCreateOrder ,validateRecheckOrder ,OldvalidateRecheckOrder} = require("../validators/order");
const {
  getOrderById,
  getAllOrder,
  createOrder,
  deleteOrderById,
  reCheckApi,
  FinalcreateOrder
} = require("../controllers/order.js");

router.get("/", getAllOrder);
// router.get("/:id", auth, getOrderById);
// router.post("/", auth, OldvalidateRecheckOrder, createOrder);
router.post("/new", auth, 
// validateCreateOrder,
 FinalcreateOrder);
// router.post("/recheck", auth, validateRecheckOrder, reCheckApi);
// router.delete("/delete/:id", auth, deleteOrderById);

module.exports = router;
