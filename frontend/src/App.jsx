import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./layouts/Dashboard";
import OrdersPage from "./pages/OrdersPage";
import TablesPage from "./pages/TablesPage";
import MenuPage from "./pages/MenuPage";
import QRCodesPage from "./pages/QRCodesPage";
import PublicMenu from "./pages/PublicMenu";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public customer route */}
        <Route path="/menu/:restaurantSlug/:tableSlug" element={<PublicMenu />} />

        {/* Auth + dashboard */}
        <Route path="/login" element={<LoginPage />} />

        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Navigate to="orders" />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="tables" element={<TablesPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="qr-codes" element={<QRCodesPage />} />
          {/* <Route path="/menu/:restaurantSlug/:tableSlug" element={<PublicMenu />} /> */}
        </Route>

        {/* Default */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
