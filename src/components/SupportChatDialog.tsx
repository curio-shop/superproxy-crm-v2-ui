import { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
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
        className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        style={{ zIndex: Z_INDEX.chatDialog }}
        onClick={onClose}
      />
      <div
        className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl flex flex-col"
        style={{ zIndex: Z_INDEX.chatDialog + 1 }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Support Chat</h2>
            <p className="text-xs text-blue-100">We typically respond within a few hours</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${msg.sender_type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.sender_type === 'support' && (
                      <div className="flex-shrink-0">
                        {msg.sender_avatar ? (
                          <img
                            src={msg.sender_avatar}
                            alt={msg.sender_name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                            {msg.sender_name.charAt(0)}
                          </div>
                        )}
                      </div>
                    )}
                    <div>
                      {msg.sender_type === 'support' && (
                        <p className="text-xs text-gray-600 mb-1 px-1">{msg.sender_name}</p>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          msg.sender_type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-1">
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSending ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
