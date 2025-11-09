import { useState, useEffect, useCallback } from 'react';
import { messagesService } from '@/services/whatsapp/messagesService';
import type { WhatsAppMessage, ConversationDetail } from '@/types/whatsappTypes';

export interface UseMessagesReturn {
  messages: WhatsAppMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  refreshMessages: () => Promise<void>;
  isSending: boolean;
}

export function useMessages(conversationPhone: string | null): UseMessagesReturn {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
    const tenantId = 'bc531d42-ac91-41df-817e-26c339af6b3a';

  useEffect(() => {
  const ws = new WebSocket(`ws://whatsapp.dglinkup.com/ws/${tenantId}`);
  
  ws.onmessage = (event) => {
    const newMessage = JSON.parse(event.data);
    setMessages(prev => [...prev, newMessage]);
  };
  
  return () => ws.close();
}, [tenantId]);

  const loadMessages = useCallback(async () => {
    if (!conversationPhone) {
      setMessages([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const conversationDetail = await messagesService.getConversationMessages(conversationPhone);
      setMessages(conversationDetail.messages);
    } catch (err: any) {
      console.error('Failed to load messages:', err);
      setError(err.message || 'Failed to load messages');
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [conversationPhone]);

  const sendMessage = useCallback(async (text: string) => {
    if (!conversationPhone || !text.trim() || isSending) return;

    const messageText = text.trim();
    const tempMessage: WhatsAppMessage = {
      id: `temp-${Date.now()}`,
      from: 'me', // This will be replaced with actual user phone in real implementation
      to: conversationPhone,
      text: messageText,
      type: 'text',
      direction: 'outgoing',
      timestamp: new Date().toISOString(),
    };


    

    // Optimistically add message to UI
    setMessages(prev => [...prev, tempMessage]);
    setIsSending(true);
    setError(null);

    try {
      const response = await messagesService.sendTextMessage({
        to: conversationPhone,
        text: messageText
      });

      // Replace temp message with actual response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id 
            ? {
                ...tempMessage,
                id: response.message_id,
                timestamp: response.timestamp,
              }
            : msg
        )
      );

      console.log('Message sent successfully:', response);
    } catch (err: any) {
      console.error('Failed to send message:', err);
      // Remove the optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      setError(err.message || 'Failed to send message');
      throw err; // Re-throw so the UI can handle it
    } finally {
      setIsSending(false);
    }
  }, [conversationPhone, isSending]);

  const refreshMessages = useCallback(async () => {
    await loadMessages();
  }, [loadMessages]);

  // Load messages when conversation changes
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    refreshMessages,
    isSending,
  };
}