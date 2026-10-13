export type ThemeMode = "dark" | "light";

// Status choices matching STATUS_CHOICES = [('draft', 'Draft'), ('active', 'Active'), ('archived', 'Archived')]
export type ProductStatus = 'draft' | 'active' | 'archived';

export interface ProductDimensions {
  l?: number | null;
  w?: number | null;
  h?: number | null;
}
export interface Brand {
  id: number | string;
  name: string;
  slug?: string;
  logo?: string | File | null;
  description?: string;
}
export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  // Foreign Key IDs (Sent to backend DB)
  category_id?: number | null;
  brand_id?: number | null;

  // Display Fields (Populated by Django serializer / relations)
  category_name?: string;
  brand_name?: string;
  sku: string;
  price: number;
  compare_at_price?: number | null;
  cost_price?: number | null;
  tax_class?: string;
  weight_kg?: number | null;
  dimensions?: ProductDimensions | null;
  stock_quantity: number;
  sales_count: number;
  image?: string | null;
  is_active: boolean;
  is_featured: boolean;
  status: ProductStatus;
  meta_title?: string;
  meta_description?: string;
  attributes?: Record<string, any> | null;
  created_at?: string;
  updated_at?: string;
}
export type OrderStatus = "Paid" | "Pending" | "Processing" | "Failed" | "Delivered";

// export interface OrderItem {
//   id: number;
//   productName: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// Add or replace the OrderItem interface in your types/index.ts file:

export interface OrderItem {
  id: number | string;
  order: number | string;
  product?: number | string | null;
  product_variant?: number | string | null;
  product_name_snapshot: string;
  sku_snapshot: string;
  unit_price: number | string;
  quantity: number;
  subtotal: number | string;

  // Display / Relational Labels for Foreign Keys
  order_number_display?: string;
  user_email_display?: string;
  order_display_label?: string;
  product_name_display?: string;
  product_variant_label?: string;
}


export interface Payment {
  id: number | string;
  order: number | string;
  order_number_display?: string;
  user_email_display?: string;
  order_display_label?: string;
  payment_method: string;
  transaction_id?: string | null;
  amount: number | string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  gateway_response?: any;
  paid_at?: string | null;
  created_at?: string;
}

export interface ShippingMethod {
  id: number | string;
  name: string;
  cost: number | string;
  estimated_days_min: number;
  estimated_days_max: number;
  is_active: boolean;
}

// Add this to your existing src/types/index.ts file

export type ShipmentStatus = 'pending' | 'in_transit' | 'delivered' | 'returned';

export interface Shipment {
  id: number;
  order: number; // Foreign Key to Order ID
  shipping_method: number | null; // Foreign Key to ShippingMethod ID
  carrier: string; // e.g. FedEx, UPS, DHL
  tracking_number: string;
  status: ShipmentStatus;
  shipped_at: string | null; // ISO Date String
  delivered_at: string | null; // ISO Date String

  // Display fields enriched by AdminContext
  order_number_display?: string;
  user_email_display?: string;
  order_display_label?: string; // Format: "ORDER_NUMBER (user_email)"
  shipping_method_name_display?: string;
}

export interface CustomerSummary {
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  city?: string;
}

// export interface Order {
//   id: string;
//   orderNumber: string;
//   customer: CustomerSummary;
//   date: string;
//   amount: number;
//   paymentMethod: "Credit Card" | "PayPal" | "Apple Pay" | "Stripe" | "Cash on Delivery";
//   status: OrderStatus;
//   itemsCount: number;
//   items: OrderItem[];
//   shippingAddress: string;
// }
export interface User {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  password?: string;
  phone_number?: string | null;
  is_verified?: boolean;
  is_seller?: boolean;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  date_of_birth?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Address {
  id: number | string;
  user: number | string;
  user_email?: string;
  address_type: "shipping" | "billing";
  full_name: string;
  phone_number: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_default: boolean;
  created_at?: string;
}
export interface Order {
  id: number | string;
  order_number?: string;

  // Foreign Key to User (supports both raw ID from DB or expanded User object)
  user?: number | string | User | null;
  user_id?: number | string | null;
  user_email?: string; // Resolved helper property for table/card UI

  // Order Statuses
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'unpaid' | 'paid' | 'failed' | 'refunded';

  // Foreign Key to Address (supports raw ID or expanded Address object)
  shipping_address?: number | string | Address | null;
  shipping_address_id?: number | string | null;
  shipping_address_display?: string; // Resolved string (e.g., "John Doe: 123 Main St (New York)")

  billing_address?: number | string | Address | null;
  billing_address_id?: number | string | null;
  billing_address_display?: string; // Resolved string for billing address

  // Financial Totals
  subtotal: number;
  discount_total?: number;
  shipping_total?: number;
  tax_total?: number;
  grand_total: number;
  currency?: string;

  // Metadata & Timestamps
  notes?: string;
  placed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AttributeValue {
  id: number;
  attributeName: string;
  value: string;
}

export interface ProductVariant {
  id: number;
  product: number | Product;
  product_id?: number | null;
  product_name?: string;
  sku: string;
  attribute_values: number[] | AttributeValue[];
  price_override?: number | string | null;
  stock_quantity: number;
  image?: string | null;
  is_active: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  location: string;
  totalOrders: number;
  totalSpend: number;
  status: "Active" | "Inactive" | "Blocked";
  joinDate: string;
}

export interface CategoryItem {
  id: number | string;
  name: string;
  slug: string;
  parent?: number | string | CategoryItem | null;
  parent_id?: number | string | null;
  description?: string;
  image?: string | File | null;
  is_active: boolean;
  children?: CategoryItem[];
}

export interface MetricStat {
  id: string;
  title: string;
  value: string;
  numericValue: number;
  change: string;
  isPositive: boolean;
  period: string;
  subtext: string;
}

// export interface NotificationItem {
//   id: string;
//   title: string;
//   description: string;
//   time: string;
//   read: boolean;
//   type: "order" | "stock" | "user" | "payment";
// }
export interface Warehouse {
  id: number | string;
  name: string;
  address: string;
  city: string;
  country: string;
  created_at?: string;
  updated_at?: string;
}
export interface Inventory {
  id: number;
  product_variant: number; // Foreign key ID
  product_variant_sku?: string; // SKU fallback
  product_name?: string; // Parent Product Name
  product_variant_label?: string; // Resolved label: "Product Name (SKU)"
  warehouse: number;
  warehouse_name?: string;
  quantity: number;
  reserved_quantity: number;
  updated_at?: string;
}
export interface Cart {
  id: number;
  user: number | null;
  user_email?: string;
  session_key?: string | null;
  created_at?: string;
  updated_at?: string;
}
export interface CartItem {
  id: number;
  cart: number;
  cart_display_label?: string; // Format: session_key (email) or User Email
  product_variant: number;
  product_variant_label?: string; // Format: Name (SKU)
  quantity: number;
  added_at?: string;
}
export interface Notification {
  id?: number;
  user: number; // Foreign key user ID sent to backend
  user_email?: string; // Optional email field returned by backend for display
  notification_type: 'order' | 'promo' | 'system';
  title: string;
  message: string;
  is_read: boolean;
  created_at?: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  message: string;
  time: string;
  unread: boolean;
}

export interface CategoryMetric {
  name: string;
  count: number;
  revenue: number;
  percentage: number;
  color: string;
}

export interface Testimonial {
  id: number | string;
  patientName: string;
  profession?: string | null;
  rating: number;
  comment?: string | null;
  created_at?: string;
}

export interface Social {
  id: number | string;
  platformName?: string;
  url?: string;
  created_at?: string;
}

export interface PageVisit {
  id?: number;
  user?: number; // Foreign key user ID sent to backend
  user_email?: string; // Optional email field returned by backend for display
  session_key?: string;
  path: string;
  ip_address?: string;
  device_type: string;
  visited_at?: string;
}