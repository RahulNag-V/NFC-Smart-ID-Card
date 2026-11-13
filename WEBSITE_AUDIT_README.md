# 📋 Comprehensive Website Audit & Technical Architecture Reference

> **Project Name:** Ananta Sparsha — Digital Student Smart NFC Identity & Engineering Portfolio  
> **Repository:** [NFC-Smart-ID-Card](https://github.com/RahulNag-V/NFC-Smart-ID-Card)  
> **Production Deployment:** [https://rahulnagv-21cs051.web.app](https://rahulnagv-21cs051.web.app) • [https://rahulnagv-24cs051.web.app](https://rahulnagv-24cs051.web.app)  
> **Student Identity:** Rahul Nag V (USN: `1BH24CS051` / `24CS051`), Department of Computer Science & Engineering, Bangalore Technological Institute  
> **Audit Date:** November 13, 2026  
> **Verification Status:** 100% verified against live source code, Tailwind configurations, React component hierarchy, and Firebase security rules.

---

## Table of Contents

1. [Project Overview & Tech Stack](#1-project-overview--tech-stack)
   - [1.1 Purpose & Target Audience](#11-purpose--target-audience)
   - [1.2 Architecture & Technology Stack](#12-architecture--technology-stack)
   - [1.3 Complete Folder Structure](#13-complete-folder-structure)
2. [Design System & Visual Tokens](#2-design-system--visual-tokens)
   - [2.1 Color Palette & CSS Variables](#21-color-palette--css-variables)
   - [2.2 Curated Theme Presets](#22-curated-theme-presets)
   - [2.3 Typography Engine & Font Hierarchies](#23-typography-engine--font-hierarchies)
   - [2.4 Spacing, Borders, Shadows & Effects](#24-spacing-borders-shadows--effects)
   - [2.5 Responsive Breakpoints & Viewport Constraints](#25-responsive-breakpoints--viewport-constraints)
3. [Brand Voice, Tone & Copywriting](#3-brand-voice-tone--copywriting)
   - [3.1 Brand Voice & Communication Persona](#31-brand-voice--communication-persona)
   - [3.2 Actual Copy Breakdown (Hero, Academic, and Navigation)](#32-actual-copy-breakdown)
4. [Public-Facing Pages (Step-by-Step Breakdown)](#4-public-facing-pages-step-by-step-breakdown)
   - [4.1 Public Portfolio & Digital ID Route (`/`)](#41-public-portfolio--digital-id-route-)
     - [Section 1: College Header & Identity Navigation](#section-1-college-header--identity-navigation)
     - [Section 2: Vertical Smart Student ID Card (Interactive 3D Face)](#section-2-vertical-smart-student-id-card-interactive-3d-face)
     - [Section 3: Core Engineering Disciplines](#section-3-core-engineering-disciplines)
     - [Section 4: Academic Transcript, SGPA Calculations & Schooling](#section-4-academic-transcript-sgpa-calculations--schooling)
     - [Section 5: Technical Skills Directory](#section-5-technical-skills-directory)
     - [Section 6: Works & Projects Showcase (`/#works`)](#section-6-works--projects-showcase-works)
     - [Section 7: Contact & Verified Touchpoints (`/#contact`)](#section-7-contact--verified-touchpoints-contact)
   - [4.2 Custom 404 Route (`/404`)](#42-custom-404-route-404)
5. [Editing, Admin & Protected Sites/Views](#5-editing-admin--protected-sitesviews)
   - [5.1 Owner Authentication & Security Guards](#51-owner-authentication--security-guards)
   - [5.2 Protected Routes Map](#52-protected-routes-map)
   - [5.3 Owner Dashboard & Editor Architecture](#53-owner-dashboard--editor-architecture)
   - [5.4 Step-by-Step Editing Workflows (CRUD Operations)](#54-step-by-step-editing-workflows-crud-operations)
   - [5.5 Staging Draft vs. Live Production Isolation](#55-staging-draft-vs-live-production-isolation)
   - [5.6 Smart Phone Live Preview & Multi-Tier Card Exporter](#56-smart-phone-live-preview--multi-tier-card-exporter)
6. [Performance, Accessibility & SEO Audit Notes](#6-performance-accessibility--seo-audit-notes)
   - [6.1 SEO Metadata & Social Graph Engine](#61-seo-metadata--social-graph-engine)
   - [6.2 Accessibility (a11y) Conformance](#62-accessibility-a11y-conformance)
   - [6.3 Security Rules & Data Integrity (Firestore & Storage)](#63-security-rules--data-integrity-firestore--storage)
   - [6.4 Known Limitations & Technical Debt](#64-known-limitations--technical-debt)
   - [6.5 Automated Verification Test Suite (28 Tests)](#65-automated-verification-test-suite-28-tests)

---

## 1. Project Overview & Tech Stack

### 1.1 Purpose & Target Audience

**Ananta Sparsha** (Sanskrit: *Eternal Touch*) is an enterprise-grade Digital Student Identity and Interactive Academic Portfolio system engineered for **Rahul Nag V**, a Computer Science & Engineering undergraduate at **Bangalore Technological Institute (BTI)**, affiliated with Visvesvaraya Technological University (VTU).

The system serves three primary functions:
1. **Contactless Physical-to-Digital Smart ID (NFC / QR):** When tapped via an NFC card or scanned via its ISO 14443 Type A RFID / QR code, the system immediately presents an interactive 3D digital student identity card verifying enrollment, VTU credentials, institutional status, and academic progress without requiring external applications.
2. **Scholastic Credential Verification:** Provides registrars, recruiters, and academic councils with a tamper-resistant, cryptographically hashed (`VRF-21CS051-99A7`) view of engineering semester SGPA scores, cumulative degree CGPA, schooling benchmarks, and certified honors.
3. **Software Engineering & AI Research Portfolio:** Showcases peer-reviewed research implementations (e.g., 3D UNETR vision transformers for multi-modal brain tumor segmentation), full-stack distributed systems, network security intrusion engines, and hardware gateways.

**Target Audience:** University registrars, academic verification bodies, engineering hiring managers, technical interviewers, conference committees, and industry collaborators.

---

### 1.2 Architecture & Technology Stack

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|  React 18.3.1 (SPA)  |  TypeScript 5.6.3  |  Vite 5.4.11  |  Framer Motion 12.4.7 |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                                 STYLING & DESIGN                                  |
|  Tailwind CSS 3.4.15  |  CSS Variables Theme Cascading  |  Lucide React Icons     |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                              STATE & CONTEXT ENGINES                              |
|  AuthContext (MFA)  |  SiteContentContext (Live)  |  OwnerEditorContext (Staging) |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                              BACKEND & CLOUD RUNTIME                              |
|  Firebase Auth (Email/Phone OTP)  |  Cloud Firestore (Draft/Live)  |  GCS Storage |
+-----------------------------------------------------------------------------------+
```

| Layer | Technology | Version | Purpose in Codebase |
| :--- | :--- | :--- | :--- |
| **Core Framework** | React | `18.3.1` | Client-side reactive UI rendering and state orchestration. |
| **DOM Engine** | React DOM | `18.3.1` | Virtual DOM hydration and mount management. |
| **Language** | TypeScript | `5.6.3` | Strict static typing, schema modeling, and compile-time error checks. |
| **Build Tool** | Vite | `5.4.11` | Ultra-fast HMR, Rollup production bundling, and asset pipelines. |
| **Styling Library** | Tailwind CSS | `3.4.15` | Utility-first responsive CSS styling with custom theme variables. |
| **Animation Engine** | Framer Motion | `12.4.7` | Fluid layout transitions, 3D card tilt physics, and slide drawers. |
| **Iconography** | Lucide React | `0.460.0` | High-fidelity vector iconography across all modules. |
| **Class Utilities** | `clsx` & `tailwind-merge` | `2.1.1` / `2.5.5` | Dynamic className composition and style override resolution. |
| **Variants** | `class-variance-authority`| `0.7.1` | Component variant construction for buttons and badges. |
| **2D / 3D Graphics** | HTML5 Canvas & SVG | Native | High-density card rendering, barcode synthesis, and QR generation. |
| **QR Code Engine** | `qrcode` | `1.5.4` | Dynamic SVG and canvas QR code rendering for contact sharing. |
| **Image Export** | `html-to-image` | `1.11.13` | High-resolution 3x rasterization of ID card front and back faces. |
| **Cloud Backend** | Firebase SDK | `11.0.2` | Authentication, Firestore database, and Cloud Storage. |
| **Hosting Targets** | Firebase Hosting | v13 | Dual live deployment targets (`rahulnagv-21cs051`, `rahulnagv-24cs051`). |
| **Test Runner** | Node.js Test Runner | Native | `node --test scripts/test-system.mjs` (28 automated assertions). |

---

### 1.3 Complete Folder Structure

```
smartNFC/
├── .firebase/                     # Firebase CLI cache & deploy metadata
├── .github/                       # CI/CD GitHub Actions workflows
├── dist/                          # Production Vite build output (HTML, CSS, JS, assets)
├── public/                        # Static public assets
│   ├── favicon.svg                # Scalable vector college shield favicon
│   └── .nojekyll                  # GitHub Pages compatibility marker
├── scripts/                       # Test suites and development utilities
│   └── test-system.mjs            # 28-test automated system verification suite
├── src/                           # Application source code
│   ├── assets/                    # Bundled media assets
│   │   ├── bti-logo.jpeg          # Official Bangalore Technological Institute crest
│   │   └── student-photo.png      # High-resolution portrait photograph of Rahul Nag V
│   ├── components/                # React component architecture
│   │   ├── common/                # Shared global utilities
│   │   │   ├── ErrorBoundary.tsx  # React crash guard and deep state fallback
│   │   │   └── NotFoundPage.tsx   # Custom 404 page with return-to-ID routing
│   │   ├── education/             # Academic pathways
│   │   │   └── EducationSection.tsx # Engineering semesters, SGPA calculators, schooling
│   │   ├── id-card/               # Digital Student ID Card subsystem
│   │   │   ├── BarcodeView.tsx    # Code 128 / Code 39 SVG barcode generator
│   │   │   ├── CollegeEmblem.tsx  # High-fidelity SVG BTI institutional emblem
│   │   │   ├── CollegeNavbar.tsx  # Sticky desktop & mobile institutional navigation
│   │   │   ├── IdCardFrontFace.tsx # Front card face layout with RFID graphics
│   │   │   ├── IdCardBackFace.tsx  # Back card face layout with registrar endorsement
│   │   │   ├── QrCodeView.tsx     # Dynamic vector QR code generator
│   │   │   ├── StudentIdCard.tsx  # Horizontal ID card variant
│   │   │   ├── StudentIdCardFront.tsx # Horizontal front face
│   │   │   ├── StudentIdCardBack.tsx  # Horizontal back face
│   │   │   ├── StudentInfoSections.tsx # Detailed student metadata sections
│   │   │   └── VerticalStudentIdCard.tsx # Primary vertical 3D tilt & flip ID card
│   │   ├── owner/                 # Protected Owner Administration subsystem
│   │   │   ├── modules/           # Tabbed dashboard configuration modules
│   │   │   │   ├── AppearanceModule.tsx   # Themes, fonts, colors, layouts & backgrounds
│   │   │   │   ├── BasicInfoModule.tsx    # Profile details, drag-and-drop cover & avatar
│   │   │   │   ├── LivePreviewModule.tsx  # Realistic smartphone canvas live preview
│   │   │   │   ├── OverviewModule.tsx     # Completion meter, quick actions, health checks
│   │   │   │   ├── ProfessionalModule.tsx # Projects, SGPA semesters, skills, certs
│   │   │   │   ├── SectionsModule.tsx     # Section ordering, titles, subtitles & visibility
│   │   │   │   ├── SecurityModule.tsx     # Phone MFA, password validator, OTP controls
│   │   │   │   └── SocialLinksModule.tsx  # Digital touchpoints, URLs, brand colors
│   │   │   ├── OwnerDashboard.tsx # Primary owner console shell with slide-out menu
│   │   │   ├── OwnerLogin.tsx     # Secure sign-in with phone OTP recovery
│   │   │   └── SmartphoneFrame.tsx # Authentic smartphone mockup frame with Dynamic Island
│   │   ├── public/                # Public visitor views
│   │   │   └── PublicPortfolioView.tsx # Multi-tab portfolio (`home`, `works`, `contact`)
│   │   ├── skills/                # Skills repository
│   │   │   └── SkillsSection.tsx  # Categorized technical competencies & proficiency tags
│   │   └── ui/                    # Atomic UI components
│   │       ├── gradient-card.tsx  # Dynamic gradient container
│   │       ├── liquid-morph-floating-menu.tsx # Fluid bottom navigation bar
│   │       └── project-card.tsx   # Interactive engineering project showcase card
│   ├── context/                   # Global React Context providers
│   │   ├── AuthContext.tsx        # Firebase Auth state, phone verification, lockout guard
│   │   ├── OwnerEditorContext.tsx # Staging draft state, autosave, publish mutators
│   │   └── SiteContentContext.tsx # Live published profile data provider
│   ├── data/                      # Data models and initial seed state
│   │   ├── initialContent.ts      # Comprehensive seed data for published profile
│   │   ├── mockStudent.ts         # Backup student fallback data
│   │   ├── projects.ts            # Detailed engineering projects catalog
│   │   └── student.ts             # Student identity schema, seed data, privacy masks
│   ├── lib/                       # Cloud infrastructure & utilities
│   │   ├── firebase.ts            # Firebase app initialization, Firestore, Storage
│   │   └── passwordValidator.ts   # 5-factor password complexity & phone normalizer
│   ├── types/                     # TypeScript type contracts
│   │   └── content.ts             # PublishedProfileData, themes, sections, certificates
│   ├── App.tsx                    # Top-level client router with SEO metadata updates
│   ├── index.css                  # Tailwind directives, CSS variables, typography rules
│   ├── main.tsx                   # React root mount entry point
│   └── vite-env.d.ts              # Vite environment variable type declarations
├── .env                           # Environment variables (API keys, project IDs)
├── .env.example                   # Environment configuration template
├── .firebaserc                    # Firebase project target mappings
├── .gitignore                     # Git exclusions
├── firebase.json                  # Firebase Hosting rewrite rules and headers
├── firestore.rules                # Production Cloud Firestore security rules
├── index.html                     # HTML5 shell, Google Fonts preconnect, viewport tags
├── package.json                   # Dependency definitions, scripts, engines
├── postcss.config.js              # PostCSS Tailwind and Autoprefixer plugins
├── README.md                      # Quickstart documentation
├── storage.rules                  # Production Cloud Storage security rules
├── tailwind.config.js             # Tailwind design tokens, vintage palette, font extensions
├── tsconfig.json                  # TypeScript compiler options
└── vite.config.ts                 # Vite build settings and plugins
```

---

## 2. Design System & Visual Tokens

The design system is grounded in an authentic scholastic parchment aesthetic, pairing warm organic sandstone tones with dignified dark-brown and brass accents. All tokens are dynamically cascaded through CSS variables, enabling real-time theme customization without CSS re-compilation.

### 2.1 Color Palette & CSS Variables

#### Root CSS Variable Tokens (`src/index.css`)

```css
:root {
  --background: #fbf8f3;             /* Warm cream parchment */
  --foreground: #2b241e;             /* Deep charcoal bistre */

  --card: #fffefb;                   /* Pristine warm off-white surface */
  --card-foreground: #2b241e;

  --popover: #fffefb;
  --popover-foreground: #2b241e;

  --primary: #a67c52;                /* Classic academic bronze gold */
  --primary-foreground: #ffffff;

  --secondary: #e5ded5;              /* Soft parchment stone */
  --secondary-foreground: #2b241e;

  --muted: #f0eae1;                  /* Subdued parchment beige */
  --muted-foreground: #73685c;       /* Muted scholastic taupe */

  --accent: #d9cdbd;                 /* Refined sand accent border */
  --accent-foreground: #2b241e;

  --destructive: #bc473b;            /* Earthy terracotta crimson */
  --destructive-foreground: #ffffff;

  --border: #d9cdbd;                 /* Standard warm card border */
  --input: #e5ded5;                  /* Input background fill */
  --ring: #a67c52;                   /* Focus indicator ring */

  --radius: 0.25rem;
}
```

#### Tailored `vintage` Color Scale (`tailwind.config.js`)

| Token | Hex Value | Usage in Interface |
| :--- | :--- | :--- |
| `vintage-50` | `#fdfbf7` | High-light card backgrounds and pristine input fills. |
| `vintage-100` | `#fbf8f3` | Global canvas backdrop and viewport background. |
| `vintage-200` | `#f0eae1` | Secondary tab pills, subtle hover fills, badge containers. |
| `vintage-300` | `#e5ded5` | Sub-surface borders and divider lines. |
| `vintage-400` | `#d9cdbd` | Card borders, structural boundaries, and input borders. |
| `vintage-500` | `#a67c52` | Secondary bronze actions, watermark fills, accent tags. |
| `vintage-600` | `#8e653e` | Hover state for bronze buttons. |
| `vintage-700` | `#754f2d` | Medium brown emphasis copy and icons. |
| `vintage-800` | `#5c3b20` | Dark brown button hover and pressed states. |
| `vintage-900` | `#2b241e` | Primary body typography, deep card borders, major headings. |
| `vintage-terracotta` | `#bc473b` | Destructive actions, reset buttons, and error highlights. |

#### Semantic Color Tokens

| Semantic Role | Hex Value | RGB / Class | Functional Application |
| :--- | :--- | :--- | :--- |
| **Signature Brand** | `#704a29` | `rgb(112, 74, 41)` | Active navbar tabs, owner badges, primary CTA buttons. |
| **Success / Verified** | `#10B981` | `rgb(16, 185, 129)` | Active student status dot, verified badges, pass alerts. |
| **Success Container** | `#f2f8f2` | `border-[#86efac]` | Success toast background with `#14532d` typography. |
| **Warning / Notice** | `#d97706` | `rgb(217, 119, 6)` | Duplicate semester warnings, draft staging indicators. |
| **Error / Destructive**| `#bc473b` | `rgb(188, 71, 59)` | Lockout alerts, delete project confirmations. |
| **Error Container** | `#fef2f2` | `border-[#fca5a5]` | Error toast background with `#991b1b` typography. |
| **Info / Cyber** | `#38bdf8` | `rgb(56, 189, 248)` | Technical stack highlights, research paper badges. |

---

### 2.2 Curated Theme Presets

The application features 6 production presets managed via `AppearanceModule.tsx`. Each preset supplies a unified combination of colors, typography, and layout rules:

| Preset Name | Category | Background | Card | Primary | Accent | Text | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Classic Academic** *(Default)* | Classic | `#fcf8f2` | `#ffffff` | `#704a29` | `#c59b27` | `#221b16` | Warm parchment, deep burgundy, and scholastic serif typography. |
| **Premium Dark** | Dark Luxury | `#0c0a09` | `#171412` | `#d4af37` | `#f59e0b` | `#fafaf9` | Jet black obsidian, metallic champagne gold, high-contrast serif. |
| **Emerald Professional** | Dark Luxury | `#041610` | `#0a231b` | `#10b981` | `#34d399` | `#ecfdf5` | Deep imperial forest emerald, jade accents, executive styling. |
| **Midnight Blue** | Modern | `#070b14` | `#0f172a` | `#38bdf8` | `#818cf8` | `#f8fafc` | Cosmic sapphire indigo, cyan highlights, cybernetic elegance. |
| **Minimal White** | Minimalist | `#ffffff` | `#f8fafc` | `#0f172a` | `#64748b` | `#0f172a` | Crisp monochromatic slate, ultra-clean geometry, modern sans. |
| **Warm Paper** | Classic | `#f8f4ed` | `#ffffff` | `#8c532b` | `#d97706` | `#29221b` | Handcrafted warm sandstone, earth ochre, and tactile print feel. |

---

### 2.3 Typography Engine & Font Hierarchies

#### Font Families

- **Primary Heading & Serif:** `"Times New Roman", Times, "Tinos", Georgia, serif`
- **Secondary Body & Sans:** `"Times New Roman", Times, "Tinos", Georgia, serif` *(Enforced across all elements via CSS base reset for historic scholastic consistency)*
- **Monospace & Code:** `"JetBrains Mono", "Courier Prime", "Courier New", monospace`

#### Google Fonts Library (`index.html`)

The HTML document preconnects to Google Fonts and loads 21 typographic typefaces:
- **Serif Heritage:** `Bodoni Moda`, `Cinzel`, `Cormorant Garamond`, `EB Garamond`, `Lora`, `Merriweather`, `Playfair Display`, `Tinos`
- **Modern Sans:** `DM Sans`, `Inter`, `Montserrat`, `Outfit`, `Plus Jakarta Sans`, `Poppins`, `Roboto`, `Space Grotesk`, `Syne`
- **Code & Monospace:** `Courier Prime`, `Fira Code`, `JetBrains Mono`, `Space Mono`

#### Exact Font Scale & Sizing Hierarchy

| Level | Size (Tailwind) | Computed Rem / Px | Weight | Line Height | Tracking | Application |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **H1** | `text-2xl sm:text-3xl` | `1.5rem - 1.875rem` (24–30px) | Bold (700) / Black (900) | `leading-tight` (1.25) | `-0.025em` | Student Full Name, Hero titles, 404 header. |
| **H2** | `text-lg sm:text-xl` | `1.125rem - 1.25rem` (18–20px) | Bold (700) | `leading-snug` (1.375) | `-0.015em` | Module titles, College main header. |
| **H3** | `text-sm sm:text-base` | `0.875rem - 1.0rem` (14–16px) | SemiBold (600) / Bold (700) | `leading-normal` (1.5) | `normal` | Project card titles, Academic year headers. |
| **H4** | `text-xs` | `0.75rem` (12px) | Bold (700) | `leading-normal` (1.5) | `0.05em` (wider) | Section subtitles, Category labels, Table caps. |
| **Body** | `text-xs sm:text-sm` | `0.75rem - 0.875rem` (12–14px) | Regular (400) / Medium (500) | `leading-relaxed` (1.625) | `normal` | Biographies, Project descriptions, Coursework notes. |
| **Caption** | `text-[10px] - text-[11px]` | `0.625rem - 0.6875rem` (10–11px)| Medium (500) | `leading-tight` (1.25) | `0.025em` | Timestamps, USN labels, Expiry badges, Chips. |
| **Micro** | `text-[8.5px] - text-[9px]` | `0.53rem - 0.56rem` (8.5–9px) | SemiBold (600) | `leading-none` (1.0) | `0.05em` | Barcode subtext, chip encryption markers. |
| **Button** | `text-xs` | `0.75rem` (12px) | SemiBold (600) / Bold (700) | `leading-none` (1.0) | `0.01em` | Action buttons, Navigation items, Form toggles. |

---

### 2.4 Spacing, Borders, Shadows & Effects

- **Border Radii:**
  - `rounded-lg`: `0.375rem` (6px) — Inputs, chips, inner tool buttons.
  - `rounded-xl`: `0.5rem` (8px) — Action buttons, small modals, category cards.
  - `rounded-2xl`: `0.75rem` (12px) — Project cards, ID card outer container, drawer dialogs.
  - `rounded-3xl`: `1.0rem` (16px) — Preview modal shell, main hero containers.
  - `rounded-full`: `9999px` — Status pills, circular avatars, toggle switches.
- **Box Shadows:**
  - `shadow-2xs`: `0 1px 2px 0 rgba(0, 0, 0, 0.03)` — Subtle elevation on chips.
  - `shadow-xs`: `0 1px 3px 0 rgba(0, 0, 0, 0.05)` — Interactive button resting state.
  - `shadow-sm`: `0 2px 4px 0 rgba(0, 0, 0, 0.06)` — Top header bar and navbar pills.
  - `shadow-md`: `0 4px 6px -1px rgba(0, 0, 0, 0.08)` — Card hover state and dropdowns.
  - `shadow-lg`: `0 10px 15px -3px rgba(0, 0, 0, 0.1)` — Sticky bottom bar and mobile drawers.
  - `shadow-xl`: `0 20px 25px -5px rgba(0, 0, 0, 0.12)` — Floating modals, toast alerts.
  - `shadow-2xl`: `0 25px 50px -12px rgba(0, 0, 0, 0.25)` — 3D card tilt elevation.
- **Glassmorphism & Blurs:**
  - `backdrop-blur-xs`: Subtle `2px` blur for image scrims and photo overlays.
  - `backdrop-blur-sm`: `4px` blur for modal backdrops (`bg-black/50`).
  - `backdrop-blur-md`: `12px` frosted glass blur for sticky headers (`bg-[#FAF7F2]/95`).
- **Container Max-Widths:**
  - Phone Canvas: `max-w-sm` (`384px`)
  - ID Card Standard: `max-w-md` (`448px`)
  - Dashboard Content Area: `max-w-4xl` (`896px`)
  - Works & Projects Showcase: `max-w-6xl` (`1152px`)

---

### 2.5 Responsive Breakpoints & Viewport Constraints

| Breakpoint | Minimum Width | Architectural Behavior |
| :--- | :--- | :--- |
| **Mobile (`default`)** | `< 768px` | Single-column layout, sticky 64px header with auto-hide on scroll, slide-out hamburger navigation drawer, sticky bottom action bar, minimum 44x44px touch targets, enforced 16px form inputs to eliminate iOS Safari auto-zoom. |
| **Tablet (`md:`)** | `768px - 1023px`| 2-column project grids, expanded header pills, category selector dropdown in professional module, fixed horizontal bottom actions. |
| **Desktop (`lg:`)** | `1024px - 1279px`| Full persistent sidebar navigation, horizontal pill sub-navigation tabs, side-by-side live editor preview option, multi-column academic grids. |
| **Wide Screen (`xl:`)** | `≥ 1280px` | 3-column project showcase, expansive full-resolution certificate galleries, maximum container padding. |

---

## 3. Brand Voice, Tone & Copywriting

### 3.1 Brand Voice & Communication Persona

The website's copywriting embodies three foundational attributes:
1. **Dignified Scholastic Authority:** Reflects the rigor and heritage of Visvesvaraya Technological University and Bangalore Technological Institute. Uses terminology such as *"Affiliated to Visvesvaraya Technological University"*, *"Choice Based Credit System"*, and *"Academic Council Validation"*.
2. **Technically Precise & Architectural:** Avoids superficial buzzwords. Technical skills and projects are documented with concrete technical stacks: *"Vision Transformers"*, *"3D UNETR"*, *"Adaptive Self-Distillation"*, *"Isolation Forest Anomaly Model"*, and *"Contactless Physical-to-Digital NFC Gateways"*.
3. **Respectful & Transparent:** The visitor is addressed as an esteemed reviewer, colleague, or academic evaluator. Clear privacy notices indicate which personal fields are protected under cryptographic masking toggles.

---

### 3.2 Actual Copy Breakdown

#### Institutional & Hero Section Copy

- **Top College Header:**
  - Main Title: `"BANGALORE TECHNOLOGICAL INSTITUTE"`
  - Institutional Tagline: `"Commitment to Organised Totality • Engineering Excellence"`
  - Accreditation Subtitle: `"Affiliated to Visvesvaraya Technological University (VTU) • Approved by AICTE • Recognized by Govt. of Karnataka"`
  - College Code: `"BTI-051"`
- **Student Profile Identity:**
  - Full Legal Name: `"Rahul Nag V"`
  - Professional Headline: `"Full-Stack Software Engineer & AI Researcher"`
  - Biography: `"Computer Science and Engineering undergraduate at Bangalore Technological Institute. Specializing in deep learning medical imaging (3D UNETR), full-stack cloud architectures, and tactile contactless NFC hardware systems."`
  - Geographic Base: `"Bengaluru, Karnataka, India"`
  - University Seat Number (USN): `"1BH24CS051"` (or Student ID: `"1BH24CS051"`)
  - Department: `"Department of Computer Science and Engineering (CSE)"`
  - Current Status: `"V Semester (Pursuing) • 2024–2028"`
  - Status Indicator: `"Verified Digital ID • Active"`

#### Core Disciplines Copy

1. **Physical & NFC Hardware:**  
   *"Programmable NFC cards, Google Review stands, and dynamic cloud routing without rewriting tags."*
2. **Deep Learning & Medical Imaging:**  
   *"Vision Transformers (3D UNETR), BraTS MRI brain tumor segmentation, and online self-distillation."*
3. **Full-Stack & Cloud Architecture:**  
   *"Event scanning systems, QR code contact infrastructure, Firebase distributed backends, and React."*

#### Navigation Items & Action CTAs

- Public Tab Navigation: `"Home"`, `"Works"`, `"Contact"`
- Filter Categories: `"All Projects"`, `"Full-Stack"`, `"AI / ML"`, `"Cybersecurity"`, `"Web Apps"`
- Primary Interactive CTAs:
  - `"3D Card"` vs. `"Front & Back"`
  - `"Flip Card"`
  - `"Export Front Card (PNG)"`
  - `"Export Back Card (PNG)"`
  - `"Print ID Card"`
  - `"Share ID & QR Code"`
  - `"Owner • Edit Profile"`

---

## 4. Public-Facing Pages (Step-by-Step Breakdown)

### 4.1 Public Portfolio & Digital ID Route (`/`)

The public route renders `src/components/public/PublicPortfolioView.tsx`, providing a full-featured single-page application experience with hash-based deep linking (`/#home`, `/#works`, `/#contact`).

```
+-----------------------------------------------------------------------------------+
|  COLLEGE NAVBAR: BTI Crest | BANGALORE TECHNOLOGICAL INSTITUTE | Owner Pill       |
+-----------------------------------------------------------------------------------+
|  WATERMARK BACKGROUND: "HOME" / "WORKS" / "CONTACT" (Subtle Gold Serif SVG)       |
+-----------------------------------------------------------------------------------+
|  [TAB 1: HOME]                                                                    |
|    - 3D Interactive Vertical Student ID Card (Front / Back Flip + Tilt)           |
|    - Core Engineering Disciplines (3-Card Feature Grid)                           |
|    - Education Section (VTU Engineering Semesters, SGPA, CGPA, SSLC & PUC)        |
|    - Technical Skills Directory (Grouped Proficiency Chips)                       |
+-----------------------------------------------------------------------------------+
|  [TAB 2: WORKS]                                                                   |
|    - Filter Category Pill Selector (All, Full-Stack, AI/ML, Cyber, Web Apps)      |
|    - Engineering Projects Grid (ADMITTO Scanner, 3D UNETR, NetSentinel, etc.)     |
+-----------------------------------------------------------------------------------+
|  [TAB 3: CONTACT]                                                                 |
|    - Verified Personal & Institutional Contact Details (With Privacy Masking)     |
|    - Interactive Direct Message Form                                              |
|    - Official Social Channels Grid (GitHub, LinkedIn, X, Portfolio, WhatsApp)     |
+-----------------------------------------------------------------------------------+
|  LIQUID MORPH FLOATING MENU: Home | Works | Contact (Fixed Bottom Navigation)     |
+-----------------------------------------------------------------------------------+
```

#### Section 1: College Header & Identity Navigation
- **Component:** `src/components/id-card/CollegeNavbar.tsx`
- **Structure:** Sticky `top-0 z-40` bar with frosted glass backdrop (`bg-[#fffefb]/95 backdrop-blur-md border-b border-[#d9cdbd]`).
- **Interactive Elements:**
  - Left: Vector institutional emblem (`CollegeEmblem.tsx`) + College name and affiliations. Clicking navigates to `#home`.
  - Right: Floating `"Owner • Edit Profile"` button (visible if authenticated as owner) with green pulsing status dot.

#### Section 2: Vertical Smart Student ID Card (Interactive 3D Face)
- **Component:** `src/components/id-card/VerticalStudentIdCard.tsx`
- **View Controls:** Top segmented control toggling between **"3D Card"** and **"Front & Back"** views, alongside a secondary **"Flip Card"** button.
- **Front Face (`IdCardFrontFace.tsx`):**
  - Institutional gold foil header with college crest.
  - High-resolution student photograph (`assets/student-photo.png`) framed by a golden border and green active enrollment indicator.
  - Student full name, USN, degree, branch, and academic validity period (`01 Oct 2024 – 31 Sep 2028`).
  - Contactless RFID smart chip icon + Code 128 dynamic barcode.
- **Back Face (`IdCardBackFace.tsx`):**
  - Emergency contact details, blood group, current residential address, and permanent address.
  - Authorized Registrar signature block and college seal.
  - Cryptographic verification badge (`VRF-21CS051-99A7`) and scannable QR code resolving to the verification gateway.
- **Physics & Gestures:** Mouse-driven 3D tilt tracking (`rotateX`, `rotateY`) on desktop; device orientation / gyroscope tilt simulation on mobile; 180° smooth flip transition via Framer Motion.

#### Section 3: Core Engineering Disciplines
- **Layout:** Responsive 3-card vertical stack / grid with icon badges, category headings, and technical architectural summaries.

#### Section 4: Academic Transcript, SGPA Calculations & Schooling
- **Component:** `src/components/education/EducationSection.tsx`
- **Engineering Progression:**
  - 3rd Year B.E. (In Progress): 5th Semester actively pursuing.
  - 2nd Year B.E. (Completed): 3rd Sem SGPA `7.71`, 4th Sem SGPA `8.00` → Yearly Average SGPA: `7.86`.
  - 1st Year B.E. (Completed): 1st Sem SGPA `7.15`, 2nd Sem SGPA `7.60` → Yearly Average SGPA: `7.38`.
  - **Cumulative Degree CGPA:** Automatically computed across all 4 completed semesters: **`7.62` / 10.0**.
- **Schooling Benchmarks:**
  - 12th PUC (PCMC): St. Joseph Pre-University College — **`80.64%`** (Karnataka PUE Board).
  - 10th SSLC: Holy Cross High School — **`80.33%`** (KSEEB).
- **Certifications Gallery:** Accredited certificates with credential verification links and full-screen image lightbox preview.

#### Section 5: Technical Skills Directory
- **Component:** `src/components/skills/SkillsSection.tsx`
- **Categorization:** Languages, Frontend, Backend, AI & ML, Hardware & IoT, Developer Tools.
- **Proficiency Tags:** Interactive filterable chips indicating skill tier (Advanced, Proficient, Hands-on, Specialized).

#### Section 6: Works & Projects Showcase (`/#works`)
- **Component:** `src/components/public/PublicPortfolioView.tsx` & `src/components/ui/project-card.tsx`
- **Filter Bar:** Touch-friendly horizontal selector: `"All Projects" (7)`, `"Full-Stack" (3)`, `"AI / ML" (2)`, `"Cybersecurity" (1)`, `"Web Apps" (5)`.
- **Card Specs:** Featured cover imagery, technical tags, GitHub repo link, live deployment demo link, and responsive multi-column layout.

#### Section 7: Contact & Verified Touchpoints (`/#contact`)
- **Direct Message Form:** Controlled inputs for name, email, and message with instant client validation and success confirmation.
- **Touchpoints Grid:** GitHub, LinkedIn, X, Instagram, Personal Website, and WhatsApp. External links enforce `target="_blank" rel="noopener noreferrer"`.
- **Privacy Masking:** Protected attributes (phone, email, addresses) are conditionally obscured (`maskPhone`, `maskEmail`, `maskAddress`) unless toggled public by the owner.

---

### 4.2 Custom 404 Route (`/404`)

- **Component:** `src/components/common/NotFoundPage.tsx`
- **Trigger:** Any unmapped URL path (e.g., `/unknown`, `/portfolio/test`).
- **Features:**
  - Institutional header with BTI crest.
  - Clear error message: *"The digital identity credential or section you requested cannot be located."*
  - Direct navigation buttons: `"Back to ID Card"` and `"Owner Console"`.
  - Dynamic SEO title tag update (`404 Page Not Found • Ananta Sparsha Digital ID`).

---

## 5. Editing, Admin & Protected Sites/Views

### 5.1 Owner Authentication & Security Guards

The authentication system (`src/context/AuthContext.tsx` and `src/components/owner/OwnerLogin.tsx`) enforces strict owner-only access controls:

1. **Authorized Owner Validation:** Access is restricted to the designated account:
   - Configured Email: `rahulnagv.dev@gmail.com` (case-insensitive check)
   - Configured UID: `VITE_OWNER_UID` / Firestore rule authorization
   - Configured Phone: `+91 98446 16699`
2. **Brute-Force Rate Limiting & Lockout Guard:**
   - Failed attempts are tracked in memory and persistent storage.
   - Reaching **5 consecutive failed attempts** triggers an automatic **60-second security lockout**.
   - During lockout, submission buttons are disabled and a live countdown timer displays remaining seconds.
3. **Multi-Factor Authentication (Phone OTP):**
   - Firebase `RecaptchaVerifier` integration for invisible bot protection.
   - SMS one-time password verification via `signInWithPhoneNumber`.
   - Used for initial registration, phone updates, and password reset recovery.
4. **Strict Password Complexity Validator (`src/lib/passwordValidator.ts`):**
   - Minimum 12 characters (minimum 8 for score >= 2)
   - At least 1 uppercase letter (`[A-Z]`)
   - At least 1 lowercase letter (`[a-z]`)
   - At least 1 numerical digit (`[0-9]`)
   - At least 1 special character (`[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]`)
   - Confirmation matching requirement

---

### 5.2 Protected Routes Map

| Route Path | Access Level | Component Mounted | Purpose |
| :--- | :--- | :--- | :--- |
| `/` or `/#` | **Public** | `PublicPortfolioView` | Read-only digital ID card, academic path, and engineering projects. |
| `/owner/login` | **Public** | `OwnerLogin` | Secure administrative authentication and phone OTP password recovery. |
| `/owner/dashboard`| **Owner-Only** | `OwnerDashboard` (`OwnerEditorProvider`) | Comprehensive content management, live preview, and profile configuration. |
| `/owner/security` | **Owner-Only** | `OwnerDashboard` (initialTab: `security`) | Cryptographic governance, phone MFA registration, password modification. |
| `/404` | **Public** | `NotFoundPage` | Informative fallback screen for unmapped route requests. |

---

### 5.3 Owner Dashboard & Editor Architecture

The editor is wrapped in `OwnerEditorProvider` (`src/context/OwnerEditorContext.tsx`), providing 7 distinct management modules:

```
+-----------------------------------------------------------------------------------+
|  TOP HEADER BAR: Student Avatar | Full Name | "Owner" Pill | Live Toggle | Share  |
+-----------------------------------------------------------------------------------+
|  SIDEBAR NAV (lg:w-64)            |  ACTIVE MODULE WORKSPACE                      |
|  - Overview                       |  (Renders currently selected module)          |
|  - Edit Profile (Basic Info)      |                                               |
|  - Appearance                     |  [SPLIT SCREEN / LIVE PREVIEW MODAL]          |
|  - Professional Info              |  Realistic Smartphone Mockup Frame            |
|  - Social Links                   |  - Dynamic Island, Speaker Slit               |
|  - Profile Sections               |  - Interactive 3D Card Tilt & Flip            |
|  - Security & Access              |  - 2-Tier High-Resolution PNG Exporters       |
+-----------------------------------------------------------------------------------+
|  STICKY BOTTOM ACTIONS: Save Staging Draft  |  Publish Live to Production         |
+-----------------------------------------------------------------------------------+
```

---

### 5.4 Step-by-Step Editing Workflows (CRUD Operations)

#### 1. Overview Module (`OverviewModule.tsx`)
- Calculates real-time **Profile Completion Percentage** across 10 vital parameters.
- Quick navigation tiles to all modules.
- Health status audits (NFC hardware tag readiness, verified credential status, public mode visibility).

#### 2. Edit Profile & Identity Module (`BasicInfoModule.tsx`)
- **Cover Backdrop Uploader:**
  - Entire banner acts as a drag-and-drop dropzone with dashed border.
  - Client-side `<canvas>` image compression to **1200px max width** (`image/webp` or `image/jpeg` at 0.8 quality).
  - Off-thread decoding via `createImageBitmap(file)` preventing UI freezes.
  - Instant optimistic preview (`URL.createObjectURL`) appearing in **< 50ms**.
  - Non-blocking top progress bar and alert pill with `Retry` capability.
  - Hover/mobile overlay buttons to `"Change Cover"` or `"Reset / Remove"`.
- **Overlapping Avatar Uploader:** Drag-and-drop or click to browse photo with camera badge and circular active dot.
- **Personal Details:** Full name, headline, biography, location, and website URL.
- **Academic Credentials:** USN, Student ID, Branch, Section, Semester, Academic Year, Enrollment Status (`ACTIVE`, `GRADUATED`, `ON LEAVE`), and Curriculum Scheme.
- **Private Demographics & Masking Toggles:** Blood group, date of birth, mobile phone, email, current address, permanent address, and emergency contact visibility.

#### 3. Appearance Module (`AppearanceModule.tsx`)
- Theme preset selector (Classic Academic, Premium Dark, Emerald Professional, Midnight Blue, Minimal White, Warm Paper).
- Typography customizer (Times New Roman, Cinzel, Playfair Display, Cormorant Garamond, EB Garamond, Bodoni Moda, Merriweather, Inter, DM Sans, Plus Jakarta Sans, JetBrains Mono).
- Palette overrides: Background, Foreground, Card, Primary, Accent, Border, Muted, Ring.
- Background customizer: Solid color, Linear/Radial gradients with custom angles, or custom background image with adjustable overlay opacity.

#### 4. Professional Credentials Module (`ProfessionalModule.tsx`)
- **Category Navigation:** Touch-friendly custom dropdown selector on mobile/tablet (`< 1024px` / `lg:hidden`) with active tab icon, label, count badge, and rotating chevron; horizontal pill tabs on desktop (`hidden lg:flex`).
- **Projects Portfolio (CRUD):**
  - Add, edit, delete, and reorder (up/down) projects.
  - Project title, category, filter tags, description, technologies, GitHub link, live URL, and featured toggle.
  - Multi-image drag-and-drop uploader with thumbnail reordering.
- **Academics & SGPA (CRUD):**
  - Degree year manager (Year 1 to Year 4).
  - Strictly max 2 semesters per year (Semesters 1 to 8).
  - Duplicate semester warning & identical score detection.
  - Automated yearly average SGPA and degree cumulative CGPA calculations.
  - 10th & 12th standard schooling records manager.
- **Technical Skills (CRUD):** Add, edit, categorize, and delete technical competencies with proficiency levels.
- **Certifications (CRUD):** Multi-image certificate uploader with issuer, issue date, credential URL, and lightbox preview.

#### 5. Social Links Module (`SocialLinksModule.tsx`)
- Configure handles, custom action text, destination URLs, and brand gradients for GitHub, LinkedIn, X, Instagram, Website, Email, and WhatsApp.
- Toggle visibility and drag/reorder digital touchpoints.

#### 6. Profile Sections Module (`SectionsModule.tsx`)
- Reorder global sections (Watermark, ID Card, Education, Skills, Disciplines, Featured Projects, Call to Action, Custom Text/Image).
- Toggle visibility and customize section titles, subtitles, and descriptions.

#### 7. Security & Access Module (`SecurityModule.tsx`)
- Firebase Authentication management.
- Register / update multi-factor verification phone number via SMS OTP.
- Change password with OTP verification and 5-factor complexity enforcement.
- Active session inspection and instant sign-out.

---

### 5.5 Staging Draft vs. Live Production Isolation

To prevent accidental data corruption or partial edits appearing on physical NFC cards, the application implements a strict **two-tier staging architecture**:

```
+-----------------------------------------------------------------------------------+
|                             OWNER EDITOR (LOCAL / DRAFT)                          |
|                                                                                   |
|   User edits profile fields -> Saved to Firestore '/profiles/{id}/private/draft'  |
|   (or local storage fallback). Public visitors NEVER see these pending changes.   |
+-----------------------------------------------------------------------------------+
                                         |
                       [Click "Publish Live" Button]
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                           PRODUCTION (PUBLISHED PROFILE)                          |
|                                                                                   |
|   Atomically written to Firestore '/profiles/{id}'. Version counter incremented. |
|   Snapshot stored in '/profiles/{id}/versions/{v}'. All public scans update live. |
+-----------------------------------------------------------------------------------+
```

- **Draft State (`saveDraft`):** Persists pending work to Firestore path `profiles/rahulnagv/private/draft`. Marked as `isDirty`.
- **Discard State (`discardChanges`):** Reverts draft state back to currently published content.
- **Live Publishing (`publishLive`):** Validates schema, increments document version, archives snapshot to `profiles/rahulnagv/versions/{versionId}`, and overwrites root `profiles/rahulnagv`. Instantly updates all NFC and QR scans globally.

---

### 5.6 Smart Phone Live Preview & Multi-Tier Card Exporter

- **Component:** `src/components/owner/SmartphoneFrame.tsx` & `ProfilePreviewModal.tsx`
- **Mockup Hardware:** Authentic smartphone bezel with rounded outer frame (`rounded-[44px]`), speaker slit (`w-12 h-1`), Dynamic Island pill (`w-24 h-4`), status bar indicators (9:41 AM, 5G, 100% battery), and bottom home bar.
- **High-Resolution Card Exporter:**
  - Rasterizes DOM node `#export-card-front` and `#export-card-back` using `html-to-image`.
  - Enforces `pixelRatio: 3` and `cacheBust: true`, exporting ultra-crisp `300 DPI` PNG files formatted as `${FullName}_${USN}_ID_FRONT.png` and `${FullName}_${USN}_ID_BACK.png`.
  - Secondary `"Print ID Card"` action invokes `@media print` optimized stylesheets.

---

## 6. Performance, Accessibility & SEO Audit Notes

### 6.1 SEO Metadata & Social Graph Engine

- **Dynamic Route Titles & Meta Descriptions (`App.tsx`):**
  - **Public ID:** `"Digital Student ID • Rahul Nag V (24CS051) | Bangalore Technological Institute"`
  - **Owner Login:** `"Owner Sign In • Ananta Sparsha Digital ID Console"`
  - **Owner Console:** `"Owner Console • Ananta Sparsha Smart ID Management"`
  - **Security Portal:** `"Security & OTP Access Controls • Ananta Sparsha Console"`
  - **404 Fallback:** `"404 Page Not Found • Ananta Sparsha Digital ID"`
- **Semantic HTML Structure:**
  - Enforces strict semantic layout (`<header>`, `<main>`, `<nav>`, `<aside>`, `<section>`, `<footer>`, `<button>`, `<input>`).
  - No empty or non-semantic button tags; all interactive controls contain text or explicit `aria-label` / `title` attributes.
- **Crawler Optimization:** Viewport configured with `width=device-width, initial-scale=1.0`, Open Graph and Twitter Card tags ready, and canonical URL pointing to primary deployment target.

---

### 6.2 Accessibility (a11y) Conformance

- **Color Contrast:** Deep charcoal (`#2b241e`) and dark brown (`#704a29`) on parchment background (`#fbf8f3`) exceed WCAG 2.1 AAA contrast requirements (`> 7:1`).
- **Keyboard Navigation & ARIA:**
  - Dropdown selectors utilize `role="listbox"`, `role="option"`, `aria-haspopup="listbox"`, and `aria-expanded`.
  - Escape key listeners automatically dismiss modal overlays, QR share dialogs, and floating navigation menus.
  - Active elements feature visible focus rings (`focus:ring-2 focus:ring-[#704a29]`).
- **Mobile Touch Usability:**
  - All interactive buttons and touchpoints enforce a minimum touch target of **`44 x 44 px`**.
  - Mobile text inputs enforce `font-size: 16px` (`text-base`) on screens `< 768px` in `src/index.css` to prevent annoying iOS Safari viewport auto-zooming.
  - Generous scroll-margin (`scroll-mt-24`) ensures focused inputs remain unobstructed by on-screen keyboards.
- **Reduced Motion:** Gyroscope and 3D card tilt listeners inspect `window.matchMedia('(prefers-reduced-motion: reduce)')` and disable automatic animation loops if active.

---

### 6.3 Security Rules & Data Integrity (Firestore & Storage)

#### Cloud Firestore Security (`firestore.rules`)
- **Public Read:** Public visitors can read published profiles (`profiles/{profileId}`).
- **Owner-Only Write:** Only requests matching `isOwner()` (authenticated with `rahulnagv.dev@gmail.com` or authorized UID) can create, update, or delete profiles.
- **Strict Subcollection Isolation:** Private drafts (`/private/{document=**}`) and version snapshots (`/versions/{versionId}`) deny public reads completely.
- **Payload Validation:** Payloads are validated against schema boundaries and capped at `< 1,000,000` bytes (1 MB) to prevent resource exhaustion attacks.

#### Cloud Storage Security (`storage.rules`)
- **Public Image Read:** Visitors can retrieve profile photographs, college logos, and project media.
- **Owner-Only Uploads:** Uploads require authentication matching the owner's UID or email.
- **MIME & Size Restrictions:** Uploads are strictly restricted to `image/(jpeg|png|webp|svg+xml)` and capped at **5 MB max**.

---

### 6.4 Known Limitations & Technical Debt

1. **Large Vendor Minified Chunks:**
   - Production bundle output generated by Vite includes an asset chunk (`dist/assets/index-*.js`) of approximately `1,265 kB` (gzip: `~321 kB`). This exceeds Vite's default 500 kB suggestion due to bundling Framer Motion, Firebase Auth, Firestore, and `html-to-image` into a unified single-page application.
   - *Recommendation:* Introduce dynamic `import()` code-splitting for `/owner/*` admin modules so public visitors only download public ID card components.
2. **Browser Off-Thread Canvas Support:**
   - Client-side cover compression leverages `createImageBitmap(file)`. In older legacy mobile browsers lacking `createImageBitmap`, image decoding falls back gracefully to standard FileReader workflows.
3. **Local Storage Fallback Synchronization:**
   - When running offline or when Firebase configuration keys are absent, the application persists drafts to `localStorage`. While robust for local testing, synchronization across multiple devices requires active Firebase credentials.

---

### 6.5 Automated Verification Test Suite (28 Tests)

The system includes a 100% passing automated test suite executed via Node.js native test runner:

```bash
npm test
# Command executed: node --test scripts/test-system.mjs
```

```
✔ 1.  Owner Authorization & Access Control Logic
✔ 2.  Privacy Masking Functions for Read-Only Public Viewing
✔ 3.  Published Content Schema & Data Integrity
✔ 4.  Read-Only Data Immutability Enforcement
✔ 5.  Owner Login Rate Limiting & Lockout Guard (5 attempts, 60s)
✔ 6.  Staging Draft vs Live Public Profile Isolation
✔ 7.  Permanent NFC Hardware Link Invariance
✔ 8.  Edit Profile Button Navigation & Single-Owner Access Routing
✔ 9.  Public Profile Interface Exposes No Direct Modification Controls
✔ 10. Firebase auth/configuration-not-found Graceful Recovery
✔ 11. Password Complexity and Phone Number Normalization Tests
✔ 12. Engineering Academic Year & Semester SGPA Dynamic Management
✔ 13. Project Card Long-Text Invariance & Project Media Upload Schema
✔ 14. Certificate Multi-Image Upload, Gallery Normalization and Management
✔ 15. Social Channel Configuration, Edit Mutators & Reordering Logic
✔ 16. Appearance Module Font Family Selection, Categorization & CSS Variable Cascading
✔ 17. Certificate & Media Drag-and-Drop File Processing and Thumbnail Reordering
✔ 18. Two-Semester Academic Year Limits, Duplicate Warnings, Cumulative CGPA & 10th/12th Schooling
✔ 19. Redesigned Header Bar, Verified Status Badge, Public Mode Toggle, and User Profile Menu
✔ 20. Smartphone Frame Hardware Specs, Dynamic Island, and Card Watermark Calibration
✔ 21. Mobile Single-Row Header, Slide-Out Drawer & Sticky Bottom Action Bar Layout
✔ 22. Mobile-Only Live Preview Focus, Scroll-Aware Top Navbar & Mobile UX Polish
✔ 23. Full-Site UX, 404 Routing, Clickable Tel/Mailto, SEO Metadata & Asset Optimization
✔ 24. Navigation Bar Item Pruning: Live Preview removed, Profile Sections and Security & Access stack seamlessly
✔ 25. Smart ID Preview Modal: Frame, Segmented Controls, Centerpiece Stage, and 2-Tier Export Footer
✔ 26. Cover Backdrop & Overlapping Avatar Drag-and-Drop Uploader: States, Validation & Compression
✔ 27. Instant Optimistic Preview, Off-Thread 1200px WebP Compression & Non-Blocking Progress UI
✔ 28. Professional Module Mobile & Tablet Category Selector Dropdown (< 1024px)

ℹ tests 28 | suites 0 | pass 28 | fail 0 | cancelled 0 | skipped 0 | duration_ms 72ms
```

---

## 7. Deployment & Verification Summary

- **Primary Live Deployment:** [https://rahulnagv-21cs051.web.app](https://rahulnagv-21cs051.web.app)
- **Secondary / NFC Gateway Target:** [https://rahulnagv-24cs051.web.app](https://rahulnagv-24cs051.web.app)
- **GitHub Version Control:** [https://github.com/RahulNag-V/NFC-Smart-ID-Card.git](https://github.com/RahulNag-V/NFC-Smart-ID-Card.git) (`main` branch)
- **Continuous Deployment:** Builds verified with `tsc -b && vite build` (zero errors).

