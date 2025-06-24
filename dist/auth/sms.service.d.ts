export declare class SmsService {
    private client;
    private isDevelopment;
    constructor();
    sendCode(phone: string, code: string): Promise<boolean>;
}
