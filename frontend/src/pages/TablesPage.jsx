import { useEffect, useState } from "react";
import api from "../api";

const TablesPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTable, setNewTable] = useState("");

  const fetchTables = async () => {
    try {
      const res = await api.get("/api/tables");
      setTables(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch tables");
    } finally {
      setLoading(false);
    }
  };

  const createTable = async () => {
    if (!newTable.trim()) return;

    try {
      const res = await api.post("/api/tables", { name: newTable });
      setTables((prev) => [...prev, res.data]);
      setNewTable("");
    } catch (err) {
      console.error(err);
      alert("Error adding table");
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Manage Tables</h2>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Table Name"
          value={newTable}
          onChange={(e) => setNewTable(e.target.value)}
          className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-sm"
        />
        <button
          onClick={createTable}
          className="px-4 py-2 rounded-md bg-brand-500 hover:bg-brand-600 text-white"
        >
          Add Table
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((table) => (
          <div
            key={table._id}
            className="bg-slate-900 border border-slate-800 rounded-lg p-4 shadow"
          >
            <p className="font-medium">{table.name}</p>
            <p className="text-xs text-slate-400 mt-1">
              Slug: {table.slug}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablesPage;
