import { useEffect, useState, useRef } from "react";
import api from "../api";
import { io } from "socket.io-client";

const statusColors = {
  PENDING: "bg-yellow-500/10 text-yellow-300 border-yellow-500/40",
  ACCEPTED: "bg-blue-500/10 text-blue-300 border-blue-500/40",
  PREPARING: "bg-blue-500/10 text-blue-300 border-blue-500/40",
  READY: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
  SERVED: "bg-slate-600/20 text-slate-200 border-slate-500/40",
  CANCELLED: "bg-red-500/10 text-red-300 border-red-500/40",
};

// ⚠️ Change this to whatever port your backend runs on (check terminal)
const SOCKET_URL = "http://localhost:5000"; // or 3000 if backend on 3000

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  // Depending on your login response, this might be _id or restaurantId:
  const restaurantId =
    user?.restaurant?._id || user?.restaurantId || user?.restaurant;

  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/orders", {
        params: statusFilter ? { status: statusFilter } : {},
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Initial fetch + refetch on filter
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [statusFilter]);

  // Setup socket.io connection
  useEffect(() => {
    if (!restaurantId) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 Socket connected", socket.id);
      setSocketConnected(true);
      socket.emit("joinRestaurant", restaurantId);
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
      setSocketConnected(false);
    });

    // New order created (from QR/customer)
    socket.on("orderCreated", (order) => {
      console.log("📥 New order via socket:", order);
      setOrders((prev) => [order, ...prev]); // add on top
    });

    // Order updated (status change)
    socket.on("orderUpdated", (updated) => {
      console.log("♻ Order updated via socket:", updated);
      setOrders((prev) =>
        prev.map((o) => (o._id === updated._id ? updated : o))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [restaurantId]);

  const updateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/api/orders/${id}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === res.data._id ? res.data : o))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Orders</h3>
          <p className="text-[11px] text-slate-500">
            Realtime:{" "}
            <span
              className={
                socketConnected ? "text-emerald-400" : "text-slate-500"
              }
            >
              ● {socketConnected ? "Connected" : "Disconnected"}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value || "")}
            className="bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-lg px-2 py-1"
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY">Ready</option>
            <option value="SERVED">Served</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button
            onClick={fetchOrders}
            className="text-xs px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">
                #{order._id.slice(-6).toUpperCase()}
              </p>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  statusColors[order.status] || "bg-slate-800 text-slate-200"
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-100">
              Table: {order.table?.name || "N/A"}
            </p>
            <ul className="text-xs text-slate-300 space-y-1">
              {order.items?.map((it) => (
                <li key={it._id}>
                  {it.quantity} × {it.menuItem?.name}{" "}
                  <span className="text-slate-500">
                    (₹{it.menuItem?.price})
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-100 mt-1">
              Total: <span className="font-semibold">₹{order.totalAmount}</span>
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {order.status === "PENDING" && (
                <button
                  onClick={() => updateStatus(order._id, "PREPARING")}
                  className="text-[11px] px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700"
                >
                  Mark Preparing
                </button>
              )}
              {order.status === "PREPARING" && (
                <button
                  onClick={() => updateStatus(order._id, "READY")}
                  className="text-[11px] px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700"
                >
                  Mark Ready
                </button>
              )}
              {order.status === "READY" && (
                <button
                  onClick={() => updateStatus(order._id, "SERVED")}
                  className="text-[11px] px-3 py-1 rounded-md bg-slate-700 hover:bg-slate-600"
                >
                  Mark Served
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <p className="text-xs text-slate-500 mt-4">No orders yet.</p>
      )}
    </div>
  );
};

export default OrdersPage;
