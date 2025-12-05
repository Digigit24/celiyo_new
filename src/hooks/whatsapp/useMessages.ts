import { useState, useEffect, useCallback } from 'react';
import { messagesService } from '@/services/whatsapp/messagesService';
import { uploadMedia, sendMediaMessage as sendMedia } from '@/services/whatsapp';
import type { WhatsAppMessage } from '@/types/whatsappTypes';
import { useWebSocket } from '@/context/WebSocketProvider';

export interface UseMessagesReturn {
  messages: WhatsAppMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  sendMediaMessage: (file: File, media_type: "image" | "video" | "audio" | "document", caption?: string) => Promise<void>;
  refreshMessages: () => Promise<void>;
}

export function useMessages(conversationPhone: string | null): UseMessagesReturn {
  const { messages: allMessages } = useWebSocket();
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizePhone = (p?: string | null) => (p ? String(p).replace(/^\+/, '') : '');

  useEffect(() => {
    if (allMessages.length > 0) {
      const latestMessage = allMessages[allMessages.length - 1];
      if (
        (normalizePhone(latestMessage.from) === normalizePhone(conversationPhone)) ||
        (normalizePhone(latestMessage.to) === normalizePhone(conversationPhone))
      ) {
        setMessages((prevMessages) => [...prevMessages, latestMessage]);
      }
    }
  }, [allMessages, conversationPhone]);

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
    if (!conversationPhone || !text.trim()) return;

    const messageText = text.trim();
    
    try {
      await messagesService.sendTextMessage({
        to: conversationPhone,
        text: messageText
      });
    } catch (err: any) {
      console.error('❌ Failed to send message:', err);
      setError(err.message || 'Failed to send message');
      throw err;
    }
  }, [conversationPhone]);

  const sendMediaMessage = useCallback(async (file: File, media_type: "image" | "video" | "audio" | "document", caption?: string) => {
    if (!conversationPhone) return;

    try {
      const uploadResponse = await uploadMedia(file);
      const media_id = uploadResponse.media_id;

      await sendMedia({
        to: conversationPhone,
        media_id,
        media_type,
        caption,
      });

    } catch (err: any) {
      console.error('❌ Failed to send media message:', err);
      setError(err.message || 'Failed to send media message');
      throw err;
    }
  }, [conversationPhone]);

  const refreshMessages = useCallback(async () => {
    await loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    sendMediaMessage,
    refreshMessages,
  };
}