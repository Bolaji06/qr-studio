import { encodeQRData } from '../../lib/qr-encoder';
import { QR_TYPE_METADATA } from '../../lib/qr-constants';
import type { SavedQRCode } from '../../types';
import { QRDownload } from '../qr-generator/QRDownload';
import { Badge } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { QRThumbnail } from './QRThumbnail';

interface QRPreviewModalProps {
  record: SavedQRCode | null;
  onClose: () => void;
}

export function QRPreviewModal({ record, onClose }: QRPreviewModalProps) {
  if (!record) return null;

  const encodedData = encodeQRData(record.type, record.payload);
  const meta = QR_TYPE_METADATA.find((m) => m.type === record.type);

  return (
    <Modal isOpen={Boolean(record)} onClose={onClose} title={record.name}>
      <div className="space-y-5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <Badge variant="indigo">{meta?.label ?? record.type}</Badge>
          <span>
            Created {new Date(record.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        <div
          className={`flex items-center justify-center rounded-xl border border-slate-200 p-6 ${
            record.customization.transparentBackground
              ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:14px_14px] bg-slate-50'
              : 'bg-slate-50'
          }`}
        >
          <QRThumbnail record={record} size={260} />
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600 break-all">
          {encodedData}
        </div>

        <QRDownload
          encodedData={encodedData}
          customization={record.customization}
          filename={record.name}
          disabled={false}
          title={record.name}
        />
      </div>
    </Modal>
  );
}
