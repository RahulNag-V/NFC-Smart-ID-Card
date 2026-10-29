import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContent } from '../../context/SiteContentContext';
import { Download, Upload, X, Check, AlertCircle, FileText, Copy } from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { exportBackup, importBackup } = useSiteContent();
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadFile = () => {
    const json = exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RahulNagV_Profile_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyClipboard = async () => {
    const json = exportBackup();
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleImport = async () => {
    if (!importText.trim()) return;
    const result = await importBackup(importText);
    if (result.success) {
      setImportStatus({ success: true, message: 'Backup successfully restored to editor draft!' });
      setTimeout(() => {
        setImportStatus(null);
        onClose();
      }, 1500);
    } else {
      setImportStatus({ success: false, message: result.error || 'Failed to parse JSON backup.' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setImportText(text);
    };
    reader.readAsText(file);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1a1410]/70 backdrop-blur-sm cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-lg bg-[#fffefb] border border-[#d9cdbd] rounded-2xl shadow-2xl p-6 text-[#2b241e] font-sans max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#d9cdbd]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#f0eae1] text-[#704a29] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-serif text-[#2b241e]">Backup &amp; Migration</h3>
                <p className="text-[11px] text-[#73685c]">Export or restore profile configuration as clean JSON</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-5">
            {/* Export Section */}
            <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] space-y-2.5">
              <h4 className="text-xs font-bold text-[#704a29] uppercase tracking-wide">Export Current Profile</h4>
              <p className="text-xs text-[#73685c]">
                Download a complete, offline JSON snapshot of your personal information, VTU academic entries, projects, theme settings, and section ordering. No passwords or secrets are ever exported.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadFile}
                  className="px-3.5 py-1.5 rounded-lg bg-[#704a29] hover:bg-[#5a3a1f] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .json Backup</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyClipboard}
                  className="px-3 py-1.5 rounded-lg bg-[#fffefb] hover:bg-[#f0eae1] border border-[#d9cdbd] text-xs font-semibold text-[#52493e] flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
                </button>
              </div>
            </div>

            {/* Import Section */}
            <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] space-y-2.5">
              <h4 className="text-xs font-bold text-[#704a29] uppercase tracking-wide">Restore from JSON</h4>
              <p className="text-xs text-[#73685c]">
                Paste a previously exported JSON backup or upload a .json file to restore content into your active draft.
              </p>

              <div>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="text-xs text-[#73685c] file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#f0eae1] file:text-[#704a29] hover:file:bg-[#e6dcce] cursor-pointer"
                />
              </div>

              <textarea
                rows={4}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste JSON backup payload here..."
                className="w-full p-2.5 text-[11px] font-mono rounded-lg bg-white border border-[#d9cdbd] text-[#2b241e]"
              />

              {importStatus && (
                <div
                  className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                    importStatus.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {importStatus.success ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{importStatus.message}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleImport}
                disabled={!importText.trim()}
                className="w-full py-2 rounded-lg bg-[#2b241e] hover:bg-[#42372e] text-white text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Validate &amp; Restore to Draft</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
