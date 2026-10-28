import ProductsView from "@/admin/views/ProductsView";
import AdminLayout from "@/admin/views/AdminRoute";

export default function AdminProductsPage() {
  return <AdminLayout><ProductsView /></AdminLayout>;
}