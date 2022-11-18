const mongoose = require("mongoose");
module.exports = () => {
  return [
    {
      $project: {
        _id: "$_id",
        first_name: "$first_name",
        last_name: "$last_name",
        profile_image: "$profile_image",
        google_login: "$google_login",
        apple_login: "$apple_login",
        face_id: "$face_id",
        stripeCustomerId: "$stripeCustomerId",
        cardId:"$cardId",
        fcmToken: "$fcmToken",
        email: "$email",
        mobile_phone: "$mobile_phone",
        emailVerified: "$emailVerified",
        mobilePhoneVerified: "$mobilePhoneVerified",
        countryCode: "$countryCode",
        mobile_without_code: "$mobile_without_code",
        status: "$status",
        customerType: "$customerType",
        role: "$role",
        createdAt: "$createdAt",
        updatedAt: "$updatedAt",
      },
    },
    { $sort: { updatedAt: -1 } },
  ];
};
