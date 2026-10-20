# 🎓 NFC Smart ID Card & Academic Profile

> **Digital Student Identity Card, 3D Tactile Portfolio, and Academic Showcase** for **Rahul Nag V (USN: 24CS051)**, Department of Computer Science & Engineering, Bangalore Technological Institute.

🌐 **Live Production App**: [https://rahulnagv-24cs051.web.app](https://rahulnagv-24cs051.web.app)

---

## 🌟 Key Highlights & Features

- **3D Interactive Flip ID Card**:
  - Full 3D card tilt & flip physics powered by Framer Motion.
  - Multi-layer security elements including guilloche wave patterns, micro-text watermarks, dynamic glare reflection, and authentic VTU / BTI institutional crests.
  - Authentic front and back faces with student barcode, validation chip, emergency contacts, blood group, and address.
  - Dual viewing modes: **Interactive 3D Flip** and **Side-by-Side (Print Preview)**.
  - **High-Resolution Export**: One-click download of front/back PNGs or instant print-ready rendering.

- **Classical Academic Aesthetics**:
  - Styled with a vintage paper palette and **Times New Roman** serif typography across all pages.
  - Dynamic ambient shadows, watermark typography, and liquid navigation transitions.

- **Curated Selected Works**:
  - Project showcase with live filtering across Full-Stack, AI / Deep Learning, and Cybersecurity architectures.
  - Interactive project cards with live demo links and technical stack badges.

- **Academic Progression & Evaluation**:
  - Structured semester-by-semester breakdown from 1st year to final year.
  - Real-time overall CGPA indicators, academic evaluation trackers, and laboratory practical achievements.

- **Zero-Redirect Direct Inquiries**:
  - Direct dispatch contact interface with background alerting (Direct Email, CallMeBot WhatsApp, Fast2SMS, and Webhooks).
  - Quick-connect channels to WhatsApp, Instagram, LinkedIn, GitHub, and Email.

- **Liquid Morphing Floating Menu**:
  - Accessible floating navigation bar with fluid spring morphing between navigation pills and active view states.

---

## 🛠️ Technology Stack

- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS, Custom Serif Typography (Times New Roman / Tinos)
- **Animations**: Framer Motion, Canvas-Confetti, Lucide React Icons
- **Deployment**: Firebase Hosting & Firebase CLI
- **Export & Graphics**: HTML2Canvas, SVG Filter Engine

---

## 🚀 Getting Started Locally

### Prerequisites

- Node.js (v18 or newer recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/RahulNag-V/NFC-Smart-ID-Card.git
   cd NFC-Smart-ID-Card
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables** (Optional):
   ```bash
   cp .env.example .env
   ```
   Add any optional webhook or SMS/WhatsApp gateway keys if you wish to test custom notification dispatches.

4. **Run development server**:
   ```bash
   npm run dev
   ```
   The local app will start at `http://localhost:5173/`.

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📦 Deployment to Firebase Hosting

```bash
# Build the production bundle
npm run build

# Deploy to Firebase
npx -y firebase-tools deploy --only hosting
```

---

## 👤 Author

**Rahul Nag V**
- USN: `24CS051`
- Department: Computer Science & Engineering
- Institution: Bangalore Technological Institute (BTI)
- Portfolio: [https://rahulnagv-24cs051.web.app](https://rahulnagv-24cs051.web.app)
