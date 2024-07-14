import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AuthLayout } from '@ui/layouts/AuthLayout';
import { Home } from '@ui/pages/home';

export function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
