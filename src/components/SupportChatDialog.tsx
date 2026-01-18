import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { supabase } from '../lib/supabase';
import { Z_INDEX } from '../lib/zIndex';

interface Message {
  id: string;
  sender_type: 'user' | 'support';
  sender_name: string;
  sender_avatar?: string;
  message: string;
  created_at: string;
}

interface SupportChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

export default function SupportChatDialog({ isOpen, onClose, userId, userName }: SupportChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && userId) {
      initializeConversation();
    }
  }, [isOpen, userId]);

  const initializeConversation = async () => {
    setIsLoading(true);
    try {
      const { data: existingConversation } = await supabase
        .from('support_conversations')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'open')
        .maybeSingle();

      let convId = existingConversation?.id;

      if (!convId) {
        const { data: newConversation, error } = await supabase
          .from('support_conversations')
          .insert({
            user_id: userId,
            status: 'open',
            unread_count: 0
          })
          .select('id')
          .single();

        if (error) throw error;
        convId = newConversation.id;

        await sendAutoGreeting(convId);
      }

      setConversationId(convId);
      await loadMessages(convId);
      await markMessagesAsRead(convId);
    } catch (error) {
      console.error('Error initializing conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendAutoGreeting = async (convId: string) => {
    const greetingMessage = {
      conversation_id: convId,
      sender_type: 'support',
      sender_id: '00000000-0000-0000-0000-000000000000',
      sender_name: 'Support Team',
      sender_avatar: null,
      message: `Hi ${userName}! 👋 Welcome to our support chat. We're here to help you with any questions you might have. Our team typically responds within a few hours during business hours. How can we assist you today?`
    };

    await supabase
      .from('support_messages')
      .insert(greetingMessage);
  };

  const loadMessages = async (convId: string) => {
    const { data, error } = await supabase
      .from('support_messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    setMessages(data || []);
  };

  const markMessagesAsRead = async (convId: string) => {
    await supabase
      .from('support_conversations')
      .update({ unread_count: 0 })
      .eq('id', convId);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId || isSending) return;

    setIsSending(true);
    try {
      const messageData = {
        conversation_id: conversationId,
        sender_type: 'user',
        sender_id: userId,
        sender_name: userName,
        message: newMessage.trim()
      };

      const { data, error } = await supabase
        .from('support_messages')
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`support_messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (newMsg.sender_id !== userId) {
            setMessages(prev => {
              if (prev.some(m => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, userId]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-[2px] transition-opacity"
        style={{ zIndex: Z_INDEX.chatDialog }}
        onClick={onClose}
      />
      <div
        className="fixed bottom-24 right-6 w-[380px] h-[550px] bg-white shadow-2xl flex flex-col rounded-2xl border border-slate-200 animate-in slide-in-from-bottom-8 fade-in duration-300"
        style={{ zIndex: Z_INDEX.chatDialog + 1 }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Icon icon="solar:chat-round-dots-bold" width="20" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Support Chat</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-xs text-blue-100">Online</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            aria-label="Close chat"
          >
            <Icon icon="solar:close-circle-bold" width="24" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Icon icon="svg-spinners:270-ring-with-bg" width="40" className="text-blue-600" />
            </div>
          ) : (
            <>
              {messages.map((msg, index) => {
                const showDate = index === 0 ||
                  new Date(messages[index - 1].created_at).toDateString() !== new Date(msg.created_at).toDateString();

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="flex justify-center my-3">
                        <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm">
                          {new Date(msg.created_at).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            year: new Date(msg.created_at).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                          })}
                        </span>
                      </div>
                    )}
                    <div
                      className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end gap-2 max-w-[75%] ${msg.sender_type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {msg.sender_type === 'support' && (
                          <div className="flex-shrink-0 mb-1">
                            {msg.sender_avatar ? (
                              <img
                                src={msg.sender_avatar}
                                alt={msg.sender_name}
                                className="w-7 h-7 rounded-full"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                                {msg.sender_name.charAt(0)}
                              </div>
                            )}
                          </div>
                        )}
                        <div>
                          {msg.sender_type === 'support' && (
                            <p className="text-xs text-slate-600 mb-1 px-2 font-medium">{msg.sender_name}</p>
                          )}
                          <div
                            className={`rounded-2xl px-4 py-2.5 ${
                              msg.sender_type === 'user'
                                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md'
                                : 'bg-white text-slate-800 shadow-sm border border-slate-200'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 px-2">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 rounded-b-2xl">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                disabled={isSending}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Add emoji"
              >
                <Icon icon="solar:smile-circle-bold" width="20" />
              </button>
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full p-3 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg disabled:shadow-none"
              aria-label="Send message"
            >
              {isSending ? (
                <Icon icon="svg-spinners:270-ring-with-bg" width="20" />
              ) : (
                <Icon icon="solar:plain-2-bold" width="20" className="rotate-45" />
              )}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">Press Enter to send • Shift+Enter for new line</p>
        </form>
      </div>
    </>
  );
}
