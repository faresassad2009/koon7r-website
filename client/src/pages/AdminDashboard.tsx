import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { LogOut, Package, Settings, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  processing: "bg-purple-500",
  shipped: "bg-cyan-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState<"orders" | "settings">("orders");

  // Redirect if not admin
  if (user?.role !== "admin") {
    setLocation("/");
    return null;
  }

  const ordersQuery = trpc.orders.all.useQuery();
  const updateStatusMutation = trpc.orders.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Order status updated!");
      ordersQuery.refetch();
    },
    onError: () => {
      toast.error("Failed to update order status");
    },
  });

  const deleteOrderMutation = trpc.orders.deleteOrder.useMutation({
    onSuccess: () => {
      toast.success("Order deleted!");
      ordersQuery.refetch();
    },
    onError: () => {
      toast.error("Failed to delete order");
    },
  });

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const orders = ordersQuery.data || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <Button
            variant={selectedTab === "orders" ? "default" : "outline"}
            onClick={() => setSelectedTab("orders")}
          >
            <Package className="mr-2 h-4 w-4" />
            Orders ({orders.length})
          </Button>
          <Button
            variant={selectedTab === "settings" ? "default" : "outline"}
            onClick={() => setSelectedTab("settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>

        {/* Orders Tab */}
        {selectedTab === "orders" && (
          <div className="space-y-4">
            {ordersQuery.isLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">Loading orders...</p>
                </CardContent>
              </Card>
            ) : orders.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">No orders yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{order.id}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {order.customerName} • {order.customerPhone}
                          </p>
                        </div>
                        <Badge className={statusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Order Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Email</p>
                          <p className="font-medium">{order.customerEmail || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total</p>
                          <p className="font-bold text-primary">${order.totalAmount}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Address</p>
                          <p className="font-medium">{order.customerAddress}</p>
                        </div>
                        {order.notes && (
                          <div className="col-span-2">
                            <p className="text-muted-foreground">Notes</p>
                            <p className="font-medium">{order.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Items */}
                      <div>
                        <p className="text-muted-foreground text-sm mb-2">Items</p>
                        <div className="text-sm space-y-1 bg-background p-3 rounded">
                          {(() => {
                            try {
                              const items = JSON.parse(order.items);
                              return items.map(
                                (item: any, idx: number) => (
                                  <p key={idx}>
                                    {item.name} ({item.size}) x{item.quantity} - ${item.price}
                                  </p>
                                )
                              );
                            } catch {
                              return <p>Error parsing items</p>;
                            }
                          })()}
                        </div>
                      </div>

                      {/* Status Update */}
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <p className="text-muted-foreground text-sm mb-2">Update Status</p>
                          <Select
                            value={order.status}
                            onValueChange={(status) =>
                              updateStatusMutation.mutate({
                                orderId: order.id,
                                status: status as any,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() =>
                            deleteOrderMutation.mutate({ orderId: order.id })
                          }
                          disabled={deleteOrderMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Timestamps */}
                      <div className="text-xs text-muted-foreground pt-2 border-t">
                        {order.createdAt && (
                          <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
                        )}
                        {order.updatedAt && (
                          <p>Updated: {new Date(order.updatedAt).toLocaleString()}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {selectedTab === "settings" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Contact Email</p>
                  <p className="text-muted-foreground">info@koon7r.com</p>
                </div>
                <div>
                  <p className="font-medium mb-2">Contact Phone</p>
                  <p className="text-muted-foreground">+970 59 123 4567</p>
                </div>
                <div>
                  <p className="font-medium mb-2">Total Orders</p>
                  <p className="text-muted-foreground">{orders.length}</p>
                </div>
                <div>
                  <p className="font-medium mb-2">Total Revenue</p>
                  <p className="text-primary font-bold">
                    ${orders.reduce((sum, order) => sum + order.totalAmount, 0)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map(
                  (status) => (
                    <div key={status} className="flex justify-between">
                      <span className="capitalize">{status}</span>
                      <Badge>
                        {orders.filter((o) => o.status === status).length}
                      </Badge>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

