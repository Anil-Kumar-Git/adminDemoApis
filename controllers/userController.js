const User = require("../models/homeShema");
const bcrypt = require("bcrypt");
const { Send200, Send400, Send500 } = require("../helper/userResponce");
const {
  checkValidation,
  generateToken,
  validPwd,
  sendMail,
  oneTimeAuth,
} = require("../helper/users");
const CONFIG = require("../config.json");
const passwordModal = require("../models/passwordModal");

const allUsers = async (req, res) => {
  try {
    const usersData = await User.find();
    if (usersData) {
      return Send200(res, "Users details get successful", usersData);
    } else {
      return Send400(res, "Users not found");
    }
  } catch (err) {
    return Send500(res, "Something wrong, try again later!", err.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findOne({ _id });
    const { name, phoneNumber, email, address } = req.body;

    if (checkValidation(name, phoneNumber, email, user.password, res)) {
      const userData = {
        ...req.body,
      };
      const result = await User.updateOne({ _id }, { ...userData });
      if (result) {
        return Send200(res, "user update successful");
      } else {
        return Send400(res, "user not updated");
      }
    }
  } catch (err) {
    return Send500(res, "Something wrong, try again later!", err.message);
  }
};

const changePwd = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (validPwd(newPassword)) {
      const _id = req._user;
      const user = await User.findById({ _id });
      const validUser = await bcrypt.compare(oldPassword, user.password);
      console.log(user);
      if (validUser) {
        console.log(newPassword);
        let hashPassword = await bcrypt.hash(newPassword.toString(), 10);
        let updatePassword = await User.findByIdAndUpdate(
          { _id },
          { password: hashPassword }
        );
        if (updatePassword) {
          return Send200(res, "password change successful");
        } else {
          return Send400(res, "password not changes");
        }
      } else {
        Send400(res, "Old password is incorrect");
      }
    } else {
      Send400(res, "enter a strong password (like: A,a,1,#)");
    }
  } catch (err) {}
};

const deleteUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findOne({ _id });
    if (user) {
      const deleteUser = await User.deleteOne({ _id });
      if (deleteUser) {
        return Send200(res, "user delete successful");
      }
    } else {
      return Send400(res, "user not found");
    }
  } catch (err) {
    return Send500(res, "Something wrong, try again later!", err.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const validUser = await bcrypt.compare(password, user.password);
      if (validUser) {
        const token = await generateToken(user);

        return Send200(res, "login Successfully", user, token);
      } else {
        return Send400(res, "Invalid username or password");
      }
    } else {
      return Send400(res, "User not exist");
    }
  } catch (err) {
    return Send500(res, "Something wrong, try again later!", err.message);
  }
};

const singup = async (req, res) => {
  try {
    const { name, phoneNumber, email, password, address } = req.body;
    if (checkValidation(name, phoneNumber, email, password, res)) {
      const user = await User.findOne({ email });
      if (user) {
        return Send400(res, "Email Already Exists");
      } else {
        const Npassword = await bcrypt.hash(password.toString(), 10);
        req.body.password = Npassword;
        const newUser = {
          ...req.body,
        };
        console.log(req.body);
        const result = await User.create(newUser);
        return Send200(res, "Signup successfully!", result);
      }
    }
  } catch (err) {
    return Send500(res, "Something wrong, try again later!", err.message);
  }
};

const singleUser = async (req, res) => {
  try {
    const Id = req.params.id;
    if (!Id) {
      return Send400(res, "Id is required ");
    }

    const payload = { _id: Id };
    let data = await User.findOne(payload);
    if (data) {
      return Send200(res, "User found successfully", data);
    } else {
      return Send400(res, "User not found");
    }
  } catch (err) {
    return Send500(res, "Something wrong, try again later!", err.message);
  }
};

const forgotPwd = async (req, res) => {
  try {
    const { email } = req.body;
    const validUser = await User.findOne({ email });
    if (validUser) {
      let token = generateToken(validUser);
      const mailDetails = {
        from: CONFIG.USER_EMAIL,
        to: email,
        subject: "Your reseat password link :-",
        html: `<a href="${CONFIG.CLIENT_URL_FRONT}/reset-password/${token}">click here to reset you password</a>`,
      };
      const mailDone = await sendMail(mailDetails);
      if (mailDone) {
        return Send200(res, "reset password send Link on email");
      } else {
        return Send400(res, "Link not sent");
      }
    } else {
      return Send400(res, "user not exist");
    }
  } catch (err) {
    return Send500(res, "Something wrong, try again later!", err.message);
  }
};

const resetPwd = async (req, res) => {
  try {
    const { password, token } = req.body;
    const payload = oneTimeAuth(token);
    if (payload) {
      const findToken = await passwordModal.findOne(payload);
      console.log(findToken,"find token")
      if (findToken) {
        return Send500(res, "token expire only one time use");
      } else {
        let pwdmodel=  await passwordModal.create(payload);
        let hashPwd = await bcrypt.hash(password.toString(), 10);
        let updatePwd = await User.updateOne(
          { _id: payload.userId},
          { password: hashPwd }
        );
        console.log(pwdmodel,"moadl")
        if (updatePwd.modifiedCount==1) {
          return Send200(res, "password reseat successful");
        } else {
          return Send400(res, "reseat password not changed");
        }
      }
    } else {
      return Send400(res, "token expire or somthingwrong with password");
    }
  } catch (err) {
    return Send500(res, "Something wrong, try again later!", err.message);
  }
};

module.exports = {
  forgotPwd,
  updateUser,
  allUsers,
  deleteUser,
  singup,
  login,
  singleUser,
  changePwd,
  resetPwd,
};
