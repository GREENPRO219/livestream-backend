import { diskStorage } from 'multer';
import * as fs from 'fs';

export const createUploadDirectories = () => {
  const directories = ['./uploads', './uploads/avatars', './uploads/images', './uploads/videos'];
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

export const createFileUploadConfig = () => ({
  storage: diskStorage({
    destination: (req, file, cb) => {
      // Get type from form data
      const type = req.body?.type;
      
      // If it's an avatar upload, use avatars folder
      if (type === 'avatar') {
        cb(null, './uploads/avatars');
      } else {
        // Determine destination based on file MIME type
        if (file.mimetype.startsWith('video/')) {
          cb(null, './uploads/videos');
        } else {
          cb(null, './uploads/images');
        }
      }
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 500 * 1024 * 1024, // 100MB limit
  },
});

export const processUploadRequest = (req: any) => {
  const type = req.body?.type;
  const allowedTypes = ['avatar'];
  const uploadType = allowedTypes.includes(type) ? type : undefined;
  
  console.log('Request body:', req.body);
  console.log('Type from body:', type);
  console.log('Upload type:', uploadType);
  
  return uploadType;
}; 