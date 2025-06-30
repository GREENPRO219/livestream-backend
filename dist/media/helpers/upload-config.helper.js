"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processUploadRequest = exports.createFileUploadConfig = exports.createUploadDirectories = void 0;
const multer_1 = require("multer");
const fs = require("fs");
const createUploadDirectories = () => {
    const directories = ['./uploads', './uploads/avatars', './uploads/images', './uploads/videos'];
    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};
exports.createUploadDirectories = createUploadDirectories;
const createFileUploadConfig = () => ({
    storage: (0, multer_1.diskStorage)({
        destination: (req, file, cb) => {
            const type = req.body?.type;
            if (type === 'avatar') {
                cb(null, './uploads/avatars');
            }
            else {
                if (file.mimetype.startsWith('video/')) {
                    cb(null, './uploads/videos');
                }
                else {
                    cb(null, './uploads/images');
                }
            }
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 500 * 1024 * 1024,
    },
});
exports.createFileUploadConfig = createFileUploadConfig;
const processUploadRequest = (req) => {
    const type = req.body?.type;
    const allowedTypes = ['avatar'];
    const uploadType = allowedTypes.includes(type) ? type : undefined;
    console.log('Request body:', req.body);
    console.log('Type from body:', type);
    console.log('Upload type:', uploadType);
    return uploadType;
};
exports.processUploadRequest = processUploadRequest;
//# sourceMappingURL=upload-config.helper.js.map