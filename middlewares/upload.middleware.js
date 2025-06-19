const multer = require('multer');
const path  = require('path');
const fs    = require('fs');

const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext    = path.extname(file.originalname);
        const nombre = `curso-${req.params.id}-${Date.now()}${ext}`;
        cb(null, nombre);
    }
});

module.exports = multer({ storage });
