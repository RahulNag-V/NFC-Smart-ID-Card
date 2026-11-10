import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  Nfc,
  QrCode,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useOwnerEditor } from '../../../context/OwnerEditorContext';

export const NfcQrModule: React.FC = () => {
  const { publishedContent, showToast } = useOwnerEditor();

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/`
    : 'https://rahulnagv-24cs051.web.app/';

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Generate QR code data URL
  useEffect(() => {
    QRCode.toDataURL(publicUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: '#221b16',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [publicUrl]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      showToast('Public portfolio URL copied.', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy URL.', 'error');
    }
  };

  const handleDownloadPng = async () => {
    try {
      setIsGenerating(true);
      const highResUrl = await QRCode.toDataURL(publicUrl, {
        width: 1024,
        margin: 2,
        color: {
          dark: '#221b16',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      });

      const a = document.createElement('a');
      a.href = highResUrl;
      a.download = `ananta-sparsha-qr-1024px.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('High-resolution PNG QR downloaded.', 'success');
    } catch (err) {
      showToast('Failed to generate PNG QR.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSvg = async () => {
    try {
      const svgString = await QRCode.toString(publicUrl, {
        type: 'svg',
        margin: 2,
        color: {
          dark: '#221b16',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      });

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ananta-sparsha-qr-vector.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Vector SVG QR code downloaded.', 'success');
    } catch (err) {
      showToast('Failed to generate SVG QR.', 'error');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl font-serif">
      {/* Module Title */}
      <div>
        <h2 className="text-xl font-bold text-[#2b241e] tracking-tight">
          NFC & Dynamic QR Identity Management
        </h2>
        <p className="text-xs text-[#73685c] mt-1">
          Review your permanent contactless smart card URL, inspect NFC NDEF encoding parameters, and download print-ready QR assets.
        </p>
      </div>

      {/* Permanent NFC Stability Banner */}
      <div className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#704a29] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Nfc className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#2b241e]">
                Permanent NFC Routing Architecture
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#f2f8f2] text-[#166534] border border-[#86efac] text-[10px] font-bold">
                No Tag Rewrites Needed
              </span>
            </div>
            <p className="text-xs text-[#73685c] mt-1.5 leading-relaxed max-w-xl">
              Your physical NFC card is permanently written with your canonical URL. Whenever you edit and publish your profile through Ananta Sparsha, cloud documents update instantly. You <b>never</b> have to rewrite your physical NFC tags.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex sm:flex-col items-center gap-1.5">
          <span className="text-[10px] text-[#73685c] font-bold uppercase">Current Edition</span>
          <span className="px-3 py-1 rounded-xl bg-[#f0eae1] border border-[#d9cdbd] text-xs font-bold text-[#704a29]">
            v{publishedContent.version || 1}.0 Live
          </span>
        </div>
      </div>

      {/* QR Code Generator & Download Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Visual Card */}
        <div className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-6 flex flex-col items-center justify-center text-center shadow-2xs">
          <div className="p-4 bg-white rounded-2xl shadow-md border-2 border-[#d9cdbd] relative group mb-4">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Permanent Portfolio QR Code"
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center">
                <span className="text-xs text-[#73685c]">Generating QR...</span>
              </div>
            )}
          </div>

          <p className="text-xs text-[#73685c] mb-2 font-semibold">
            Dynamic Smart QR &bull; Error Correction Level H
          </p>

          <div className="flex items-center gap-3 mt-3 w-full">
            <button
              onClick={handleDownloadPng}
              disabled={isGenerating}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#704a29] hover:bg-[#593a1f] text-xs font-bold text-white flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG (1024px)</span>
            </button>
            <button
              onClick={handleDownloadSvg}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#fffefb] hover:bg-[#f0eae1] text-xs font-semibold text-[#2b241e] flex items-center justify-center gap-1.5 transition cursor-pointer border border-[#d9cdbd] shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-[#704a29]" />
              <span>Vector SVG</span>
            </button>
          </div>
        </div>

        {/* Technical Hardware & Encoding Specs */}
        <div className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-6 flex flex-col justify-between space-y-4 shadow-2xs">
          <div>
            <h3 className="text-xs uppercase tracking-wider text-[#704a29] font-bold pb-3 border-b border-[#d9cdbd] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#704a29]" />
              Physical NFC Tag Specification
            </h3>

            <div className="space-y-3 mt-4 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#fbf8f3] border border-[#d9cdbd]">
                <span className="text-[#73685c]">NDEF Record Type</span>
                <span className="text-[#704a29] font-bold">URI (0x55 0x04)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#fbf8f3] border border-[#d9cdbd]">
                <span className="text-[#73685c]">Tag Compatibility</span>
                <span className="text-[#2b241e] font-semibold">NTAG213 / 215 / 216</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#fbf8f3] border border-[#d9cdbd]">
                <span className="text-[#73685c]">Physical Tag Security</span>
                <span className="text-[#16a34a] font-bold">Password Lockable (0xFF)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#fbf8f3] border border-[#d9cdbd]">
                <span className="text-[#73685c]">Encoding Protocol</span>
                <span className="text-[#2b241e]">ISO/IEC 14443 Type A</span>
              </div>
            </div>
          </div>

          {/* Canonical URL Copy Box */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#73685c] font-bold mb-1.5">
              Permanent NFC Payload URL
            </label>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd]">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="w-full bg-transparent text-xs text-[#704a29] font-semibold focus:outline-none select-all px-2"
              />
              <button
                onClick={handleCopyUrl}
                className="px-3 py-1.5 rounded-lg bg-[#fffefb] hover:bg-[#f0eae1] border border-[#d9cdbd] text-xs text-[#2b241e] flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#16a34a]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NfcQrModule;
