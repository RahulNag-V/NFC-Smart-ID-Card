import React from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { useOwnerEditor } from '../../../context/OwnerEditorContext';
import { ThemePresetName, ThemeConfig } from '../../../types/content';

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
        headingFont: '"Cinzel", "Times New Roman", serif',
        bodyFont: '"Tinos", Georgia, serif',
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

export const AppearanceModule: React.FC = () => {
  const { draftContent, updateAppearance, showToast } = useOwnerEditor();
  const theme = draftContent.theme;

  const handleSelectPreset = (preset: PresetDefinition) => {
    updateAppearance(preset.config);
    showToast(`Applied ${preset.name} theme aesthetic.`, 'success');
  };

  const handleFontFamilyChange = (family: 'serif' | 'sans' | 'mono') => {
    let headingFont = '"Cinzel", Georgia, serif';
    let bodyFont = '"Tinos", Georgia, serif';

    if (family === 'sans') {
      headingFont = '"Plus Jakarta Sans", "Inter", sans-serif';
      bodyFont = '"Inter", sans-serif';
    } else if (family === 'mono') {
      headingFont = '"JetBrains Mono", monospace';
      bodyFont = '"JetBrains Mono", monospace';
    }

    updateAppearance({
      typography: {
        ...theme.typography,
        fontFamily: family,
        headingFont,
        bodyFont,
      },
    });
  };

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
        <h3 className="text-xs uppercase tracking-wider text-[#704a29] font-bold pb-3 border-b border-[#d9cdbd] flex items-center gap-2">
          <Type className="w-4 h-4 text-[#704a29]" />
          Typography Architecture
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              family: 'serif' as const,
              label: 'Classical Serif',
              sub: 'Cinzel & Tinos',
              sample: 'Ag',
              desc: 'Academic dignity, regal, and traditional.',
            },
            {
              family: 'sans' as const,
              label: 'Modern Sans',
              sub: 'Jakarta & Inter',
              sample: 'Ag',
              desc: 'Crisp, contemporary, and tech-forward.',
            },
            {
              family: 'mono' as const,
              label: 'Precision Mono',
              sub: 'JetBrains Mono',
              sample: 'Ag',
              desc: 'Engineering precision and code aesthetic.',
            },
          ].map((item) => {
            const isSelected = theme.typography.fontFamily === item.family;
            return (
              <button
                key={item.family}
                type="button"
                onClick={() => handleFontFamilyChange(item.family)}
                className={`p-4 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-[#f0eae1]/50 border-[#704a29] ring-2 ring-[#704a29]/20'
                    : 'bg-[#fffefb] border-[#d9cdbd] hover:border-[#704a29]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-[#704a29]">
                      {item.sample}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-[#704a29]" />}
                  </div>
                  <h4 className="text-sm font-bold text-[#2b241e]">{item.label}</h4>
                  <p className="text-[11px] text-[#73685c]">{item.sub}</p>
                </div>
                <p className="text-[11px] text-[#73685c] mt-3 leading-normal">
                  {item.desc}
                </p>
              </button>
            );
          })}
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
