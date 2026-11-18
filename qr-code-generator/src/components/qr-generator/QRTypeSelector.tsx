import { QR_TYPE_METADATA } from '../../lib/qr-constants';
import type { QRCodeType } from '../../types';
import { QRTypeIcon } from '../common/QRTypeIcon';

interface QRTypeSelectorProps {
  selectedType: QRCodeType;
  onSelectType: (type: QRCodeType) => void;
}

export function QRTypeSelector({
  selectedType,
  onSelectType,
}: QRTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3">
      {QR_TYPE_METADATA.map((item) => {
        const isSelected = item.type === selectedType;
        return (
          <button
            key={item.type}
            type="button"
            onClick={() => onSelectType(item.type)}
            aria-pressed={isSelected}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-xs font-medium transition-all cursor-pointer ${
              isSelected
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <QRTypeIcon
              type={item.type}
              className={`h-4 w-4 shrink-0 ${
                isSelected ? 'text-indigo-600' : 'text-slate-500'
              }`}
            />
            <span className="truncate">{item.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
