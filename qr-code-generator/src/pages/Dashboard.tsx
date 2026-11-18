import { Plus, QrCode, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { QRPreviewModal } from '../components/dashboard/QRPreviewModal';
import { SavedQRCard } from '../components/dashboard/SavedQRCard';
import { Badge, Card } from '../components/ui/Card';
import { QR_TYPE_METADATA } from '../lib/qr-constants';
import {
  deleteSavedQRCode,
  getSavedQRCodes,
  renameSavedQRCode,
} from '../services/storage';
import type { QRCodeType, SavedQRCode } from '../types';

export function Dashboard() {
  const [records, setRecords] = useState<SavedQRCode[]>(() => getSavedQRCodes());
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<QRCodeType | 'all'>('all');
  const [previewRecord, setPreviewRecord] = useState<SavedQRCode | null>(null);

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return records.filter((item) => {
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      if (!query) return true;
      return (
        item.name.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query)
      );
    });
  }, [records, searchQuery, typeFilter]);

  const handleRename = (id: string, newName: string) => {
    const updated = renameSavedQRCode(id, newName);
    if (updated) {
      setRecords((prev) =>
        prev.map((item) => (item.id === id ? updated : item)),
      );
    }
  };

  const handleDelete = (id: string) => {
    if (deleteSavedQRCode(id)) {
      setRecords((prev) => prev.filter((item) => item.id !== id));
      if (previewRecord?.id === id) setPreviewRecord(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Saved QR Codes
            </h1>
            <Badge variant="default">{records.length} total</Badge>
          </div>
          <p className="mt-1.5 text-sm text-slate-600">
            Manage, rename, preview, and re-export your locally saved QR codes.
          </p>
        </div>

        <Link
          to="/generator"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-xs transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          New QR Code
        </Link>
      </div>

      {records.length === 0 ? (
        <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <QrCode className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            No saved QR codes yet
          </h2>
          <p className="mt-1.5 max-w-sm text-sm text-slate-500">
            Create your first QR code in the generator and save it here for
            quick access and re-exporting.
          </p>
          <Link
            to="/generator"
            className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Create Your First QR Code
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Search and Filter Controls */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved QR codes by name..."
                aria-label="Search saved QR codes"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <select
              aria-label="Filter by QR code type"
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as QRCodeType | 'all')
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:w-52"
            >
              <option value="all">All Types ({records.length})</option>
              {QR_TYPE_METADATA.map((meta) => (
                <option key={meta.type} value={meta.type}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>

          {/* Grid */}
          {filteredRecords.length === 0 ? (
            <Card className="p-10 text-center">
              <p className="text-sm font-medium text-slate-800">
                No matching QR codes found
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Try clearing your search query or selecting a different type
                filter.
              </p>
            </Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredRecords.map((record) => (
                <SavedQRCard
                  key={record.id}
                  record={record}
                  onPreview={setPreviewRecord}
                  onRename={handleRename}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <QRPreviewModal
        record={previewRecord}
        onClose={() => setPreviewRecord(null)}
      />
    </div>
  );
}
