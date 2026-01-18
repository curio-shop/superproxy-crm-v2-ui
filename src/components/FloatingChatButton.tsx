import { MessageCircle } from 'lucide-react';
import { Z_INDEX } from '../lib/zIndex';

interface FloatingChatButtonProps {
  unreadCount: number;
  onClick: () => void;
  isOpen: boolean;
}

export default function FloatingChatButton({ unreadCount, onClick, isOpen }: FloatingChatButtonProps) {
  if (isOpen) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110"
      style={{ zIndex: Z_INDEX.FLOATING_CHAT_BUTTON }}
      aria-label="Open support chat"
    >
      <MessageCircle size={24} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
