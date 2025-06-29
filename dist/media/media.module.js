"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaModule = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const media_controller_1 = require("./media.controller");
const media_service_1 = require("./media.service");
const media_entity_1 = require("./entities/media.entity");
const multer_1 = require("multer");
const path_1 = require("path");
let MediaModule = class MediaModule {
};
exports.MediaModule = MediaModule;
exports.MediaModule = MediaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([media_entity_1.Media]),
            platform_express_1.MulterModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    storage: (0, multer_1.diskStorage)({
                        destination: (req, file, cb) => {
                            const type = file.mimetype.startsWith('video/') ? 'videos' : 'images';
                            cb(null, `uploads/${type}`);
                        },
                        filename: (req, file, cb) => {
                            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                            cb(null, `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
                        },
                    }),
                    fileFilter: (req, file, cb) => {
                        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
                            cb(null, true);
                        }
                        else {
                            cb(new Error('Only images and videos are allowed'), false);
                        }
                    },
                    limits: {
                        fileSize: 1024 * 1024 * 100,
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [media_controller_1.MediaController],
        providers: [media_service_1.MediaService],
        exports: [media_service_1.MediaService],
    })
], MediaModule);
//# sourceMappingURL=media.module.js.map