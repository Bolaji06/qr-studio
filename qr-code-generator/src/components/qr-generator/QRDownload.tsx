import { Download, FileCode2, FileImage, FileText } from 'lucide-react';
import { useState } from 'react';
import {
  downloadQRAsPdf,
  downloadQRAsPng,
  downloadQRAsSvg,
} from '../../lib/qr-generator';
import type { QRCustomization } from '../../types';
import { Button } from '../ui/Button';

interface QRDownloadProps {
  encodedData: string;
  customization: QRCustomization;
  filename: string;
  disabled: boolean;
  title?: string;
}

export function QRDownload({
  encodedData,
  customization,
  filename,
  disabled,
  title,
}: QRDownloadProps) {
  const [pngResolution, setPngResolution] = useState<number>(1024);
  const [downloading, setDownloading] = useState<'png' | 'svg' | 'pdf' | null>(
    null,
  );
  const [exportError, setExportError] = useState<string | null>(null);

  const handleDownload = async (format: 'png' | 'svg' | 'pdf') => {
    if (disabled) return;
    setExportError(null);
    setDownloading(format);
    try {
      if (format === 'png') {
        await downloadQRAsPng(encodedData, customization, filename, pngResolution);
      } else if (format === 'svg') {
        await downloadQRAsSvg(encodedData, customization, filename);
      } else {
        await downloadQRAsPdf(encodedData, customization, filename, title);
      }
    } catch (err) {
      setExportError(
        err instanceof Error ? err.message : 'Failed to export QR code.',
      );
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Download Export
        </span>
        <select
          aria-label="PNG Export Resolution"
          value={pngResolution}
          onChange={(e) => setPngResolution(Number(e.target.value))}
          disabled={disabled}
          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
        >
          <option value={512}>PNG 512px</option>
          <option value={1024}>PNG 1024px</option>
          <option value={2048}>PNG 2048px</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="primary"
          size="md"
          disabled={disabled || downloading !== null}
          onClick={() => handleDownload('png')}
        >
          <FileImage className="h-4 w-4" />
          {downloading === 'png' ? '...' : 'PNG'}
        </Button>

        <Button
          variant="outline"
          size="md"
          disabled={disabled || downloading !== null}
          onClick={() => handleDownload('svg')}
        >
          <FileCode2 className="h-4 w-4" />
          {downloading === 'svg' ? '...' : 'SVG'}
        </Button>

        <Button
          variant="outline"
          size="md"
          disabled={disabled || downloading !== null}
          onClick={() => handleDownload('pdf')}
        >
          <FileText className="h-4 w-4" />
          {downloading === 'pdf' ? '...' : 'PDF'}
        </Button>
      </div>

      {exportError && (
        <p className="flex items-center gap-1.5 text-xs text-rose-600">
          <Download className="h-3.5 w-3.5 shrink-0" />
          {exportError}
        </p>
      )}
    </div>
  );
}
