import type { QRCodeType, QRPayloadMap } from '../types';

function escapeWifiField(value: string): string {
  return value.replace(/([\\;,:])/g, '\\$1');
}

function escapeVCardField(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}

export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function extractSocialHandle(raw: string, platformDomain: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const cleaned = trimmed.replace(/^@+/, '');
  if (platformDomain === 'linkedin.com') {
    const path = cleaned.replace(/^in\//i, '');
    return `https://www.linkedin.com/in/${path}`;
  }
  return `https://www.${platformDomain}/${cleaned}`;
}

export function encodeQRData<T extends QRCodeType>(
  type: T,
  payload: QRPayloadMap[T],
): string {
  switch (type) {
    case 'url': {
      const p = payload as QRPayloadMap['url'];
      return normalizeUrl(p.url);
    }
    case 'text': {
      const p = payload as QRPayloadMap['text'];
      return p.text.trim();
    }
    case 'email': {
      const p = payload as QRPayloadMap['email'];
      const email = p.email.trim();
      const params = new URLSearchParams();
      if (p.subject.trim()) params.set('subject', p.subject.trim());
      if (p.body.trim()) params.set('body', p.body.trim());
      const query = params.toString();
      return query ? `mailto:${email}?${query}` : `mailto:${email}`;
    }
    case 'phone': {
      const p = payload as QRPayloadMap['phone'];
      return `tel:${p.phone.trim().replace(/\s+/g, '')}`;
    }
    case 'sms': {
      const p = payload as QRPayloadMap['sms'];
      const phone = p.phone.trim().replace(/\s+/g, '');
      const message = p.message.trim();
      return message ? `SMSTO:${phone}:${message}` : `SMSTO:${phone}`;
    }
    case 'wifi': {
      const p = payload as QRPayloadMap['wifi'];
      const ssid = escapeWifiField(p.ssid.trim());
      const password = p.encryption === 'nopass' ? '' : escapeWifiField(p.password);
      const hidden = p.hidden ? 'true' : 'false';
      return `WIFI:T:${p.encryption};S:${ssid};P:${password};H:${hidden};;`;
    }
    case 'vcard': {
      const p = payload as QRPayloadMap['vcard'];
      const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
      if (p.fullName.trim()) lines.push(`FN:${escapeVCardField(p.fullName.trim())}`);
      if (p.organization.trim()) lines.push(`ORG:${escapeVCardField(p.organization.trim())}`);
      if (p.phone.trim()) lines.push(`TEL;TYPE=CELL:${p.phone.trim()}`);
      if (p.email.trim()) lines.push(`EMAIL:${p.email.trim()}`);
      if (p.website.trim()) lines.push(`URL:${normalizeUrl(p.website)}`);
      lines.push('END:VCARD');
      return lines.join('\n');
    }
    case 'whatsapp': {
      const p = payload as QRPayloadMap['whatsapp'];
      const digits = p.phone.replace(/[^\d]/g, '');
      const message = p.message.trim();
      return message
        ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
        : `https://wa.me/${digits}`;
    }
    case 'instagram': {
      const p = payload as QRPayloadMap['instagram'];
      return extractSocialHandle(p.username, 'instagram.com');
    }
    case 'facebook': {
      const p = payload as QRPayloadMap['facebook'];
      return extractSocialHandle(p.username, 'facebook.com');
    }
    case 'linkedin': {
      const p = payload as QRPayloadMap['linkedin'];
      return extractSocialHandle(p.username, 'linkedin.com');
    }
    case 'location': {
      const p = payload as QRPayloadMap['location'];
      if (p.mode === 'query') {
        const q = p.query.trim();
        if (/^https?:\/\//i.test(q)) return q;
        return `https://maps.google.com/?q=${encodeURIComponent(q)}`;
      }
      const lat = p.latitude.trim();
      const lng = p.longitude.trim();
      return `https://maps.google.com/?q=${lat},${lng}`;
    }
  }
}
