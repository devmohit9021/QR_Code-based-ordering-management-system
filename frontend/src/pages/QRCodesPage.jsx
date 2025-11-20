import { useEffect, useState } from "react";
import api from "../api";
import { QRCodeSVG } from "qrcode.react";


const FRONTEND_URL = "http://localhost:5173"; // Vite default. Change when you deploy.

const QRCodesPage = () => {
  const [restaurantSlug, setRestaurantSlug] = useState("");
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // 1) Restaurant profile
      const profileRes = await api.get("/api/restaurant/profile");
      setRestaurantSlug(profileRes.data.slug);

      // 2) Tables list
      const tablesRes = await api.get("/api/tables");
      setTables(tablesRes.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load QR data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Table QR Codes</h2>
          <p className="text-xs text-slate-400">
            Restaurant slug: <span className="font-mono">{restaurantSlug}</span>
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="hidden md:inline-flex px-4 py-2 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold print:hidden"
        >
          Print Page
        </button>
      </div>

      <p className="text-xs text-slate-500 mb-4">
        Each QR opens the customer menu for that table. You can print and stick them on the tables.
      </p>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 print:grid-cols-3">
        {tables.map((table) => {
          const url = `${FRONTEND_URL}/menu/${restaurantSlug}/${table.slug}`;
          return (
            <div
              key={table._id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center gap-2 print:p-2"
            >
              <p className="text-sm font-semibold text-slate-100">
                {table.name}
              </p>
              <div className="bg-white p-2 rounded">
                <QRCodeSVG value={url} size={128} />
              </div>
              <p className="text-[10px] text-slate-400 break-all text-center">
                {url}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 md:hidden text-[11px] text-slate-500">
        Tip: For printing, open this page on laptop/PC and press{" "}
        <span className="font-mono">Ctrl + P</span>.
      </div>
    </div>
  );
};

export default QRCodesPage;
