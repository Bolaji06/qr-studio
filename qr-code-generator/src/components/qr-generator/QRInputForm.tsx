import type { QRCodeType, QRPayloadMap, WifiEncryption } from '../../types';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';

interface QRInputFormProps<T extends QRCodeType> {
  type: T;
  payload: QRPayloadMap[T];
  errors: Record<string, string>;
  showErrors: boolean;
  onChange: (updated: QRPayloadMap[T]) => void;
}

export function QRInputForm<T extends QRCodeType>({
  type,
  payload,
  errors,
  showErrors,
  onChange,
}: QRInputFormProps<T>) {
  const err = (field: string) => (showErrors ? errors[field] : undefined);

  switch (type) {
    case 'url': {
      const p = payload as QRPayloadMap['url'];
      return (
        <Input
          label="Website URL"
          type="url"
          placeholder="https://example.com"
          required
          value={p.url}
          error={err('url')}
          hint="If you omit https://, it will be added automatically."
          onChange={(e) =>
            onChange({ ...p, url: e.target.value } as QRPayloadMap[T])
          }
        />
      );
    }

    case 'text': {
      const p = payload as QRPayloadMap['text'];
      return (
        <Textarea
          label="Plain Text"
          rows={4}
          placeholder="Enter any message, note, or code..."
          required
          value={p.text}
          error={err('text')}
          hint={`${p.text.length}/2000 characters`}
          onChange={(e) =>
            onChange({ ...p, text: e.target.value } as QRPayloadMap[T])
          }
        />
      );
    }

    case 'email': {
      const p = payload as QRPayloadMap['email'];
      return (
        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="hello@example.com"
            required
            value={p.email}
            error={err('email')}
            onChange={(e) =>
              onChange({ ...p, email: e.target.value } as QRPayloadMap[T])
            }
          />
          <Input
            label="Subject (optional)"
            placeholder="Inquiry from QR code"
            value={p.subject}
            onChange={(e) =>
              onChange({ ...p, subject: e.target.value } as QRPayloadMap[T])
            }
          />
          <Textarea
            label="Message Body (optional)"
            rows={3}
            placeholder="Hi there, I scanned your QR code..."
            value={p.body}
            onChange={(e) =>
              onChange({ ...p, body: e.target.value } as QRPayloadMap[T])
            }
          />
        </div>
      );
    }

    case 'phone': {
      const p = payload as QRPayloadMap['phone'];
      return (
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 555 123 4567"
          required
          value={p.phone}
          error={err('phone')}
          hint="Include country code for international dialing."
          onChange={(e) =>
            onChange({ ...p, phone: e.target.value } as QRPayloadMap[T])
          }
        />
      );
    }

    case 'sms': {
      const p = payload as QRPayloadMap['sms'];
      return (
        <div className="space-y-4">
          <Input
            label="Recipient Phone Number"
            type="tel"
            placeholder="+1 555 123 4567"
            required
            value={p.phone}
            error={err('phone')}
            onChange={(e) =>
              onChange({ ...p, phone: e.target.value } as QRPayloadMap[T])
            }
          />
          <Textarea
            label="Prefilled Message (optional)"
            rows={3}
            placeholder="Hello! Please send me more info."
            value={p.message}
            onChange={(e) =>
              onChange({ ...p, message: e.target.value } as QRPayloadMap[T])
            }
          />
        </div>
      );
    }

    case 'wifi': {
      const p = payload as QRPayloadMap['wifi'];
      return (
        <div className="space-y-4">
          <Input
            label="Network Name (SSID)"
            placeholder="Office_Guest_WiFi"
            required
            value={p.ssid}
            error={err('ssid')}
            onChange={(e) =>
              onChange({ ...p, ssid: e.target.value } as QRPayloadMap[T])
            }
          />
          <Select
            label="Security Type"
            value={p.encryption}
            options={[
              { value: 'WPA', label: 'WPA / WPA2 / WPA3' },
              { value: 'WEP', label: 'WEP' },
              { value: 'nopass', label: 'None (Open Network)' },
            ]}
            onChange={(e) =>
              onChange({
                ...p,
                encryption: e.target.value as WifiEncryption,
              } as QRPayloadMap[T])
            }
          />
          {p.encryption !== 'nopass' && (
            <Input
              label="Password"
              type="text"
              placeholder="Network password"
              required
              value={p.password}
              error={err('password')}
              onChange={(e) =>
                onChange({ ...p, password: e.target.value } as QRPayloadMap[T])
              }
            />
          )}
          <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={p.hidden}
              onChange={(e) =>
                onChange({ ...p, hidden: e.target.checked } as QRPayloadMap[T])
              }
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Hidden network
          </label>
        </div>
      );
    }

    case 'vcard': {
      const p = payload as QRPayloadMap['vcard'];
      return (
        <div className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Jane Doe"
            required
            value={p.fullName}
            error={err('fullName')}
            onChange={(e) =>
              onChange({ ...p, fullName: e.target.value } as QRPayloadMap[T])
            }
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 555 123 4567"
              value={p.phone}
              error={err('phone')}
              onChange={(e) =>
                onChange({ ...p, phone: e.target.value } as QRPayloadMap[T])
              }
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="jane@company.com"
              value={p.email}
              error={err('email')}
              onChange={(e) =>
                onChange({ ...p, email: e.target.value } as QRPayloadMap[T])
              }
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Organisation"
              placeholder="Acme Corp"
              value={p.organization}
              onChange={(e) =>
                onChange({ ...p, organization: e.target.value } as QRPayloadMap[T])
              }
            />
            <Input
              label="Website"
              type="url"
              placeholder="https://acme.com"
              value={p.website}
              error={err('website')}
              onChange={(e) =>
                onChange({ ...p, website: e.target.value } as QRPayloadMap[T])
              }
            />
          </div>
        </div>
      );
    }

    case 'whatsapp': {
      const p = payload as QRPayloadMap['whatsapp'];
      return (
        <div className="space-y-4">
          <Input
            label="WhatsApp Phone Number"
            type="tel"
            placeholder="+1 555 123 4567"
            required
            value={p.phone}
            error={err('phone')}
            hint="Include country code (e.g. +44 or +1)."
            onChange={(e) =>
              onChange({ ...p, phone: e.target.value } as QRPayloadMap[T])
            }
          />
          <Textarea
            label="Prefilled Message (optional)"
            rows={3}
            placeholder="Hi! I'd like to ask about..."
            value={p.message}
            onChange={(e) =>
              onChange({ ...p, message: e.target.value } as QRPayloadMap[T])
            }
          />
        </div>
      );
    }

    case 'instagram': {
      const p = payload as QRPayloadMap['instagram'];
      return (
        <Input
          label="Instagram Username or Profile URL"
          placeholder="@yourhandle or https://instagram.com/yourhandle"
          required
          value={p.username}
          error={err('username')}
          onChange={(e) =>
            onChange({ ...p, username: e.target.value } as QRPayloadMap[T])
          }
        />
      );
    }

    case 'facebook': {
      const p = payload as QRPayloadMap['facebook'];
      return (
        <Input
          label="Facebook Username or Page URL"
          placeholder="yourpage or https://facebook.com/yourpage"
          required
          value={p.username}
          error={err('username')}
          onChange={(e) =>
            onChange({ ...p, username: e.target.value } as QRPayloadMap[T])
          }
        />
      );
    }

    case 'linkedin': {
      const p = payload as QRPayloadMap['linkedin'];
      return (
        <Input
          label="LinkedIn Handle or Profile URL"
          placeholder="jane-doe or https://linkedin.com/in/jane-doe"
          required
          value={p.username}
          error={err('username')}
          onChange={(e) =>
            onChange({ ...p, username: e.target.value } as QRPayloadMap[T])
          }
        />
      );
    }

    case 'location': {
      const p = payload as QRPayloadMap['location'];
      return (
        <div className="space-y-4">
          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() =>
                onChange({ ...p, mode: 'coordinates' } as QRPayloadMap[T])
              }
              className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                p.mode === 'coordinates'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              GPS Coordinates
            </button>
            <button
              type="button"
              onClick={() =>
                onChange({ ...p, mode: 'query' } as QRPayloadMap[T])
              }
              className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                p.mode === 'query'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Address / Maps Link
            </button>
          </div>

          {p.mode === 'coordinates' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Latitude"
                placeholder="37.7749"
                required
                value={p.latitude}
                error={err('latitude')}
                onChange={(e) =>
                  onChange({ ...p, latitude: e.target.value } as QRPayloadMap[T])
                }
              />
              <Input
                label="Longitude"
                placeholder="-122.4194"
                required
                value={p.longitude}
                error={err('longitude')}
                onChange={(e) =>
                  onChange({ ...p, longitude: e.target.value } as QRPayloadMap[T])
                }
              />
            </div>
          ) : (
            <Input
              label="Address, Place Name, or Google Maps URL"
              placeholder="1600 Amphitheatre Parkway, Mountain View"
              required
              value={p.query}
              error={err('query')}
              onChange={(e) =>
                onChange({ ...p, query: e.target.value } as QRPayloadMap[T])
              }
            />
          )}
        </div>
      );
    }
  }
}
