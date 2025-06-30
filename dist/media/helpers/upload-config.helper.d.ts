export declare const createUploadDirectories: () => void;
export declare const createFileUploadConfig: () => {
    storage: any;
    limits: {
        fileSize: number;
    };
};
export declare const processUploadRequest: (req: any) => any;
export declare const moveFileToCorrectDirectory: (file: Express.Multer.File, uploadType?: string) => void;
