export default function TypingIndicator({ typingUsers }) {
  if (!typingUsers || typingUsers.length === 0) return null;

  const label =
    typingUsers.length === 1
      ? `${typingUsers[0]} is typing`
      : typingUsers.length === 2
        ? `${typingUsers[0]} and ${typingUsers[1]} are typing`
        : `${typingUsers.length} people are typing`;

  return (
    <div className="flex items-center gap-2 px-5 pb-1 text-xs text-slate-400">
      <span className="flex gap-0.5">
        <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
        <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
        <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400" />
      </span>
      {label}...
    </div>
  );
}
