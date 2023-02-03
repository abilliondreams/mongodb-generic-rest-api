const fs = require('fs');
const path = require('path');
const multer = require('multer');
const {v4: uId} = require('uuid');

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        console.log('uplodar folder is', process.cwd() + `/upload/${req.query.userId}`);
        if (!fs.existsSync(process.cwd() + `/upload/${req.query.userId}`)) {
             fs.mkdirSync(process.cwd() + `/upload/${req.query.userId}`, {recursive: true});
            }
        callback(null, process.cwd() + `/upload/${req.query.userId}`);
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + '-' + uId());
    }
  });

  var fileFilter = function (req, file, done) {
     if (file.mimetype === 'text/csv') {
      done(null, true);
     } else {
       done(new Error("Only CSV file format is supported."));
     }
  };
  
  const limits = {fileSize: 1024 * 1024 * 1024};

  module.exports = multer({ storage : storage , fileFilter: fileFilter, limits : limits});
