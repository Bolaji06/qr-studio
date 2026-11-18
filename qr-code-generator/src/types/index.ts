import type {
  CornerDotType,
  CornerSquareType,
  DotType,
  ErrorCorrectionLevel,
} from 'qr-code-styling';

export type QRCodeType =
  | 'url'
  | 'text'
  | 'email'
  | 'phone'
  | 'sms'
  | 'wifi'
  | 'vcard'
  | 'whatsapp'
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'location';

export interface UrlPayload {
  url: string;
}

export interface TextPayload {
  text: string;
}

export interface EmailPayload {
  email: string;
  subject: string;
  body: string;
}

export interface PhonePayload {
  phone: string;
}

export interface SmsPayload {
  phone: string;
  message: string;
}

export type WifiEncryption = 'WPA' | 'WEP' | 'nopass';

export interface WifiPayload {
  ssid: string;
  password: string;
  encryption: WifiEncryption;
  hidden: boolean;
}

export interface VCardPayload {
  fullName: string;
  phone: string;
  email: string;
  organization: string;
  website: string;
}

export interface WhatsappPayload {
  phone: string;
  message: string;
}

export interface SocialPayload {
  username: string;
}

export interface LocationPayload {
  mode: 'coordinates' | 'query';
  latitude: string;
  longitude: string;
  query: string;
}

export interface QRPayloadMap {
  url: UrlPayload;
  text: TextPayload;
  email: EmailPayload;
  phone: PhonePayload;
  sms: SmsPayload;
  wifi: WifiPayload;
  vcard: VCardPayload;
  whatsapp: WhatsappPayload;
  instagram: SocialPayload;
  facebook: SocialPayload;
  linkedin: SocialPayload;
  location: LocationPayload;
}

export type AnyQRPayload = QRPayloadMap[QRCodeType];

export type SupportedDotType = Extract<
  DotType,
  'square' | 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'extra-rounded'
>;

export type SupportedCornerSquareType = Extract<
  CornerSquareType,
  'square' | 'dot' | 'extra-rounded'
>;

export type SupportedCornerDotType = Extract<CornerDotType, 'square' | 'dot'>;

export interface QRCustomization {
  foregroundColor: string;
  backgroundColor: string;
  transparentBackground: boolean;
  dotType: SupportedDotType;
  cornerSquareType: SupportedCornerSquareType;
  cornerDotType: SupportedCornerDotType;
  size: number;
  margin: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  logoDataUrl?: string;
  logoSize: number;
}

export interface SavedQRCode<T extends QRCodeType = QRCodeType> {
  id: string;
  name: string;
  type: T;
  payload: QRPayloadMap[T];
  customization: QRCustomization;
  createdAt: string;
  updatedAt: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
