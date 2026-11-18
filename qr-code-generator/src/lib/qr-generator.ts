import { jsPDF } from 'jspdf';
import QRCodeStyling, { type Options } from 'qr-code-styling';
import type { QRCustomization } from '../types';

export function buildQRCodeOptions(
  data: string,
  customization: QRCustomization,
  overrideSize?: number,
  drawType: 'canvas' | 'svg' = 'svg',
): Options {
  const size = overrideSize ?? customization.size;
  const effectiveErrorCorrection = customization.logoDataUrl
    ? 'H'
    : customization.errorCorrectionLevel;

  return {
    type: drawType,
    width: size,
    height: size,
    data: data || 'https://example.com',
    margin: Math.round((customization.margin / 300) * size),
    qrOptions: {
      errorCorrectionLevel: effectiveErrorCorrection,
    },
    dotsOptions: {
      type: customization.dotType,
      color: customization.foregroundColor,
    },
    cornersSquareOptions: {
      type: customization.cornerSquareType,
      color: customization.foregroundColor,
    },
    cornersDotOptions: {
      type: customization.cornerDotType,
      color: customization.foregroundColor,
    },
    backgroundOptions: {
      color: customization.transparentBackground
        ? 'transparent'
        : customization.backgroundColor,
    },
    image: customization.logoDataUrl || undefined,
    imageOptions: {
      crossOrigin: 'anonymous',
      hideBackgroundDots: true,
      imageSize: customization.logoSize,
      margin: 4,
    },
  };
}

export function sanitizeFilename(name: string): string {
  const cleaned = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\-_]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cleaned || 'qr-code';
}

export async function downloadQRAsPng(
  data: string,
  customization: QRCustomization,
  filename: string,
  resolution = 1024,
): Promise<void> {
  const qr = new QRCodeStyling(
    buildQRCodeOptions(data, customization, resolution, 'canvas'),
  );
  await qr.download({
    name: sanitizeFilename(filename),
    extension: 'png',
  });
}

export async function downloadQRAsSvg(
  data: string,
  customization: QRCustomization,
  filename: string,
): Promise<void> {
  const qr = new QRCodeStyling(
    buildQRCodeOptions(data, customization, customization.size, 'svg'),
  );
  await qr.download({
    name: sanitizeFilename(filename),
    extension: 'svg',
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert QR code blob to data URL.'));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error('FileReader error'));
    reader.readAsDataURL(blob);
  });
}

export async function downloadQRAsPdf(
  data: string,
  customization: QRCustomization,
  filename: string,
  title?: string,
): Promise<void> {
  const highResSize = 1200;
  const qr = new QRCodeStyling(
    buildQRCodeOptions(data, customization, highResSize, 'canvas'),
  );
  const rawBlob = await qr.getRawData('png');
  if (!rawBlob || !(rawBlob instanceof Blob)) {
    throw new Error('Unable to generate PNG data for PDF export.');
  }
  const dataUrl = await blobToDataUrl(rawBlob);

  // Create a clean print-ready A4 PDF centred with the QR code
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const qrSizeMm = 120;
  const x = (pageWidth - qrSizeMm) / 2;
  const y = (pageHeight - qrSizeMm) / 2 - 10;

  if (title) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(15, 23, 42);
    pdf.text(title, pageWidth / 2, y - 14, { align: 'center' });
  }

  pdf.addImage(dataUrl, 'PNG', x, y, qrSizeMm, qrSizeMm);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  const truncatedData = data.length > 80 ? `${data.slice(0, 77)}...` : data;
  pdf.text(truncatedData, pageWidth / 2, y + qrSizeMm + 12, { align: 'center' });

  pdf.save(`${sanitizeFilename(filename)}.pdf`);
}
