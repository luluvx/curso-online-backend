const multer = require('multer');
const path = require('path');
const fs = require('fs');


const getUploadMiddleware = (tipo) => {
    const uploadDir = path.resolve(`src/public/uploads/${tipo}`);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const nombre = `${tipo}-${req.params.id || 'temp'}-${Date.now()}${ext}`;
            cb(null, nombre);
        }
    });

    return multer({ storage });
};

module.exports = getUploadMiddleware;
