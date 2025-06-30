"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveFileToCorrectDirectory = exports.processUploadRequest = exports.createFileUploadConfig = exports.createUploadDirectories = void 0;
const multer_1 = require("multer");
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
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
            cb(null, './uploads/images');
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
const moveFileToCorrectDirectory = (file, uploadType) => {
    if (uploadType === 'avatar') {
        const oldPath = file.path;
        const newPath = path.join('./uploads/avatars', path.basename(file.filename));
        try {
            fs.renameSync(oldPath, newPath);
            file.path = newPath;
            console.log(`Avatar file moved from ${oldPath} to ${newPath}`);
        }
        catch (error) {
            console.error('Error moving avatar file:', error);
            throw new common_1.BadRequestException('Failed to process avatar upload');
        }
    }
    else if (file.mimetype.startsWith('video/')) {
        const oldPath = file.path;
        const newPath = path.join('./uploads/videos', path.basename(file.filename));
        try {
            fs.renameSync(oldPath, newPath);
            file.path = newPath;
            console.log(`Video file moved from ${oldPath} to ${newPath}`);
        }
        catch (error) {
            console.error('Error moving video file:', error);
            throw new common_1.BadRequestException('Failed to process video upload');
        }
    }
};
exports.moveFileToCorrectDirectory = moveFileToCorrectDirectory;
//# sourceMappingURL=upload-config.helper.js.map