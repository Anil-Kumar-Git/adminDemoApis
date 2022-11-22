const Order = require("../models/order.js");
const orderAgregationDate = require("../aggregation/order");
// const mongoose = require("mongoose");
// const OrderCheck = require("../models/order_details.js");
// const ServiceCheck = require("../models/service.js");
// const { UsaOneAnticash, CriminalApi } = require("../helpers/resultHelper.js");
// const {
//   onOrderNotifications,
//   onOrderRecheckNotifications,
// } = require("../helpers/notification");
const _ = require("lodash");
// const order = require("../aggregations/order.js");
// const moment = require("moment");

// const { charge } = require("../helpers/stripe.js");

const getAllOrder = async (req, res) => {
  try {
    let orderAggregation = orderAgregationDate();
    const orders = await Order.aggregate(orderAggregation);
    code = 200;
    return res.status(code).json({
      code,
      message: "Data fetched",
      data: orders,
    });
  } catch (err) {
    code = 500;
    return res.status(code).json({ code, message: err.message, errors: err });
  }
};

// const getOrderById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     let where = {
//       _id: { $eq: mongoose.Types.ObjectId(id) },
//     };
//     let orderAggregation = orderAgregationDate();
//     orderAggregation.push({
//       $match: where,
//     });

//     const orders = await Order.aggregate(orderAggregation);
//     code = 200;
//     return res.status(code).json({
//       code,
//       message: "Data fetched",
//       data: orders,
//     });
//   } catch (err) {
//     code = 500;
//     return res.status(code).json({ code, message: err.message, errors: err });
//   }
// };

// const deleteOrderById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const order = await Order.findByIdAndDelete(id);
//     code = 200;
//     return res.status(code).json({
//       code,
//       message: "Data Deleted",
//       data: order,
//     });
//   } catch (err) {
//     code = 500;
//     return res.status(code).json({ code, message: err.message, errors: err });
//   }
// };

// const createOrder = async (req, res) => {
//   try {
//     req.body.user_id = req.user._id;
//     let { stripeCustomerId } = req.user;
//     const { cardId, total, service_id, status } = req.body;
//     if (req.body.age) {
//       let yearNow = new Date().getFullYear();
//       req.body.yob = yearNow - Number(req.body.age);
//     }

//     let order = await Order.create(req.body);
//     let dataCheck = await Promise.all(
//       service_id.map(async (service) => {
//         let servicedata = await ServiceCheck.findById(service);
//         let value = {
//           order_id: order._id,
//           service_id: service,
//           result: {},
//         };
//         if (servicedata.name.toLowerCase().includes("anti-catfish")) {
//           req.body.marital_status = "M";
//           value.result.anti_cash = await UsaOneAnticash(req.body);
//           value.status = "verified";
//         } else if (servicedata.name.toLowerCase().includes("criminal")) {
//           value.status = "verified";
//           value.result.criminal = await CriminalApi(req.body);
//         } else if (servicedata.name.toLowerCase().includes("social")) {
//           value.result.social = {
//             name: "name name name name",
//             status: "name name name name",
//             discription: "name name name name",
//           };
//         }

//         let order_checks = await OrderCheck.create(value);
//         return order_checks;
//       })
//     );
//     onOrderNotifications(req.user, order);
//     code = 200;
//     return res.status(code).json({
//       code,
//       message: "Data created",
//       data: order,
//     });
//   } catch (err) {
//     code = 500;
//     return res.status(code).json({ code, message: err.message, errors: err });
//   }
// };

const FinalcreateOrder = async (req, res) => {
  try {
    req.body.user_id = req.user._id;
    let { stripeCustomerId } = req.user;
    const { cardId, total, service_id, status } = req.body;
    if (total && cardId && stripeCustomerId && stripeCustomerId !== null) {
      const paymentCharge = await charge(total, stripeCustomerId, cardId);
      if (!paymentCharge) {
        code = 400;
        return res.status(code).json({
          code,
          message: "Payment Fail",
          errors: {},
        });
      }
      if (req.body.age) {
        let yearNow = new Date().getFullYear();
        req.body.yob = yearNow - Number(req.body.age);
      }
      console.log(
        "Payment Charge == ",
        paymentCharge.payment_method_details.card.brand
      );
      req.body.transaction_id = paymentCharge.id;
      req.body.payment_status =
        paymentCharge.status == "succeeded"
          ? "success"
          : paymentCharge.status == "payment_failed"
          ? "failed"
          : "pending";
      req.body.cardType = paymentCharge.payment_method_details.card.brand;

      let order = await Order.create(req.body);
      let dataCheck = await Promise.all(
        service_id.map(async (service) => {
          let servicedata = await ServiceCheck.findById(service);
          let value = {
            order_id: order._id,
            service_id: service,
            result: {},
          };
          if (servicedata.name.toLowerCase().includes("anti-catfish")) {
            req.body.marital_status = "M";
            value.result.anti_cash = await UsaOneAnticash(req.body);
            value.status = "verified";
          } else if (servicedata.name.toLowerCase().includes("criminal")) {
            value.status = "verified";
            value.result.criminal = await CriminalApi(req.body);
          } else if (servicedata.name.toLowerCase().includes("social")) {
            value.result.social = {
              name: "name name name name",
              status: "name name name name",
              discription: "name name name name",
            };
          }

          let order_checks = await OrderCheck.create(value);
          return order_checks;
        })
      );
      onOrderNotifications(req.user, order);
      code = 200;
      return res.status(code).json({
        code,
        message: "Data created",
        data: order,
      });
    } else {
      code = 400;
      return res.status(code).json({
        code,
        message: "Something went wrong",
        errors: {},
      });
    }
  } catch (err) {
    console.log("Error == ", err);
    code = 500;
    return res.status(code).json({ code, message: err.message, errors: err });
  }
};

// const reCheckApi = async (req, res) => {
//   code = 400;
//   try {
//     const { orderId, service_id } = req.body;

//     let checkorder = await Order.findById(orderId);
//     var date2 = moment(new Date());
//     var date1 = moment(new Date(checkorder.createdAt));
//     var diff = date2.diff(date1, "days");
//     if (Number(diff) <= 30) {
//       let orderCountIncrease = await Order.findByIdAndUpdate(
//         orderId,
//         {
//           timesearch: Number(checkorder.timesearch) + 1,
//         },
//         { new: true }
//       );
//       let dataCheck = await Promise.all(
//         service_id.map(async (service) => {
//           let servicedata = await ServiceCheck.findById(service);
//           let value = {
//             result: {},
//           };
//           if (servicedata.name.toLowerCase().includes("anti-catfish")) {
//             req.body.marital_status = "M";
//             value.result.anti_cash = await UsaOneAnticash(req.body);
//             value.status = "verified";
//           } else if (servicedata.name.toLowerCase().includes("criminal")) {
//             value.status = "verified";
//             value.result.criminal = await CriminalApi(req.body);
//           } else if (servicedata.name.toLowerCase().includes("social")) {
//             value.result.social = {
//               name: "name name name name",
//               status: "name name name name",
//               discription: "name name name name",
//             };
//           }
//           let order_checks = await OrderCheck.findOneAndUpdate(
//             { order_id: orderId, service_id: service },
//             value,
//             { new: true }
//           );
//           return order_checks;
//         })
//       );
//       onOrderRecheckNotifications(req.user, orderCountIncrease);
//       code = 200;
//       return res.status(code).json({
//         code,
//         message: "Recheck Done",
//       });
//     } else {
//       return res.status(code).json({
//         code,
//         message: "Order creation date is more than 30 days",
//         errors: {},
//       });
//     }
//   } catch (err) {
//     return res.status(code).json({ code, message: err.message, errors: err });
//   }
// };
module.exports = {
  getAllOrder,
  // getOrderById,
  
  // createOrder,
  // deleteOrderById,
  // reCheckApi,
  FinalcreateOrder,
};
