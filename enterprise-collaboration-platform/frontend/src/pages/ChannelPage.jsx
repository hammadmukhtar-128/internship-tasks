import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Hash, Lock, Users, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { channelsApi } from '../api/channels';
import { messagesApi } from '../api/messages';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import MessageBubble from '../components/chat/MessageBubble';
import MessageInput from '../components/chat/MessageInput';
import TypingIndicator from '../components/chat/TypingIndicator';
import EmptyState from '../components/common/EmptyState';

export default function ChannelPage() {
  const { channelId } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket() || {};

  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState({}); // { userId: name }
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }));
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const [{ data: channelData }, { data: msgData }] = await Promise.all([
          channelsApi.getChannel(channelId),
          messagesApi.getChannelMessages(channelId),
        ]);
        if (!active) return;
        setChannel(channelData.data.channel);
        setMessages(msgData.data.messages);
        messagesApi.markChannelRead(channelId).catch(() => {});
      } catch (err) {
        toast.error('Could not load channel');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    scrollToBottom();
    return () => {
      active = false;
    };
  }, [channelId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit('channel:join', { channelId });

    const onNewMessage = (msg) => {
      if (msg.channel !== channelId && msg.channel?._id !== channelId) return;
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    };

    const onTyping = ({ channelId: cId, userId, userName, isTyping }) => {
      if (cId !== channelId || userId === user._id) return;
      setTypingUsers((prev) => {
        const next = { ...prev };
        if (isTyping) next[userId] = userName;
        else delete next[userId];
        return next;
      });
    };

    const onReactionUpdate = ({ messageId, reactions }) => {
      setMessages((prev) => prev.map((m) => (m._id === messageId ? { ...m, reactions } : m)));
    };

    socket.on('message:new', onNewMessage);
    socket.on('typing:update', onTyping);
    socket.on('message:reaction-update', onReactionUpdate);

    return () => {
      socket.emit('channel:leave', { channelId });
      socket.off('message:new', onNewMessage);
      socket.off('typing:update', onTyping);
      socket.off('message:reaction-update', onReactionUpdate);
    };
  }, [socket, channelId, user._id]);

  const handleSend = useCallback(
    ({ content, attachments }) => {
      socket?.emit('message:send', { channelId, content, attachments }, (res) => {
        if (!res?.success) toast.error(res?.message || 'Failed to send message');
      });
    },
    [socket, channelId]
  );

  const handleTyping = useCallback(
    (isTyping) => {
      socket?.emit(isTyping ? 'typing:start' : 'typing:stop', { channelId });
    },
    [socket, channelId]
  );

  const handleReact = useCallback(
    (messageId, emoji) => {
      socket?.emit('message:react', { messageId, emoji });
    },
    [socket]
  );

  const handleEdit = async (id, content) => {
    try {
      const { data } = await messagesApi.editMessage(id, content);
      setMessages((prev) => prev.map((m) => (m._id === id ? data.data.message : m)));
    } catch (err) {
      toast.error('Could not edit message');
    }
  };

  const handleDelete = async (id) => {
    try {
      await messagesApi.deleteMessage(id);
      setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, isDeleted: true } : m)));
    } catch (err) {
      toast.error('Could not delete message');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="animate-spin text-brand-500" size={28} />
      </div>
    );
  }

  if (!channel) {
    return <EmptyState icon={Hash} title="Channel not found" description="It may have been deleted or archived." />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-slate-200/70 px-5 py-3.5 dark:border-white/5">
        <div className="flex items-center gap-2">
          {channel.type === 'private' ? <Lock size={16} className="text-slate-400" /> : <Hash size={16} className="text-slate-400" />}
          <h2 className="font-display font-semibold text-slate-800 dark:text-white">{channel.name}</h2>
          {channel.description && (
            <span className="hidden text-sm text-slate-400 md:inline">— {channel.description}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-slate-400">
          <Users size={15} />
          {channel.members?.length || 0}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto py-3">
        {messages.length === 0 ? (
          <EmptyState
            icon={Hash}
            title={`Welcome to #${channel.name}`}
            description="This is the start of the channel. Send the first message!"
          />
        ) : (
          messages.map((m) => (
            <MessageBubble
              key={m._id}
              message={m}
              currentUserId={user._id}
              isOwnMessage={m.sender?._id === user._id}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReact={handleReact}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <TypingIndicator typingUsers={Object.values(typingUsers)} />
      <MessageInput onSend={handleSend} onTyping={handleTyping} channelName={channel.name} />
    </div>
  );
}
