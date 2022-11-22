const mongoose = require("mongoose");
const Order = require("../../models/order");
const Order_details = require("../../models/order_details");
const _ = require("lodash");
const OrderTwo = require("../../aggregation/order_details");

const getAllOrderData = async (req, res) => {
    code = 400;
    try {
      const { orderId, orderStatus, to, from, flied, transactionId } = req.body;
      const where = {};
      if (orderStatus && orderStatus !== "") {
        where.status = orderStatus;
      }
      if (to && to !== "" && from && from !== "") {
        where.createdAt = {
          $gte: new Date(to),
          $lt: new Date(from),
        };
      }
      let orderResultAggregation = OrderTwo("home");
      orderResultAggregation.push({
        $match: where,
      });
      const orders = await Order.aggregate(orderResultAggregation);
      code = 200;
      return res.status(code).json({
        code,
        data: orders,
      });
    } catch (error) {
      return res.status(code).json({ code, message: error.message, errors: {} });
    }
  };
  
  const getOrderById = async (req, res) => {
    code = 400;
    try {
      const { id } = req.params;
      const where = {};
      if (id) {
        where._id = { $eq: mongoose.Types.ObjectId(id) };
      }
  
      let orderResultAggregation = OrderTwo();
      orderResultAggregation.push({
        $match: where,
      });
      const orders = await Order.aggregate(orderResultAggregation);
      code = 200;
      return res.status(code).json({
        code,
        data: orders,
      });
    } catch (error) {
      return res.status(code).json({ code, message: error.message, errors: {} });
    }
  };

  const deleteOrder = async (req, res) => {
    let code = 400;
    try {
      const { id } = req.params;
      const checkorder = await Order.find({ _id: id });
      await Order.deleteMany({ _id: id });
      let order_delete = await Promise.all(
        checkorder.map(async (order) => {
          let order_details = await Order_details.deleteMany({
            order_id: order._id,
          });
          return order_details;
        })
      );
      if (checkorder) {
        code = 200;
        return res.status(code).json({
          code,
          massage: "Order Deleted Successfully",
        });
      }
      return res.status(code).json({
        code,
        message: "No Order found",
        errors: { error: "No Order found" },
      });
    } catch (err) {
      return res.status(code).json({ code, message: err.message, errors: {} });
    }
  };
  
  const updateOrder = async (req, res) => {
    let code = 400;
    try {
      const { id } = req.params;
      const body = _.pickBy(_.get(req, "body"), (value, key) => {
        return (
          key === "first_name" ||
          key === "last_name" ||
          key === "city" ||
          key === "state" ||
          key === "age" ||
          key === "email" ||
          key === "phone" ||
          key === "payment_status"
        );
      });
      const order = await Order.findByIdAndUpdate(id, body, { new: true });
      if (order) {
        code = 200;
        return res.status(code).json({
          code,
          massage: "Order Updated Successfully",
        });
      }
      return res.status(code).json({
        code,
        message: "No Order found",
        errors: { error: "No Order found" },
      });
    } catch (error) {
      return res.status(code).json({ code, message: error.message, errors: {} });
    }
  };

  // add order

  const addOrder = async (req, res) => {
    let code = 400;
    try {
      const { id } = req.params;
      const body = _.pickBy(_.get(req, "body"), (value, key) => {
        return (
          key === "first_name" ||
          key === "last_name" ||
          key === "city" ||
          key === "state" ||
          key === "age" ||
          key === "email" ||
          key === "phone" ||
          key === "payment_status"
        );
      });
      const order = await Order.findByIdAndUpdate(id, body, { new: true });
      if (order) {
        code = 200;
        return res.status(code).json({
          code,
          massage: "Order Updated Successfully",
        });
      }
      return res.status(code).json({
        code,
        message: "No Order found",
        errors: { error: "No Order found" },
      });
    } catch (error) {
      return res.status(code).json({ code, message: error.message, errors: {} });
    }
  };

  module.exports ={
    getAllOrderData,
    getOrderById,
    deleteOrder,
    updateOrder
  }