exports.validateContent = (req, res, next) => {
  const { title, slug, image, content, type } = req.body;
  if (type == "about" || type == "privacy" || type == "term") {
    if (title == "" || slug == "" || image == "" || content == "" || content == "<p><br></p>") {
      return res.status(400).json({
        code: 400,
        message: "All fields are mandetory",
      });
    }
  }
  if (type == "anticatfish" || type == "criminal" || type == "social") {
    if (title == "" || content == ""|| content == "<p><br></p>") {
      return res.status(400).json({
        code: 400,
        message: "Title and Content are mandetory.",
      });
    }
  }

  if (type == "onboarding") {
    if (image == "" || content == "" || content == "<p><br></p>") {
      return res.status(400).json({
        code: 400,
        message: "Image and Content are mandetory.",
      });
    }
  }
  return next();
};
