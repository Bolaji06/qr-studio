import { describe, expect, it } from 'vitest';
import { DEFAULT_CUSTOMIZATION } from '../qr-constants';
import {
  getContrastRatio,
  getReadabilityWarnings,
  validateQRPayload,
} from '../validators';

describe('validateQRPayload', () => {
  it('validates URLs', () => {
    expect(validateQRPayload('url', { url: '' }).isValid).toBe(false);
    expect(validateQRPayload('url', { url: 'not-a-url' }).isValid).toBe(false);
    expect(validateQRPayload('url', { url: 'example.com' }).isValid).toBe(true);
  });

  it('validates Wi-Fi credentials', () => {
    expect(
      validateQRPayload('wifi', {
        ssid: '',
        password: '123',
        encryption: 'WPA',
        hidden: false,
      }).isValid,
    ).toBe(false);

    expect(
      validateQRPayload('wifi', {
        ssid: 'Guest',
        password: '',
        encryption: 'nopass',
        hidden: false,
      }).isValid,
    ).toBe(true);
  });

  it('validates GPS coordinates', () => {
    expect(
      validateQRPayload('location', {
        mode: 'coordinates',
        latitude: '95',
        longitude: '0',
        query: '',
      }).isValid,
    ).toBe(false);

    expect(
      validateQRPayload('location', {
        mode: 'coordinates',
        latitude: '37.77',
        longitude: '-122.41',
        query: '',
      }).isValid,
    ).toBe(true);
  });
});

describe('getContrastRatio and getReadabilityWarnings', () => {
  it('computes high contrast for black on white', () => {
    expect(getContrastRatio('#000000', '#ffffff')).toBeGreaterThan(20);
  });

  it('warns on low contrast colours', () => {
    const warnings = getReadabilityWarnings({
      ...DEFAULT_CUSTOMIZATION,
      foregroundColor: '#e2e8f0',
      backgroundColor: '#ffffff',
    });
    expect(warnings.some((w) => w.includes('Low contrast'))).toBe(true);
  });
});
