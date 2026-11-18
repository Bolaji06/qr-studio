import {
  ArrowRight,
  Download,
  FolderKanban,
  Palette,
  QrCode,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { QRTypeIcon } from '../components/common/QRTypeIcon';
import { Card } from '../components/ui/Card';
import { QR_TYPE_METADATA } from '../lib/qr-constants';

const STEPS = [
  {
    step: '01',
    title: 'Choose Content Type',
    description:
      'Pick from 12 structured formats including URLs, Wi-Fi networks, vCards, WhatsApp, and social profiles.',
  },
  {
    step: '02',
    title: 'Customise Design',
    description:
      'Adjust colours, dot patterns, corner styles, margins, and embed your own brand logo with live readability checks.',
  },
  {
    step: '03',
    title: 'Export & Manage',
    description:
      'Download crisp PNG, vector SVG, or print-ready PDF files, and save configurations to your local dashboard.',
  },
];

const FEATURES = [
  {
    icon: Palette,
    title: 'Full Visual Customisation',
    description:
      'Fine-tune foreground and background colours, dot patterns, corner shapes, and logo overlays in real time.',
  },
  {
    icon: Download,
    title: 'High-Res PNG, SVG & PDF',
    description:
      'Export up to 2048px raster PNGs, scalable vector SVGs, or print-ready A4 PDFs without watermarks.',
  },
  {
    icon: FolderKanban,
    title: 'Local Dashboard & History',
    description:
      'Save, search, filter, rename, and re-export your QR codes anytime using browser localStorage.',
  },
  {
    icon: ShieldCheck,
    title: 'Private & 100% Client-Side',
    description:
      'No account required and no server uploads. Your Wi-Fi passwords, contacts, and links stay on your device.',
  },
];

export function Home() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-medium text-indigo-700">
              <Sparkles className="h-3.5 w-3.5" />
              Instant, scannable QR codes in your browser
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Create custom QR codes built for real-world scanning
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Generate, style, preview, and export production-ready QR codes for
              websites, Wi-Fi, contacts, and social profiles—completely free and
              without leaving your browser.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/generator"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 text-sm font-medium text-white shadow-xs transition-colors hover:bg-indigo-700 sm:w-auto"
              >
                <QrCode className="h-4 w-4" />
                Generate QR Code
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 sm:w-auto"
              >
                Open Saved Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Types */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            12 Supported QR Code Types
          </h2>
          <p className="mt-2 text-slate-600">
            Select any format below to jump straight into the generator with
            tailored fields and validation.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QR_TYPE_METADATA.map((item) => (
            <Link
              key={item.type}
              to={`/generator?type=${item.type}`}
              className="group rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all hover:border-indigo-300 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <QRTypeIcon type={item.type} className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {item.label}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            How It Works
          </h2>
          <p className="mt-2 text-slate-600">
            Go from raw link or contact details to a print-ready QR code in
            three simple steps.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((item) => (
            <Card key={item.step} className="p-6">
              <span className="inline-block rounded-md bg-indigo-50 px-2.5 py-1 font-mono text-xs font-semibold text-indigo-700">
                {item.step}
              </span>
              <h3 className="mt-4 text-base font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Built for Reliability & Control
          </h2>
          <p className="mt-2 text-slate-600">
            Every customisation option is backed by real-time contrast and error
            correction safeguards.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <Card key={feat.title} className="flex gap-4 p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {feat.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {feat.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
