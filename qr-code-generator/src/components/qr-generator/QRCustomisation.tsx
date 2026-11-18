import { AlertTriangle, ImagePlus, RotateCcw, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import {
  CORNER_DOT_OPTIONS,
  CORNER_SQUARE_OPTIONS,
  DOT_TYPE_OPTIONS,
} from '../../lib/qr-constants';
import { getReadabilityWarnings, isValidHexColor } from '../../lib/validators';
import type {
  QRCustomization,
  SupportedCornerDotType,
  SupportedCornerSquareType,
  SupportedDotType,
} from '../../types';
import { Button } from '../ui/Button';

interface QRCustomisationProps {
  customization: QRCustomization;
  onChange: (updated: QRCustomization) => void;
  onReset: () => void;
}

export function QRCustomisation({
  customization,
  onChange,
  onReset,
}: QRCustomisationProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fgHexInput, setFgHexInput] = useState(customization.foregroundColor);
  const [bgHexInput, setBgHexInput] = useState(customization.backgroundColor);
  const [logoError, setLogoError] = useState<string | null>(null);

  const warnings = getReadabilityWarnings(customization);

  const handleHexChange = (
    field: 'foregroundColor' | 'backgroundColor',
    value: string,
  ) => {
    if (field === 'foregroundColor') setFgHexInput(value);
    else setBgHexInput(value);

    if (isValidHexColor(value)) {
      onChange({ ...customization, [field]: value });
    }
  };

  const handleColorPickerChange = (
    field: 'foregroundColor' | 'backgroundColor',
    value: string,
  ) => {
    if (field === 'foregroundColor') setFgHexInput(value);
    else setBgHexInput(value);
    onChange({ ...customization, [field]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoError(null);

    if (!file.type.startsWith('image/')) {
      setLogoError('Please select a valid image file (PNG, JPG, SVG, or WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setLogoError('Logo image must be smaller than 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange({
          ...customization,
          logoDataUrl: reader.result,
          errorCorrectionLevel: 'H',
        });
      }
    };
    reader.onerror = () => {
      setLogoError('Failed to read the selected image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    onChange({ ...customization, logoDataUrl: undefined });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetAll = () => {
    onReset();
    setFgHexInput('#0f172a');
    setBgHexInput('#ffffff');
    setLogoError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Appearance</h3>
        <Button variant="ghost" size="sm" onClick={handleResetAll}>
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      {/* Colours */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Colours
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="fg-hex"
              className="block text-xs font-medium text-slate-700"
            >
              Foreground
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label="Foreground colour picker"
                value={customization.foregroundColor}
                onChange={(e) =>
                  handleColorPickerChange('foregroundColor', e.target.value)
                }
                className="h-9 w-10 shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-white p-0.5"
              />
              <input
                id="fg-hex"
                type="text"
                value={fgHexInput}
                onChange={(e) =>
                  handleHexChange('foregroundColor', e.target.value)
                }
                placeholder="#0f172a"
                maxLength={7}
                className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 font-mono text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="bg-hex"
              className="block text-xs font-medium text-slate-700"
            >
              Background
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label="Background colour picker"
                disabled={customization.transparentBackground}
                value={customization.backgroundColor}
                onChange={(e) =>
                  handleColorPickerChange('backgroundColor', e.target.value)
                }
                className="h-9 w-10 shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-white p-0.5 disabled:opacity-40"
              />
              <input
                id="bg-hex"
                type="text"
                disabled={customization.transparentBackground}
                value={bgHexInput}
                onChange={(e) =>
                  handleHexChange('backgroundColor', e.target.value)
                }
                placeholder="#ffffff"
                maxLength={7}
                className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 font-mono text-xs text-slate-900 focus:border-indigo-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={customization.transparentBackground}
            onChange={(e) =>
              onChange({
                ...customization,
                transparentBackground: e.target.checked,
              })
            }
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          Transparent background
        </label>
      </div>

      {/* Dot Patterns */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Dot Pattern
        </p>
        <div className="grid grid-cols-3 gap-2">
          {DOT_TYPE_OPTIONS.map((opt) => {
            const active = customization.dotType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  onChange({
                    ...customization,
                    dotType: opt.value as SupportedDotType,
                  })
                }
                aria-pressed={active}
                className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Corner Styles */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Corner Styles
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <span className="block text-xs font-medium text-slate-700">
              Corner Square
            </span>
            <div className="flex gap-1.5">
              {CORNER_SQUARE_OPTIONS.map((opt) => {
                const active = customization.cornerSquareType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...customization,
                        cornerSquareType: opt.value as SupportedCornerSquareType,
                      })
                    }
                    aria-pressed={active}
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      active
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="block text-xs font-medium text-slate-700">
              Corner Dot
            </span>
            <div className="flex gap-1.5">
              {CORNER_DOT_OPTIONS.map((opt) => {
                const active = customization.cornerDotType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...customization,
                        cornerDotType: opt.value as SupportedCornerDotType,
                      })
                    }
                    aria-pressed={active}
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      active
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Logo Overlay
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          onChange={handleLogoUpload}
          className="hidden"
          id="qr-logo-upload"
        />

        {customization.logoDataUrl ? (
          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={customization.logoDataUrl}
                  alt="Uploaded QR logo preview"
                  className="h-10 w-10 rounded-md border border-slate-200 bg-white object-contain p-1"
                />
                <div>
                  <p className="text-xs font-medium text-slate-800">
                    Logo embedded
                  </p>
                  <p className="text-[11px] text-slate-500">
                    High error correction (H) enabled automatically
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveLogo}
                aria-label="Remove logo"
              >
                <Trash2 className="h-4 w-4 text-rose-600" />
              </Button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Logo size</span>
                <span className="font-mono">
                  {Math.round(customization.logoSize * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.15}
                max={0.45}
                step={0.01}
                value={customization.logoSize}
                onChange={(e) =>
                  onChange({
                    ...customization,
                    logoSize: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-indigo-600"
              />
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50/70 px-4 py-3 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-400 hover:bg-indigo-50/40 hover:text-indigo-700 cursor-pointer"
          >
            <ImagePlus className="h-4 w-4" />
            Upload Logo (PNG, SVG, JPG)
          </button>
        )}

        {logoError && <p className="text-xs text-rose-600">{logoError}</p>}
      </div>

      {/* Additional Settings */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Dimensions & Margin
        </p>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Preview Size</span>
              <span className="font-mono">{customization.size}px</span>
            </div>
            <input
              type="range"
              min={200}
              max={400}
              step={10}
              value={customization.size}
              onChange={(e) =>
                onChange({ ...customization, size: Number(e.target.value) })
              }
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Quiet-zone Margin</span>
              <span className="font-mono">{customization.margin}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={32}
              step={2}
              value={customization.margin}
              onChange={(e) =>
                onChange({ ...customization, margin: Number(e.target.value) })
              }
              className="w-full accent-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Readability Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          {warnings.map((warning, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
