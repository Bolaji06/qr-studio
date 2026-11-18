import { describe, expect, it } from 'vitest';
import { encodeQRData, normalizeUrl } from '../qr-encoder';

describe('normalizeUrl', () => {
  it('prepends https:// when protocol is missing', () => {
    expect(normalizeUrl('example.com')).toBe('https://example.com');
  });

  it('preserves existing http/https protocols', () => {
    expect(normalizeUrl('http://example.com')).toBe('http://example.com');
    expect(normalizeUrl('https://example.com/path')).toBe(
      'https://example.com/path',
    );
  });
});

describe('encodeQRData', () => {
  it('encodes url', () => {
    expect(encodeQRData('url', { url: 'acme.com' })).toBe('https://acme.com');
  });

  it('encodes plain text', () => {
    expect(encodeQRData('text', { text: '  Hello World  ' })).toBe(
      'Hello World',
    );
  });

  it('encodes email with subject and body', () => {
    const res = encodeQRData('email', {
      email: 'hi@acme.com',
      subject: 'Hello',
      body: 'How are you?',
    });
    expect(res).toBe('mailto:hi@acme.com?subject=Hello&body=How+are+you%3F');
  });

  it('encodes phone and sms', () => {
    expect(encodeQRData('phone', { phone: '+1 555 1234' })).toBe(
      'tel:+15551234',
    );
    expect(
      encodeQRData('sms', { phone: '+1 555 1234', message: 'Hi!' }),
    ).toBe('SMSTO:+15551234:Hi!');
  });

  it('encodes wifi with special character escaping', () => {
    expect(
      encodeQRData('wifi', {
        ssid: 'My;Net:1',
        password: 'pass,word\\1',
        encryption: 'WPA',
        hidden: true,
      }),
    ).toBe('WIFI:T:WPA;S:My\\;Net\\:1;P:pass\\,word\\\\1;H:true;;');
  });

  it('encodes open wifi without password', () => {
    expect(
      encodeQRData('wifi', {
        ssid: 'Guest',
        password: 'ignored',
        encryption: 'nopass',
        hidden: false,
      }),
    ).toBe('WIFI:T:nopass;S:Guest;P:;H:false;;');
  });

  it('encodes vCard 3.0', () => {
    const vcard = encodeQRData('vcard', {
      fullName: 'Jane Doe',
      phone: '+15550100',
      email: 'jane@acme.com',
      organization: 'Acme, Inc.',
      website: 'acme.com',
    });
    expect(vcard).toContain('BEGIN:VCARD');
    expect(vcard).toContain('VERSION:3.0');
    expect(vcard).toContain('FN:Jane Doe');
    expect(vcard).toContain('ORG:Acme\\, Inc.');
    expect(vcard).toContain('URL:https://acme.com');
    expect(vcard).toContain('END:VCARD');
  });

  it('encodes whatsapp link', () => {
    expect(
      encodeQRData('whatsapp', { phone: '+1 (555) 234-5678', message: 'Hi!' }),
    ).toBe('https://wa.me/15552345678?text=Hi!');
  });

  it('encodes social profiles', () => {
    expect(encodeQRData('instagram', { username: '@mybrand' })).toBe(
      'https://www.instagram.com/mybrand',
    );
    expect(encodeQRData('facebook', { username: 'mybrand' })).toBe(
      'https://www.facebook.com/mybrand',
    );
    expect(encodeQRData('linkedin', { username: 'jane-doe' })).toBe(
      'https://www.linkedin.com/in/jane-doe',
    );
  });

  it('encodes location coordinates and queries', () => {
    expect(
      encodeQRData('location', {
        mode: 'coordinates',
        latitude: '37.7749',
        longitude: '-122.4194',
        query: '',
      }),
    ).toBe('https://maps.google.com/?q=37.7749,-122.4194');

    expect(
      encodeQRData('location', {
        mode: 'query',
        latitude: '',
        longitude: '',
        query: 'Golden Gate Bridge',
      }),
    ).toBe('https://maps.google.com/?q=Golden%20Gate%20Bridge');
  });
});
