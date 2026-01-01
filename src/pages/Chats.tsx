import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, Clock, Check, X, Loader2, ArrowRight } from 'lucide-react';

interface ChatRequest {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  buyer_id: string;
  seller_id: string;
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

export default function Chats() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [chatRequests, setChatRequests] = useState<ChatRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const isSeller = (p: any) => p?.role === 'seller' || p?.is_seller;
  const isBuyer = (p: any) => p?.role === 'buyer' || p?.is_buyer;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchChatRequests();
    }
  }, [user]);

  const fetchChatRequests = async () => {
    setLoading(true);
    
    // Get requests where user is either buyer or seller
    const { data, error } = await supabase
      .from('chat_requests')
      .select(`
        *,
        products:product_id (product_name, image1)
      `)
      .or(`buyer_id.eq.${user!.id},seller_id.eq.${user!.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching chat requests:', error);
      setLoading(false);
      return;
    }

    // Fetch profiles for buyers and sellers
    const enrichedData = await Promise.all(
      (data || []).map(async (request) => {
        const [buyerResult, sellerResult] = await Promise.all([
          supabase.from('profiles').select('full_name').eq('id', request.buyer_id).single(),
          supabase.from('profiles').select('full_name').eq('id', request.seller_id).single(),
        ]);

        return {
          ...request,
          buyer_profile: buyerResult.data,
          seller_profile: sellerResult.data,
        };
      })
    );

    setChatRequests(enrichedData as ChatRequest[]);
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> Pending</Badge>;
      case 'accepted':
        return <Badge variant="default" className="gap-1 bg-success"><Check className="w-3 h-3" /> Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="gap-1"><X className="w-3 h-3" /> Rejected</Badge>;
      default:
        return null;
    }
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

  const activeChats = chatRequests.filter(r => r.status === 'accepted');
  const pendingChats = chatRequests.filter(r => r.status === 'pending');
  const otherChats = chatRequests.filter(r => r.status === 'rejected');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">My Chats</h1>
          <p className="text-muted-foreground mt-1">
            Manage your conversations with {isSeller(profile) ? 'buyers' : 'sellers'}
          </p>
        </div>

        {chatRequests.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No conversations yet</h3>
            <p className="text-muted-foreground">
              {isBuyer(profile) 
                ? 'Browse products and request to chat with sellers'
                : 'Wait for buyers to send you chat requests'}
            </p>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Active Chats */}
            {activeChats.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  Active Chats ({activeChats.length})
                </h2>
                <div className="grid gap-4">
                  {activeChats.map((request) => {
                    const otherPerson = user!.id === request.buyer_id 
                      ? request.seller_profile 
                      : request.buyer_profile;
                    const isBuyer = user!.id === request.buyer_id;

                    return (
                      <Card 
                        key={request.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate(`/chat/${request.id}`)}
                      >
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                            {request.products?.image1 ? (
                              <img 
                                src={request.products.image1} 
                                alt="" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <MessageCircle className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold truncate">
                                {otherPerson?.full_name || 'User'}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {isBuyer ? 'Seller' : 'Buyer'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {request.products?.product_name}
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground" />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pending Chats */}
            {pendingChats.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  Pending Requests ({pendingChats.length})
                </h2>
                <div className="grid gap-4">
                  {pendingChats.map((request) => {
                    const otherPerson = user!.id === request.buyer_id 
                      ? request.seller_profile 
                      : request.buyer_profile;
                    const isBuyer = user!.id === request.buyer_id;

                    return (
                      <Card key={request.id} className="opacity-75">
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                            {request.products?.image1 ? (
                              <img 
                                src={request.products.image1} 
                                alt="" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <MessageCircle className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold truncate">
                                {otherPerson?.full_name || 'User'}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {isBuyer ? 'Seller' : 'Buyer'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {request.products?.product_name}
                            </p>
                          </div>
                          {getStatusBadge(request.status)}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Rejected Chats */}
            {otherChats.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                  Rejected ({otherChats.length})
                </h2>
                <div className="grid gap-4">
                  {otherChats.map((request) => {
                    const otherPerson = user!.id === request.buyer_id 
                      ? request.seller_profile 
                      : request.buyer_profile;

                    return (
                      <Card key={request.id} className="opacity-50">
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                            {request.products?.image1 ? (
                              <img 
                                src={request.products.image1} 
                                alt="" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <MessageCircle className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">
                              {otherPerson?.full_name || 'User'}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {request.products?.product_name}
                            </p>
                          </div>
                          {getStatusBadge(request.status)}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
