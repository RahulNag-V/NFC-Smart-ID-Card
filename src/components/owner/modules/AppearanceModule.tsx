import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Type,
  Layout,
  Sparkles,
  Check,
  CheckCircle2,
  Sliders,
  Paintbrush,
  Sun,
  Moon,
  Search,
  SlidersHorizontal,
  BookOpen,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';
import { useOwnerEditor } from '../../../context/OwnerEditorContext';
import { ThemePresetName, ThemeConfig } from '../../../types/content';
import { loadThemeFonts, loadFontFamily } from '../../../lib/fontLoader';

interface PresetDefinition {
  name: ThemePresetName;
  tagline: string;
  category: 'Classic' | 'Dark Luxury' | 'Minimalist' | 'Modern';
  previewColors: {
    bg: string;
    card: string;
    primary: string;
    accent: string;
    text: string;
  };
  config: Partial<ThemeConfig>;
}

const curatedPresets: PresetDefinition[] = [
  {
    name: 'Classic Academic',
    tagline: 'Warm parchment, deep burgundy, and dignified scholastic serif typography.',
    category: 'Classic',
    previewColors: {
      bg: '#fcf8f2',
      card: '#ffffff',
      primary: '#704a29',
      accent: '#c59b27',
      text: '#221b16',
    },
    config: {
      preset: 'Classic Academic',
      colors: {
        background: '#fcf8f2',
        foreground: '#221b16',
        card: '#ffffff',
        cardForeground: '#221b16',
        primary: '#704a29',
        primaryForeground: '#ffffff',
        secondary: '#f3ebe1',
        secondaryForeground: '#704a29',
        muted: '#f5eee6',
        mutedForeground: '#7a6a58',
        accent: '#c59b27',
        accentForeground: '#1a140e',
        border: '#e8dcce',
        ring: '#704a29',
      },
      typography: {
        fontFamily: 'serif',
        headingFont: '"Instrument Serif", "Playfair Display", Georgia, serif',
        bodyFont: '"Plus Jakarta Sans", Inter, sans-serif',
        fontSizeScale: 'normal',
        letterSpacing: 'normal',
      },
      layout: {
        pageWidth: 'standard',
        borderRadius: 'medium',
        shadowIntensity: 'subtle',
        spacingDensity: 'normal',
      },
    },
  },
  {
    name: 'Premium Dark',
    tagline: 'Ultra-luxury jet black obsidian, metallic champagne gold, and sharp contrast.',
    category: 'Dark Luxury',
    previewColors: {
      bg: '#0c0a09',
      card: '#171412',
      primary: '#d4af37',
      accent: '#f59e0b',
      text: '#fafaf9',
    },
    config: {
      preset: 'Premium Dark',
      colors: {
        background: '#0c0a09',
        foreground: '#fafaf9',
        card: '#171412',
        cardForeground: '#fafaf9',
        primary: '#d4af37',
        primaryForeground: '#0c0a09',
        secondary: '#231f1c',
        secondaryForeground: '#d4af37',
        muted: '#1f1b18',
        mutedForeground: '#a8a29e',
        accent: '#e5c07b',
        accentForeground: '#0c0a09',
        border: 'rgba(212, 175, 55, 0.25)',
        ring: '#d4af37',
      },
      typography: {
        fontFamily: 'serif',
        headingFont: '"Cinzel", "Times New Roman", serif',
        bodyFont: '"Inter", sans-serif',
        fontSizeScale: 'normal',
        letterSpacing: 'wide',
      },
      layout: {
        pageWidth: 'standard',
        borderRadius: 'large',
        shadowIntensity: 'prominent',
        spacingDensity: 'normal',
      },
    },
  },
  {
    name: 'Emerald Professional',
    tagline: 'Deep imperial forest emerald, jade accents, and regal executive distinction.',
    category: 'Dark Luxury',
    previewColors: {
      bg: '#041610',
      card: '#0a231b',
      primary: '#10b981',
      accent: '#34d399',
      text: '#ecfdf5',
    },
    config: {
      preset: 'Emerald Professional',
      colors: {
        background: '#041610',
        foreground: '#ecfdf5',
        card: '#0a231b',
        cardForeground: '#ecfdf5',
        primary: '#10b981',
        primaryForeground: '#041610',
        secondary: '#0f3127',
        secondaryForeground: '#34d399',
        muted: '#0e2b22',
        mutedForeground: '#6ee7b7',
        accent: '#d4af37',
        accentForeground: '#041610',
        border: 'rgba(16, 185, 129, 0.25)',
        ring: '#10b981',
      },
      typography: {
        fontFamily: 'sans',
        headingFont: '"Plus Jakarta Sans", sans-serif',
        bodyFont: '"Inter", sans-serif',
        fontSizeScale: 'normal',
        letterSpacing: 'normal',
      },
      layout: {
        pageWidth: 'standard',
        borderRadius: 'large',
        shadowIntensity: 'prominent',
        spacingDensity: 'normal',
      },
    },
  },
  {
    name: 'Midnight Blue',
    tagline: 'Deep cosmic sapphire indigo with high-tech cyan and cybernetic elegance.',
    category: 'Modern',
    previewColors: {
      bg: '#070b14',
      card: '#0f172a',
      primary: '#38bdf8',
      accent: '#818cf8',
      text: '#f8fafc',
    },
    config: {
      preset: 'Midnight Blue',
      colors: {
        background: '#070b14',
        foreground: '#f8fafc',
        card: '#0f172a',
        cardForeground: '#f8fafc',
        primary: '#38bdf8',
        primaryForeground: '#070b14',
        secondary: '#1e293b',
        secondaryForeground: '#38bdf8',
        muted: '#1e293b',
        mutedForeground: '#94a3b8',
        accent: '#818cf8',
        accentForeground: '#070b14',
        border: 'rgba(56, 189, 248, 0.25)',
        ring: '#38bdf8',
      },
      typography: {
        fontFamily: 'sans',
        headingFont: '"Inter", sans-serif',
        bodyFont: '"Inter", sans-serif',
        fontSizeScale: 'normal',
        letterSpacing: 'normal',
      },
      layout: {
        pageWidth: 'standard',
        borderRadius: 'large',
        shadowIntensity: 'prominent',
        spacingDensity: 'normal',
      },
    },
  },
  {
    name: 'Minimal White',
    tagline: 'Pristine modernism, crisp monochromatic slate, and pure typography.',
    category: 'Minimalist',
    previewColors: {
      bg: '#ffffff',
      card: '#f8fafc',
      primary: '#0f172a',
      accent: '#64748b',
      text: '#0f172a',
    },
    config: {
      preset: 'Minimal White',
      colors: {
        background: '#ffffff',
        foreground: '#0f172a',
        card: '#f8fafc',
        cardForeground: '#0f172a',
        primary: '#0f172a',
        primaryForeground: '#ffffff',
        secondary: '#f1f5f9',
        secondaryForeground: '#0f172a',
        muted: '#f1f5f9',
        mutedForeground: '#64748b',
        accent: '#475569',
        accentForeground: '#ffffff',
        border: '#e2e8f0',
        ring: '#0f172a',
      },
      typography: {
        fontFamily: 'sans',
        headingFont: '"Inter", sans-serif',
        bodyFont: '"Inter", sans-serif',
        fontSizeScale: 'normal',
        letterSpacing: 'tight',
      },
      layout: {
        pageWidth: 'standard',
        borderRadius: 'medium',
        shadowIntensity: 'subtle',
        spacingDensity: 'compact',
      },
    },
  },
  {
    name: 'Warm Paper',
    tagline: 'Handcrafted warm sandstone, earth ochre, and warm tactile print aesthetics.',
    category: 'Classic',
    previewColors: {
      bg: '#f8f4ed',
      card: '#ffffff',
      primary: '#8c532b',
      accent: '#d97706',
      text: '#29221b',
    },
    config: {
      preset: 'Warm Paper',
      colors: {
        background: '#f8f4ed',
        foreground: '#29221b',
        card: '#ffffff',
        cardForeground: '#29221b',
        primary: '#8c532b',
        primaryForeground: '#ffffff',
        secondary: '#eee4d5',
        secondaryForeground: '#8c532b',
        muted: '#ede4d5',
        mutedForeground: '#786857',
        accent: '#d97706',
        accentForeground: '#ffffff',
        border: '#e0d1bd',
        ring: '#8c532b',
      },
      typography: {
        fontFamily: 'serif',
        headingFont: '"Cinzel", Georgia, serif',
        bodyFont: '"Tinos", Georgia, serif',
        fontSizeScale: 'relaxed',
        letterSpacing: 'normal',
      },
      layout: {
        pageWidth: 'standard',
        borderRadius: 'medium',
        shadowIntensity: 'subtle',
        spacingDensity: 'spacious',
      },
    },
  },
];

export interface FontFamilyDefinition {
  id: string;
  name: string;
  category: 'Serif' | 'Sans' | 'Mono' | 'Display';
  headingFont: string;
  bodyFont: string;
  genericType: 'serif' | 'sans' | 'mono';
  sampleHeading: string;
  sampleBody: string;
  badge: string;
  description: string;
}

export const curatedFontFamilies: FontFamilyDefinition[] = [
  {
    id: 'instrument-jakarta',
    name: 'Instrument Serif & Plus Jakarta',
    category: 'Display',
    headingFont: "'Instrument Serif', 'Playfair Display', Georgia, serif",
    bodyFont: "'Plus Jakarta Sans', Inter, -apple-system, sans-serif",
    genericType: 'serif',
    sampleHeading: 'Ag',
    sampleBody: 'Modern Swiss Editorial Architecture',
    badge: 'Editorial Standard',
    description: 'Distinctive high-contrast editorial serif paired with crisp geometric tech interface sans.',
  },
  {
    id: 'times-academic',
    name: 'Times New Roman & Tinos',
    category: 'Serif',
    headingFont: "'Times New Roman', Times, 'Tinos', Georgia, serif",
    bodyFont: "'Times New Roman', Times, 'Tinos', Georgia, serif",
    genericType: 'serif',
    sampleHeading: 'Ag',
    sampleBody: 'Scholastic Academic Standard',
    badge: 'Default Academic',
    description: 'Official academic serif with authentic parchment texture and heritage dignity.',
  },
  {
    id: 'cinzel-tinos',
    name: 'Cinzel & Tinos',
    category: 'Serif',
    headingFont: "'Cinzel', 'Times New Roman', serif",
    bodyFont: "'Tinos', Georgia, serif",
    genericType: 'serif',
    sampleHeading: 'AG',
    sampleBody: 'Classical Inscriptional Roman',
    badge: 'Regal Roman',
    description: 'Monumental Roman capitals paired with graceful literary serif body text.',
  },
  {
    id: 'playfair-lora',
    name: 'Playfair Display & Lora',
    category: 'Serif',
    headingFont: "'Playfair Display', Georgia, serif",
    bodyFont: "'Lora', Georgia, serif",
    genericType: 'serif',
    sampleHeading: 'Ag',
    sampleBody: 'High-Contrast Luxury Editorial',
    badge: 'Editorial Luxury',
    description: 'Late 18th-century European Enlightenment serif with delicate, sharp hairlines.',
  },
  {
    id: 'cormorant-garamond',
    name: 'Cormorant Garamond',
    category: 'Serif',
    headingFont: "'Cormorant Garamond', Garamond, serif",
    bodyFont: "'Cormorant Garamond', Garamond, serif",
    genericType: 'serif',
    sampleHeading: 'Ag',
    sampleBody: 'Refined French Renaissance',
    badge: 'Heritage Garamond',
    description: 'Masterfully balanced bookmaker serif with historic humanist cadence.',
  },
  {
    id: 'eb-garamond-merriweather',
    name: 'EB Garamond & Merriweather',
    category: 'Serif',
    headingFont: "'EB Garamond', Garamond, serif",
    bodyFont: "'Merriweather', Georgia, serif",
    genericType: 'serif',
    sampleHeading: 'Ag',
    sampleBody: 'Historic Humanist Literary',
    badge: 'Humanist Classic',
    description: 'Claude Garamont 1592 archetype paired with a robust digital reading serif.',
  },
  {
    id: 'bodoni-moda',
    name: 'Bodoni Moda',
    category: 'Serif',
    headingFont: "'Bodoni Moda', 'Didot', serif",
    bodyFont: "'Tinos', Georgia, serif",
    genericType: 'serif',
    sampleHeading: 'Ag',
    sampleBody: 'Dramatic Italian Modernity',
    badge: 'Italian Haute',
    description: 'Radical vertical stress and hair-thin serifs by Gianbattista Bodoni (Parma, 1798).',
  },
  {
    id: 'merriweather',
    name: 'Merriweather',
    category: 'Serif',
    headingFont: "'Merriweather', Georgia, serif",
    bodyFont: "'Merriweather', Georgia, serif",
    genericType: 'serif',
    sampleHeading: 'Ag',
    sampleBody: 'Sturdy High-Legibility Serif',
    badge: 'Academic Text',
    description: 'Designed specifically for effortless screen absorption and long reading stamina.',
  },
  {
    id: 'lora',
    name: 'Lora',
    category: 'Serif',
    headingFont: "'Lora', Georgia, serif",
    bodyFont: "'Lora', Georgia, serif",
    genericType: 'serif',
    sampleHeading: 'Ag',
    sampleBody: 'Calligraphic Brushed Serif',
    badge: 'Contemporary Serif',
    description: 'A contemporary serif with brushed roots and subtle artistic curves.',
  },
  {
    id: 'plus-jakarta',
    name: 'Plus Jakarta Sans',
    category: 'Sans',
    headingFont: "'Plus Jakarta Sans', -apple-system, sans-serif",
    bodyFont: "'Plus Jakarta Sans', -apple-system, sans-serif",
    genericType: 'sans',
    sampleHeading: 'Ag',
    sampleBody: 'Clean Architectural Tech',
    badge: 'Modern Tech',
    description: 'Geometric neo-grotesque with clean open counters and modern tech authority.',
  },
  {
    id: 'inter',
    name: 'Inter',
    category: 'Sans',
    headingFont: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    bodyFont: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    genericType: 'sans',
    sampleHeading: 'Ag',
    sampleBody: 'World Standard Interface Sans',
    badge: 'Universal UI',
    description: 'Tall x-height crafted by Rasmus Andersson for razor-sharp digital readability.',
  },
  {
    id: 'poppins',
    name: 'Poppins',
    category: 'Sans',
    headingFont: "'Poppins', sans-serif",
    bodyFont: "'Poppins', sans-serif",
    genericType: 'sans',
    sampleHeading: 'Ag',
    sampleBody: 'Pure Geometric Round Sans',
    badge: 'Geometric Round',
    description: 'Friendly geometric sans based on circles and rational modernist curves.',
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    category: 'Sans',
    headingFont: "'Montserrat', sans-serif",
    bodyFont: "'Montserrat', sans-serif",
    genericType: 'sans',
    sampleHeading: 'Ag',
    sampleBody: 'Urban Architectural Sans',
    badge: 'Urban Architecture',
    description: 'Historic Buenos Aires neighborhood signage aesthetic; bold and sturdy.',
  },
  {
    id: 'outfit',
    name: 'Outfit',
    category: 'Sans',
    headingFont: "'Outfit', sans-serif",
    bodyFont: "'Outfit', sans-serif",
    genericType: 'sans',
    sampleHeading: 'Ag',
    sampleBody: 'Airy Contemporary Digital',
    badge: 'Digital Clean',
    description: 'Airy, futuristic proportions designed by Brand New Media for modern brands.',
  },
  {
    id: 'space-grotesk',
    name: 'Space Grotesk',
    category: 'Sans',
    headingFont: "'Space Grotesk', sans-serif",
    bodyFont: "'Space Grotesk', sans-serif",
    genericType: 'sans',
    sampleHeading: 'Ag',
    sampleBody: 'Brutalist High-Tech Grotesque',
    badge: 'Cyber Tech',
    description: 'Adapted from Space Mono; quirky tech angles with strong engineering presence.',
  },
  {
    id: 'dm-sans',
    name: 'DM Sans',
    category: 'Sans',
    headingFont: "'DM Sans', sans-serif",
    bodyFont: "'DM Sans', sans-serif",
    genericType: 'sans',
    sampleHeading: 'Ag',
    sampleBody: 'Low-Contrast Modernist Sans',
    badge: 'High Precision',
    description: 'Commissioned by Google from Colophon Foundry for high-density information layouts.',
  },
  {
    id: 'roboto',
    name: 'Roboto',
    category: 'Sans',
    headingFont: "'Roboto', sans-serif",
    bodyFont: "'Roboto', sans-serif",
    genericType: 'sans',
    sampleHeading: 'Ag',
    sampleBody: 'Dual-Nature Geometric Sans',
    badge: 'Modern Classic',
    description: 'Rigid geometric skeletons paired with friendly, relaxed natural curves.',
  },
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    category: 'Mono',
    headingFont: "'JetBrains Mono', monospace",
    bodyFont: "'JetBrains Mono', monospace",
    genericType: 'mono',
    sampleHeading: '01',
    sampleBody: 'Premier Developer Monospace',
    badge: 'Developer Choice',
    description: 'Engineered specifically for source code clarity, character distinction, and speed.',
  },
  {
    id: 'fira-code',
    name: 'Fira Code',
    category: 'Mono',
    headingFont: "'Fira Code', monospace",
    bodyFont: "'Fira Code', monospace",
    genericType: 'mono',
    sampleHeading: '=>',
    sampleBody: 'Technical Programming Ligatures',
    badge: 'Programming Ligatures',
    description: 'Mozilla-inspired developer font with beautiful terminal coding aesthetics.',
  },
  {
    id: 'space-mono',
    name: 'Space Mono',
    category: 'Mono',
    headingFont: "'Space Mono', monospace",
    bodyFont: "'Space Mono', monospace",
    genericType: 'mono',
    sampleHeading: '_>',
    sampleBody: 'Retro Cyberpunk Terminal',
    badge: 'Retro Terminal',
    description: '1960s space-exploration typewriter aesthetics combined with 80s arcade consoles.',
  },
  {
    id: 'courier-prime',
    name: 'Courier Prime',
    category: 'Mono',
    headingFont: "'Courier Prime', monospace",
    bodyFont: "'Courier Prime', monospace",
    genericType: 'mono',
    sampleHeading: '¶',
    sampleBody: 'Academic Mechanical Typewriter',
    badge: 'Vintage Mechanical',
    description: 'The definitive Hollywood typewriter font with heavier, inked strike weights.',
  },
  {
    id: 'oswald-jakarta',
    name: 'Oswald & Plus Jakarta',
    category: 'Display',
    headingFont: "'Oswald', sans-serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
    genericType: 'sans',
    sampleHeading: 'AG',
    sampleBody: 'Impact Condensed Headlines',
    badge: 'Condensed Impact',
    description: 'Classic Gothic rework with strong vertical impact for striking banner cards.',
  },
  {
    id: 'syne-inter',
    name: 'Syne & Inter',
    category: 'Display',
    headingFont: "'Syne', sans-serif",
    bodyFont: "'Inter', sans-serif",
    genericType: 'sans',
    sampleHeading: 'Ag',
    sampleBody: 'Avant-Garde Art Direction',
    badge: 'Creative Vanguard',
    description: 'Daring French design studio display typeface with distinctive flair.',
  },
];

export const AppearanceModule: React.FC = () => {
  const { draftContent, updateAppearance, showToast } = useOwnerEditor();
  const theme = draftContent.theme;

  const [fontCategoryFilter, setFontCategoryFilter] = useState<'All' | 'Serif' | 'Sans' | 'Mono' | 'Display'>('All');
  const [fontSearch, setFontSearch] = useState('');
  const [isFontCategoryDropdownOpen, setIsFontCategoryDropdownOpen] = useState(false);
  const fontCategoryDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        fontCategoryDropdownRef.current &&
        !fontCategoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFontCategoryDropdownOpen(false);
      }
    };
    if (isFontCategoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFontCategoryDropdownOpen]);

  const fontCategoryTabs = [
    { id: 'All', label: `All (${curatedFontFamilies.length})` },
    { id: 'Serif', label: `Serif (${curatedFontFamilies.filter((f) => f.category === 'Serif').length})` },
    { id: 'Sans', label: `Sans-Serif (${curatedFontFamilies.filter((f) => f.category === 'Sans').length})` },
    { id: 'Mono', label: `Monospace (${curatedFontFamilies.filter((f) => f.category === 'Mono').length})` },
    { id: 'Display', label: `Display (${curatedFontFamilies.filter((f) => f.category === 'Display').length})` },
  ];

  const currentHeading = theme.typography?.headingFont || "'Times New Roman', Times, 'Tinos', Georgia, serif";
  const currentBody = theme.typography?.bodyFont || "'Times New Roman', Times, 'Tinos', Georgia, serif";

  const activeFontFamily =
    curatedFontFamilies.find(
      (f) =>
        f.headingFont.toLowerCase().replace(/['"\s]/g, '') === currentHeading.toLowerCase().replace(/['"\s]/g, '') ||
        f.name.toLowerCase() === (theme.typography?.fontFamily || '').toLowerCase()
    ) || curatedFontFamilies[0];

  const handleSelectPreset = (preset: PresetDefinition) => {
    loadThemeFonts(preset.config);
    updateAppearance(preset.config);
    showToast(`Applied ${preset.name} theme aesthetic.`, 'success');
  };

  const handleSelectFontFamily = (font: FontFamilyDefinition) => {
    loadFontFamily(font.headingFont);
    loadFontFamily(font.bodyFont);
    updateAppearance({
      typography: {
        ...theme.typography,
        fontFamily: font.genericType,
        headingFont: font.headingFont,
        bodyFont: font.bodyFont,
      },
    });

    try {
      const root = document.documentElement;
      root.style.setProperty('--font-heading', font.headingFont);
      root.style.setProperty('--font-body', font.bodyFont);
      root.style.setProperty('--font-family', font.headingFont);
    } catch { }

    showToast(`Applied "${font.name}" font family.`, 'success');
  };

  const handleFontSizeScaleChange = (scale: 'compact' | 'normal' | 'relaxed') => {
    updateAppearance({
      typography: {
        ...theme.typography,
        fontSizeScale: scale,
      },
    });
    showToast(`Set font scale to ${scale}.`, 'info');
  };

  const handleLetterSpacingChange = (spacing: 'tight' | 'normal' | 'wide') => {
    updateAppearance({
      typography: {
        ...theme.typography,
        letterSpacing: spacing,
      },
    });
    showToast(`Set letter spacing to ${spacing}.`, 'info');
  };

  const filteredFontFamilies = curatedFontFamilies.filter((f) => {
    const matchesCategory = fontCategoryFilter === 'All' || f.category === fontCategoryFilter;
    const matchesSearch =
      fontSearch.trim() === '' ||
      f.name.toLowerCase().includes(fontSearch.toLowerCase()) ||
      f.badge.toLowerCase().includes(fontSearch.toLowerCase()) ||
      f.description.toLowerCase().includes(fontSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRadiusChange = (radius: 'none' | 'small' | 'medium' | 'large' | 'full') => {
    updateAppearance({
      layout: {
        ...theme.layout,
        borderRadius: radius,
      },
    });
  };

  return (
    <div className="space-y-8 max-w-4xl font-serif">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-[#2b241e] tracking-tight">
          Appearance & Aesthetic Direction
        </h2>
        <p className="text-xs text-[#73685c] mt-1">
          Select from curated architectural themes or tailor typography and corner styling for your public identity card.
        </p>
      </div>

      {/* Curated Theme Presets */}
      <div className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#d9cdbd]">
          <h3 className="text-xs uppercase tracking-wider text-[#704a29] font-bold flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#704a29]" />
            Curated Architectural Themes
          </h3>
          <span className="text-xs text-[#73685c]">
            Active: <span className="text-[#704a29] font-bold">{theme.preset}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {curatedPresets.map((preset) => {
            const isSelected = theme.preset === preset.name;
            return (
              <motion.div
                key={preset.name}
                whileHover={{ y: -2 }}
                onClick={() => handleSelectPreset(preset)}
                className={`rounded-xl p-5 border transition duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between shadow-2xs ${
                  isSelected
                    ? 'bg-[#f0eae1]/50 border-[#704a29] ring-2 ring-[#704a29]/20'
                    : 'bg-[#fffefb] border-[#d9cdbd] hover:border-[#704a29]'
                }`}
              >
                {/* Active Selection Badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#704a29] text-white text-[10px] font-bold">
                    <Check className="w-3 h-3 text-white" />
                    <span>Active</span>
                  </div>
                )}

                <div>
                  {/* Swatch Preview Bar */}
                  <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] w-fit">
                    <div
                      className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                      style={{ backgroundColor: preset.previewColors.bg }}
                      title="Background"
                    />
                    <div
                      className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                      style={{ backgroundColor: preset.previewColors.card }}
                      title="Card Surface"
                    />
                    <div
                      className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                      style={{ backgroundColor: preset.previewColors.primary }}
                      title="Primary Brand"
                    />
                    <div
                      className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                      style={{ backgroundColor: preset.previewColors.accent }}
                      title="Accent Trim"
                    />
                  </div>

                  <h4 className="text-base font-bold text-[#2b241e] flex items-center gap-2">
                    {preset.name}
                  </h4>
                  <p className="text-xs text-[#73685c] mt-1 leading-relaxed">
                    {preset.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#d9cdbd] flex items-center justify-between text-[11px] text-[#73685c]">
                  <span>Category: {preset.category}</span>
                  <span className={isSelected ? 'text-[#704a29] font-bold' : 'text-[#73685c]'}>
                    {isSelected ? 'Currently Applied' : 'Tap to Apply'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Typography & Font Architecture */}
      <div className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#d9cdbd] gap-2">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-[#704a29]" />
            <h3 className="text-xs uppercase tracking-wider text-[#704a29] font-bold">
              Typography Architecture &amp; Font Families ({curatedFontFamilies.length} Available)
            </h3>
          </div>
          <span className="text-xs text-[#73685c]">
            Active Font: <span className="text-[#704a29] font-bold">{activeFontFamily.name}</span>
          </span>
        </div>

        {/* Live Interactive Font Specimen Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#fcf8f2] via-[#faf5ed] to-[#f5eee2] border-2 border-[#b89574] shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#d9cdbd]/60">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#704a29] px-2.5 py-0.5 rounded-full bg-[#f0eae1] border border-[#d9cdbd]">
                {activeFontFamily.category}
              </span>
              <span className="text-xs font-bold text-[#2b241e]">
                {activeFontFamily.name}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#73685c]">
              Live Specimen &bull; Cascades to entire public ID profile
            </span>
          </div>

          <div
            style={{ fontFamily: activeFontFamily.headingFont }}
            className="text-lg sm:text-2xl font-bold text-[#1e1713] tracking-tight transition-all"
          >
            Digital Student Identity &bull; Rahul Nag V
          </div>

          <div
            style={{ fontFamily: activeFontFamily.bodyFont }}
            className="text-xs sm:text-sm text-[#524538] leading-relaxed transition-all"
          >
            Department of Computer Science &amp; Engineering &bull; Bangalore Technological Institute (BTI).
            Accredited by Visvesvaraya Technological University (VTU) &bull; USN: 1BH24CS051.
          </div>

          <div
            style={{ fontFamily: activeFontFamily.bodyFont }}
            className="pt-2 border-t border-[#d9cdbd]/40 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#73685c]"
          >
            <span>The quick brown fox jumps over the lazy dog</span>
            <span className="font-mono">0123456789 &bull; SGPA 8.00 / 10.0</span>
          </div>
        </div>

        {/* Filter Pills & Search Input */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Mobile Category Dropdown Selector (< 640px) */}
            <div className="relative sm:hidden w-full" ref={fontCategoryDropdownRef}>
              <button
                type="button"
                onClick={() => setIsFontCategoryDropdownOpen((prev) => !prev)}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#fffefb] border border-[#d9cdbd] hover:border-[#704a29] shadow-2xs flex items-center justify-between transition cursor-pointer select-none active:scale-[0.99]"
                aria-expanded={isFontCategoryDropdownOpen}
                aria-haspopup="listbox"
              >
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-[#704a29]" />
                  <span className="text-xs font-serif font-bold text-[#2b241e]">
                    {fontCategoryTabs.find((t) => t.id === fontCategoryFilter)?.label || 'All'}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#704a29] transition-transform duration-200 ${
                    isFontCategoryDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isFontCategoryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-30 left-0 right-0 mt-1.5 rounded-xl bg-[#fffefb] border border-[#d9cdbd] shadow-lg p-1 space-y-0.5"
                    role="listbox"
                  >
                    {fontCategoryTabs.map((tab) => {
                      const isSelected = fontCategoryFilter === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            setFontCategoryFilter(tab.id as any);
                            setIsFontCategoryDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            isSelected
                              ? 'bg-[#704a29] text-white shadow-2xs'
                              : 'text-[#2b241e] hover:bg-[#f0eae1]'
                          }`}
                        >
                          <span>{tab.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Category Filter Pills (hidden on mobile, visible on sm+) */}
            <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-xl bg-[#f0eae1] border border-[#d9cdbd] overflow-x-auto">
              {fontCategoryTabs.map((tab) => {
                const isSelected = fontCategoryFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFontCategoryFilter(tab.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#704a29] text-white shadow-xs'
                        : 'text-[#73685c] hover:text-[#2b241e] hover:bg-white/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#73685c]" />
              <input
                type="text"
                value={fontSearch}
                onChange={(e) => setFontSearch(e.target.value)}
                placeholder="Search font family..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
              />
              {fontSearch && (
                <button
                  type="button"
                  onClick={() => setFontSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#73685c] hover:text-[#2b241e] text-xs cursor-pointer"
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Available Font Families Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {filteredFontFamilies.map((font) => {
            const isSelected =
              activeFontFamily.id === font.id ||
              (theme.typography?.headingFont || '').toLowerCase().replace(/['"\s]/g, '') ===
                font.headingFont.toLowerCase().replace(/['"\s]/g, '');

            return (
              <motion.div
                key={font.id}
                whileHover={{ y: -2 }}
                onClick={() => handleSelectFontFamily(font)}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer relative shadow-2xs ${
                  isSelected
                    ? 'bg-[#f0eae1]/60 border-[#704a29] ring-2 ring-[#704a29]/25 shadow-xs'
                    : 'bg-[#fffefb] border-[#d9cdbd] hover:border-[#704a29] hover:bg-[#faf7f2]/50'
                }`}
              >
                {/* Active Indicator Badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#704a29] text-white text-[9.5px] font-bold shadow-2xs">
                    <Check className="w-3 h-3 text-white" />
                    <span>Applied</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      style={{ fontFamily: font.headingFont }}
                      className="text-2xl font-black text-[#704a29] leading-none"
                    >
                      {font.sampleHeading}
                    </span>
                    <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-md bg-[#f0eae1] text-[#704a29] border border-[#d9cdbd] font-semibold">
                      {font.badge}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#2b241e] leading-snug">
                    {font.name}
                  </h4>

                  {/* Sample rendered in that actual font */}
                  <div
                    style={{ fontFamily: font.headingFont }}
                    className="text-xs font-semibold text-[#704a29] mt-1.5 leading-snug truncate"
                  >
                    {font.sampleBody}
                  </div>

                  <p className="text-[11px] text-[#73685c] mt-2 leading-relaxed line-clamp-2">
                    {font.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#d9cdbd]/60 flex items-center justify-between text-[10px] text-[#73685c]">
                  <span className="font-mono">{font.category}</span>
                  <span className={isSelected ? 'text-[#704a29] font-bold' : 'text-[#73685c] group-hover:text-[#2b241e]'}>
                    {isSelected ? 'Currently Active' : 'Tap to Select'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredFontFamilies.length === 0 && (
          <div className="p-8 text-center bg-[#fbf8f3] rounded-xl border border-dashed border-[#d9cdbd]">
            <p className="text-xs text-[#73685c]">No font families found matching &ldquo;{fontSearch}&rdquo;.</p>
            <button
              type="button"
              onClick={() => {
                setFontSearch('');
                setFontCategoryFilter('All');
              }}
              className="mt-2 text-xs text-[#704a29] font-bold underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Fine-Tuning Controls: Font Scale & Letter Spacing */}
        <div className="pt-4 border-t border-[#d9cdbd] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Scale */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#73685c] font-bold mb-1.5">
              Font Scale / Text Density
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'compact', label: 'Compact', desc: '90%' },
                { id: 'normal', label: 'Normal', desc: '100%' },
                { id: 'relaxed', label: 'Relaxed', desc: '110%' },
              ].map((s) => {
                const isSelected = (theme.typography?.fontSizeScale || 'normal') === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleFontSizeScaleChange(s.id as any)}
                    className={`py-2 px-2 rounded-xl border text-center transition cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-[#f0eae1] border-[#704a29] text-[#704a29] font-bold ring-1 ring-[#704a29]'
                        : 'bg-[#fffefb] border-[#d9cdbd] text-[#73685c] hover:border-[#704a29]'
                    }`}
                  >
                    <div className="font-semibold">{s.label}</div>
                    <div className="text-[10px] opacity-75">{s.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Letter Spacing */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#73685c] font-bold mb-1.5">
              Character Kerning / Letter Spacing
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'tight', label: 'Tight', desc: '-0.025em' },
                { id: 'normal', label: 'Standard', desc: '0em' },
                { id: 'wide', label: 'Spaced', desc: '+0.05em' },
              ].map((sp) => {
                const isSelected = (theme.typography?.letterSpacing || 'normal') === sp.id;
                return (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => handleLetterSpacingChange(sp.id as any)}
                    className={`py-2 px-2 rounded-xl border text-center transition cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-[#f0eae1] border-[#704a29] text-[#704a29] font-bold ring-1 ring-[#704a29]'
                        : 'bg-[#fffefb] border-[#d9cdbd] text-[#73685c] hover:border-[#704a29]'
                    }`}
                  >
                    <div className="font-semibold">{sp.label}</div>
                    <div className="text-[10px] opacity-75">{sp.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Geometry & Border Radius */}
      <div className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-6 sm:p-8 space-y-6 shadow-2xs">
        <h3 className="text-xs uppercase tracking-wider text-[#704a29] font-bold pb-3 border-b border-[#d9cdbd] flex items-center gap-2">
          <Layout className="w-4 h-4 text-[#704a29]" />
          Card Geometry & Corner Radii
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { val: 'none' as const, label: 'Sharp Precision', radius: '0px' },
            { val: 'small' as const, label: 'Subtle Minimal', radius: '4px' },
            { val: 'medium' as const, label: 'Modern Classic', radius: '8px' },
            { val: 'large' as const, label: 'Soft Pebble', radius: '14px' },
          ].map((item) => {
            const isSelected = theme.layout.borderRadius === item.val;
            return (
              <button
                key={item.val}
                type="button"
                onClick={() => handleRadiusChange(item.val)}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col items-center text-center gap-2 cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-[#f0eae1] border-[#704a29] text-[#704a29] font-bold ring-2 ring-[#704a29]/20'
                    : 'bg-[#fffefb] border-[#d9cdbd] text-[#73685c] hover:border-[#704a29]'
                }`}
              >
                <div
                  className="w-10 h-10 border-2 border-[#704a29]/40 bg-[#fbf8f3]"
                  style={{ borderRadius: item.radius }}
                />
                <span className="text-xs font-bold text-[#2b241e]">{item.label}</span>
                <span className="text-[10px] text-[#73685c]">{item.radius}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AppearanceModule;
