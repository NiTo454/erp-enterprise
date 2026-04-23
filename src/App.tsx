import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './shared/components/MainLayout';
import { DashboardView } from './modules/dashboard/DashboardView';
import { InventoryView } from './modules/inventory/InventoryView';
import { SalesView } from './modules/sales/SalesView';
import { FinanceView } from './modules/finance/FinanceView';
import { NotFound } from './shared/components/NotFound';
import React from 'react';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardView />} />
          <Route path="inventory" element={<InventoryView />} />
          <Route path="sales" element={<SalesView />} />
          <Route path="finance" element={<FinanceView />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
