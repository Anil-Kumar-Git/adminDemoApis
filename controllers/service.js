const Service = require("../models/service");
const {serviceData} =require('../helpers/notificationKey.js')

const getAllService = async (req, res) => {
  try {
    const serviceCheck = await Service.find({});
    if(serviceCheck?.length ==0){
      await Service.insertMany(serviceData)
    }

    const service = await Service.find({});
    code = 200;
    return res.status(code).json({
      code,
      message: "Data fetched",
      data: service,
    });
  } catch (err) {
    code = 500;
    return res.status(code).json({ code, message: err.message, errors: err });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    code = 200;
    return res.status(code).json({
      code,
      message: "Data fetched",
      data: service,
    });
  } catch (err) {
    code = 500;
    return res.status(code).json({ code, message: err.message, errors: err });
  }
};

const createService = async (req, res) => {
  try {
    let service = await Service.create(req.body);
    code = 200;
    return res.status(code).json({
      code,
      message: "Data created",
      data: service,
    });
  } catch (err) {
    code = 500;
    return res.status(code).json({ code, message: err.message, errors: err });
  }
};
module.exports = {
  getServiceById,
  getAllService,
  createService,
};
