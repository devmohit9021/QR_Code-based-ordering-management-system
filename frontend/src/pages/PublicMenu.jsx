import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000";

const PublicMenu = () => {
  const { restaurantSlug, tableSlug } = useParams();

  const [restaurantName, setRestaurantName] = useState("");
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [notes, setNotes] = useState("");
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState("");

  // Fetch public menu
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/menu/public/${restaurantSlug}`
        );
        setRestaurantName(res.data.restaurant || "Restaurant");
        setItems(res.data.items || []);
      } catch (err) {
        console.error("Public menu fetch error:", err);
        const status = err.response?.status;
        const serverMsg = err.response?.data?.message || err.response?.data || null;
        const clientMsg = err.message || "Unknown error";
        setError(
          `Failed to load menu${status ? ` (HTTP ${status})` : ""}: ${serverMsg || clientMsg}`
        );
      } finally {
        setLoadingMenu(false);
      }
    };

    fetchMenu();
  }, [restaurantSlug]);

  // Cart helpers
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c._id === item._id);
      if (existing) {
        return prev.map((c) =>
          c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c._id === id ? { ...c, quantity: Math.max(1, c.quantity - 1) } : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((c) =>
        c._id === id ? { ...c, quantity: c.quantity + 1 } : c
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setNotes("");
    setOrderResult(null);
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Place order API
  const placeOrder = async () => {
    if (cart.length === 0) return;

    setPlacingOrder(true);
    setError("");
    setOrderResult(null);

    try {
      const payload = {
        items: cart.map((c) => ({
          menuItemId: c._id,
          quantity: c.quantity,
        })),
        notes,
      };

      const res = await axios.post(
        `${API_BASE}/api/orders/public/${restaurantSlug}/${tableSlug}`,
        payload
      );

      setOrderResult(res.data);
      clearCart();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to place order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loadingMenu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <p>Loading menu...</p>
      </div>
    );
  }

  if (error && !items.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-4">
        <div className="max-w-sm text-center">
          <h1 className="text-lg font-semibold mb-2">Oops!</h1>
          <p className="text-sm text-slate-400 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex justify-between items-center gap-3">
          <div>
            <h1 className="text-lg font-semibold">{restaurantName}</h1>
            <p className="text-xs text-slate-400">Table: {tableSlug}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">
              Powered by <span className="text-brand-400 font-semibold">QR Dine</span>
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-4">
        <div className="max-w-3xl mx-auto grid gap-4 md:grid-cols-[2fr,1fr]">
          {/* Menu list */}
          <div>
            <h2 className="text-sm font-semibold text-slate-300 mb-3">
              Menu
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-slate-400">
                        {item.description}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      ₹{item.price}{" "}
                      {item.category && (
                        <span className="ml-2 text-[11px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {item.category}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <p className="text-sm font-semibold">₹{item.price}</p>
                    <button
                      onClick={() => addToCart(item)}
                      className="mt-2 text-xs px-3 py-1.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <p className="text-xs text-slate-500">
                  No menu items available right now.
                </p>
              )}
            </div>
          </div>

          {/* Cart */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 h-fit sticky top-20">
            <h2 className="text-sm font-semibold text-slate-300 mb-3">
              Your Order
            </h2>

            {cart.length === 0 ? (
              <p className="text-xs text-slate-500 mb-2">
                No items added yet. Tap <span className="font-semibold">Add</span> on menu.
              </p>
            ) : (
              <div className="space-y-3 mb-3">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center text-xs"
                  >
                    <div>
                      <p className="text-slate-100">{item.name}</p>
                      <p className="text-slate-500">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseQty(item._id)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-800 text-slate-200"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-slate-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQty(item._id)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-800 text-slate-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-slate-800 pt-3 mt-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Total</span>
                <span className="font-semibold text-slate-100">
                  ₹{totalAmount}
                </span>
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any notes? (less spicy, no onion, etc.)"
                rows={2}
                className="w-full mt-1 text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100"
              />

              {error && (
                <p className="text-[11px] text-red-400 bg-red-900/20 border border-red-800 rounded-md px-2 py-1">
                  {error}
                </p>
              )}

              <button
                disabled={cart.length === 0 || placingOrder}
                onClick={placeOrder}
                className="w-full mt-1 text-sm px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 font-semibold"
              >
                {placingOrder ? "Placing order..." : "Place Order"}
              </button>

              {orderResult && (
                <p className="text-[11px] text-emerald-400 mt-2">
                  ✅ Order placed! Your order id:{" "}
                  <span className="font-mono">
                    {orderResult._id?.slice(-6).toUpperCase()}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicMenu;
