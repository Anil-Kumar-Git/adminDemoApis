const Page = require("../models/page.js");

const { aboutData, privicyData, termData } = require("../helpers/notificationKey.js");

const getAllPage = async (req, res) => {
  try {
    const findAbout = await Page.findOne({ type: "about" });
    const findprivice = await Page.findOne({ type: "privacy" });
    const findterm = await Page.findOne({ type: "term" });
    const findLoading = await Page.find({ type: "onboarding" });

    if (!findAbout) {
      let dataAbout = {
        title: "About",
        type: "about",
        content: aboutData,
      };
      await Page.create(dataAbout);
    }

    if (!findprivice) {
      let dataPrivicy = {
        title: "Privacy Policy",
        type: "privacy",
        content: privicyData,
      };
      await Page.create(dataPrivicy);
    }
    if (!findterm) {
      let dataTerm = {
        title: "Terms & Conditions",
        type: "term",
        content: termData,
      };
      await Page.create(dataTerm);
    }

    const page = await Page.find({ type: { $not: /onboarding/ } });
    code = 200;
    return res.status(code).json({
      code,
      message: "Data fetched",
      data: page,
      onboarding: findLoading,
    });
  } catch (err) {
    code = 500;
    return res.status(code).json({ code, message: err.message, errors: err });
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

const createPage = async (req, res) => {
  try {
    let page = await Page.create(req.body);
    code = 200;
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
module.exports = {
  getPageById,
  createPage,
  getAllPage,
};
