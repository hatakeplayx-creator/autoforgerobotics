import type { JsonValue } from "../mongodb/models.js";

interface Setting {
  key: string;
  value: JsonValue;
}

export interface OTPProvider {
  send(phone: string, otp: string): Promise<void>;
}

// Mock OTP provider for development
class MockOTPProvider implements OTPProvider {
  async send(phone: string, otp: string): Promise<void> {
    console.log(`[Mock] Sending OTP ${otp} to ${phone}`);
  }
}

// Example: Twilio provider (stub)
class TwilioOTPProvider implements OTPProvider {
  private accountSid: string;
  private authToken: string;
  private from: string;

  constructor(config: { accountSid: string; authToken: string; from: string }) {
    this.accountSid = config.accountSid;
    this.authToken = config.authToken;
    this.from = config.from;
  }

  async send(phone: string, otp: string): Promise<void> {
    // Implement Twilio integration here
    console.log(`[Twilio] Would send OTP ${otp} to ${phone}`);
  }
}

// Example: MSG91 provider (stub)
class MSG91OTPProvider implements OTPProvider {
  private apiKey: string;
  private senderId: string;

  constructor(config: { apiKey: string; senderId: string }) {
    this.apiKey = config.apiKey;
    this.senderId = config.senderId;
  }

  async send(phone: string, otp: string): Promise<void> {
    // Implement MSG91 integration here
    console.log(`[MSG91] Would send OTP ${otp} to ${phone}`);
  }
}

// Example: WhatsApp Cloud API provider (stub)
class WhatsAppOTPProvider implements OTPProvider {
  private apiKey: string;
  private from: string;

  constructor(config: { apiKey: string; from: string }) {
    this.apiKey = config.apiKey;
    this.from = config.from;
  }

  async send(phone: string, otp: string): Promise<void> {
    // Implement WhatsApp integration here
    console.log(`[WhatsApp] Would send OTP ${otp} to ${phone}`);
  }
}

export function createOTPProvider(settings: Setting[]): OTPProvider {
  const getSetting = (key: string): JsonValue | undefined => settings.find(s => s.key === key)?.value;

  const providerType = getSetting("OTP_PROVIDER") || "mock";

  switch (providerType) {
    case "twilio":
      return new TwilioOTPProvider({
        accountSid: String(getSetting("TWILIO_ACCOUNT_SID") ?? ""),
        authToken: String(getSetting("TWILIO_AUTH_TOKEN") ?? ""),
        from: String(getSetting("TWILIO_FROM") ?? ""),
      });
    case "msg91":
      return new MSG91OTPProvider({
        apiKey: String(getSetting("MSG91_API_KEY") ?? ""),
        senderId: String(getSetting("MSG91_SENDER_ID") ?? ""),
      });
    case "whatsapp":
      return new WhatsAppOTPProvider({
        apiKey: String(getSetting("WHATSAPP_API_KEY") ?? ""),
        from: String(getSetting("WHATSAPP_FROM") ?? ""),
      });
    default:
      return new MockOTPProvider();
  }
}

export function generateOTP(length: number = 6): string {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}
