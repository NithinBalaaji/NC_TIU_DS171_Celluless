const HttpStatus = require('http-status-codes');
const path = require('path');
const multer = require('multer');
const util = require('util');

class Uploader {

    constructor(req,fileOptions) {

        // Set The Storage Engine
        const storageOptions = multer.diskStorage({
            destination: path.join('/home/teslash21/CS/Github/drsiri/public/uploads'),
            filename: (req, file, cb) => {
                cb(null, fileOptions.fileName + '_' + Date.now() + path.extname(file.originalname));
            },
            onError : (error, next) => {
                let status_code = 500;
                return {
                    status_code: status_code,
                    message: error.toString(),
                    data: {}
                }
            }
        });

        // Check File Type
        const checkFileType = (file, allowedFileTypesRE, cb) => {
            // Check extension
            const extname = allowedFileTypesRE.test(path.extname(file.originalname).toLowerCase());
            // Check mimetype
            const mimetype = allowedFileTypesRE.test(file.mimetype);
            if (true) {
                return cb(null, true);
            } else {
                console.log('Error: Upload only allowed file types');
                cb('Error: Upload only allowed file types');
            }
        }

        this.upload = multer({
            storage: storageOptions,
            limits: { fileSize: fileOptions.allowedFileSize },
            fileFilter: function (req, file, cb) {   
                checkFileType(file,fileOptions.allowedFileTypesRE,cb);
            }
        });

    }

    async uploadSingle(req, res, fieldName) {
        try {
            const upload = util.promisify(this.upload.single(fieldName));
            let response = await upload(req, res);

            console.log('File has been successfully uploaded.');
            let status_code = 200;
            return {
                status_code: status_code,
                message: 'File has been successfully uploaded.',
                data: {
                    file: req.file
                }
            }
        } catch (error) {
            let status_code = 500;
            return {
                status_code: status_code,
                message: HttpStatus.getStatusText(status_code),
                data: {}
            }
        }
    }

    async uploadMulti(req, res, fieldDetails) {
        try {
            const upload = util.promisify(this.upload.array(fieldDetails.fieldName,fieldDetails.maxCount));
            let response = await upload(req, res);
            
            console.log('Files have been successfully uploaded.');
            let status_code = 200;
            return {
                status_code: status_code,
                message: 'Files have been successfully uploaded.',
                data: {
                    files: req.files
                }
            }
        } catch (error) {
            let status_code = 500;
            return {
                status_code: status_code,
                message: HttpStatus.getStatusText(status_code),
                data: {}
            }
        }
    }

}

module.exports = Uploader;
