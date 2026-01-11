import { MainLayout } from "@ui/layouts/MainLayout";
import { Home } from "@ui/pages/home";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

export function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
