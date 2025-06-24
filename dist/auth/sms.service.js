"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const dysmsapi20180501_1 = require("@alicloud/dysmsapi20180501");
const $OpenApi = require("@alicloud/openapi-client");
const $Util = require("@alicloud/tea-util");
let SmsService = class SmsService {
    constructor() {
        this.client = null;
        this.isDevelopment = process.env.NODE_ENV === 'development';
        if (process.env.ALIBABA_CLOUD_ACCESS_KEY_ID && process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET) {
            const config = new $OpenApi.Config({
                accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID,
                accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET,
            });
            config.endpoint = 'dysmsapi.aliyuncs.com';
            this.client = new dysmsapi20180501_1.default(config);
        }
        else {
            common_1.Logger.warn('Alibaba Cloud SMS credentials not configured. SMS will be logged instead of sent.');
        }
    }
    async sendCode(phone, code) {
        if (!this.client || this.isDevelopment) {
            common_1.Logger.log(`[DEV] SMS Code for ${phone}: ${code}`);
            return true;
        }
        const signName = process.env.ALIBABA_SMS_SIGN_NAME || '';
        const templateCode = process.env.ALIBABA_SMS_TEMPLATE_CODE || '';
        if (!signName || !templateCode) {
            common_1.Logger.error('SMS sign name or template code not configured');
            return false;
        }
        const params = new dysmsapi20180501_1.SendMessageWithTemplateRequest({
            from: signName,
            templateCode: templateCode,
            templateParam: JSON.stringify({ code }),
            to: phone,
        });
        const runtime = new $Util.RuntimeOptions({});
        try {
            const response = await this.client.sendMessageWithTemplateWithOptions(params, runtime);
            if (response.body.responseCode === 'OK') {
                common_1.Logger.log(`SMS sent to ${phone}`);
                return true;
            }
            else {
                common_1.Logger.error(`Failed to send SMS: ${JSON.stringify(response.body)}`);
                return false;
            }
        }
        catch (error) {
            common_1.Logger.error(`SMS sending error: ${error}`);
            return false;
        }
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SmsService);
//# sourceMappingURL=sms.service.js.map