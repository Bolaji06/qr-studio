# Project: QR Code Generator

## 1. Your Role

Act as a Senior Frontend Engineer, Software Architect, and UI/UX Designer.

Your responsibility is to plan, design, and build a modern, responsive, production-quality QR Code Generator web application.

Approach this project as a real software product. Prioritise clean architecture, reusable components, excellent user experience, accessibility, maintainability, and working functionality.

Do not just create a visual prototype. All core features must work.

---

## 2. Project Overview

Build a web application that allows users to generate, customise, preview, download, and manage QR codes.

The application should support different QR code types, including website URLs, text, contact information, Wi-Fi credentials, email addresses, phone numbers, WhatsApp links, and social media profiles.

The experience should be straightforward: users select a QR code type, provide the required information, customise its appearance, preview the result, and download it.

The application should work entirely on the frontend without requiring a backend for its initial version.

---

## 3. Technology Stack

### Frontend

Use the following technologies:

- Vite – Development environment and build tool.
- React – Frontend framework.
- TypeScript – Static typing.
- Tailwind CSS – Styling.
- React Router DOM – Application navigation.
- Lucide React – Icons.

### QR Code Generation

Evaluate and use `qr-code-styling` as the primary QR code generation library.

It should support:

- QR code generation.
- Custom colours.
- Different dot patterns.
- Custom corner styles.
- Logo/image embedding.
- PNG export.
- SVG export.

For PDF downloads, use a suitable client-side PDF generation library.

### Persistence

Use browser localStorage for saving generated QR codes and user preferences.

Do not introduce a database, authentication system, API, or backend in this initial version.

---

## 4. Project Initialization

Before writing application features, create the Vite React TypeScript project.

Run:

```bash
npm create vite@latest qr-code-generator -- --template react-ts

cd qr-code-generator

npm install
```

Install the required dependencies:

```bash
npm install react-router-dom lucide-react qr-code-styling
npm install jspdf
npm install -D tailwindcss @tailwindcss/vite
```

Configure Tailwind CSS using the appropriate Vite integration.

Verify that the application runs successfully before proceeding.

---

## 5. Core Application Features

### A. QR Code Generation

Allow users to generate QR codes for the following content types:

1. Website URL.
2. Plain text.
3. Email address.
4. Phone number.
5. SMS message.
6. Wi-Fi credentials.
7. Contact information (vCard).
8. WhatsApp links.
9. Instagram profiles.
10. Facebook profiles.
11. LinkedIn profiles.
12. Google Maps and location links.

Each QR code type should have its own appropriate input fields.

Examples:

**Website URL**
- Website URL.

**Wi-Fi**
- Network name (SSID).
- Password.
- Security type (WPA, WEP, or None).
- Hidden network option.

**Contact**
- Full name.
- Phone number.
- Email address.
- Organisation.
- Website.

**WhatsApp**
- Phone number with country code.
- Optional prefilled message.

Validate user inputs before generating QR codes.

Ensure the generated QR code contains the correct encoded data for the selected content type.

### B. QR Code Customisation

Give users control over the appearance of their QR codes.

Include the following options:

**Colours**
- Foreground colour.
- Background colour.
- Colour picker.
- Custom hexadecimal colour input.

**QR Code Patterns**
- Square.
- Dots.
- Rounded.
- Classy.
- Classy Rounded.
- Extra Rounded.

Only expose styles supported by the selected QR generation library.

**Corner Customisation**
- Corner square styles.
- Corner dot styles.

**Logo Customisation**
- Upload a custom logo.
- Preview uploaded logo.
- Adjust logo size.
- Remove uploaded logo.

**Additional Settings**
- QR code dimensions.
- Margin.
- Background transparency.

Maintain sufficient contrast and error correction to preserve QR code readability.

Use high error correction when embedding a logo, and warn users when customisation may affect scanning reliability.

### C. Live QR Code Preview

Provide a dedicated preview area.

Requirements:

- Generate the QR code immediately when valid input is provided.
- Update the preview whenever the user changes customisation settings.
- Display the QR code in a clean preview container.
- Provide a reset customisation option.
- Provide a clear empty state before the first QR code is generated.
- Display validation errors where appropriate.

Avoid unnecessary page reloads.

### D. Download and Export

Allow users to download their generated QR codes in:

- PNG.
- SVG.
- PDF.

Requirements:

- Preserve all customisation settings.
- Support high-resolution downloads.
- Ensure SVG exports remain vector-based.
- Ensure PDF exports have appropriate dimensions and print quality.
- Use meaningful filenames where possible.

### E. QR Code Management

Create a history/dashboard section.

Users should be able to:

- View previously generated QR codes.
- Rename saved QR codes.
- Preview saved QR codes.
- Download existing QR codes.
- Delete QR codes.
- View the QR code type.
- See when each QR code was created.

Persist QR code records using localStorage.

Handle empty states and storage errors gracefully.

Do not store unnecessary image data or excessively large objects in localStorage. Where appropriate, persist the QR configuration and regenerate the QR code when it is opened.

---

## 6. Application Pages

Create the following pages:

### A. Home Page

The landing page should introduce the QR Code Generator.

Include:

- Clear headline explaining the product.
- Short description.
- Primary CTA: Generate QR Code.
- Overview of supported QR code types.
- Brief explanation of how it works.
- Feature highlights.

Keep the page simple and focused on getting users to generate their first QR code.

### B. QR Generator Page

This is the application's primary page.

Organise it into three logical sections:

**1. Content Selection and Input**
- Display available QR code types.
- Allow users to select a type.
- Display the relevant input fields.

**2. Customisation Panel**
- Colour selection.
- Pattern selection.
- Corner styles.
- Logo upload.
- Additional settings.

**3. QR Code Preview**
- Live QR code preview.
- Download options.
- Save QR code option.

On desktop, use a well-organised multi-column layout.

On mobile, stack the sections vertically with a clear interaction flow.

### C. Dashboard Page

Display previously saved QR codes.

Include:

- Page title and description.
- Total number of saved QR codes.
- QR code cards or a table.
- Search functionality.
- Filter by QR code type.
- Rename action.
- Preview action.
- Download action.
- Delete action.
- Empty state with a CTA to create a QR code.

### D. Not Found Page

Create a simple 404 page with a link back to the home page.

---

## 7. User Interface and Design Direction

Design a clean, modern SaaS-style interface.

The application should feel professional, lightweight, and intuitive.

### Design Principles

- Minimalist interface.
- Clear visual hierarchy.
- Consistent spacing.
- Subtle borders and shadows.
- Rounded cards and input fields.
- Consistent typography.
- Accessible colour contrast.
- Clear button states.
- Responsive layouts.

Avoid excessive gradients, unnecessary animations, and visual clutter.

Use a consistent design system for:
- Colours.
- Typography.
- Buttons.
- Input fields.
- Cards.
- Modals.
- Dropdowns.
- Navigation.

Create reusable UI components instead of repeating markup.

---

## 8. Suggested Project Structure

Organise the project into reusable components and clearly separated modules.

```text
src/
├── assets/
├── components/
│   ├── common/
│   ├── layout/
│   ├── navigation/
│   ├── qr-generator/
│   │   ├── QRTypeSelector.tsx
│   │   ├── QRInputForm.tsx
│   │   ├── QRCustomisation.tsx
│   │   ├── QRPreview.tsx
│   │   └── QRDownload.tsx
│   ├── dashboard/
│   └── ui/
├── pages/
│   ├── Home.tsx
│   ├── Generator.tsx
│   ├── Dashboard.tsx
│   └── NotFound.tsx
├── hooks/
├── lib/
│   ├── qr-generator.ts
│   ├── qr-encoder.ts
│   └── validators.ts
├── services/
│   └── storage.ts
├── types/
│   └── index.ts
├── utils/
├── App.tsx
├── main.tsx
└── index.css
```

You may modify the structure when necessary, but maintain separation of concerns and avoid putting all application logic inside a single component.

---

## 9. Functional Requirements

Ensure the following:

1. Users can generate actual, scannable QR codes.
2. Each QR code type encodes the correct data format.
3. QR previews update when settings change.
4. All customisation options work correctly.
5. Uploaded logos appear inside generated QR codes.
6. PNG, SVG, and PDF exports work.
7. Users can save and retrieve QR codes.
8. Saved QR codes persist after refreshing the browser.
9. Users can rename and delete saved QR codes.
10. Forms validate user inputs.
11. The application works on mobile and desktop.
12. No core feature should rely on placeholder functionality.

---

## 10. Code Quality and Engineering Standards

Follow these development standards:

- Use functional React components and hooks.
- Use TypeScript interfaces and types.
- Avoid unnecessary `any` types.
- Keep components small and reusable.
- Separate application logic from UI components.
- Use appropriate state management.
- Avoid unnecessary dependencies.
- Implement proper error handling.
- Ensure accessibility.
- Use semantic HTML.
- Avoid duplicated code.
- Keep naming conventions consistent.
- Write maintainable and readable code.

Use React state appropriately. Do not introduce Redux or other complex state management libraries unless genuinely necessary.

---

## 11. Testing and Quality Assurance

Before considering the project complete, verify:

- All QR code types generate correctly.
- Generated QR codes can be scanned using a mobile device.
- Customisation settings work.
- Logo uploads work.
- All download formats work.
- Saved QR codes persist after refreshing.
- Search and filtering work.
- Rename and delete operations work.
- Invalid inputs are handled correctly.
- Responsive layouts work.
- There are no TypeScript errors.
- There are no critical browser console errors.
- The production build completes successfully.

Use automated tests for important QR encoding, validation, and storage logic where practical.

---

## 12. Development Workflow

Work through the project in the following phases.

**Phase 1: Project Setup**
- Initialise Vite React TypeScript.
- Install dependencies.
- Configure Tailwind CSS.
- Set up React Router.
- Establish the folder structure.

**Phase 2: UI Development**
- Build the application layout.
- Build the navigation.
- Create the home page.
- Create the generator interface.
- Create the dashboard.

**Phase 3: QR Generation**
- Integrate the QR code generation library.
- Implement all supported QR code types.
- Add input validation.
- Implement live preview.

**Phase 4: Customisation**
- Implement colour controls.
- Implement pattern and corner customisation.
- Implement logo upload.
- Add additional settings.

**Phase 5: Export and Persistence**
- Implement PNG, SVG, and PDF downloads.
- Implement localStorage persistence.
- Implement dashboard management features.

**Phase 6: Testing and Refinement**
- Test all core functionality.
- Fix errors.
- Improve responsiveness.
- Verify production build.

---

## 13. Important Instructions to the Agent

1. Start by inspecting the existing project directory before making changes.
2. If no project exists, initialise a new Vite React TypeScript project.
3. Do not use Next.js, Vue, Angular, or another frontend framework.
4. Do not introduce a backend in the initial version.
5. Do not build only a static UI or visual prototype.
6. Implement actual QR code generation and downloads.
7. Do not skip any of the core features.
8. Prioritise functionality and usability over unnecessary complexity.
9. Test features as you implement them.
10. Do not claim that a feature is complete unless it has been implemented and verified.
11. Keep the application architecture extensible so authentication, cloud storage, dynamic QR codes, and analytics can be introduced in future versions.

## 14. Expected Deliverable

At the end of development, deliver:

- A complete Vite + React + TypeScript application.
- A clean, responsive user interface.
- Functional QR code generation.
- QR code customisation.
- Live previews.
- PNG, SVG, and PDF exports.
- QR code history and management.
- Local persistence.
- A working production build.
- A README containing setup instructions, dependencies, and development commands.

**Final objective:** Build a reliable, attractive, and easy-to-use QR Code Generator that users can use immediately without creating an account or depending on a backend.