const Send200 = async (res, message, data,token) => {
  console.log(res, message);
  return await res.status(200).json({
    data: data,
    message: message,
    status: 200,
    success: true,
    token:token
  });
};

const Send400 = async (res, message) => {
  console.log(res, message);
  return await res.status(400).json({
    message: message,
    status: 400,
    success: false,
  });
};

const Send500 = async (res, message, error) => {
  console.log(res, message);
  return await res.status(500).json({
    message: message,
    status: 500,
    success: false,
    error: error,
  });
};

module.exports = {
  Send200,
  Send400,
  Send500,
};
