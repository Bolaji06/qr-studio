import { BookmarkPlus, Check, Copy, QrCode } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import { useEffect, useRef, useState } from 'react';
import { buildQRCodeOptions } from '../../lib/qr-generator';
import type { QRCustomization } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface QRPreviewProps {
  encodedData: string;
  isValid: boolean;
  hasInteracted: boolean;
  customization: QRCustomization;
  qrName: string;
  onQrNameChange: (name: string) => void;
  onSave: () => void;
  saveStatus: { type: 'success' | 'warning' | 'error'; message: string } | null;
  isEditingExisting: boolean;
}

export function QRPreview({
  encodedData,
  isValid,
  hasInteracted,
  customization,
  qrName,
  onQrNameChange,
  onSave,
  saveStatus,
  isEditingExisting,
}: QRPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<QRCodeStyling | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isValid || !encodedData) {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      qrInstanceRef.current = null;
      return;
    }

    const options = buildQRCodeOptions(
      encodedData,
      customization,
      customization.size,
      'svg',
    );

    if (!qrInstanceRef.current) {
      qrInstanceRef.current = new QRCodeStyling(options);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        qrInstanceRef.current.append(containerRef.current);
      }
    } else {
      qrInstanceRef.current.update(options);
    }
  }, [encodedData, isValid, customization]);

  const handleCopyPayload = async () => {
    if (!encodedData) return;
    try {
      await navigator.clipboard.writeText(encodedData);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <div className="space-y-5">
      {/* Live Preview Canvas Container */}
      <div
        className={`relative flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-slate-200 p-6 ${
          customization.transparentBackground
            ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:14px_14px] bg-slate-50'
            : 'bg-slate-50/70'
        }`}
      >
        {isValid && encodedData ? (
          <div
            ref={containerRef}
            className="flex max-w-full items-center justify-center overflow-hidden rounded-lg shadow-xs [&>svg]:h-auto [&>svg]:max-w-full"
            aria-label="Live QR code preview"
          />
        ) : (
          <div className="flex max-w-xs flex-col items-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <QrCode className="h-7 w-7" />
            </div>
            <p className="text-sm font-medium text-slate-800">
              {hasInteracted
                ? 'Complete the required fields'
                : 'Your QR code preview will appear here'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {hasInteracted
                ? 'Fix the validation errors on the left to generate a scannable QR code.'
                : 'Select a content type and enter your details to generate a live QR code.'}
            </p>
          </div>
        )}
      </div>

      {/* Encoded Payload Strip */}
      {isValid && encodedData && (
        <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
          <span className="truncate font-mono text-xs text-slate-600" title={encodedData}>
            {encodedData}
          </span>
          <button
            type="button"
            onClick={handleCopyPayload}
            className="inline-flex shrink-0 items-center gap-1 rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </button>
        </div>
      )}

      {/* Save to Dashboard */}
      <div className="space-y-2.5 border-t border-slate-200 pt-4">
        <Input
          label="QR Code Label"
          placeholder="e.g. Company Website, Guest Wi-Fi"
          value={qrName}
          onChange={(e) => onQrNameChange(e.target.value)}
        />
        <Button
          variant="secondary"
          className="w-full"
          disabled={!isValid || !encodedData}
          onClick={onSave}
        >
          <BookmarkPlus className="h-4 w-4" />
          {isEditingExisting ? 'Update Saved QR Code' : 'Save to Dashboard'}
        </Button>

        {saveStatus && (
          <p
            className={`text-xs ${
              saveStatus.type === 'error'
                ? 'text-rose-600'
                : saveStatus.type === 'warning'
                  ? 'text-amber-700'
                  : 'text-emerald-700'
            }`}
          >
            {saveStatus.message}
          </p>
        )}
      </div>
    </div>
  );
}
