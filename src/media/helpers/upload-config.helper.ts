import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

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
      // Default to images folder - we'll move the file later if needed
      cb(null, './uploads/images');
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

export const moveFileToCorrectDirectory = (file: Express.Multer.File, uploadType?: string) => {
  if (uploadType === 'avatar') {
    const oldPath = file.path;
    const newPath = path.join('./uploads/avatars', path.basename(file.filename));
    
    try {
      fs.renameSync(oldPath, newPath);
      file.path = newPath;
      console.log(`Avatar file moved from ${oldPath} to ${newPath}`);
    } catch (error) {
      console.error('Error moving avatar file:', error);
      throw new BadRequestException('Failed to process avatar upload');
    }
  } else if (file.mimetype.startsWith('video/')) {
    const oldPath = file.path;
    const newPath = path.join('./uploads/videos', path.basename(file.filename));
    
    try {
      fs.renameSync(oldPath, newPath);
      file.path = newPath;
      console.log(`Video file moved from ${oldPath} to ${newPath}`);
    } catch (error) {
      console.error('Error moving video file:', error);
      throw new BadRequestException('Failed to process video upload');
    }
  }
}; 