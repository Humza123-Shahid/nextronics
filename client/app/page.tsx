import { fetchProducts } from "./components/data";
import HomeClient from "./components/HomeClient";

export default async function Page() {
  const products = await fetchProducts();
  return <HomeClient products={products} />;
}