const express = require("express");
const router = express.Router();
const { auth, adminAuth } = require("../../middleware/auth");
const {
    getAllOrderData,
    getOrderById,
    deleteOrder,
    updateOrder
} = require("../../controllers/admin/orderData");

router.post("/all_order", auth, adminAuth, getAllOrderData);
router.get("/all_order/:id", auth, adminAuth, getOrderById);
router.delete("/delete/:id", auth, adminAuth, deleteOrder);
router.patch("/update/:id", auth, adminAuth, updateOrder);

module.exports = router;
