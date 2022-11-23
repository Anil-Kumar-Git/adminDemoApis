const mongoose = require("mongoose");
const Page = require("../../models/page");
const _ = require("lodash");

const createPage = async (req, res) => {
  try {
    code = 200;
    const { title, slug, image, content } = req.body;
    if (title == "" || slug == "" || image == "" || content == "") {
      return res.status(400).json({
        code: 400,
        message: "All field is mandetory",
      });
    }
    let page = await Page.create(req.body);
    return res.status(code).json({
      code,
      message: "Data created",
      data: page,
    });
  } catch (err) {
    code = 500;
    return res.status(code).json({ code, message: err.message, errors: err });
  }
};

const updatePage = async (req, res) => {
  let code = 400;
  try {
    const { id } = req.params;
    const body = _.pickBy(_.get(req, "body"), (value, key) => {
      return key === "title" || key === "slug" || key === "image" || key === "content";
    });
   
    const page = await Page.findByIdAndUpdate(id, body, { new: true });
    if (page) {
      code = 200;
      return res.status(code).json({
        code,
        massage: "Page Updated Successfully",
        data: page,
      });
    }
    return res.status(code).json({
      code,
      message: "No Page found",
      errors: { error: "No Page found" },
    });
  } catch (error) {
    return res.status(code).json({ code, message: error.message, errors: {} });
  }
};

const getPageById = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await Page.findById(id);
    code = 200;
    return res.status(code).json({
      code,
      message: "Data fetched",
      data: page,
    });
  } catch (err) {
    code = 500;
    return res.status(code).json({ code, message: err.message, errors: err });
  }
};

const getAllPage = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await Page.find();
    code = 200;
    return res.status(code).json({
      code,
      message: "Data fetched",
      data: page,
    });
  } catch (err) {
    code = 500;
    return res.status(code).json({ code, message: err.message, errors: err });
  }
};

const multerPage = async (req, res) => {
  let code=400;
  if(req.file){
    code = 200;
    return res.status(code).json({
      code,
      message: "image uploaded",
      file:req.file
    });
  }else{
    return res.status(code).json({
      code,
      message: "please select a file",
    });
  }

};

module.exports = {
  getAllPage,
  getPageById,
  createPage,
  updatePage,
  multerPage,
};
