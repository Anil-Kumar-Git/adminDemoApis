const mongoose = require("mongoose");
module.exports = () => {
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
      },
    },
    { $sort: { updatedAt: -1 } },
  ];
};
