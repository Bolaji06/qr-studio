import type { QRCodeType, QRCustomization, QRPayloadMap, ValidationResult } from '../types';
import { normalizeUrl } from './qr-encoder';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d][\d\s\-().]{4,20}$/;
const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function isValidHttpUrl(raw: string): boolean {
  try {
    const url = new URL(normalizeUrl(raw));
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.includes('.');
  } catch {
    return false;
  }
}

export function isValidHexColor(color: string): boolean {
  return HEX_COLOR_REGEX.test(color.trim());
}

export function validateQRPayload<T extends QRCodeType>(
  type: T,
  payload: QRPayloadMap[T],
): ValidationResult {
  const errors: Record<string, string> = {};

  switch (type) {
    case 'url': {
      const p = payload as QRPayloadMap['url'];
      if (!p.url.trim()) {
        errors.url = 'Website URL is required.';
      } else if (!isValidHttpUrl(p.url)) {
        errors.url = 'Enter a valid URL (e.g. https://example.com).';
      }
      break;
    }
    case 'text': {
      const p = payload as QRPayloadMap['text'];
      if (!p.text.trim()) {
        errors.text = 'Text content cannot be empty.';
      } else if (p.text.length > 2000) {
        errors.text = 'Text must be 2000 characters or fewer for reliable scanning.';
      }
      break;
    }
    case 'email': {
      const p = payload as QRPayloadMap['email'];
      if (!p.email.trim()) {
        errors.email = 'Email address is required.';
      } else if (!EMAIL_REGEX.test(p.email.trim())) {
        errors.email = 'Enter a valid email address.';
      }
      break;
    }
    case 'phone': {
      const p = payload as QRPayloadMap['phone'];
      if (!p.phone.trim()) {
        errors.phone = 'Phone number is required.';
      } else if (!PHONE_REGEX.test(p.phone.trim())) {
        errors.phone = 'Enter a valid phone number (e.g. +1 555 123 4567).';
      }
      break;
    }
    case 'sms': {
      const p = payload as QRPayloadMap['sms'];
      if (!p.phone.trim()) {
        errors.phone = 'Phone number is required.';
      } else if (!PHONE_REGEX.test(p.phone.trim())) {
        errors.phone = 'Enter a valid phone number.';
      }
      break;
    }
    case 'wifi': {
      const p = payload as QRPayloadMap['wifi'];
      if (!p.ssid.trim()) {
        errors.ssid = 'Network name (SSID) is required.';
      }
      if (p.encryption !== 'nopass' && p.password.length < 4) {
        errors.password = 'Password must be at least 4 characters for secured networks.';
      }
      break;
    }
    case 'vcard': {
      const p = payload as QRPayloadMap['vcard'];
      if (!p.fullName.trim()) {
        errors.fullName = 'Full name is required.';
      }
      if (p.email.trim() && !EMAIL_REGEX.test(p.email.trim())) {
        errors.email = 'Enter a valid email address.';
      }
      if (p.phone.trim() && !PHONE_REGEX.test(p.phone.trim())) {
        errors.phone = 'Enter a valid phone number.';
      }
      if (p.website.trim() && !isValidHttpUrl(p.website)) {
        errors.website = 'Enter a valid website URL.';
      }
      break;
    }
    case 'whatsapp': {
      const p = payload as QRPayloadMap['whatsapp'];
      const digits = p.phone.replace(/[^\d]/g, '');
      if (!p.phone.trim()) {
        errors.phone = 'WhatsApp phone number with country code is required.';
      } else if (digits.length < 7 || digits.length > 15) {
        errors.phone = 'Include a valid country code and phone number (7–15 digits).';
      }
      break;
    }
    case 'instagram':
    case 'facebook':
    case 'linkedin': {
      const p = payload as QRPayloadMap['instagram'];
      if (!p.username.trim()) {
        errors.username = 'Username or profile URL is required.';
      }
      break;
    }
    case 'location': {
      const p = payload as QRPayloadMap['location'];
      if (p.mode === 'coordinates') {
        const lat = Number(p.latitude);
        const lng = Number(p.longitude);
        if (!p.latitude.trim() || Number.isNaN(lat) || lat < -90 || lat > 90) {
          errors.latitude = 'Enter a valid latitude (-90 to 90).';
        }
        if (!p.longitude.trim() || Number.isNaN(lng) || lng < -180 || lng > 180) {
          errors.longitude = 'Enter a valid longitude (-180 to 180).';
        }
      } else {
        if (!p.query.trim()) {
          errors.query = 'Enter an address, place name, or Google Maps link.';
        }
      }
      break;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

function expandHex(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function getRelativeLuminance(hex: string): number {
  const [r, g, b] = expandHex(hex).map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(fgHex: string, bgHex: string): number {
  if (!isValidHexColor(fgHex) || !isValidHexColor(bgHex)) return 21;
  const l1 = getRelativeLuminance(fgHex);
  const l2 = getRelativeLuminance(bgHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getReadabilityWarnings(customization: QRCustomization): string[] {
  const warnings: string[] = [];

  if (!customization.transparentBackground) {
    const ratio = getContrastRatio(
      customization.foregroundColor,
      customization.backgroundColor,
    );
    if (ratio < 3.0) {
      warnings.push(
        'Low contrast between foreground and background colours may prevent scanners from reading this QR code.',
      );
    }
  } else {
    warnings.push(
      'Transparent background enabled — ensure the surface you place this QR code on provides strong contrast.',
    );
  }

  if (customization.logoDataUrl && customization.logoSize > 0.36) {
    warnings.push(
      'Large logo size may cover too many data modules. Keep logo size around 30% or lower and test scanning.',
    );
  }

  if (customization.margin < 4) {
    warnings.push(
      'A very small quiet-zone margin can make scanning harder on some devices.',
    );
  }

  return warnings;
}
