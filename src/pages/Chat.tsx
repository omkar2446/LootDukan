import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Send, ArrowLeft, Loader2, AlertCircle, User } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

interface ChatInfo {
  id: string;
  buyer_id: string;
  seller_id: string;
  status: string;
  products: {
    product_name: string;
    image1: string | null;
  };
  buyer_profile: {
    full_name: string;
  } | null;
  seller_profile: {
    full_name: string;
  } | null;
}

const DAILY_MESSAGE_LIMIT = 10;

export default function Chat() {
  const { requestId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [dailyCount, setDailyCount] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && requestId) {
      fetchChatInfo();
      fetchMessages();
      fetchDailyCount();

      // Subscribe to new messages
      const channel = supabase
        .channel(`messages-${requestId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `request_id=eq.${requestId}`,
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, requestId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatInfo = async () => {
    const { data, error } = await supabase
      .from('chat_requests')
      .select(`
        *,
        products:product_id (product_name, image1)
      `)
      .eq('id', requestId)
      .single();

    if (error || !data) {
      toast({
        title: 'Error',
        description: 'Chat not found.',
        variant: 'destructive',
      });
      navigate('/chats');
      return;
    }

    // Check if user is part of this chat
    if (data.buyer_id !== user!.id && data.seller_id !== user!.id) {
      navigate('/chats');
      return;
    }

    // Check if chat is accepted
    if (data.status !== 'accepted') {
      toast({
        title: 'Chat not available',
        description: 'This chat request has not been accepted yet.',
        variant: 'destructive',
      });
      navigate('/chats');
      return;
    }

    // Fetch profiles
    const [buyerResult, sellerResult] = await Promise.all([
      supabase.from('profiles').select('full_name').eq('id', data.buyer_id).single(),
      supabase.from('profiles').select('full_name').eq('id', data.seller_id).single(),
    ]);

    setChatInfo({
      ...data,
      buyer_profile: buyerResult.data,
      seller_profile: sellerResult.data,
    } as ChatInfo);
    setLoading(false);
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data);
    }
  };

  const fetchDailyCount = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data } = await supabase
      .from('daily_message_counts')
      .select('message_count')
      .eq('user_id', user!.id)
      .eq('message_date', today)
      .maybeSingle();

    if (data) {
      setDailyCount(data.message_count);
    }
  };

  const updateDailyCount = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Try to update existing record
    const { data: existing } = await supabase
      .from('daily_message_counts')
      .select('*')
      .eq('user_id', user!.id)
      .eq('message_date', today)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('daily_message_counts')
        .update({ message_count: existing.message_count + 1 })
        .eq('id', existing.id);
      setDailyCount(existing.message_count + 1);
    } else {
      await supabase
        .from('daily_message_counts')
        .insert({
          user_id: user!.id,
          message_date: today,
          message_count: 1,
        });
      setDailyCount(1);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    if (dailyCount >= DAILY_MESSAGE_LIMIT) {
      toast({
        title: 'Daily limit reached',
        description: `You can only send ${DAILY_MESSAGE_LIMIT} messages per day. Try again tomorrow!`,
        variant: 'destructive',
      });
      return;
    }

    setSending(true);

    const { error } = await supabase.from('messages').insert({
      request_id: requestId,
      sender_id: user!.id,
      message: newMessage.trim(),
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message.',
        variant: 'destructive',
      });
    } else {
      await updateDailyCount();
      setNewMessage('');
    }

    setSending(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!chatInfo) return null;

  const otherPerson = user!.id === chatInfo.buyer_id 
    ? chatInfo.seller_profile 
    : chatInfo.buyer_profile;
  const isBuyer = user!.id === chatInfo.buyer_id;
  const remainingMessages = DAILY_MESSAGE_LIMIT - dailyCount;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Chat Header */}
      <div className="sticky top-16 z-40 bg-card border-b border-border">
        <div className="container py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/chats')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
              {chatInfo.products?.image1 ? (
                <img 
                  src={chatInfo.products.image1} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">
                {otherPerson?.full_name || 'User'}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {chatInfo.products?.product_name}
              </p>
            </div>
            
            <div className="text-right">
              <span className={`text-xs font-medium ${
                remainingMessages <= 3 ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {remainingMessages} messages left today
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container py-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.sender_id === user!.id;
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isOwn
                        ? 'bg-gradient-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.message}
                    </p>
                    <p className={`text-xs mt-1 ${
                      isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {new Date(message.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-card border-t border-border">
        <div className="container py-4">
          {remainingMessages <= 0 ? (
            <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <span>Daily message limit reached. Try again tomorrow!</span>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 h-12"
                disabled={sending}
              />
              <Button 
                type="submit" 
                variant="default" 
                size="icon" 
                className="w-12 h-12"
                disabled={sending || !newMessage.trim()}
              >
                {sending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
