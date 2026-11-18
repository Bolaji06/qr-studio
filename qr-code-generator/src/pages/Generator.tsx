import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QRCustomisation } from '../components/qr-generator/QRCustomisation';
import { QRDownload } from '../components/qr-generator/QRDownload';
import { QRInputForm } from '../components/qr-generator/QRInputForm';
import { QRPreview } from '../components/qr-generator/QRPreview';
import { QRTypeSelector } from '../components/qr-generator/QRTypeSelector';
import { Card } from '../components/ui/Card';
import {
  DEFAULT_CUSTOMIZATION,
  DEFAULT_PAYLOADS,
  QR_TYPE_METADATA,
} from '../lib/qr-constants';
import { encodeQRData } from '../lib/qr-encoder';
import { validateQRPayload } from '../lib/validators';
import { getSavedQRCodeById, saveQRCode } from '../services/storage';
import type { QRCodeType, QRCustomization, QRPayloadMap } from '../types';

function isQRCodeType(value: string | null): value is QRCodeType {
  return QR_TYPE_METADATA.some((m) => m.type === value);
}

export function Generator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const queryType = searchParams.get('type');
  const initialRecord = useMemo(
    () => (editId ? getSavedQRCodeById(editId) : undefined),
    [editId],
  );

  const [editingId, setEditingId] = useState<string | undefined>(
    () => initialRecord?.id,
  );
  const [selectedType, setSelectedType] = useState<QRCodeType>(() =>
    initialRecord
      ? initialRecord.type
      : isQRCodeType(queryType)
        ? queryType
        : 'url',
  );
  const [payloads, setPayloads] = useState<{ [K in QRCodeType]: QRPayloadMap[K] }>(
    () => {
      const base = structuredClone(DEFAULT_PAYLOADS);
      if (initialRecord) {
        (base as Record<QRCodeType, QRPayloadMap[QRCodeType]>)[
          initialRecord.type
        ] = initialRecord.payload;
      }
      return base;
    },
  );
  const [customization, setCustomization] = useState<QRCustomization>(() =>
    initialRecord
      ? { ...DEFAULT_CUSTOMIZATION, ...initialRecord.customization }
      : { ...DEFAULT_CUSTOMIZATION },
  );
  const [qrName, setQrName] = useState(() => initialRecord?.name ?? '');
  const [hasInteracted, setHasInteracted] = useState(() =>
    Boolean(initialRecord),
  );
  const [saveStatus, setSaveStatus] = useState<{
    type: 'success' | 'warning' | 'error';
    message: string;
  } | null>(null);

  const currentPayload = payloads[selectedType];

  const validation = useMemo(
    () => validateQRPayload(selectedType, currentPayload),
    [selectedType, currentPayload],
  );

  const encodedData = useMemo(() => {
    if (!validation.isValid) return '';
    return encodeQRData(selectedType, currentPayload);
  }, [selectedType, currentPayload, validation.isValid]);

  const handleSelectType = (type: QRCodeType) => {
    setSelectedType(type);
    setHasInteracted(false);
    setSaveStatus(null);
    if (editingId) {
      setEditingId(undefined);
      setSearchParams({ type });
    }
  };

  const handlePayloadChange = (updated: QRPayloadMap[typeof selectedType]) => {
    setHasInteracted(true);
    setSaveStatus(null);
    setPayloads((prev) => ({
      ...prev,
      [selectedType]: updated,
    }));
  };

  const handleSave = () => {
    setHasInteracted(true);
    if (!validation.isValid || !encodedData) {
      setSaveStatus({
        type: 'error',
        message: 'Please fix the input errors before saving.',
      });
      return;
    }

    const typeMeta = QR_TYPE_METADATA.find((m) => m.type === selectedType);
    const defaultLabel = `${typeMeta?.shortLabel ?? 'QR'} Code`;

    try {
      const result = saveQRCode({
        id: editingId,
        name: qrName || defaultLabel,
        type: selectedType,
        payload: currentPayload,
        customization,
      });

      setEditingId(result.record.id);
      setQrName(result.record.name);
      setSaveStatus(
        result.logoOmitted
          ? {
              type: 'warning',
              message:
                'Saved to Dashboard! Note: your uploaded logo was too large for browser storage and was omitted from the saved copy.',
            }
          : {
              type: 'success',
              message: 'Saved to Dashboard! You can view or re-export it anytime.',
            },
      );
    } catch (err) {
      setSaveStatus({
        type: 'error',
        message:
          err instanceof Error ? err.message : 'Failed to save QR code.',
      });
    }
  };

  const downloadFilename = qrName.trim() || `qr-${selectedType}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          QR Code Generator
        </h1>
        <p className="mt-1.5 text-sm text-slate-600">
          Choose a content type, enter your details, customise the design, and
          export in PNG, SVG, or PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Section 1: Content Selection & Input */}
        <Card className="p-5 sm:p-6 lg:col-span-4">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Step 1
              </span>
              <h2 className="mt-0.5 text-base font-semibold text-slate-900">
                Content Type & Details
              </h2>
            </div>

            <QRTypeSelector
              selectedType={selectedType}
              onSelectType={handleSelectType}
            />

            <div className="border-t border-slate-200 pt-5">
              <QRInputForm
                type={selectedType}
                payload={currentPayload}
                errors={validation.errors}
                showErrors={hasInteracted}
                onChange={handlePayloadChange}
              />
            </div>
          </div>
        </Card>

        {/* Section 2: Customisation Panel */}
        <Card className="p-5 sm:p-6 lg:col-span-4">
          <div className="mb-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Step 2
            </span>
            <h2 className="mt-0.5 text-base font-semibold text-slate-900">
              Customisation
            </h2>
          </div>

          <QRCustomisation
            customization={customization}
            onChange={(next) => {
              setSaveStatus(null);
              setCustomization(next);
            }}
            onReset={() => setCustomization({ ...DEFAULT_CUSTOMIZATION })}
          />
        </Card>

        {/* Section 3: Live Preview, Save & Download */}
        <Card className="p-5 sm:p-6 lg:sticky lg:top-24 lg:col-span-4">
          <div className="mb-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Step 3
            </span>
            <h2 className="mt-0.5 text-base font-semibold text-slate-900">
              Live Preview & Export
            </h2>
          </div>

          <div className="space-y-6">
            <QRPreview
              encodedData={encodedData}
              isValid={validation.isValid}
              hasInteracted={hasInteracted}
              customization={customization}
              qrName={qrName}
              onQrNameChange={setQrName}
              onSave={handleSave}
              saveStatus={saveStatus}
              isEditingExisting={Boolean(editingId)}
            />

            <div className="border-t border-slate-200 pt-4">
              <QRDownload
                encodedData={encodedData}
                customization={customization}
                filename={downloadFilename}
                disabled={!validation.isValid || !encodedData}
                title={qrName.trim() || undefined}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
