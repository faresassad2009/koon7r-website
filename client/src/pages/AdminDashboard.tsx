import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { LogOut, Trash2 } from "lucide-react";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuth");
    const email = localStorage.getItem("adminEmail");
    
    if (adminAuth === "true" && email) {
      setIsAdmin(true);
      setAdminEmail(email);
    } else {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const ordersQuery = trpc.orders.all.useQuery(undefined, {
    enabled: isAdmin,
  });

  const messagesQuery = trpc.messages.all.useQuery(undefined, {
    enabled: isAdmin,
  });

  const updateStatusMutation = trpc.orders.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated!");
      ordersQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status");
    },
  });

  const deleteOrderMutation = trpc.orders.deleteOrder.useMutation({
    onSuccess: () => {
      toast.success("Order deleted!");
      ordersQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete order");
    },
  });

  const markAsReadMutation = trpc.messages.markAsRead.useMutation({
    onSuccess: () => {
      messagesQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark as read");
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminEmail");
    setLocation("/");
  };

  if (!isAdmin) {
    return null;
  }

  const orders = ordersQuery.data || [];
  const messages = messagesQuery.data || [];

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const confirmedCount = orders.filter((o) => o.status === "confirmed").length;
  const shippedCount = orders.filter((o) => o.status === "shipped").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Welcome, {adminEmail}</p>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Confirmed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{confirmedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Shipped
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shippedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Delivered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deliveredCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="messages">Messages ({messages.length})</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            {ordersQuery.isLoading ? (
              <Card>
                <CardContent className="pt-6">Loading orders...</CardContent>
              </Card>
            ) : orders.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No orders yet
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Customer: {order.customerName}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">${order.totalAmount}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p>{order.customerEmail || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p>{order.customerPhone}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Address</p>
                        <p>{order.customerAddress}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatusMutation.mutate({
                            orderId: order.id,
                            status: e.target.value as any,
                          })
                        }
                        className="px-3 py-2 rounded-md border border-border bg-background text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteOrderMutation.mutate({ orderId: order.id })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            {messagesQuery.isLoading ? (
              <Card>
                <CardContent className="pt-6">Loading messages...</CardContent>
              </Card>
            ) : messages.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No messages yet
                </CardContent>
              </Card>
            ) : (
              messages.map((msg) => (
                <Card
                  key={msg.id}
                  className={msg.isRead ? "opacity-60" : "border-primary"}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{msg.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{msg.email}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{msg.message}</p>
                    {!msg.isRead && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          markAsReadMutation.mutate({ messageId: msg.id })
                        }
                      >
                        Mark as Read
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

