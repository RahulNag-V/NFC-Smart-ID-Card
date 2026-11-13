import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Globe,
  ExternalLink,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Sparkles,
  Edit2,
  X,
  ChevronUp,
  ChevronDown,
  Palette,
} from 'lucide-react';
import { useOwnerEditor } from '../../../context/OwnerEditorContext';
import { SocialChannelConfig } from '../../../types/content';

const brandColorPresets = [
  { name: 'WhatsApp', color: '#25D366' },
  { name: 'Instagram', color: '#E1306C' },
  { name: 'LinkedIn', color: '#0A66C2' },
  { name: 'GitHub', color: '#181717' },
  { name: 'X / Twitter', color: '#000000' },
  { name: 'Telegram', color: '#229ED9' },
  { name: 'YouTube', color: '#FF0000' },
  { name: 'Discord', color: '#5865F2' },
  { name: 'Classic Bronze', color: '#704a29' },
  { name: 'Emerald', color: '#10B981' },
];

export const SocialLinksModule: React.FC = () => {
  const { draftContent, updateSocialChannels, showToast } = useOwnerEditor();
  const channels = draftContent.socialChannels || [];

  const [newCustomName, setNewCustomName] = useState('');
  const [newCustomUrl, setNewCustomUrl] = useState('');
  const [newCustomHandle, setNewCustomHandle] = useState('');
  const [editingChannel, setEditingChannel] = useState<SocialChannelConfig | null>(null);

  const handleToggleChannel = (id: string) => {
    const updated = channels.map((c) =>
      c.id === id ? { ...c, visible: !c.visible } : c
    );
    updateSocialChannels(updated);
  };

  const handleMoveChannel = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= channels.length) return;
    const updated = [...channels];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    updateSocialChannels(updated);
    showToast(`Reordered ${moved.name}.`, 'info');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChannel) return;
    if (!editingChannel.name.trim()) {
      showToast('Platform name is required.', 'error');
      return;
    }
    if (!editingChannel.url.trim()) {
      showToast('Destination URL is required.', 'error');
      return;
    }

    let validUrl = editingChannel.url.trim();
    if (
      !validUrl.startsWith('http://') &&
      !validUrl.startsWith('https://') &&
      !validUrl.startsWith('mailto:') &&
      !validUrl.startsWith('tel:')
    ) {
      validUrl = `https://${validUrl}`;
    }

    const updated = channels.map((c) =>
      c.id === editingChannel.id
        ? {
            ...editingChannel,
            url: validUrl,
            handle: editingChannel.handle.trim() || editingChannel.name.trim(),
            actionText: editingChannel.actionText.trim() || `Visit ${editingChannel.name.trim()}`,
          }
        : c
    );

    updateSocialChannels(updated);
    showToast(`Updated ${editingChannel.name} settings.`, 'success');
    setEditingChannel(null);
  };

  const handleUpdateChannel = (id: string, patch: Partial<SocialChannelConfig>) => {
    const updated = channels.map((c) =>
      c.id === id ? { ...c, ...patch } : c
    );
    updateSocialChannels(updated);
  };

  const handleAddCustomChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomName.trim() || !newCustomUrl.trim()) {
      showToast('Name and destination URL are required.', 'error');
      return;
    }

    let validUrl = newCustomUrl.trim();
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
      validUrl = `https://${validUrl}`;
    }

    const newChannel: SocialChannelConfig = {
      id: `custom-${Date.now()}`,
      name: newCustomName.trim(),
      handle: newCustomHandle.trim() || newCustomName.trim(),
      actionText: `Visit ${newCustomName.trim()}`,
      url: validUrl,
      brandColor: '#704a29',
      visible: true,
    };

    updateSocialChannels([...channels, newChannel]);
    setNewCustomName('');
    setNewCustomUrl('');
    setNewCustomHandle('');
    showToast(`Added ${newChannel.name} link.`, 'success');
  };

  const handleDeleteChannel = (id: string) => {
    updateSocialChannels(channels.filter((c) => c.id !== id));
    showToast('Channel link removed.', 'info');
  };

  return (
    <div className="space-y-8 max-w-4xl font-serif">
      {/* Module Title */}
      <div>
        <h2 className="text-xl font-bold text-[#2b241e] tracking-tight">
          Social Channels & Outbound Connect
        </h2>
        <p className="text-xs text-[#73685c] mt-1">
          Configure direct links for your social networks, instant messaging channels, developer portfolios, and personal destinations.
        </p>
      </div>

      {/* Social Links List */}
      <div className="space-y-4">
        {channels.map((channel, idx) => (
          <div
            key={channel.id}
            className={`p-5 rounded-2xl border transition duration-200 shadow-2xs ${
              channel.visible
                ? 'bg-[#fffefb] border-[#d9cdbd] hover:border-[#704a29]'
                : 'bg-[#fbf8f3] border-[#d9cdbd]/60 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0 font-bold text-xs"
                  style={{ backgroundColor: channel.brandColor || '#704a29' }}
                >
                  {channel.name.slice(0, 2).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-[#2b241e] truncate">{channel.name}</h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        channel.visible
                          ? 'bg-[#f2f8f2] border-[#86efac] text-[#166534] font-bold'
                          : 'bg-[#f0eae1] border-[#d9cdbd] text-[#73685c]'
                      }`}
                    >
                      {channel.visible ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-xs text-[#73685c] mt-0.5 font-semibold truncate">{channel.handle}</p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {/* Reorder Up / Down */}
                <button
                  type="button"
                  onClick={() => handleMoveChannel(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg bg-[#f0eae1] hover:bg-[#e5ded5] text-[#2b241e] disabled:opacity-30 cursor-pointer shadow-2xs"
                  title="Move Up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveChannel(idx, 'down')}
                  disabled={idx === channels.length - 1}
                  className="p-1.5 rounded-lg bg-[#f0eae1] hover:bg-[#e5ded5] text-[#2b241e] disabled:opacity-30 cursor-pointer shadow-2xs"
                  title="Move Down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {/* Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleChannel(channel.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs ${
                    channel.visible
                      ? 'bg-[#f2f8f2] border-[#86efac] text-[#166534] font-bold'
                      : 'bg-[#f0eae1] border-[#d9cdbd] text-[#73685c]'
                  }`}
                >
                  {channel.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{channel.visible ? 'Active' : 'Muted'}</span>
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => setEditingChannel({ ...channel })}
                  className="px-3 py-1.5 rounded-xl bg-[#f0eae1] hover:bg-[#e5ded5] text-[#704a29] border border-[#d9cdbd] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                  title={`Edit ${channel.name} configuration`}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                {/* Test Link Button */}
                {channel.url && (
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#f0eae1] hover:bg-[#e5ded5] text-[#2b241e] border border-[#d9cdbd] transition shadow-2xs"
                    title="Test Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {/* Delete button (for custom added links) */}
                {channel.id.startsWith('custom-') && (
                  <button
                    type="button"
                    onClick={() => handleDeleteChannel(channel.id)}
                    className="p-2 rounded-xl bg-[#fef2f2] hover:bg-[#fee2e2] text-[#bc473b] border border-[#fca5a5] transition cursor-pointer shadow-2xs"
                    title="Delete Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Inline Quick Editable Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#d9cdbd]">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#73685c] font-bold mb-1">
                  Public Handle / Label
                </label>
                <input
                  type="text"
                  value={channel.handle}
                  onChange={(e) => handleUpdateChannel(channel.id, { handle: e.target.value })}
                  placeholder="@handle or profile"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-base md:text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29] focus-visible:ring-2 focus-visible:ring-amber-900/30 transition-colors duration-200 scroll-mt-24"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#73685c] font-bold mb-1">
                  Destination URL
                </label>
                <input
                  type="url"
                  value={channel.url}
                  onChange={(e) => handleUpdateChannel(channel.id, { url: e.target.value })}
                  placeholder="https://..."
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-base md:text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29] focus-visible:ring-2 focus-visible:ring-amber-900/30 transition-colors duration-200 scroll-mt-24"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Social Channel Modal */}
      <AnimatePresence>
        {editingChannel && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#d9cdbd]">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-xs"
                    style={{ backgroundColor: editingChannel.brandColor || '#704a29' }}
                  >
                    {editingChannel.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#2b241e]">
                      Edit {editingChannel.name}
                    </h3>
                    <p className="text-[11px] text-[#73685c]">
                      Customize branding, action text, and destination endpoint
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingChannel(null)}
                  className="text-[#73685c] hover:text-[#2b241e] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-1.5">
                      Platform Name
                    </label>
                    <input
                      type="text"
                      value={editingChannel.name}
                      onChange={(e) => setEditingChannel({ ...editingChannel, name: e.target.value })}
                      required
                      placeholder="e.g. WhatsApp, Instagram"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-1.5">
                      Public Handle / Label
                    </label>
                    <input
                      type="text"
                      value={editingChannel.handle}
                      onChange={(e) => setEditingChannel({ ...editingChannel, handle: e.target.value })}
                      required
                      placeholder="e.g. +91 9844616699 or @handle"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-1.5">
                    Call-To-Action Button Text
                  </label>
                  <input
                    type="text"
                    value={editingChannel.actionText || ''}
                    onChange={(e) => setEditingChannel({ ...editingChannel, actionText: e.target.value })}
                    placeholder="e.g. Direct Message on WhatsApp, Follow on Instagram"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                  />
                  <span className="text-[10px] text-[#73685c] mt-0.5 block">
                    Shown when visitors hover or tap this touchpoint on the profile
                  </span>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-1.5">
                    Destination URL
                  </label>
                  <input
                    type="text"
                    value={editingChannel.url}
                    onChange={(e) => setEditingChannel({ ...editingChannel, url: e.target.value })}
                    required
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                  />
                </div>

                {/* Brand Color & Presets */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold">
                    Brand Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={
                        editingChannel.brandColor.startsWith('#') && editingChannel.brandColor.length === 7
                          ? editingChannel.brandColor
                          : '#704a29'
                      }
                      onChange={(e) => setEditingChannel({ ...editingChannel, brandColor: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-[#d9cdbd] p-1 bg-white cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingChannel.brandColor}
                      onChange={(e) => setEditingChannel({ ...editingChannel, brandColor: e.target.value })}
                      placeholder="#25D366"
                      className="w-32 px-3 py-2 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs font-mono text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                    />
                    <div
                      className="px-3 py-1.5 rounded-lg text-white text-xs font-bold shadow-2xs"
                      style={{ backgroundColor: editingChannel.brandColor || '#704a29' }}
                    >
                      Color Preview
                    </div>
                  </div>

                  {/* Swatches */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {brandColorPresets.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setEditingChannel({ ...editingChannel, brandColor: preset.color })}
                        className="px-2 py-1 rounded-md text-[10px] font-semibold border flex items-center gap-1.5 transition cursor-pointer hover:scale-105"
                        style={{
                          backgroundColor: `${preset.color}15`,
                          borderColor: preset.color,
                          color:
                            preset.color === '#000000' || preset.color === '#181717'
                              ? '#181717'
                              : preset.color,
                        }}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: preset.color }} />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visibility Switch */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#d9cdbd]/60">
                  <input
                    type="checkbox"
                    id="editChannelVisible"
                    checked={editingChannel.visible}
                    onChange={(e) => setEditingChannel({ ...editingChannel, visible: e.target.checked })}
                    className="rounded border-[#d9cdbd] text-[#704a29] focus:ring-[#704a29]"
                  />
                  <label htmlFor="editChannelVisible" className="text-xs text-[#2b241e] font-semibold cursor-pointer">
                    Display this channel on your public ID profile touchpoint menu
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#d9cdbd]">
                  <button
                    type="button"
                    onClick={() => setEditingChannel(null)}
                    className="px-4 py-2 rounded-xl bg-[#f0eae1] hover:bg-[#e5ded5] text-xs text-[#73685c] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#704a29] hover:bg-[#593a1f] text-xs font-bold text-white shadow-xs cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Custom Social Channel Form */}
      <div className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-6 sm:p-8 space-y-4 shadow-2xs">
        <h3 className="text-xs uppercase tracking-wider text-[#704a29] font-bold flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#704a29]" />
          Add Custom Outbound Link
        </h3>
        <p className="text-xs text-[#73685c]">
          Add personal blogs, research repositories, Medium, Discord, Spotify, or any custom destination.
        </p>

        <form onSubmit={handleAddCustomChannel} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={newCustomName}
            onChange={(e) => setNewCustomName(e.target.value)}
            placeholder="Platform Name (e.g. Substack)"
            className="px-3.5 py-2 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
          />
          <input
            type="text"
            value={newCustomHandle}
            onChange={(e) => setNewCustomHandle(e.target.value)}
            placeholder="Display Text (e.g. @rahul.newsletter)"
            className="px-3.5 py-2 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newCustomUrl}
              onChange={(e) => setNewCustomUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#704a29] hover:bg-[#593a1f] text-xs font-bold text-white cursor-pointer shrink-0 shadow-xs"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SocialLinksModule;
