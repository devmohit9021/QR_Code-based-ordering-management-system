import { useEffect, useState } from "react";
import api from "../api";

const MenuPage = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });

  const fetchMenu = async () => {
    try {
      const res = await api.get("/api/menu");
      setMenu(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const createMenuItem = async () => {
    if (!form.name || !form.price) return alert("Name and price required");

    try {
      const res = await api.post("/api/menu", {
        name: form.name,
        price: parseFloat(form.price),
        description: form.description,
        category: form.category,
      });
      setMenu((prev) => [...prev, res.data]);
      setForm({ name: "", price: "", description: "", category: "" });
    } catch (err) {
      console.error(err);
      alert("Error adding menu item");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Menu Management</h2>

      {/* Add menu item form */}
      <div className="mb-6 bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
        />
        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          value={form.price}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
        />
        <textarea
          name="description"
          placeholder="Short description"
          value={form.description}
          onChange={handleChange}
          rows={2}
          className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
        ></textarea>

        <input
          type="text"
          name="category"
          placeholder="Category (e.g. Starter, Drinks)"
          value={form.category}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-sm"
        />

        <button
          onClick={createMenuItem}
          className="w-full mt-2 px-4 py-2 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold"
        >
          Add Menu Item
        </button>
      </div>

      {/* Menu items grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menu.map((item) => (
          <div
            key={item._id}
            className="bg-slate-900 border border-slate-800 rounded-lg p-4 shadow"
          >
            <p className="font-medium text-slate-100">{item.name}</p>
            {item.category && (
              <p className="text-xs text-slate-400 mt-0.5">
                Category: {item.category}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              ₹{item.price}
            </p>
            {item.description && (
              <p className="text-xs text-slate-500 mt-1">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {menu.length === 0 && (
        <p className="text-xs text-slate-500 mt-4">No menu items yet.</p>
      )}
    </div>
  );
};

export default MenuPage;
