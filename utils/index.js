var multer = require('multer');
var path = require('path');
const storage = multer.diskStorage({
    destination: './public/storage',
    filename: function(req, file, cb){
      cb(null,"image" + '-' + Date.now() + path.extname(file.originalname));
    }
  });

const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
  }).single('file');

module.exports={storage, upload};