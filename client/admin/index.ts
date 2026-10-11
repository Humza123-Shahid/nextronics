// Export Context
export * from "./context/AdminContext";

// Export Types
export * from "./types";

// Export Mock Data
export * from "./data/mockData";

// Export Components
export { default as Sidebar } from "./components/Sidebar";
export { default as Header } from "./components/Header";
export { default as Breadcrumb } from "./components/Breadcrumb";
export { default as MetricCard } from "./components/MetricCard";
export { default as OrdersTable, STATUS_STYLES } from "./components/OrdersTable";
export { default as TopProducts } from "./components/TopProducts";
export { RevenueSalesChart, ProfitAnalyticsChart, VisitorsDeviceChart } from "./components/Charts";
export { default as ConfirmDeleteModal } from "./components/ConfirmDeleteModal";

// Product CRUD Modals
export { default as AddProductModal } from "./components/AddProductModal";
export { default as EditProductModal } from "./components/EditProductModal";
export { default as ViewProductModal } from "./components/ViewProductModal";

// Order CRUD Modals
export { default as AddOrderModal } from "./components/AddOrderModal";
export { default as EditOrderModal } from "./components/EditOrderModal";
export { default as OrderDetailsModal } from "./components/OrderDetailsModal";

// Customer CRUD Modals
export { default as AddCustomerModal } from "./components/AddCustomerModal";
export { default as EditCustomerModal } from "./components/EditCustomerModal";
export { default as ViewCustomerModal } from "./components/ViewCustomerModal";

// Category CRUD Modals
export { default as AddCategoryModal } from "./components/AddCategoryModal";
export { default as EditCategoryModal } from "./components/EditCategoryModal";
export { default as ViewCategoryModal } from "./components/ViewCategoryModal";

// Export Views
export { default as DashboardView } from "./views/DashboardView";
export { default as ProductsView } from "./views/ProductsView";
export { default as CategoriesView } from "./views/CategoriesView";
export { default as OrdersView } from "./views/OrdersView";
export { default as CustomersView } from "./views/CustomersView";
export { default as AnalyticsView } from "./views/AnalyticsView";
export { default as SettingsView } from "./views/SettingsView";
