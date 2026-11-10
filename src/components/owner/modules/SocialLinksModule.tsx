import React, { useState } from 'react';
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
} from 'lucide-react';
import { useOwnerEditor } from '../../../context/OwnerEditorContext';
import { SocialChannelConfig } from '../../../types/content';

export const SocialLinksModule: React.FC = () => {
  const { draftContent, updateSocialChannels, showToast } = useOwnerEditor();
  const channels = draftContent.socialChannels || [];

  const [newCustomName, setNewCustomName] = useState('');
  const [newCustomUrl, setNewCustomUrl] = useState('');
  const [newCustomHandle, setNewCustomHandle] = useState('');

  const handleToggleChannel = (id: string) => {
    const updated = channels.map((c) =>
      c.id === id ? { ...c, visible: !c.visible } : c
    );
    updateSocialChannels(updated);
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
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={`p-5 rounded-2xl border transition duration-200 shadow-2xs ${
              channel.visible
                ? 'bg-[#fffefb] border-[#d9cdbd] hover:border-[#704a29]'
                : 'bg-[#fbf8f3] border-[#d9cdbd]/60 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0 font-bold text-xs"
                  style={{ backgroundColor: channel.brandColor || '#704a29' }}
                >
                  {channel.name.slice(0, 2).toUpperCase()}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#2b241e]">{channel.name}</h3>
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
                  <p className="text-xs text-[#73685c] mt-0.5 font-semibold">{channel.handle}</p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 self-end sm:self-center">
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

            {/* Editable Fields */}
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
                  className="w-full px-3 py-1.5 rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
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
                  className="w-full px-3 py-1.5 rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

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
