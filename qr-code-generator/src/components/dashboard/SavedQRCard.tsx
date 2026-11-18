import {
  Check,
  Download,
  Edit3,
  Eye,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QR_TYPE_METADATA } from '../../lib/qr-constants';
import { encodeQRData } from '../../lib/qr-encoder';
import {
  downloadQRAsPdf,
  downloadQRAsPng,
  downloadQRAsSvg,
} from '../../lib/qr-generator';
import type { SavedQRCode } from '../../types';
import { QRTypeIcon } from '../common/QRTypeIcon';
import { Badge, Card } from '../ui/Card';
import { QRThumbnail } from './QRThumbnail';

interface SavedQRCardProps {
  record: SavedQRCode;
  onPreview: (record: SavedQRCode) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

export function SavedQRCard({
  record,
  onPreview,
  onRename,
  onDelete,
}: SavedQRCardProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [draftName, setDraftName] = useState(record.name);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const meta = QR_TYPE_METADATA.find((m) => m.type === record.type);
  const encodedData = encodeQRData(record.type, record.payload);

  const handleSaveRename = () => {
    const trimmed = draftName.trim();
    if (trimmed && trimmed !== record.name) {
      onRename(record.id, trimmed);
    } else {
      setDraftName(record.name);
    }
    setIsRenaming(false);
  };

  const handleQuickDownload = async (format: 'png' | 'svg' | 'pdf') => {
    setShowDownloadMenu(false);
    if (format === 'png') {
      await downloadQRAsPng(encodedData, record.customization, record.name, 1024);
    } else if (format === 'svg') {
      await downloadQRAsSvg(encodedData, record.customization, record.name);
    } else {
      await downloadQRAsPdf(
        encodedData,
        record.customization,
        record.name,
        record.name,
      );
    }
  };

  return (
    <Card className="flex flex-col justify-between p-4 transition-shadow hover:shadow-md">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="indigo" className="gap-1">
            <QRTypeIcon type={record.type} className="h-3 w-3" />
            {meta?.shortLabel ?? record.type}
          </Badge>
          <span className="text-[11px] text-slate-400">
            {new Date(record.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* Thumbnail */}
        <button
          type="button"
          onClick={() => onPreview(record)}
          className="flex w-full items-center justify-center rounded-lg border border-slate-100 bg-slate-50/70 p-4 transition-colors hover:bg-slate-100/80 cursor-pointer"
          title="Click to preview"
        >
          <QRThumbnail record={record} size={136} />
        </button>

        {/* Name / Rename */}
        <div>
          {isRenaming ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveRename();
                  if (e.key === 'Escape') {
                    setDraftName(record.name);
                    setIsRenaming(false);
                  }
                }}
                autoFocus
                className="w-full rounded-md border border-indigo-400 px-2 py-1 text-sm font-medium text-slate-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveRename}
                aria-label="Confirm rename"
                className="rounded p-1 text-emerald-600 hover:bg-emerald-50 cursor-pointer"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraftName(record.name);
                  setIsRenaming(false);
                }}
                aria-label="Cancel rename"
                className="rounded p-1 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {record.name}
            </h3>
          )}
          <p className="mt-0.5 truncate font-mono text-xs text-slate-500">
            {encodedData}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPreview(record)}
            title="Preview QR code"
            aria-label={`Preview ${record.name}`}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setDraftName(record.name);
              setIsRenaming(true);
            }}
            title="Rename QR code"
            aria-label={`Rename ${record.name}`}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          >
            <Edit3 className="h-4 w-4" />
          </button>

          <Link
            to={`/generator?edit=${encodeURIComponent(record.id)}`}
            title="Edit in Generator"
            aria-label={`Edit ${record.name}`}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDownloadMenu((prev) => !prev)}
              title="Download QR code"
              aria-label={`Download ${record.name}`}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
            >
              <Download className="h-4 w-4" />
            </button>
            {showDownloadMenu && (
              <div className="absolute bottom-full left-0 z-20 mb-1 w-28 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => handleQuickDownload('png')}
                  className="block w-full px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  PNG (1024px)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDownload('svg')}
                  className="block w-full px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  SVG (Vector)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDownload('pdf')}
                  className="block w-full px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  PDF (Print)
                </button>
              </div>
            )}
          </div>
        </div>

        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onDelete(record.id)}
              className="rounded-md bg-rose-600 px-2 py-1 text-[11px] font-medium text-white hover:bg-rose-700 cursor-pointer"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded-md px-1.5 py-1 text-[11px] font-medium text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            title="Delete QR code"
            aria-label={`Delete ${record.name}`}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </Card>
  );
}
