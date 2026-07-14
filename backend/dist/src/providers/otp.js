// Mock OTP provider for development
class MockOTPProvider {
    async send(phone, otp) {
        console.log(`[Mock] Sending OTP ${otp} to ${phone}`);
    }
}
// Example: Twilio provider (stub)
class TwilioOTPProvider {
    accountSid;
    authToken;
    from;
    constructor(config) {
        this.accountSid = config.accountSid;
        this.authToken = config.authToken;
        this.from = config.from;
    }
    async send(phone, otp) {
        // Implement Twilio integration here
        console.log(`[Twilio] Would send OTP ${otp} to ${phone}`);
    }
}
// Example: MSG91 provider (stub)
class MSG91OTPProvider {
    apiKey;
    senderId;
    constructor(config) {
        this.apiKey = config.apiKey;
        this.senderId = config.senderId;
    }
    async send(phone, otp) {
        // Implement MSG91 integration here
        console.log(`[MSG91] Would send OTP ${otp} to ${phone}`);
    }
}
// Example: WhatsApp Cloud API provider (stub)
class WhatsAppOTPProvider {
    apiKey;
    from;
    constructor(config) {
        this.apiKey = config.apiKey;
        this.from = config.from;
    }
    async send(phone, otp) {
        // Implement WhatsApp integration here
        console.log(`[WhatsApp] Would send OTP ${otp} to ${phone}`);
    }
}
export function createOTPProvider(settings) {
    const getSetting = (key) => settings.find(s => s.key === key)?.value;
    const providerType = getSetting("OTP_PROVIDER") || "mock";
    switch (providerType) {
        case "twilio":
            return new TwilioOTPProvider({
                accountSid: getSetting("TWILIO_ACCOUNT_SID"),
                authToken: getSetting("TWILIO_AUTH_TOKEN"),
                from: getSetting("TWILIO_FROM"),
            });
        case "msg91":
            return new MSG91OTPProvider({
                apiKey: getSetting("MSG91_API_KEY"),
                senderId: getSetting("MSG91_SENDER_ID"),
            });
        case "whatsapp":
            return new WhatsAppOTPProvider({
                apiKey: getSetting("WHATSAPP_API_KEY"),
                from: getSetting("WHATSAPP_FROM"),
            });
        default:
            return new MockOTPProvider();
    }
}
export function generateOTP(length = 6) {
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10).toString();
    }
    return otp;
}
