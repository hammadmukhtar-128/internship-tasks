import { useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Send, Paperclip, Smile, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadsApi } from '../../api/uploads';
import { useTheme } from '../../context/ThemeContext';

export default function MessageInput({ onSend, onTyping, channelName }) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeout = useRef(null);
  const { theme } = useTheme();

  const handleChange = (e) => {
    setContent(e.target.value);
    onTyping?.(true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => onTyping?.(false), 1500);
  };

  const handleFile = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const { data } = await uploadsApi.uploadSingle(file);
          return data.data.file;
        })
      );
      setAttachments((prev) => [...prev, ...uploaded]);
    } catch (err) {
      toast.error('File upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!content.trim() && attachments.length === 0) return;
    onSend({ content: content.trim(), attachments });
    setContent('');
    setAttachments([]);
    onTyping?.(false);
  };

  return (
    <form onSubmit={submit} className="border-t border-slate-200/70 bg-white/60 p-3 backdrop-blur-xl dark:border-white/5 dark:bg-panel-dark/50">
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((a, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
            >
              <span className="max-w-[140px] truncate">{a.filename}</span>
              <button
                type="button"
                onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                className="text-slate-400 hover:text-rose-500"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative flex items-end gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-2 focus-within:ring-2 focus-within:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-800/60">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />}
        </button>
        <input ref={fileInputRef} type="file" multiple hidden onChange={handleFile} />

        <textarea
          value={content}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit(e);
            }
          }}
          placeholder={`Message #${channelName || 'channel'}`}
          rows={1}
          className="max-h-32 flex-1 resize-none bg-transparent px-1 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
        />

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmoji((o) => !o)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
          >
            <Smile size={18} />
          </button>
          {showEmoji && (
            <div className="absolute bottom-full right-0 z-30 mb-2">
              <EmojiPicker
                theme={theme}
                onEmojiClick={(emojiData) => {
                  setContent((prev) => prev + emojiData.emoji);
                  setShowEmoji(false);
                }}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!content.trim() && attachments.length === 0}
          className="btn-primary !rounded-xl !px-3 !py-2"
        >
          <Send size={16} />
        </button>
      </div>
    </form>
  );
}
