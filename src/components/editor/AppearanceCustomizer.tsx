import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContent } from '../../context/SiteContentContext';
import { ThemeConfig, ThemePresetName, ThemeColors } from '../../types/content';
import { defaultTheme } from '../../data/initialContent';
import {
  X,
  Palette,
  Type,
  Layout,
  Sparkles,
  RotateCcw,
  Check,
  Sliders,
  Paintbrush,
} from 'lucide-react';

interface AppearanceCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Curated Theme Presets
const themePresets: Record<ThemePresetName, Partial<ThemeConfig>> = {
  'Classic Academic': {
    colors: {
      background: '#fbf8f3',
      foreground: '#2b241e',
      card: '#fffefb',
      cardForeground: '#2b241e',
      primary: '#a67c52',
      primaryForeground: '#ffffff',
      secondary: '#e5ded5',
      secondaryForeground: '#2b241e',
      muted: '#f0eae1',
      mutedForeground: '#73685c',
      accent: '#d9cdbd',
      accentForeground: '#2b241e',
      border: '#d9cdbd',
      ring: '#a67c52',
      idCardBorder: '#8c7860',
      idCardBackground: '#ffffff',
    },
    typography: {
      fontFamily: 'serif',
      headingFont: '"Times New Roman", Times, "Tinos", Georgia, serif',
      bodyFont: '"Times New Roman", Times, "Tinos", Georgia, serif',
      fontSizeScale: 'normal',
      letterSpacing: 'normal',
    },
    layout: {
      pageWidth: 'compact',
      borderRadius: 'medium',
      shadowIntensity: 'subtle',
      spacingDensity: 'normal',
    },
  },
  'Premium Dark': {
    colors: {
      background: '#0d1117',
      foreground: '#f0f6fc',
      card: '#161b22',
      cardForeground: '#f0f6fc',
      primary: '#d29922',
      primaryForeground: '#0d1117',
      secondary: '#21262d',
      secondaryForeground: '#f0f6fc',
      muted: '#1f242c',
      mutedForeground: '#8b949e',
      accent: '#30363d',
      accentForeground: '#f0f6fc',
      border: '#30363d',
      ring: '#d29922',
      idCardBorder: '#d29922',
      idCardBackground: '#161b22',
    },
    typography: {
      fontFamily: 'sans',
      headingFont: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      bodyFont: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
  'Minimal White': {
    colors: {
      background: '#ffffff',
      foreground: '#111827',
      card: '#f9fafb',
      cardForeground: '#111827',
      primary: '#111827',
      primaryForeground: '#ffffff',
      secondary: '#f3f4f6',
      secondaryForeground: '#111827',
      muted: '#e5e7eb',
      mutedForeground: '#6b7280',
      accent: '#e5e7eb',
      accentForeground: '#111827',
      border: '#e5e7eb',
      ring: '#111827',
      idCardBorder: '#111827',
      idCardBackground: '#ffffff',
    },
    typography: {
      fontFamily: 'sans',
      headingFont: '"Inter", system-ui, sans-serif',
      bodyFont: '"Inter", system-ui, sans-serif',
      fontSizeScale: 'normal',
      letterSpacing: 'wide',
    },
    layout: {
      pageWidth: 'compact',
      borderRadius: 'small',
      shadowIntensity: 'none',
      spacingDensity: 'spacious',
    },
  },
  'Midnight Blue': {
    colors: {
      background: '#0a192f',
      foreground: '#ccd6f6',
      card: '#112240',
      cardForeground: '#ccd6f6',
      primary: '#64ffda',
      primaryForeground: '#0a192f',
      secondary: '#233554',
      secondaryForeground: '#ccd6f6',
      muted: '#172a45',
      mutedForeground: '#8892b0',
      accent: '#233554',
      accentForeground: '#64ffda',
      border: '#233554',
      ring: '#64ffda',
      idCardBorder: '#64ffda',
      idCardBackground: '#112240',
    },
    typography: {
      fontFamily: 'sans',
      headingFont: 'system-ui, sans-serif',
      bodyFont: 'system-ui, sans-serif',
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
  'Emerald Professional': {
    colors: {
      background: '#f4f7f4',
      foreground: '#143823',
      card: '#ffffff',
      cardForeground: '#143823',
      primary: '#166534',
      primaryForeground: '#ffffff',
      secondary: '#dcfce7',
      secondaryForeground: '#143823',
      muted: '#e2ece2',
      mutedForeground: '#3d6b4f',
      accent: '#bbf7d0',
      accentForeground: '#143823',
      border: '#cbdccb',
      ring: '#166534',
      idCardBorder: '#166534',
      idCardBackground: '#ffffff',
    },
    typography: {
      fontFamily: 'sans',
      headingFont: 'Georgia, serif',
      bodyFont: 'system-ui, sans-serif',
      fontSizeScale: 'normal',
      letterSpacing: 'normal',
    },
    layout: {
      pageWidth: 'compact',
      borderRadius: 'medium',
      shadowIntensity: 'subtle',
      spacingDensity: 'normal',
    },
  },
  'Warm Paper': {
    colors: {
      background: '#f5eee6',
      foreground: '#382e25',
      card: '#fcf8f2',
      cardForeground: '#382e25',
      primary: '#8c532b',
      primaryForeground: '#ffffff',
      secondary: '#e8dbcd',
      secondaryForeground: '#382e25',
      muted: '#ded0c0',
      mutedForeground: '#7a6a5b',
      accent: '#c9b39c',
      accentForeground: '#382e25',
      border: '#c9b39c',
      ring: '#8c532b',
      idCardBorder: '#8c532b',
      idCardBackground: '#fcf8f2',
    },
    typography: {
      fontFamily: 'serif',
      headingFont: '"Times New Roman", Times, serif',
      bodyFont: '"Times New Roman", Times, serif',
      fontSizeScale: 'normal',
      letterSpacing: 'normal',
    },
    layout: {
      pageWidth: 'compact',
      borderRadius: 'medium',
      shadowIntensity: 'subtle',
      spacingDensity: 'normal',
    },
  },
  'Modern Glass': {
    colors: {
      background: '#eef2f6',
      foreground: '#1e293b',
      card: 'rgba(255, 255, 255, 0.75)',
      cardForeground: '#1e293b',
      primary: '#3b82f6',
      primaryForeground: '#ffffff',
      secondary: 'rgba(241, 245, 249, 0.8)',
      secondaryForeground: '#1e293b',
      muted: '#e2e8f0',
      mutedForeground: '#64748b',
      accent: '#cbd5e1',
      accentForeground: '#1e293b',
      border: 'rgba(203, 213, 225, 0.8)',
      ring: '#3b82f6',
      idCardBorder: '#3b82f6',
      idCardBackground: '#ffffff',
    },
    typography: {
      fontFamily: 'sans',
      headingFont: 'system-ui, sans-serif',
      bodyFont: 'system-ui, sans-serif',
      fontSizeScale: 'relaxed',
      letterSpacing: 'wide',
    },
    layout: {
      pageWidth: 'standard',
      borderRadius: 'large',
      shadowIntensity: 'medium',
      spacingDensity: 'spacious',
    },
  },
  'Custom': {},
};

export const AppearanceCustomizer: React.FC<AppearanceCustomizerProps> = ({
  isOpen,
  onClose,
}) => {
  const { activeContent, updateTheme } = useSiteContent();
  const theme = activeContent.theme || defaultTheme;

  const [panelTab, setPanelTab] = useState<'presets' | 'colors' | 'typography' | 'layout'>('presets');

  const handleApplyPreset = (presetName: ThemePresetName) => {
    const config = themePresets[presetName];
    updateTheme({
      preset: presetName,
      colors: { ...theme.colors, ...(config.colors || {}) },
      typography: { ...theme.typography, ...(config.typography || {}) },
      layout: { ...theme.layout, ...(config.layout || {}) },
    });
  };

  const handleColorChange = (key: keyof ThemeColors, hex: string) => {
    updateTheme({
      preset: 'Custom',
      colors: {
        ...theme.colors,
        [key]: hex,
      },
    });
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset all appearance and theme customizations to the default Classic Academic theme?')) {
      updateTheme(defaultTheme);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[9990] md:hidden backdrop-blur-xs"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 z-[9995] w-full max-w-md bg-[#fffefb] border-l border-[#d9cdbd] shadow-2xl flex flex-col font-sans text-[#2b241e]"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#d9cdbd] flex items-center justify-between bg-[#fbf8f3]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#f0eae1] text-[#704a29] flex items-center justify-center">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold font-serif text-[#2b241e]">Full Website Customizer</h2>
                  <p className="text-[11px] text-[#73685c]">Instant live preview without reloading</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="p-1.5 rounded-lg text-[#73685c] hover:text-[#704a29] hover:bg-[#f0eae1] transition cursor-pointer"
                  title="Reset to default theme"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] transition cursor-pointer"
                  aria-label="Close customizer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 p-2 bg-[#f0eae1]/60 border-b border-[#d9cdbd] text-xs">
              <button
                type="button"
                onClick={() => setPanelTab('presets')}
                className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  panelTab === 'presets'
                    ? 'bg-[#fffefb] text-[#704a29] shadow-2xs border border-[#d9cdbd]'
                    : 'text-[#73685c] hover:text-[#2b241e]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Presets</span>
              </button>

              <button
                type="button"
                onClick={() => setPanelTab('colors')}
                className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  panelTab === 'colors'
                    ? 'bg-[#fffefb] text-[#704a29] shadow-2xs border border-[#d9cdbd]'
                    : 'text-[#73685c] hover:text-[#2b241e]'
                }`}
              >
                <Paintbrush className="w-3.5 h-3.5" />
                <span>Colors</span>
              </button>

              <button
                type="button"
                onClick={() => setPanelTab('typography')}
                className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  panelTab === 'typography'
                    ? 'bg-[#fffefb] text-[#704a29] shadow-2xs border border-[#d9cdbd]'
                    : 'text-[#73685c] hover:text-[#2b241e]'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Typography</span>
              </button>

              <button
                type="button"
                onClick={() => setPanelTab('layout')}
                className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  panelTab === 'layout'
                    ? 'bg-[#fffefb] text-[#704a29] shadow-2xs border border-[#d9cdbd]'
                    : 'text-[#73685c] hover:text-[#2b241e]'
                }`}
              >
                <Layout className="w-3.5 h-3.5" />
                <span>Layout</span>
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* PRESETS TAB */}
              {panelTab === 'presets' && (
                <div className="space-y-3">
                  <p className="text-xs text-[#73685c]">
                    Select a ready-to-use aesthetic preset or customize specific color and font tokens.
                  </p>

                  <div className="grid grid-cols-1 gap-2.5">
                    {(Object.keys(themePresets) as ThemePresetName[])
                      .filter((p) => p !== 'Custom')
                      .map((pName) => {
                        const isSelected = theme.preset === pName;
                        const pConfig = themePresets[pName];
                        const bg = pConfig.colors?.background || '#ffffff';
                        const fg = pConfig.colors?.foreground || '#000000';
                        const prim = pConfig.colors?.primary || '#704a29';

                        return (
                          <button
                            key={pName}
                            type="button"
                            onClick={() => handleApplyPreset(pName)}
                            className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#704a29] ring-2 ring-[#704a29]/20 bg-[#fbf8f3] shadow-xs'
                                : 'border-[#d9cdbd] hover:border-[#704a29] bg-[#fffefb]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {/* Swatch Pill */}
                              <div
                                className="w-8 h-8 rounded-lg border border-black/10 flex items-center justify-center shadow-2xs shrink-0"
                                style={{ backgroundColor: bg }}
                              >
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: prim }} />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-[#2b241e]">{pName}</h4>
                                <p className="text-[10px] text-[#73685c]">
                                  {pName === 'Classic Academic'
                                    ? 'Original warm vintage paper aesthetic'
                                    : pName === 'Premium Dark'
                                    ? 'Obsidian dark mode with gold accents'
                                    : pName === 'Minimal White'
                                    ? 'Modern clean high-contrast editorial'
                                    : 'Balanced curated palette'}
                                </p>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-[#704a29] text-white flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* COLORS TAB */}
              {panelTab === 'colors' && (
                <div className="space-y-3">
                  <p className="text-xs text-[#73685c]">
                    Tailor individual hexadecimal color variables throughout the application.
                  </p>

                  <div className="space-y-2.5">
                    {[
                      { key: 'background', label: 'Page Background' },
                      { key: 'foreground', label: 'Primary Text Color' },
                      { key: 'primary', label: 'Accent & Button Background' },
                      { key: 'card', label: 'Card Surface Background' },
                      { key: 'border', label: 'Border & Divider Lines' },
                      { key: 'idCardBorder', label: 'Student ID Card Outer Border' },
                      { key: 'idCardBackground', label: 'Student ID Card Surface' },
                      { key: 'muted', label: 'Muted Background / Badges' },
                      { key: 'mutedForeground', label: 'Secondary / Subtitle Text' },
                    ].map(({ key, label }) => {
                      const colorVal = (theme.colors as any)[key] || '#ffffff';
                      return (
                        <div
                          key={key}
                          className="p-3 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] flex items-center justify-between gap-3"
                        >
                          <div>
                            <span className="text-xs font-semibold text-[#2b241e] block">{label}</span>
                            <span className="text-[10px] font-mono text-[#73685c]">{colorVal}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={colorVal}
                              onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                              className="w-8 h-8 rounded-lg cursor-pointer border border-[#d9cdbd] p-0.5 bg-white"
                            />
                            <input
                              type="text"
                              value={colorVal}
                              onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                              className="w-20 px-2 py-1 text-xs rounded font-mono bg-white border border-[#d9cdbd] text-center"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TYPOGRAPHY TAB */}
              {panelTab === 'typography' && (
                <div className="space-y-3">
                  <p className="text-xs text-[#73685c]">
                    Configure global font pairings and heading scales.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#52493e] mb-1">
                        Primary Font Family
                      </label>
                      <select
                        value={theme.typography.fontFamily}
                        onChange={(e) =>
                          updateTheme({
                            typography: {
                              ...theme.typography,
                              fontFamily: e.target.value as any,
                              headingFont:
                                e.target.value === 'serif'
                                  ? '"Times New Roman", Times, "Tinos", Georgia, serif'
                                  : e.target.value === 'sans'
                                  ? '"Inter", system-ui, sans-serif'
                                  : 'ui-monospace, SFMono-Regular, Menlo, monospace',
                              bodyFont:
                                e.target.value === 'serif'
                                  ? '"Times New Roman", Times, "Tinos", Georgia, serif'
                                  : e.target.value === 'sans'
                                  ? '"Inter", system-ui, sans-serif'
                                  : 'ui-monospace, SFMono-Regular, Menlo, monospace',
                            },
                          })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e]"
                      >
                        <option value="serif">Academic Serif (Times New Roman / Georgia / Tinos)</option>
                        <option value="sans">Modern Sans (Inter / System UI / Segoe UI)</option>
                        <option value="mono">Technical Monospace (SF Mono / Menlo / Consolas)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#52493e] mb-1">
                        Letter Spacing
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['tight', 'normal', 'wide'] as const).map((space) => (
                          <button
                            key={space}
                            type="button"
                            onClick={() =>
                              updateTheme({
                                typography: { ...theme.typography, letterSpacing: space },
                              })
                            }
                            className={`py-1.5 px-3 rounded-lg text-xs font-semibold capitalize border cursor-pointer ${
                              theme.typography.letterSpacing === space
                                ? 'bg-[#704a29] text-white border-[#704a29]'
                                : 'bg-[#fbf8f3] text-[#73685c] border-[#d9cdbd]'
                            }`}
                          >
                            {space}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LAYOUT TAB */}
              {panelTab === 'layout' && (
                <div className="space-y-3">
                  <p className="text-xs text-[#73685c]">
                    Configure card corner rounding, shadow intensity, and page constraints.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-[#52493e] mb-1">
                      Corner Radius
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['none', 'small', 'medium', 'large'] as const).map((rad) => (
                        <button
                          key={rad}
                          type="button"
                          onClick={() =>
                            updateTheme({
                              layout: { ...theme.layout, borderRadius: rad },
                            })
                          }
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize border cursor-pointer ${
                            theme.layout.borderRadius === rad
                              ? 'bg-[#704a29] text-white border-[#704a29]'
                              : 'bg-[#fbf8f3] text-[#73685c] border-[#d9cdbd]'
                          }`}
                        >
                          {rad}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#52493e] mb-1">
                      Shadow Intensity
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['none', 'subtle', 'prominent'] as const).map((shadow) => (
                        <button
                          key={shadow}
                          type="button"
                          onClick={() =>
                            updateTheme({
                              layout: { ...theme.layout, shadowIntensity: shadow },
                            })
                          }
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize border cursor-pointer ${
                            theme.layout.shadowIntensity === shadow
                              ? 'bg-[#704a29] text-white border-[#704a29]'
                              : 'bg-[#fbf8f3] text-[#73685c] border-[#d9cdbd]'
                          }`}
                        >
                          {shadow}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
