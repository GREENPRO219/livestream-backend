import { Injectable, Logger } from '@nestjs/common';
import Client, { SendMessageWithTemplateRequest } from '@alicloud/dysmsapi20180501';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';

@Injectable()
export class SmsService {
  private client: Client | null = null;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    
    // Only initialize client if credentials are available
    if (process.env.ALIBABA_CLOUD_ACCESS_KEY_ID && process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET) {
      const config = new $OpenApi.Config({
        accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID,
        accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET,
      });
      config.endpoint = 'dysmsapi.aliyuncs.com';
      this.client = new Client(config);
    } else {
      Logger.warn('Alibaba Cloud SMS credentials not configured. SMS will be logged instead of sent.');
    }
  }

  async sendCode(phone: string, code: string): Promise<boolean> {
    // Development fallback: log the code instead of sending SMS
    if (!this.client || this.isDevelopment) {
      Logger.log(`[DEV] SMS Code for ${phone}: ${code}`);
      return true;
    }

    const signName = process.env.ALIBABA_SMS_SIGN_NAME || '';
    const templateCode = process.env.ALIBABA_SMS_TEMPLATE_CODE || '';
    
    if (!signName || !templateCode) {
      Logger.error('SMS sign name or template code not configured');
      return false;
    }

    const params = new SendMessageWithTemplateRequest({
      from: signName,
      templateCode: templateCode,
      templateParam: JSON.stringify({ code }),
      to: phone,
    });
    const runtime = new $Util.RuntimeOptions({});
    try {
      const response = await this.client.sendMessageWithTemplateWithOptions(params, runtime);
      if (response.body.responseCode === 'OK') {
        Logger.log(`SMS sent to ${phone}`);
        return true;
      } else {
        Logger.error(`Failed to send SMS: ${JSON.stringify(response.body)}`);
        return false;
      }
    } catch (error) {
      Logger.error(`SMS sending error: ${error}`);
      return false;
    }
  }
} 