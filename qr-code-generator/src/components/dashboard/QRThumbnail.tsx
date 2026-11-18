import QRCodeStyling from 'qr-code-styling';
import { useEffect, useRef } from 'react';
import { encodeQRData } from '../../lib/qr-encoder';
import { buildQRCodeOptions } from '../../lib/qr-generator';
import type { SavedQRCode } from '../../types';

interface QRThumbnailProps {
  record: SavedQRCode;
  size?: number;
  className?: string;
}

export function QRThumbnail({
  record,
  size = 120,
  className = '',
}: QRThumbnailProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = encodeQRData(record.type, record.payload);
    const options = buildQRCodeOptions(
      data,
      record.customization,
      size,
      'svg',
    );
    const qr = new QRCodeStyling(options);
    if (ref.current) {
      ref.current.innerHTML = '';
      qr.append(ref.current);
    }
  }, [record, size]);

  return (
    <div
      ref={ref}
      className={`flex items-center justify-center overflow-hidden [&>svg]:h-auto [&>svg]:max-w-full ${className}`}
      aria-label={`QR code preview for ${record.name}`}
    />
  );
}
