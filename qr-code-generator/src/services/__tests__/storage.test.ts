import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_CUSTOMIZATION } from '../../lib/qr-constants';
import {
  deleteSavedQRCode,
  getSavedQRCodes,
  renameSavedQRCode,
  saveQRCode,
} from '../storage';

function createMockLocalStorage() {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
}

describe('storage service', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: createMockLocalStorage(),
      configurable: true,
    });
  });

  it('saves, lists, renames, and deletes QR codes', () => {
    const { record, logoOmitted } = saveQRCode({
      name: 'My Site',
      type: 'url',
      payload: { url: 'https://example.com' },
      customization: DEFAULT_CUSTOMIZATION,
    });

    expect(logoOmitted).toBe(false);
    expect(getSavedQRCodes()).toHaveLength(1);

    const renamed = renameSavedQRCode(record.id, 'Updated Site');
    expect(renamed?.name).toBe('Updated Site');
    expect(getSavedQRCodes()[0].name).toBe('Updated Site');

    expect(deleteSavedQRCode(record.id)).toBe(true);
    expect(getSavedQRCodes()).toHaveLength(0);
  });

  it('omits oversized logos from localStorage', () => {
    const hugeLogo = 'data:image/png;base64,' + 'A'.repeat(120_000);
    const { record, logoOmitted } = saveQRCode({
      name: 'Logo QR',
      type: 'url',
      payload: { url: 'https://example.com' },
      customization: { ...DEFAULT_CUSTOMIZATION, logoDataUrl: hugeLogo },
    });

    expect(logoOmitted).toBe(true);
    expect(record.customization.logoDataUrl).toBeUndefined();
  });

  it('handles malformed localStorage JSON gracefully', () => {
    localStorage.setItem('qr_studio_saved_codes_v1', '{not valid json');
    expect(getSavedQRCodes()).toEqual([]);
  });
});
