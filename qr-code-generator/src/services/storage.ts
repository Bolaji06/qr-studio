import type { QRCodeType, QRCustomization, QRPayloadMap, SavedQRCode } from '../types';

const STORAGE_KEY = 'qr_studio_saved_codes_v1';
const MAX_LOGO_DATA_URL_LENGTH = 100_000; // ~100 KB cap for localStorage hygiene

export interface SaveQRResult {
  record: SavedQRCode;
  logoOmitted: boolean;
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `qr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function getSavedQRCodes(): SavedQRCode[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is SavedQRCode =>
        Boolean(item) &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.type === 'string' &&
        typeof item.payload === 'object' &&
        typeof item.customization === 'object' &&
        typeof item.createdAt === 'string',
    );
  } catch {
    return [];
  }
}

function writeSavedQRCodes(records: SavedQRCode[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    throw new Error(
      err instanceof DOMException && err.name === 'QuotaExceededError'
        ? 'Browser storage quota exceeded. Delete older QR codes or remove large logos before saving.'
        : 'Unable to save QR code to browser storage.',
    );
  }
}

export function saveQRCode<T extends QRCodeType>(input: {
  id?: string;
  name: string;
  type: T;
  payload: QRPayloadMap[T];
  customization: QRCustomization;
}): SaveQRResult {
  const existing = getSavedQRCodes();
  const now = new Date().toISOString();

  let logoOmitted = false;
  const sanitizedCustomization: QRCustomization = { ...input.customization };
  if (
    sanitizedCustomization.logoDataUrl &&
    sanitizedCustomization.logoDataUrl.length > MAX_LOGO_DATA_URL_LENGTH
  ) {
    delete sanitizedCustomization.logoDataUrl;
    logoOmitted = true;
  }

  const trimmedName = input.name.trim() || `QR Code (${input.type.toUpperCase()})`;

  if (input.id) {
    const idx = existing.findIndex((item) => item.id === input.id);
    if (idx !== -1) {
      const updated: SavedQRCode<T> = {
        ...existing[idx],
        name: trimmedName,
        type: input.type,
        payload: input.payload,
        customization: sanitizedCustomization,
        updatedAt: now,
      };
      const next = [...existing];
      next[idx] = updated;
      writeSavedQRCodes(next);
      return { record: updated, logoOmitted };
    }
  }

  const created: SavedQRCode<T> = {
    id: generateId(),
    name: trimmedName,
    type: input.type,
    payload: input.payload,
    customization: sanitizedCustomization,
    createdAt: now,
    updatedAt: now,
  };

  writeSavedQRCodes([created, ...existing]);
  return { record: created, logoOmitted };
}

export function getSavedQRCodeById(id: string): SavedQRCode | undefined {
  return getSavedQRCodes().find((item) => item.id === id);
}

export function renameSavedQRCode(id: string, newName: string): SavedQRCode | null {
  const trimmed = newName.trim();
  if (!trimmed) return null;

  const existing = getSavedQRCodes();
  const idx = existing.findIndex((item) => item.id === id);
  if (idx === -1) return null;

  const updated: SavedQRCode = {
    ...existing[idx],
    name: trimmed,
    updatedAt: new Date().toISOString(),
  };
  const next = [...existing];
  next[idx] = updated;
  writeSavedQRCodes(next);
  return updated;
}

export function deleteSavedQRCode(id: string): boolean {
  const existing = getSavedQRCodes();
  const next = existing.filter((item) => item.id !== id);
  if (next.length === existing.length) return false;
  writeSavedQRCodes(next);
  return true;
}
