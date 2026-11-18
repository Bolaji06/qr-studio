import type {
  QRCodeType,
  QRCustomization,
  QRPayloadMap,
  SupportedCornerDotType,
  SupportedCornerSquareType,
  SupportedDotType,
} from '../types';

export interface QRTypeMeta {
  type: QRCodeType;
  label: string;
  shortLabel: string;
  description: string;
}

export const QR_TYPE_METADATA: QRTypeMeta[] = [
  {
    type: 'url',
    label: 'Website URL',
    shortLabel: 'URL',
    description: 'Link to any website or landing page',
  },
  {
    type: 'text',
    label: 'Plain Text',
    shortLabel: 'Text',
    description: 'Encode any custom message or note',
  },
  {
    type: 'wifi',
    label: 'Wi-Fi Network',
    shortLabel: 'Wi-Fi',
    description: 'Share network credentials for instant join',
  },
  {
    type: 'vcard',
    label: 'Contact (vCard)',
    shortLabel: 'Contact',
    description: 'Digital business card with contact details',
  },
  {
    type: 'email',
    label: 'Email Address',
    shortLabel: 'Email',
    description: 'Pre-filled email recipient, subject, and body',
  },
  {
    type: 'phone',
    label: 'Phone Number',
    shortLabel: 'Phone',
    description: 'One-tap phone call trigger',
  },
  {
    type: 'sms',
    label: 'SMS Message',
    shortLabel: 'SMS',
    description: 'Pre-filled text message to a phone number',
  },
  {
    type: 'whatsapp',
    label: 'WhatsApp Link',
    shortLabel: 'WhatsApp',
    description: 'Start a WhatsApp chat with optional message',
  },
  {
    type: 'instagram',
    label: 'Instagram',
    shortLabel: 'Instagram',
    description: 'Link directly to an Instagram profile',
  },
  {
    type: 'facebook',
    label: 'Facebook',
    shortLabel: 'Facebook',
    description: 'Link directly to a Facebook page or profile',
  },
  {
    type: 'linkedin',
    label: 'LinkedIn',
    shortLabel: 'LinkedIn',
    description: 'Link directly to a LinkedIn profile',
  },
  {
    type: 'location',
    label: 'Google Maps',
    shortLabel: 'Location',
    description: 'Share GPS coordinates or a map search',
  },
];

export const DEFAULT_PAYLOADS: { [K in QRCodeType]: QRPayloadMap[K] } = {
  url: { url: '' },
  text: { text: '' },
  email: { email: '', subject: '', body: '' },
  phone: { phone: '' },
  sms: { phone: '', message: '' },
  wifi: { ssid: '', password: '', encryption: 'WPA', hidden: false },
  vcard: { fullName: '', phone: '', email: '', organization: '', website: '' },
  whatsapp: { phone: '', message: '' },
  instagram: { username: '' },
  facebook: { username: '' },
  linkedin: { username: '' },
  location: { mode: 'coordinates', latitude: '', longitude: '', query: '' },
};

export const DEFAULT_CUSTOMIZATION: QRCustomization = {
  foregroundColor: '#0f172a',
  backgroundColor: '#ffffff',
  transparentBackground: false,
  dotType: 'square',
  cornerSquareType: 'square',
  cornerDotType: 'square',
  size: 300,
  margin: 12,
  errorCorrectionLevel: 'M',
  logoDataUrl: undefined,
  logoSize: 0.3,
};

export const DOT_TYPE_OPTIONS: { value: SupportedDotType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dots', label: 'Dots' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy Rounded' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
];

export const CORNER_SQUARE_OPTIONS: { value: SupportedCornerSquareType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
];

export const CORNER_DOT_OPTIONS: { value: SupportedCornerDotType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot' },
];
