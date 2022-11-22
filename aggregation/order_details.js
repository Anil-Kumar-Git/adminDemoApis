const mongoose = require("mongoose");
module.exports = (type) => {
  if (type == "home") {
    return [
      {
        $project: {
          _id: "$_id",
          first_name: "$first_name",
          last_name: "$last_name",
          city: "$city",
          state: "$state",
          age: "$age",
          email: "$email",
          phone: "$phone",
          date_of_request: "$date_of_request",
          time_of_request: "$time_of_request",
          service_type: "$service_type",
          payment_status: "$payment_status",
          tax: "$tax",
          total: "$total",
          transaction_id: "$transaction_id",
          user_id: "$user_id",
          cardType: "$cardType",
          processer: "$processer",
          timesearch: "$timesearch",
          result: "$result",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
          check_delete: "$check_delete",
        },
      },
      {
        $lookup: {
          from: "order_details",
          let: { uId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$order_id", "$$uId"],
                },
              },
            },
            {
              $lookup: {
                from: "services",
                localField: "service_id",
                foreignField: "_id",
                as: "service",
              },
            },
            {
              $unwind: {
                path: "$service",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                service_name: "$service.name",
                service_id: "$service_id",
                order_status: "$status",
                price: "$service.price",
              },
            },
          ],
          as: "order",
        },
      },
      { $sort: { updatedAt: -1 } },
    ];
  } else if (type == "history") {
    return [
      {
        $project: {
          _id: "$_id",
          first_name: "$first_name",
          last_name: "$last_name",
          city: "$city",
          state: "$state",
          age: "$age",
          email: "$email",
          phone: "$phone",
          date_of_request: "$date_of_request",
          time_of_request: "$time_of_request",
          service_type: "$service_type",
          payment_status: "$payment_status",
          cardType: "$cardType",
          tax: "$tax",
          total: "$total",
          transaction_id: "$transaction_id",
          user_id: "$user_id",
          result: "$result",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
          check_delete: "$check_delete",
        },
      },
      {
        $lookup: {
          from: "order_details",
          let: { uId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$order_id", "$$uId"],
                },
              },
            },
            {
              $lookup: {
                from: "services",
                localField: "service_id",
                foreignField: "_id",
                as: "service",
              },
            },
            {
              $unwind: {
                path: "$service",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                service_id: "$service_id",
                service_name: "$service.name",
                service_image: "$service.image",
                service_price: "$service.price",
                order_status: "$status",
              },
            },
          ],
          as: "order",
        },
      },
      { $sort: { updatedAt: -1 } },
    ];
  } else {
    return [
      {
        $project: {
          _id: "$_id",
          first_name: "$first_name",
          last_name: "$last_name",
          city: "$city",
          state: "$state",
          age: "$age",
          email: "$email",
          phone: "$phone",
          date_of_request: "$date_of_request",
          time_of_request: "$time_of_request",
          service_type: "$service_type",
          payment_status: "$payment_status",
          tax: "$tax",
          total: "$total",
          transaction_id: "$transaction_id",
          user_id: "$user_id",
          cardType: "$cardType",
          processer: "$processer",
          timesearch: "$timesearch",
          result: "$result",
          createdAt: "$createdAt",
          updatedAt: "$updatedAt",
          check_delete: "$check_delete",
        },
      },
      {
        $lookup: {
          from: "order_details",
          let: { uId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$order_id", "$$uId"],
                },
              },
            },
            {
              $lookup: {
                from: "services",
                localField: "service_id",
                foreignField: "_id",
                as: "service",
              },
            },
            {
              $unwind: {
                path: "$service",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                service_id: "$service_id",
                service_name: "$service.name",
                service_description: "$service.description",
                service_image: "$service.image",
                service_price: "$service.price",
                order_status: "$status",
                result: "$result",
              },
            },
          ],
          as: "order",
        },
      },
      { $sort: { updatedAt: -1 } },
    ];
  }
};
