/**
 * Dynamic On-Demand Google Fonts Loader
 * Loads non-core fonts asynchronously on demand when selected by a theme
 */

import { ThemeConfig } from '../types/content';

// Set of fonts already loaded or bundled by default in index.html
const loadedFonts = new Set<string>([
  'Instrument Serif',
  'Plus Jakarta Sans',
  'JetBrains Mono',
  'Times New Roman',
  'Georgia',
  'serif',
  'sans-serif',
  'monospace',
  'system-ui',
]);

const GOOGLE_FONT_MAP: Record<string, string> = {
  'Cinzel': 'family=Cinzel:wght@400..900',
  'Playfair Display': 'family=Playfair+Display:ital,wght@0,400..900;1,400..900',
  'Lora': 'family=Lora:ital,wght@0,400..700;1,400..700',
  'Cormorant Garamond': 'family=Cormorant+Garamond:ital,wght@0,400..700;1,400..700',
  'EB Garamond': 'family=EB+Garamond:ital,wght@0,400..800;1,400..800',
  'Merriweather': 'family=Merriweather:ital,wght@0,300..900;1,300..900',
  'Bodoni Moda': 'family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900',
  'Tinos': 'family=Tinos:ital,wght@0,400;0,700;1,400;1,700',
  'Inter': 'family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900',
  'Poppins': 'family=Poppins:ital,wght@0,300..800;1,300..800',
  'Montserrat': 'family=Montserrat:ital,wght@0,100..900;1,100..900',
  'DM Sans': 'family=DM+Sans:ital,opsz,wght@0,9..40,400..800;1,9..40,400..800',
  'Outfit': 'family=Outfit:wght@400..800',
  'Space Grotesk': 'family=Space+Grotesk:wght@400..700',
  'Syne': 'family=Syne:wght@400..800',
  'Roboto': 'family=Roboto:ital,wght@0,400..700;1,400..700',
  'Fira Code': 'family=Fira+Code:wght@400..700',
  'Space Mono': 'family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700',
  'Courier Prime': 'family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700',
};

/**
 * Loads a single font family if not already loaded
 */
export function loadFontFamily(fontName: string): void {
  if (typeof document === 'undefined') return;

  const cleanName = fontName.replace(/['"]/g, '').trim();
  if (!cleanName || loadedFonts.has(cleanName)) return;

  // Search if any known font name is contained in the string
  for (const [knownFont, fontQuery] of Object.entries(GOOGLE_FONT_MAP)) {
    if (cleanName.toLowerCase().includes(knownFont.toLowerCase())) {
      if (loadedFonts.has(knownFont)) return;

      const linkId = `google-font-${knownFont.toLowerCase().replace(/\s+/g, '-')}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;
        document.head.appendChild(link);
      }
      loadedFonts.add(knownFont);
      break;
    }
  }

  loadedFonts.add(cleanName);
}

/**
 * Inspects a ThemeConfig and loads any fonts needed
 */
export function loadThemeFonts(theme?: Partial<ThemeConfig>): void {
  if (!theme?.typography) return;
  const { headingFont, bodyFont } = theme.typography;
  if (headingFont) loadFontFamily(headingFont);
  if (bodyFont) loadFontFamily(bodyFont);
}

