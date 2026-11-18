# QR Studio — Open-Source QR Code Generator

A modern, 100% free, client-side QR Code Generator web application built with Vite, React, TypeScript, Tailwind CSS, `qr-code-styling`, and `jspdf`.

## Why This Exists

This project was inspired by a simple frustration: looking all over the internet to generate a free QR code, only to find tools locked behind paywalls, sign-up walls, watermarks, or artificial scan limits.

Generating a QR code should be **freaking free**—it's just a QR code. So QR Studio was built as an open-source, privacy-first alternative that runs entirely in your browser with no account, no backend, and no paywalls.

## Features

- **12 QR Code Types**: Website URL, Plain Text, Wi-Fi Network, Contact (vCard 3.0), Email, Phone Number, SMS, WhatsApp, Instagram, Facebook, LinkedIn, and Google Maps / Location.
- **Live Preview & Validation**: Instant QR code generation with per-field input validation and real-time readability/contrast warnings.
- **Full Customisation**:
  - Foreground & background colour pickers with custom hex inputs
  - Background transparency toggle
  - 6 dot patterns (`square`, `dots`, `rounded`, `classy`, `classy-rounded`, `extra-rounded`)
  - Corner square (`square`, `dot`, `extra-rounded`) & corner dot (`square`, `dot`) styles
  - Custom logo upload with size slider and automatic High (`H`) error correction
  - Adjustable dimensions and quiet-zone margin
- **Multi-Format Export**: High-resolution PNG (512px, 1024px, 2048px), vector SVG, and print-ready A4 PDF.
- **Dashboard & Local Persistence**: Save, search, filter by type, rename, preview, edit, re-export, and delete QR codes in `localStorage`.

## Tech Stack

- **Build Tool**: Vite
- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS (`@tailwindcss/vite`)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **QR Engine**: `qr-code-styling`
- **PDF Export**: `jspdf`
- **Testing**: Vitest

## Getting Started

```bash
cd qr-code-generator
npm install
npm run dev
```

## Available Scripts

- `npm run dev` — Start the Vite development server
- `npm run build` — Run TypeScript type-checking (`tsc -b`) and build for production
- `npm run preview` — Preview the production build locally
- `npm test` — Run Vitest unit tests for QR encoding, validation, and storage
- `npm run lint` — Run `oxlint`

## Contributing & Feedback

QR Studio is an **open-source project**, and contributions, feedback, and ideas are very welcome!

- **Found a bug or have a feature idea?** [Open an issue](https://github.com/Bolaji06/qr-studio/issues) to report bugs, suggest improvements, or help shape the direction and growth of the project.
- **Want to contribute code?** Fork the repository, create a feature branch, and open a pull request.
