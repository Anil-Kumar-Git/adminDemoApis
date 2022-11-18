const multer=require("multer")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const ext =  file.mimetype.split('/')[1]
      const uniqueSuffix = Date.now() + '.'+ext 
      cb(null, file.fieldname + '-' + uniqueSuffix)
    },
  });
  
  const fileFilter = function (req, file, cb) {
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        return cb(new Error('Invalid file type. Only jpg, png image files are allowed.'),false)
    }
    cb(null, true)
  }
  
  let fileObj = {
    storage: storage,
    limits: {
        fileSize: 1024*1024
  },
    fileFilter: fileFilter,
    onError: function(error, next) {
     console.log(error);
  }
  };
  
  const upload = multer(fileObj);