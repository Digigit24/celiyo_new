// src/pages/Chats.tsx
import { useEffect, useState } from 'react';
import { messagesService } from '@/services/whatsapp/messagesService';
import type { Conversation } from '@/types/whatsappTypes';
import { ConversationList } from '@/components/ConversationList';
import { ChatWindow } from '@/components/ChatWindow';
import { useIsMobile } from '@/hooks/use-is-mobile';

export default function Chats() {
  const [conversations, setConversations] = useState<Conversation[] | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMobile = useIsMobile();

  // Load conversations on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await messagesService.getConversations();
        if (!cancelled) {
          setConversations(data);
          // Auto-select first conversation if available
          if (data.length > 0) {
            setSelectedConversationId(data[0].phone);
          }
        }
      } catch (e: any) {
        if (!cancelled) setError(new Error(e.message || 'Failed to load conversations'));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleConversationSelect = (phone: string) => {
    setSelectedConversationId(phone);
  };

  const handleBackToList = () => {
    if (isMobile) {
      setSelectedConversationId('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">Loading WhatsApp Chats...</div>
            <div className="text-sm text-muted-foreground">Fetching conversations</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-lg font-semibold mb-2 text-destructive">Error Loading Chats</div>
            <div className="text-sm text-muted-foreground mb-4">{error.message}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Transform API conversations to match ConversationList format
  const transformedConversations = conversations?.map(conv => ({
    id: conv.phone,
    name: conv.name || conv.phone,
    lastMessage: conv.last_message,
    time: new Date(conv.last_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    channel: 'whatsapp' as const,
    unread: false, // API doesn't provide unread status in the sample
  })) || [];

  // Mobile view: show either conversation list or chat window
  if (isMobile) {
    if (selectedConversationId) {
      return (
        <div className="flex h-screen bg-background">
          <ChatWindow
            conversationId={selectedConversationId}
            selectedConversation={conversations?.find(c => c.phone === selectedConversationId)}
            isMobile={true}
            onBack={handleBackToList}
          />
        </div>
      );
    }

    return (
      <div className="flex h-screen bg-background">
        
        <ConversationList
          conversations={transformedConversations}
          selectedId={selectedConversationId}
          onSelect={handleConversationSelect}
          isMobile={true}
        />
      </div>
    );
  }

  // Desktop view: show all components
  return (
    <div className="flex h-screen bg-background">
      
      <ConversationList
        conversations={transformedConversations}
        selectedId={selectedConversationId}
        onSelect={handleConversationSelect}
      />
      {selectedConversationId ? (
        <ChatWindow
          conversationId={selectedConversationId}
          selectedConversation={conversations?.find(c => c.phone === selectedConversationId)}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">Select a conversation</div>
            <div className="text-sm text-muted-foreground">Choose a conversation from the list to start chatting</div>
          </div>
        </div>
      )}
    </div>
  );
}