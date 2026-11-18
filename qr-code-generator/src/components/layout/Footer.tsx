import { QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-slate-700">
          <QrCode className="h-4 w-4 text-indigo-600" />
          <span className="font-medium">QR Studio</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">100% client-side QR generation</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/generator" className="hover:text-slate-900 transition-colors">
            Generator
          </Link>
          <Link to="/dashboard" className="hover:text-slate-900 transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
