
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { API_CONFIG } from '@/lib/apiConfig';
import { WhatsAppMessage } from '@/types/whatsappTypes';

type SocketStatus = 'connecting' | 'open' | 'closed' | 'error';

export interface WebSocketPayload {
  phone: string;
  name: string;
  contact: {
    id: string;
    phone: string;
    name: string;
    last_seen?: string;
    is_new: boolean;
    exists: boolean;
  };
  message: WhatsAppMessage;
}

interface WebSocketContextType {
  socketStatus: SocketStatus;
  messages: WhatsAppMessage[];
  payloads: WebSocketPayload[];
  newMessageCount: number;
  clearNewMessageCount: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [socketStatus, setSocketStatus] = useState<SocketStatus>('closed');
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [payloads, setPayloads] = useState<WebSocketPayload[]>([]);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const reconnectTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const isUnmountingRef = React.useRef(false);

  const readTenantId = (): string => {
    try {
      const userJson = localStorage.getItem('celiyo_user');
      console.log('🔍 Reading tenant from localStorage:', userJson ? 'Found' : 'Not found');

      if (userJson) {
        const u = JSON.parse(userJson);
        console.log('👤 User object:', u);

        const t = u?.tenant;
        console.log('🏢 Tenant object:', t);

        const tid = t?.id || t?.tenant_id;
        console.log('🆔 Tenant ID:', tid);

        if (tid) {
          const tenantIdStr = String(tid);
          console.log('✅ Using tenant ID:', tenantIdStr);
          return tenantIdStr;
        }
      }
    } catch (error) {
      console.error('❌ Failed to read tenant ID:', error);
    }

    const fallbackTenant = 'bc531d42-ac91-41df-817e-26c339af6b3a';
    console.warn('⚠️ Using fallback tenant ID:', fallbackTenant);
    return fallbackTenant;
  };

  const connectWebSocket = React.useCallback(() => {
    if (typeof window === 'undefined' || isUnmountingRef.current) {
      console.log('🔌 Skipping WebSocket connection');
      return;
    }

    const tenantId = readTenantId();
    const wsUrl = `${API_CONFIG.WHATSAPP_WS_URL}/ws/${tenantId}`;

    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║  WebSocket Connection Attempt                         ║');
    console.log('╠════════════════════════════════════════════════════════╣');
    console.log('  Tenant ID:', tenantId);
    console.log('  WS URL:', wsUrl);
    console.log('  Base URL:', API_CONFIG.WHATSAPP_WS_URL);
    console.log('╚════════════════════════════════════════════════════════╝');

    try {
      const socket = new WebSocket(wsUrl);
      setWs(socket);
      setSocketStatus('connecting');
      console.log('🔄 WebSocket instance created, waiting for connection...');

      socket.onopen = () => {
        console.log('╔════════════════════════════════════════════════════════╗');
        console.log('║  ✅ WebSocket CONNECTED SUCCESSFULLY!                 ║');
        console.log('╠════════════════════════════════════════════════════════╣');
        console.log('  Tenant ID:', tenantId);
        console.log('  Ready State:', socket.readyState);
        console.log('╚════════════════════════════════════════════════════════╝');
        setSocketStatus('open');
    };

    socket.onmessage = (event) => {
      try {
        if (event.data === 'ping') {
          setNewMessageCount((prevCount) => prevCount + 1);
          return;
        }

        const payload = JSON.parse(event.data);

        
        console.log('📨 WebSocket message received:', payload);

        if (payload.event === 'message_incoming' || payload.event === 'message_outgoing') {
          const data = payload.data;

          // Store the full payload with contact metadata
          setPayloads((prevPayloads) => [...prevPayloads, data]);

          // Also store just the message for backward compatibility
          if (data.message) {
            setMessages((prevMessages) => [...prevMessages, data.message]);
          }

          if (payload.event === 'message_incoming') {
            setNewMessageCount((prevCount) => prevCount + 1);
          }

          console.log('✅ WebSocket message processed:', {
            phone: data.phone,
            name: data.name,
            is_new: data.contact?.is_new,
            exists: data.contact?.exists,
            message: data.message?.text
          });
        }
      } catch (error) {
        console.error('❌ Failed to parse WebSocket message:', error);
      }
    };

      socket.onerror = (error) => {
        console.log('╔════════════════════════════════════════════════════════╗');
        console.log('║  ❌ WebSocket ERROR                                    ║');
        console.log('╠════════════════════════════════════════════════════════╣');
        console.error('  Error:', error);
        console.log('  Tenant ID:', tenantId);
        console.log('  WS URL:', wsUrl);
        console.log('  Ready State:', socket.readyState);
        console.log('╚════════════════════════════════════════════════════════╝');
        setSocketStatus('error');
      };

      socket.onclose = (event) => {
        console.log('╔════════════════════════════════════════════════════════╗');
        console.log('║  🔌 WebSocket CLOSED                                   ║');
        console.log('╠════════════════════════════════════════════════════════╣');
        console.log('  Code:', event.code);
        console.log('  Reason:', event.reason || 'No reason provided');
        console.log('  Was Clean:', event.wasClean);
        console.log('  Tenant ID:', tenantId);
        console.log('╚════════════════════════════════════════════════════════╝');
        setSocketStatus('closed');

      // Clear heartbeat interval
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }

        // Attempt to reconnect after 3 seconds (unless unmounting)
        if (!isUnmountingRef.current) {
          console.log('🔄 Scheduling reconnection in 3 seconds...');
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('🔄 Attempting to reconnect WebSocket...');
            connectWebSocket();
          }, 3000);
        }
      };

      return socket;
    } catch (error) {
      console.log('╔════════════════════════════════════════════════════════╗');
      console.log('║  💥 WebSocket Creation FAILED                          ║');
      console.log('╠════════════════════════════════════════════════════════╣');
      console.error('  Error:', error);
      console.log('  Tenant ID:', tenantId);
      console.log('  WS URL:', wsUrl);
      console.log('╚════════════════════════════════════════════════════════╝');
      setSocketStatus('error');

      // Try to reconnect
      if (!isUnmountingRef.current) {
        console.log('🔄 Scheduling reconnection in 3 seconds...');
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('🔄 Attempting to reconnect WebSocket...');
          connectWebSocket();
        }, 3000);
      }

      return null;
    }
  }, []);

  useEffect(() => {
    isUnmountingRef.current = false;
    connectWebSocket();

    return () => {
      console.log('🛑 WebSocketProvider unmounting - closing connection');
      isUnmountingRef.current = true;

      // Clear reconnection timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Clear heartbeat interval
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }

      // Close WebSocket
      if (ws) {
        ws.close();
      }
    };
  }, [connectWebSocket]);

  const clearNewMessageCount = () => {
    setNewMessageCount(0);
  };

  const value = {
    socketStatus,
    messages,
    payloads,
    newMessageCount,
    clearNewMessageCount,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
