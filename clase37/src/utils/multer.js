const multer = require('multer');

const storage = multer.diskStorage({
    
    destination: (req, file, cb) => {
        cb(null, process.cwd() + '/public/img');
    },
    filename: (req, file, cb) => {
        cb(null, (Date.now()+ '-' + file.originalname));
    }
});

const uploader = multer({storage});// storage: storage

module.exports = uploader;