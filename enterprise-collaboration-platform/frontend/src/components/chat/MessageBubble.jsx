import { useState } from 'react';
import { format } from 'date-fns';
import { MoreHorizontal, Pencil, Trash2, Smile, Paperclip, FileText, Download } from 'lucide-react';
import Avatar from '../common/Avatar';

const QUICK_EMOJIS = ['👍', '❤️', '😂', '🎉', '👀', '🚀'];

function AttachmentPreview({ attachment }) {
  const isImage = attachment.mimeType.startsWith('image/');
  if (isImage) {
    return (
      <a href={attachment.url} target="_blank" rel="noreferrer" className="mt-2 block max-w-xs overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <img src={attachment.url} alt={attachment.filename} className="max-h-64 w-full object-cover" />
      </a>
    );
  }
  return (
    <a
      href={attachment.url}
      download={attachment.filename}
      className="mt-2 flex max-w-xs items-center gap-2.5 rounded-xl border border-slate-200 bg-white/60 px-3 py-2.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-800"
    >
      <FileText size={18} className="shrink-0 text-brand-500" />
      <span className="truncate text-slate-700 dark:text-slate-200">{attachment.filename}</span>
      <Download size={14} className="ml-auto shrink-0 text-slate-400" />
    </a>
  );
}

export default function MessageBubble({ message, currentUserId, onEdit, onDelete, onReact, isOwnMessage }) {
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);

  const canModify = isOwnMessage;

  const submitEdit = () => {
    if (draft.trim() && draft !== message.content) onEdit(message._id, draft.trim());
    setEditing(false);
  };

  if (message.isDeleted) {
    return (
      <div className="group flex gap-3 px-4 py-1.5 opacity-60">
        <div className="w-10" />
        <p className="text-sm italic text-slate-400">This message was deleted</p>
      </div>
    );
  }

  return (
    <div
      className="group relative flex gap-3 rounded-lg px-4 py-1.5 hover:bg-slate-100/60 dark:hover:bg-slate-800/40"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowEmojiPicker(false);
      }}
    >
      <Avatar user={message.sender} size="sm" showStatus={false} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{message.sender?.name}</span>
          <span className="text-[11px] text-slate-400">{format(new Date(message.createdAt), 'h:mm a')}</span>
          {message.isEdited && <span className="text-[11px] text-slate-400">(edited)</span>}
        </div>

        {message.replyTo && (
          <div className="mb-1 mt-0.5 border-l-2 border-brand-300 pl-2 text-xs text-slate-400">
            Replying to <span className="font-medium">{message.replyTo.sender?.name}</span>
          </div>
        )}

        {editing ? (
          <div className="mt-1 flex gap-2">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitEdit();
                if (e.key === 'Escape') setEditing(false);
              }}
              className="input-field flex-1 py-1.5 text-sm"
            />
            <button onClick={submitEdit} className="text-xs font-medium text-brand-600">
              Save
            </button>
            <button onClick={() => setEditing(false)} className="text-xs text-slate-400">
              Cancel
            </button>
          </div>
        ) : (
          message.content && (
            <p className="whitespace-pre-wrap break-words text-sm text-slate-700 dark:text-slate-300">
              {message.content}
            </p>
          )
        )}

        {message.attachments?.map((a, idx) => (
          <AttachmentPreview key={idx} attachment={a} />
        ))}

        {message.reactions?.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {message.reactions.map((r) => (
              <button
                key={r.emoji}
                onClick={() => onReact(message._id, r.emoji)}
                className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition ${
                  r.users.includes(currentUserId)
                    ? 'border-brand-400 bg-brand-50 dark:bg-brand-900/30'
                    : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
                }`}
              >
                <span>{r.emoji}</span>
                <span className="text-slate-500 dark:text-slate-400">{r.users.length}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {showActions && !editing && (
        <div className="absolute -top-3 right-4 flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker((o) => !o)}
              className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Smile size={14} />
            </button>
            {showEmojiPicker && (
              <div className="absolute right-0 top-full z-20 mt-1 flex gap-1 rounded-lg border border-slate-200 bg-white p-1.5 shadow-md dark:border-slate-700 dark:bg-slate-800">
                {QUICK_EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      onReact(message._id, e);
                      setShowEmojiPicker(false);
                    }}
                    className="rounded p-1 text-base hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
          {canModify && (
            <>
              <button
                onClick={() => setEditing(true)}
                className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => onDelete(message._id)}
                className="rounded p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
