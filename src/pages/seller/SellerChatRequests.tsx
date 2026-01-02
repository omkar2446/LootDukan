import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth"
;
import Header from "@/components/Header";

export default function SellerChatRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("chat_requests")
      .select("*")
      .eq("seller_id", user?.id)
      .order("created_at", { ascending: false });

    if (!error) setRequests(data || []);
    setLoading(false);
  };

  const updateStatus = async (
    id: string,
    status: "accepted" | "rejected"
  ) => {
    await supabase
      .from("chat_requests")
      .update({ status })
      .eq("id", id);

    fetchRequests();
  };

  if (loading) return <p>Loading...</p>;
return (
  <div className="min-h-screen bg-background flex flex-col">
    <Header />

      <h1 className="text-2xl font-bold mb-4">Chat Requests</h1>

      {requests.length === 0 && (
        <p className="text-muted-foreground">No requests yet.</p>
      )}

      {requests.map((req) => (
        <div
          key={req.id}
          className="border rounded p-4 mb-3 flex justify-between items-center"
        >
          <div>
            <p><b>Status:</b> {req.status}</p>
            <p><b>Product:</b> {req.product_id}</p>
          </div>

          {req.status === "pending" && (
            <div className="flex gap-2">
              <Button
                onClick={() => updateStatus(req.id, "accepted")}
              >
                Accept
              </Button>
              <Button
                variant="destructive"
                onClick={() => updateStatus(req.id, "rejected")}
              >
                Reject
              </Button>
            </div>
          )}

          {req.status === "accepted" && (
            <span className="text-green-600 font-semibold">Accepted</span>
          )}

          {req.status === "rejected" && (
            <span className="text-red-500 font-semibold">Rejected</span>
          )}
        </div>
      ))}
    </div>
  );
}
