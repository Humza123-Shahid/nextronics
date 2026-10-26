"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  Product,
  PageVisit,
  ProductVariant,
  AttributeValue,
  Order,
  OrderItem,
  Payment,
  ShippingMethod,
  Shipment,
  Customer,
  User, Address,
  OrderStatus,
  CategoryItem,
  Brand,
  Cart,
  CartItem,
  Notification,
  Warehouse,
  Inventory,
  ChatMessage,
  ThemeMode,
  Testimonial,
  Social
} from "../types";
import { api } from "../services/api";
import { getAuthCookie } from "@/admin/actions/auth";
import { INITIAL_NOTIFICATIONS, INITIAL_MESSAGES } from "../data/mockData";

interface AdminContextType {
  // Sidebar & Theme
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  isLoading: boolean;
  error: string | null;

  // Collections State
  products: Product[];
  views: PageVisit[];
  categories: CategoryItem[];
  brands: Brand[];
  orders: Order[];
  customers: Customer[];

  // Fetch API Triggers
  fetchProducts: () => Promise<void>;
  fetchViews: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchBrands: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  //fetchCustomers: () => Promise<void>;

  // Products CRUD
  addProduct: (product: FormData | Record<string, any>) => Promise<void>;
  // updateProduct: (id: number | string, product: FormData | Record<string, any>) => Promise<void>;
  updateProduct: (id: number | string, product: FormData | Record<string, any>, stock: Partial<Product>) => Promise<void>;

  // addProduct: (product: Omit<Product, "id" | "created_at" | "updated_at">) => Promise<void>;
  // updateProduct: (id: number | string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number | string) => Promise<void>;
  selectedProductForView: Product | null;
  setSelectedProductForView: (product: Product | null) => void;
  selectedProductForEdit: Product | null;
  setSelectedProductForEdit: (product: Product | null) => void;
  isAddProductModalOpen: boolean;
  setIsAddProductModalOpen: (open: boolean) => void;

  // Product Variants & Attribute Values
  productVariants: ProductVariant[];
  attributeValues: AttributeValue[];
  fetchProductVariants: () => Promise<void>;
  fetchAttributeValues: () => Promise<void>;
  addProductVariant: (variant: FormData | Partial<ProductVariant>) => Promise<void>;
  updateProductVariant: (id: number | string, variant: FormData | Partial<ProductVariant>) => Promise<void>;
  deleteProductVariant: (id: number | string) => Promise<void>;
  selectedProductVariantForView: ProductVariant | null;
  setSelectedProductVariantForView: (variant: ProductVariant | null) => void;
  selectedProductVariantForEdit: ProductVariant | null;
  setSelectedProductVariantForEdit: (variant: ProductVariant | null) => void;
  isAddProductVariantModalOpen: boolean;
  setIsAddProductVariantModalOpen: (open: boolean) => void;

  // // Notification CRUD
  // notifications: Notification[];
  // fetchNotifications: () => Promise<void>;
  // fetchUsers: () => Promise<void>;
  // addNotification: (variant: FormData | Partial<Notification>) => Promise<void>;
  // updateNotification: (id: number | string, variant: FormData | Partial<Notification>) => Promise<void>;
  // deleteNotification: (id: number | string) => Promise<void>;



  // Warehouses CRUD & State
  warehouses: Warehouse[];
  fetchWarehouses: () => Promise<void>;
  addWarehouse: (warehouse: Omit<Warehouse, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateWarehouse: (id: number | string, warehouse: Partial<Warehouse>) => Promise<void>;
  deleteWarehouse: (id: number | string) => Promise<void>;
  selectedWarehouseForView: Warehouse | null;
  setSelectedWarehouseForView: (warehouse: Warehouse | null) => void;
  selectedWarehouseForEdit: Warehouse | null;
  setSelectedWarehouseForEdit: (warehouse: Warehouse | null) => void;
  isAddWarehouseModalOpen: boolean;
  setIsAddWarehouseModalOpen: (open: boolean) => void;


  // Inventory CRUD & State
  inventories: Inventory[];
  fetchInventories: () => Promise<void>;
  addInventory: (inventory: Omit<Inventory, "id" | "updated_at">) => Promise<void>;
  updateInventory: (id: number | string, inventory: Partial<Inventory>) => Promise<void>;
  deleteInventory: (id: number | string) => Promise<void>;
  selectedInventoryForView: Inventory | null;
  setSelectedInventoryForView: (inventory: Inventory | null) => void;
  selectedInventoryForEdit: Inventory | null;
  setSelectedInventoryForEdit: (inventory: Inventory | null) => void;
  isAddInventoryModalOpen: boolean;
  setIsAddInventoryModalOpen: (open: boolean) => void;

  // Place this inside the `AdminContextType` interface:
  // Carts CRUD & State
  carts: Cart[];
  fetchCarts: () => Promise<void>;
  addCart: (cart: Omit<Cart, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateCart: (id: number | string, cart: Partial<Cart>) => Promise<void>;
  deleteCart: (id: number | string) => Promise<void>;
  selectedCartForView: Cart | null;
  setSelectedCartForView: (cart: Cart | null) => void;
  selectedCartForEdit: Cart | null;
  setSelectedCartForEdit: (cart: Cart | null) => void;
  isAddCartModalOpen: boolean;
  setIsAddCartModalOpen: (open: boolean) => void;


  // CartItems CRUD & State
  cartItems: CartItem[];
  fetchCartItems: () => Promise<void>;
  addCartItem: (item: Omit<CartItem, "id" | "added_at">) => Promise<void>;
  updateCartItem: (id: number | string, item: Partial<CartItem>) => Promise<void>;
  deleteCartItem: (id: number | string) => Promise<void>;
  selectedCartItemForView: CartItem | null;
  setSelectedCartItemForView: (item: CartItem | null) => void;
  selectedCartItemForEdit: CartItem | null;
  setSelectedCartItemForEdit: (item: CartItem | null) => void;
  isAddCartItemModalOpen: boolean;
  setIsAddCartItemModalOpen: (open: boolean) => void;

  // Notifications CRUD & Modals
  notifications: Notification[];
  fetchNotifications: () => Promise<void>;
  addNotification: (data: Omit<Notification, "id" | "created_at">) => Promise<void>;
  updateNotification: (id: number | string, data: Partial<Notification>) => Promise<void>;
  deleteNotification: (id: number | string) => Promise<void>;
  selectedNotificationForView: Notification | null;
  setSelectedNotificationForView: (notification: Notification | null) => void;
  selectedNotificationForEdit: Notification | null;
  setSelectedNotificationForEdit: (notification: Notification | null) => void;
  isAddNotificationModalOpen: boolean;
  setIsAddNotificationModalOpen: (open: boolean) => void;

  // AttributeValues CRUD
  addAttributeValue: (attrVal: Omit<AttributeValue, "id">) => Promise<void>;
  updateAttributeValue: (id: number | string, attrVal: Partial<AttributeValue>) => Promise<void>;
  deleteAttributeValue: (id: number | string) => Promise<void>;
  selectedAttributeValueForView: AttributeValue | null;
  setSelectedAttributeValueForView: (attrVal: AttributeValue | null) => void;
  selectedAttributeValueForEdit: AttributeValue | null;
  setSelectedAttributeValueForEdit: (attrVal: AttributeValue | null) => void;
  isAddAttributeValueModalOpen: boolean;
  setIsAddAttributeValueModalOpen: (open: boolean) => void;

  // Brands CRUD
  addBrand: (brand: Omit<Brand, "id"> | FormData) => Promise<void>;
  updateBrand: (id: number | string, brand: Partial<Brand> | FormData) => Promise<void>;
  deleteBrand: (id: number | string) => Promise<void>;
  selectedBrandForView: Brand | null;
  setSelectedBrandForView: (brand: Brand | null) => void;
  selectedBrandForEdit: Brand | null;
  setSelectedBrandForEdit: (brand: Brand | null) => void;
  isAddBrandModalOpen: boolean;
  setIsAddBrandModalOpen: (open: boolean) => void;

  // Orders CRUD

  // addOrder: (order: Omit<Order, "id">) => Promise<void>;
  // updateOrder: (id: string | number, updated: Partial<Order>) => Promise<void>;
  // deleteOrder: (id: string | number) => Promise<void>;
  // // updateOrderStatus: (id: string | number, status: OrderStatus) => Promise<void>;
  // selectedOrderForModal: Order | null;
  // setSelectedOrderForModal: (order: Order | null) => void;
  // selectedOrderForEdit: Order | null;
  // setSelectedOrderForEdit: (order: Order | null) => void;
  // isAddOrderModalOpen: boolean;
  // setIsAddOrderModalOpen: (open: boolean) => void;
  users: User[];

  isAddOrderModalOpen: boolean;
  setIsAddOrderModalOpen: (open: boolean) => void;
  selectedOrderForModal: Order | null;
  setSelectedOrderForModal: (order: Order | null) => void;
  selectedOrderForEdit: Order | null;
  setSelectedOrderForEdit: (order: Order | null) => void;
  fetchUsersAndAddresses: () => Promise<void>;

  addOrder: (orderData: Partial<Order>) => Promise<void>;
  updateOrder: (id: string | number, orderData: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string | number) => Promise<void>;


  // OrderItems CRUD & State
  orderItems: OrderItem[];
  fetchOrderItems: () => Promise<void>;
  addOrderItem: (item: Omit<OrderItem, "id" | "subtotal">) => Promise<void>;
  updateOrderItem: (id: number | string, item: Partial<OrderItem>) => Promise<void>;
  deleteOrderItem: (id: number | string) => Promise<void>;
  selectedOrderItemForView: OrderItem | null;
  setSelectedOrderItemForView: (item: OrderItem | null) => void;
  selectedOrderItemForEdit: OrderItem | null;
  setSelectedOrderItemForEdit: (item: OrderItem | null) => void;
  isAddOrderItemModalOpen: boolean;
  setIsAddOrderItemModalOpen: (open: boolean) => void;

  // Payments CRUD & State
  payments: Payment[];
  fetchPayments: () => Promise<void>;
  addPayment: (payment: Omit<Payment, "id" | "created_at">) => Promise<void>;
  updatePayment: (id: number | string, payment: Partial<Payment>) => Promise<void>;
  deletePayment: (id: number | string) => Promise<void>;
  selectedPaymentForView: Payment | null;
  setSelectedPaymentForView: (payment: Payment | null) => void;
  selectedPaymentForEdit: Payment | null;
  setSelectedPaymentForEdit: (payment: Payment | null) => void;
  isAddPaymentModalOpen: boolean;
  setIsAddPaymentModalOpen: (open: boolean) => void;

  // ShippingMethods CRUD & State
  shippingMethods: ShippingMethod[];
  fetchShippingMethods: () => Promise<void>;
  addShippingMethod: (method: Omit<ShippingMethod, "id">) => Promise<void>;
  updateShippingMethod: (id: number | string, method: Partial<ShippingMethod>) => Promise<void>;
  deleteShippingMethod: (id: number | string) => Promise<void>;
  selectedShippingMethodForView: ShippingMethod | null;
  setSelectedShippingMethodForView: (method: ShippingMethod | null) => void;
  selectedShippingMethodForEdit: ShippingMethod | null;
  setSelectedShippingMethodForEdit: (method: ShippingMethod | null) => void;
  isAddShippingMethodModalOpen: boolean;
  setIsAddShippingMethodModalOpen: (open: boolean) => void;


  // Shipments CRUD & State
  shipments: Shipment[];
  fetchShipments: () => Promise<void>;
  addShipment: (shipment: Omit<Shipment, "id">) => Promise<void>;
  updateShipment: (id: number | string, shipment: Partial<Shipment>) => Promise<void>;
  deleteShipment: (id: number | string) => Promise<void>;
  selectedShipmentForView: Shipment | null;
  setSelectedShipmentForView: (shipment: Shipment | null) => void;
  selectedShipmentForEdit: Shipment | null;
  setSelectedShipmentForEdit: (shipment: Shipment | null) => void;
  isAddShipmentModalOpen: boolean;
  setIsAddShipmentModalOpen: (open: boolean) => void;

  // Users CRUD
  addUser: (user: Partial<User>) => Promise<void>;
  updateUser: (id: number | string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: number | string) => Promise<void>;
  selectedUserForView: User | null;
  setSelectedUserForView: (user: User | null) => void;
  selectedUserForEdit: User | null;
  setSelectedUserForEdit: (user: User | null) => void;
  isAddUserModalOpen: boolean;
  setIsAddUserModalOpen: (open: boolean) => void;

  // Customers CRUD
  addCustomer: (customer: Omit<Customer, "id" | "joinDate" | "totalOrders" | "totalSpend">) => Promise<void>;
  updateCustomer: (id: string | number, updated: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string | number) => Promise<void>;
  selectedCustomerForView: Customer | null;
  setSelectedCustomerForView: (customer: Customer | null) => void;
  selectedCustomerForEdit: Customer | null;
  setSelectedCustomerForEdit: (customer: Customer | null) => void;
  isAddCustomerModalOpen: boolean;
  setIsAddCustomerModalOpen: (open: boolean) => void;

  // Categories CRUD
  addCategory: (category: Omit<CategoryItem, "id"> | FormData) => Promise<void>;
  updateCategory: (id: string | number, updated: Partial<CategoryItem> | FormData) => Promise<void>;
  deleteCategory: (id: string | number) => Promise<void>;
  selectedCategoryForView: CategoryItem | null;
  setSelectedCategoryForView: (cat: CategoryItem | null) => void;
  selectedCategoryForEdit: CategoryItem | null;
  setSelectedCategoryForEdit: (cat: CategoryItem | null) => void;
  isAddCategoryModalOpen: boolean;
  setIsAddCategoryModalOpen: (open: boolean) => void;

  // Notifications & Messages
  //notifications: NotificationItem[];
  // markNotificationRead: (id: string) => void;
  markNotificationRead: (id: number) => void
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;
  messages: ChatMessage[];
  unreadMessagesCount: number;
  setNotifications: (notifications: Notification[]) => void;

  // Global Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;


  // Address CRUD & State
  addresses: Address[];
  fetchAddresses: () => Promise<void>;
  addAddress: (address: Omit<Address, "id" | "created_at">) => Promise<void>;
  updateAddress: (id: number | string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: number | string) => Promise<void>;
  selectedAddressForView: Address | null;
  setSelectedAddressForView: (address: Address | null) => void;
  selectedAddressForEdit: Address | null;
  setSelectedAddressForEdit: (address: Address | null) => void;
  isAddAddressModalOpen: boolean;
  setIsAddAddressModalOpen: (open: boolean) => void;

  // Testimonials State & Operations
  testimonials: Testimonial[];
  fetchTestimonials: () => Promise<void>;
  addTestimonial: (testimonial: Omit<Testimonial, "id" | "created_at">) => Promise<void>;
  updateTestimonial: (id: number | string, testimonial: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: number | string) => Promise<void>;
  selectedTestimonialForView: Testimonial | null;
  setSelectedTestimonialForView: (testimonial: Testimonial | null) => void;
  selectedTestimonialForEdit: Testimonial | null;
  setSelectedTestimonialForEdit: (testimonial: Testimonial | null) => void;
  isAddTestimonialModalOpen: boolean;
  setIsAddTestimonialModalOpen: (open: boolean) => void;

  // Socials CRUD & State
  socials: Social[];
  fetchSocials: () => Promise<void>;
  addSocial: (social: Omit<Social, "id" | "created_at">) => Promise<void>;
  updateSocial: (id: number | string, social: Partial<Social>) => Promise<void>;
  deleteSocial: (id: number | string) => Promise<void>;
  selectedSocialForView: Social | null;
  setSelectedSocialForView: (social: Social | null) => void;
  selectedSocialForEdit: Social | null;
  setSelectedSocialForEdit: (social: Social | null) => void;
  isAddSocialModalOpen: boolean;
  setIsAddSocialModalOpen: (open: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// export function AdminProvider({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
export function AdminProvider({ children }: { children: React.ReactNode }) {

  // Helper to enrich raw Address records with user email

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("nextronics_access_token") || null;
    }
    return null;
  });
  // Navigation & Theme
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data Collections State
  const [products, setProducts] = useState<Product[]>([]);
  const [views, setViews] = useState<PageVisit[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const resolveCookie = async () => {
      try {
        const token = await getAuthCookie();
        if (token) {
          setAccessToken(token);
          if (typeof window !== "undefined") {
            localStorage.setItem("nextronics_access_token", token);
          }
        } else if (typeof window !== "undefined") {
          const stored = localStorage.getItem("nextronics_access_token");
          if (stored) setAccessToken(stored);
        }
      } catch (err) {
        console.error("Failed to load auth cookie:", err);
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("nextronics_access_token");
          if (stored) setAccessToken(stored);
        }
      }
    };
    resolveCookie();
  }, []);

  useEffect(() => {
    console.log("AdminContext data on the client:", views);
  }, [views]);
  const getAuthToken = async (): Promise<string | null> => {
    if (accessToken) return accessToken;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nextronics_access_token");
      if (stored) return stored;
    }
    try {
      const cookieToken = await getAuthCookie();
      if (cookieToken) return cookieToken;
    } catch { }
    return null;
  };

  // Products Modal State
  const [selectedProductForView, setSelectedProductForView] = useState<Product | null>(null);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);


  // Place inside `AdminProvider` function (alongside other state declarations):
  // Carts State & Modals
  const [carts, setCarts] = useState<Cart[]>([]);
  const [selectedCartForView, setSelectedCartForView] = useState<Cart | null>(null);
  const [selectedCartForEdit, setSelectedCartForEdit] = useState<Cart | null>(null);
  const [isAddCartModalOpen, setIsAddCartModalOpen] = useState<boolean>(false);

  // Foreign key helper: Map user ID to user email for Carts
  const enrichCartWithUserEmail = useCallback(
    (cart: any, uList: User[]): Cart => {
      const userId = cart.user_id ?? (typeof cart.user === "object" ? cart.user?.id : cart.user);
      const matchedUser = uList.find((u) => String(u.id) === String(userId));
      return {
        ...cart,
        user: userId ? Number(userId) : null,
        user_email: matchedUser?.email || (typeof cart.user === "object" ? cart.user?.email : "Guest / N/A"),
      };
    },
    []
  );

  //Notification State
  // Notifications State & Modals
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotificationForView, setSelectedNotificationForView] = useState<Notification | null>(null);
  const [selectedNotificationForEdit, setSelectedNotificationForEdit] = useState<Notification | null>(null);
  const [isAddNotificationModalOpen, setIsAddNotificationModalOpen] = useState(false);

  // Helper to map foreign key User ID to user_email
  const enrichNotificationWithUserEmail = useCallback(
    (notif: any, uList: User[]): Notification => {
      const userId = notif.user_id ?? (typeof notif.user === "object" ? notif.user?.id : notif.user);
      const matchedUser = uList.find((u) => String(u.id) === String(userId));
      return {
        ...notif,
        user: userId ? Number(userId) : notif.user,
        user_email: matchedUser?.email || (typeof notif.user === "object" ? notif.user?.email : "N/A"),
      };
    },
    []
  );
  //const [users, setUsers] = useState<User[]>([]); 

  // Product Variants & Attribute Values State
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [attributeValues, setAttributeValues] = useState<AttributeValue[]>([]);
  const [selectedProductVariantForView, setSelectedProductVariantForView] = useState<ProductVariant | null>(null);
  const [selectedProductVariantForEdit, setSelectedProductVariantForEdit] = useState<ProductVariant | null>(null);
  const [isAddProductVariantModalOpen, setIsAddProductVariantModalOpen] = useState(false);

  // Attribute Values Modal State
  const [selectedAttributeValueForView, setSelectedAttributeValueForView] = useState<AttributeValue | null>(null);
  const [selectedAttributeValueForEdit, setSelectedAttributeValueForEdit] = useState<AttributeValue | null>(null);
  const [isAddAttributeValueModalOpen, setIsAddAttributeValueModalOpen] = useState(false);

  // Brands Modal State
  const [selectedBrandForView, setSelectedBrandForView] = useState<Brand | null>(null);
  const [selectedBrandForEdit, setSelectedBrandForEdit] = useState<Brand | null>(null);
  const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);

  // Orders Modal State
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<Order | null>(null);
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);


  // OrderItems State & Modals
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedOrderItemForView, setSelectedOrderItemForView] = useState<OrderItem | null>(null);
  const [selectedOrderItemForEdit, setSelectedOrderItemForEdit] = useState<OrderItem | null>(null);
  const [isAddOrderItemModalOpen, setIsAddOrderItemModalOpen] = useState<boolean>(false);

  // Helper to map and enrich Foreign Keys (Order, Product & ProductVariant)
  const enrichOrderItemWithRelations = useCallback(
    (
      item: any,
      orderList: Order[],
      productList: Product[],
      variantList: ProductVariant[],
      userList: User[]
    ): OrderItem => {
      const orderId = item.order_id ?? (typeof item.order === "object" ? item.order?.id : item.order);
      const prodId = item.product_id ?? (typeof item.product === "object" ? item.product?.id : item.product);
      const variantId = item.product_variant_id ?? (typeof item.product_variant === "object" ? item.product_variant?.id : item.product_variant);

      // 1. Resolve Order & associated User Email
      const matchedOrder = orderList.find((o) => String(o.id) === String(orderId));
      const userId = matchedOrder?.user_id ?? (typeof matchedOrder?.user === "object" ? (matchedOrder.user as any)?.id : matchedOrder?.user);
      const matchedUser = userList.find((u) => String(u.id) === String(userId));

      const orderNumDisplay = matchedOrder?.order_number || `Order #${orderId}`;
      const userEmailDisplay = matchedUser?.email || (matchedOrder as any)?.user_email || "Guest / N/A";
      const orderDisplayLabel = `${orderNumDisplay} (${userEmailDisplay})`;

      // 2. Resolve Product
      const matchedProduct = productList.find((p) => String(p.id) === String(prodId));
      const productNameDisplay = matchedProduct?.name || item.product_name_snapshot || "N/A";

      // 3. Resolve Product Variant
      const matchedVariant = variantList.find((v) => String(v.id) === String(variantId));
      const variantSku = matchedVariant?.sku || item.sku_snapshot || "N/A";
      const variantProdId = matchedVariant?.product_id ?? (typeof matchedVariant?.product === "object" ? (matchedVariant.product as any)?.id : matchedVariant?.product);
      const matchedVariantProd = productList.find((p) => String(p.id) === String(variantProdId));
      const variantProdName = matchedVariantProd?.name || productNameDisplay;

      const variantLabel = matchedVariant ? `${variantSku} (${variantProdName})` : "No Variant";

      return {
        ...item,
        order: Number(orderId),
        product: prodId ? Number(prodId) : null,
        product_variant: variantId ? Number(variantId) : null,
        order_number_display: orderNumDisplay,
        user_email_display: userEmailDisplay,
        order_display_label: orderDisplayLabel,
        product_name_display: productNameDisplay,
        product_variant_label: variantLabel,
      };
    },
    []
  );

  // Payments State & Modals
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPaymentForView, setSelectedPaymentForView] = useState<Payment | null>(null);
  const [selectedPaymentForEdit, setSelectedPaymentForEdit] = useState<Payment | null>(null);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState<boolean>(false);

  // Helper to map and enrich Order Foreign Key for Payments
  const enrichPaymentWithOrderDetails = useCallback(
    (payment: any, orderList: Order[], userList: User[]): Payment => {
      const orderId = payment.order_id ?? (typeof payment.order === "object" ? payment.order?.id : payment.order);
      const matchedOrder = orderList.find((o) => String(o.id) === String(orderId));

      const userId = matchedOrder?.user_id ?? (typeof matchedOrder?.user === "object" ? (matchedOrder.user as any)?.id : matchedOrder?.user);
      const matchedUser = userList.find((u) => String(u.id) === String(userId));

      const orderNumDisplay = matchedOrder?.order_number || `Order #${orderId}`;
      const userEmailDisplay = matchedUser?.email || (matchedOrder as any)?.user_email || "Guest / N/A";
      const orderDisplayLabel = `${orderNumDisplay} (${userEmailDisplay})`;

      return {
        ...payment,
        order: Number(orderId),
        order_number_display: orderNumDisplay,
        user_email_display: userEmailDisplay,
        order_display_label: orderDisplayLabel,
      };
    },
    []
  );


  // Customers Modal State
  const [selectedCustomerForView, setSelectedCustomerForView] = useState<Customer | null>(null);
  const [selectedCustomerForEdit, setSelectedCustomerForEdit] = useState<Customer | null>(null);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);

  // Categories Modal State
  const [selectedCategoryForView, setSelectedCategoryForView] = useState<CategoryItem | null>(null);
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState<CategoryItem | null>(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  // Users Modal State
  const [selectedUserForView, setSelectedUserForView] = useState<User | null>(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Notifications, Messages & Global Search
  // const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [searchQuery, setSearchQuery] = useState("");


  // Testimonials State & Modals
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedTestimonialForView, setSelectedTestimonialForView] = useState<Testimonial | null>(null);
  const [selectedTestimonialForEdit, setSelectedTestimonialForEdit] = useState<Testimonial | null>(null);
  const [isAddTestimonialModalOpen, setIsAddTestimonialModalOpen] = useState(false);

  // Fetch Users & Addresses directly from PostgreSQL API endpoints
  const fetchUsersAndAddresses = useCallback(async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;
      //if (!enabled) return;
      const [userData, addrData] = await Promise.all([
        api.get<User[]>("/users/", token || undefined),
        api.get<Address[]>("/addresses/", token || undefined),
      ]);
      setUsers(userData);
      setAddresses(addrData);
    } catch (err) {
      console.error("Failed to load users or addresses from API:", err);
    }
  }, [getAuthToken]);

  // Helper to format address using DB fields
  const formatAddressDisplay = (addr?: Address) => {
    if (!addr) return "N/A";
    const namePrefix = addr.full_name ? `${addr.full_name}: ` : "";
    const line2Str = addr.address_line2 ? `, ${addr.address_line2}` : "";
    return `${namePrefix}${addr.address_line1}${line2Str} (${addr.city})`;
  };

  // Helper to enrich raw order records with relation labels
  const enrichAddressWithUserEmail = useCallback((addr: any, uList: User[]): Address => {
    const userId = addr.user_id ?? (typeof addr.user === "object" ? addr.user?.id : addr.user);
    const matchedUser = uList.find((u) => String(u.id) === String(userId));
    return {
      ...addr,
      user: userId ? Number(userId) : addr.user,
      user_email: matchedUser?.email || (typeof addr.user === "object" ? addr.user?.email : "N/A"),
    };
  }, []);
  const enrichOrderWithRelationNames = useCallback(
    (order: any, uList: User[], aList: Address[]): Order => {
      const userId = order.user_id ?? (typeof order.user === "object" ? order.user?.id : order.user);
      const shipId = order.shipping_address_id ?? (typeof order.shipping_address === "object" ? order.shipping_address?.id : order.shipping_address);
      const billId = order.billing_address_id ?? (typeof order.billing_address === "object" ? order.billing_address?.id : order.billing_address);

      const matchedUser = uList.find((u) => String(u.id) === String(userId));
      const matchedShip = aList.find((a) => String(a.id) === String(shipId));
      const matchedBill = aList.find((a) => String(a.id) === String(billId));

      return {
        ...order,
        user_id: userId ? Number(userId) : null,
        shipping_address_id: shipId ? Number(shipId) : null,
        billing_address_id: billId ? Number(billId) : null,
        user_email: matchedUser?.email || (typeof order.user === "object" ? order.user?.email : "Guest"),
        shipping_address_display: formatAddressDisplay(matchedShip || (typeof order.shipping_address === "object" ? order.shipping_address : undefined)),
        billing_address_display: formatAddressDisplay(matchedBill || (typeof order.billing_address === "object" ? order.billing_address : undefined)),
      };
    },
    []
  );



  // Load database entities on initial mount
  useEffect(() => {
    const initData = async () => {
      if (!users.length || !addresses.length) await fetchUsersAndAddresses();
    };
    initData();
  }, [accessToken, users, addresses, fetchUsersAndAddresses]);
  const fetchOrders = useCallback(async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;
      const data = await api.get<Order[]>("/orders/", token || undefined);
      const mapped = data.map((o) => enrichOrderWithRelationNames(o, users, addresses));
      setOrders(mapped);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  }, [users, addresses, enrichOrderWithRelationNames, getAuthToken]);
  useEffect(() => {
    if (users.length >= 0 || addresses.length >= 0) {
      if (!orders.length) fetchOrders();
    }
  }, [users, addresses, accessToken, orders, fetchOrders]);
  // Sync theme class with HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const toggleSidebarCollapsed = () => setSidebarCollapsed((prev) => !prev);

  // Robust foreign key and relational name resolution
  const enrichProductWithRelationNames = useCallback(
    (product: any, cats: CategoryItem[], brs: Brand[]): Product => {
      const catId =
        product.category_id ??
        (typeof product.category === "object" ? product.category?.id : product.category);

      const brandId =
        product.brand_id ??
        (typeof product.brand === "object" ? product.brand?.id : product.brand);

      const cat = cats.find((c) => Number(c.id) === Number(catId));
      const brand = brs.find((b) => Number(b.id) === Number(brandId));

      return {
        ...product,
        category_id: catId ? Number(catId) : null,
        brand_id: brandId ? Number(brandId) : null,
        category_name:
          cat?.name ||
          (typeof product.category === "object" ? product.category?.name : null) ||
          product.category_name ||
          "Uncategorized",
        brand_name:
          brand?.name ||
          (typeof product.brand === "object" ? product.brand?.name : null) ||
          product.brand_name ||
          "N/A",
      };
    },
    []
  );

  const enrichVariantWithRelationNames = useCallback(
    (variant: any, prods: Product[]): ProductVariant => {
      const prodId =
        variant.product_id ??
        (typeof variant.product === "object" ? variant.product?.id : variant.product);

      const prod = prods.find((p) => Number(p.id) === Number(prodId));

      return {
        ...variant,
        product_id: prodId ? Number(prodId) : null,
        product_name:
          prod?.name ||
          (typeof variant.product === "object" ? variant.product?.name : null) ||
          variant.product_name ||
          "N/A",
      };
    },
    []
  );

  useEffect(() => {
    if (products.length > 0) {
      setProducts((prevProducts) =>
        prevProducts.map((p) => enrichProductWithRelationNames(p, categories, brands))
      );
    }
  }, [categories, brands, enrichProductWithRelationNames]);

  // Fetch API Handlers
  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.get<CategoryItem[]>("/categories/");
      setCategories(data);
    } catch (err: any) {
      console.error("Failed to fetch categories:", err);
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;
      //if (!enabled) return;
      const data = await api.get<Brand[]>("/brands/", token);
      setBrands(data);
    } catch (err: any) {
      console.error("Failed to fetch brands:", err);
    }
  }, [getAuthToken]);
  useEffect(() => {
    if (!brands.length) fetchBrands();
  }, [accessToken, brands, fetchBrands]);
  const fetchProducts = useCallback(async () => {
    try {
      const data = await api.get<Product[]>("/products/");
      const mapped = data.map((p) => enrichProductWithRelationNames(p, categories, brands));
      setProducts(mapped);
    } catch (err: any) {
      console.error("Failed to fetch products:", err);
      setError(err.message);
    }
  }, [categories, brands, enrichProductWithRelationNames]);


  const fetchViews = useCallback(async () => {
    try {
      const data = await api.get<PageVisit[]>("/page-visits/");
      console.log(data);
      //const mapped = data.map((p) => enrichProductWithRelationNames(p, categories, brands));
      setViews(data);
    } catch (err: any) {
      console.error("Failed to fetch Views:", err);
      setError(err.message);
    }
  }, []);
  // const fetchCustomers = useCallback(async () => {
  //   try {
  //     const data = await api.get<Customer[]>("/customers/");
  //     setCustomers(data);
  //   } catch (err: any) {
  //     console.warn("Customers endpoint not active:", err.message);
  //     setCustomers([]);
  //   }
  // }, []);

  // Initial load
  const fetchTestimonials = useCallback(async () => {
    let token = accessToken;
    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem("nextronics_access_token");
    }
    if (!token) {
      try {
        token = (await getAuthCookie()) || null;
      } catch {
        token = null;
      }
    }
    if (!token) return;
    ////if (!enabled) return;
    try {
      const data = await api.getWithToken<Testimonial[]>("/testimonials/", token);
      setTestimonials(data);
    } catch (err: any) {
      console.error("Failed to fetch testimonials:", err);
    }
  }, [accessToken]);
  useEffect(() => {
    fetchTestimonials();
  }, [accessToken, fetchTestimonials]);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      // if (accessToken) {
      //   fetchTestimonials();
      // }
      if (!views.length) fetchViews();
      const token = await getAuthToken();
      if (!token) return;
      const [fetchedCats, fetchedBrs] = await Promise.all([
        api.get<CategoryItem[]>("/categories/").catch(() => []),
        !brands.length ? api.get<Brand[]>("/brands/", token || undefined).catch(() => []) : brands,
        //fetchOrders(),
        ////fetchCustomers(),
      ]);

      if (fetchedCats.length > 0) setCategories(fetchedCats);
      if (fetchedBrs.length > 0) setBrands(fetchedBrs);

      try {
        const rawProducts = await api.get<Product[]>("/products/");
        const mapped = rawProducts.map((p) =>
          enrichProductWithRelationNames(p, fetchedCats, fetchedBrs)
        );
        setProducts(mapped);
      } catch (err: any) {
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!brands.length || !products.length || !categories.length) loadInitialData();
    //// }, [enrichProductWithRelationNames, fetchOrders, fetchViews, accessToken, fetchTestimonials]);
    // }, [enrichProductWithRelationNames, fetchOrders, fetchViews]);
  }, [enrichProductWithRelationNames, getAuthToken, brands, products, categories]);

  // useEffect(() => {
  //   if (!socials.length) fetchSocials();   // empty array → fetch → new empty array → fetch...
  // }, [socials, accessToken, fetchSocials]);
  //}, [enrichProductWithRelationNames, fetchOrders, fetchCustomers]);

  // useEffect(() => {
  //   fetchNotifications();
  //   fetchUsers();
  // }, []);

  // Brands CRUD Operations
  const addBrand = async (newBrand: Omit<Brand, "id"> | FormData) => {
    const token = await getAuthToken();
    const created = await api.post<Brand>("/brands/", newBrand, token || undefined);
    setBrands((prev) => [created, ...prev]);
  };

  const updateBrand = async (id: number | string, updatedBrand: Partial<Brand> | FormData) => {
    const token = await getAuthToken();
    const response = await api.patch<Brand>(`/brands/${id}/`, updatedBrand, token || undefined);
    setBrands((prev) => prev.map((b) => (b.id === id ? response : b)));
  };

  const deleteBrand = async (id: number | string) => {
    const token = await getAuthToken();
    await api.delete(`/brands/${id}/`, token || undefined);
    setBrands((prev) => prev.filter((b) => b.id !== id));
  };

  // Products CRUD Operations
  // const addProduct = async (newProd: Omit<Product, "id" | "created_at" | "updated_at">) => {
  //   const payload = {
  //     ...newProd,
  //     category_id: newProd.category_id ? Number(newProd.category_id) : null,
  //     brand_id: newProd.brand_id ? Number(newProd.brand_id) : null,
  //   };
  //   const response = await api.post<Product>("/products/", payload);
  //   const enriched = enrichProductWithRelationNames(response, categories, brands);
  //   setProducts((prev) => [enriched, ...prev]);
  // };

  // const updateProduct = async (id: number | string, updatedFields: Partial<Product>) => {
  //   const payload = {
  //     ...updatedFields,
  //     ...(updatedFields.category_id !== undefined && {
  //       category_id: updatedFields.category_id ? Number(updatedFields.category_id) : null,
  //     }),
  //     ...(updatedFields.brand_id !== undefined && {
  //       brand_id: updatedFields.brand_id ? Number(updatedFields.brand_id) : null,
  //     }),
  //   };
  //   const response = await api.patch<Product>(`/products/${id}/`, payload);
  //   const enriched = enrichProductWithRelationNames(response, categories, brands);
  //   setProducts((prev) => prev.map((p) => (p.id === id ? enriched : p)));
  // };
  // Inside AdminProvider implementation:
  const addProduct = async (newProd: FormData | Record<string, any>) => {
    const token = await getAuthToken();
    const response = await api.post<Product>("/products/", newProd, token || undefined);
    const enriched = enrichProductWithRelationNames(response, categories, brands);
    setProducts((prev) => [enriched, ...prev]);
  };

  // const updateProduct = async (id: number | string, updatedFields: FormData | Record<string, any>) => {
  const updateProduct = async (id: number | string, updatedFields: FormData | Record<string, any>, stock: Partial<Product>) => {

    const token = await getAuthToken();
    const response = await api.patch<Product>(`/products/${id}/`, updatedFields, token || undefined);
    const enriched = enrichProductWithRelationNames(response, categories, brands);
    setProducts((prev) => prev.map((p) => (p.id === id ? enriched : p)));
    if (Number(stock.stock_quantity) === 0) {
      const response = await api.post<Notification>(`/notifications/`, { notification_type: "system", title: "Product Out of Stock", message: `Product ${stock.name} is out of stock` }, token || undefined);
      setNotifications((prev) => [response, ...prev]);
    }
    else if (Number(stock.stock_quantity) < 5) {
      const response = await api.post<Notification>(`/notifications/`, { notification_type: "system", title: "Low Stock", message: `Product ${stock.name} has low stock (${stock.stock_quantity} left)` }, token || undefined);
      setNotifications((prev) => [response, ...prev]);
    }
  };
  const deleteProduct = async (id: number | string) => {
    const token = await getAuthToken();
    await api.delete(`/products/${id}/`, token || undefined);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };
  // Warehouses State & Modals
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouseForView, setSelectedWarehouseForView] = useState<Warehouse | null>(null);
  const [selectedWarehouseForEdit, setSelectedWarehouseForEdit] = useState<Warehouse | null>(null);
  const [isAddWarehouseModalOpen, setIsAddWarehouseModalOpen] = useState(false);

  // Warehouses CRUD Actions
  const fetchWarehouses = useCallback(async () => {
    try {
      const token = await getAuthToken();
      //if (!enabled) return;
      if (!token) return;
      const data = await api.get<Warehouse[]>("/warehouses/", token || undefined);
      setWarehouses(data);
    } catch (err: any) {
      console.error("Failed to fetch warehouses:", err);
    }
  }, [getAuthToken]);

  const addWarehouse = async (newWarehouse: Omit<Warehouse, "id" | "created_at" | "updated_at">) => {
    const token = await getAuthToken();
    const created = await api.post<Warehouse>("/warehouses/", newWarehouse, token || undefined);
    setWarehouses((prev) => [created, ...prev]);
  };

  const updateWarehouse = async (id: number | string, updatedFields: Partial<Warehouse>) => {
    const token = await getAuthToken();
    const updated = await api.patch<Warehouse>(`/warehouses/${id}/`, updatedFields, token || undefined);
    setWarehouses((prev) => prev.map((w) => (w.id === id ? updated : w)));
  };

  const deleteWarehouse = async (id: number | string) => {
    const token = await getAuthToken();
    await api.delete(`/warehouses/${id}/`, token || undefined);
    setWarehouses((prev) => prev.filter((w) => w.id !== id));
  };

  useEffect(() => {
    if (!warehouses.length) fetchWarehouses();
  }, [accessToken, warehouses, fetchWarehouses]);

  // Inventory State & Modals
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [selectedInventoryForView, setSelectedInventoryForView] = useState<Inventory | null>(null);
  const [selectedInventoryForEdit, setSelectedInventoryForEdit] = useState<Inventory | null>(null);
  const [isAddInventoryModalOpen, setIsAddInventoryModalOpen] = useState(false);

  // Foreign key helper to map Product Variant Name + SKU and Warehouse Name
  const enrichInventoryWithRelationNames = useCallback(
    (inv: any, variants: ProductVariant[], whs: Warehouse[], products: Product[] = []): Inventory => {
      const variantId =
        inv.product_variant_id ??
        (typeof inv.product_variant === "object" ? inv.product_variant?.id : inv.product_variant);

      const warehouseId =
        inv.warehouse_id ??
        (typeof inv.warehouse === "object" ? inv.warehouse?.id : inv.warehouse);

      const matchedVariant = variants.find((v) => Number(v.id) === Number(variantId));
      const matchedWarehouse = whs.find((w) => Number(w.id) === Number(warehouseId));

      // Resolve parent product to get Product Name
      const parentProductId =
        matchedVariant?.product_id ??
        (typeof matchedVariant?.product === "object" ? matchedVariant?.product?.id : matchedVariant?.product);

      const matchedProduct = products.find((p) => Number(p.id) === Number(parentProductId));

      const productName =
        matchedProduct?.name ||
        (typeof matchedVariant?.product === "object" ? matchedVariant?.product?.name : null) ||
        inv.product_name ||
        "";

      const variantSku =
        matchedVariant?.sku ||
        (typeof inv.product_variant === "object" ? inv.product_variant?.sku : null) ||
        inv.product_variant_sku ||
        `Variant #${variantId}`;

      // Format combined label: "Product Name (SKU)" or fallback to SKU/ID
      const productVariantLabel = productName
        ? `${productName} (${variantSku})`
        : variantSku;

      return {
        ...inv,
        product_variant: Number(variantId),
        warehouse: Number(warehouseId),
        product_name: productName,
        product_variant_sku: variantSku,
        product_variant_label: productVariantLabel,
        warehouse_name:
          matchedWarehouse?.name ||
          (typeof inv.warehouse === "object" ? inv.warehouse?.name : null) ||
          inv.warehouse_name ||
          `Warehouse #${warehouseId}`,
      };
    },
    []
  );

  const fetchInventories = useCallback(async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;
      //if (!enabled) return;
      const data = await api.get<Inventory[]>("/inventories/", token || undefined);
      const mapped = data.map((inv) =>
        enrichInventoryWithRelationNames(inv, productVariants, warehouses, products)
      );
      setInventories(mapped);
    } catch (err: any) {
      console.error("Failed to fetch inventories:", err);
    }
  }, [productVariants, warehouses, products, enrichInventoryWithRelationNames, getAuthToken]);

  const addInventory = async (newInv: Omit<Inventory, "id" | "updated_at">) => {
    const token = await getAuthToken();
    const payload = {
      ...newInv,
      product_variant: Number(newInv.product_variant),
      warehouse: Number(newInv.warehouse),
      quantity: Number(newInv.quantity),
      reserved_quantity: Number(newInv.reserved_quantity),
    };
    const created = await api.post<Inventory>("/inventories/", payload, token || undefined);
    const enriched = enrichInventoryWithRelationNames(created, productVariants, warehouses);
    setInventories((prev) => [enriched, ...prev]);
  };

  const updateInventory = async (id: number | string, updatedFields: Partial<Inventory>) => {
    const token = await getAuthToken();
    const payload = {
      ...updatedFields,
      ...(updatedFields.product_variant !== undefined && { product_variant: Number(updatedFields.product_variant) }),
      ...(updatedFields.warehouse !== undefined && { warehouse: Number(updatedFields.warehouse) }),
      ...(updatedFields.quantity !== undefined && { quantity: Number(updatedFields.quantity) }),
      ...(updatedFields.reserved_quantity !== undefined && { reserved_quantity: Number(updatedFields.reserved_quantity) }),
    };
    const updated = await api.patch<Inventory>(`/inventories/${id}/`, payload, token || undefined);
    const enriched = enrichInventoryWithRelationNames(updated, productVariants, warehouses);
    setInventories((prev) => prev.map((item) => (item.id === id ? enriched : item)));
  };

  const deleteInventory = async (id: number | string) => {
    const token = await getAuthToken();
    await api.delete(`/inventories/${id}/`, token || undefined);
    setInventories((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    if (productVariants.length >= 0 || warehouses.length >= 0) {
      if (!inventories.length) fetchInventories();
    }
  }, [productVariants, warehouses, accessToken, inventories, fetchInventories]);


  // Place inside `AdminProvider` function:
  const fetchCarts = useCallback(async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;
      //if (!enabled) return;
      const data = await api.get<Cart[]>("/carts/", token || undefined);
      const enriched = data.map((c) => enrichCartWithUserEmail(c, users));
      setCarts(enriched);
    } catch (err: any) {
      console.error("Failed to fetch carts:", err);
    }
  }, [users, enrichCartWithUserEmail, getAuthToken]);

  const addCart = async (newCart: Omit<Cart, "id" | "created_at" | "updated_at">) => {
    const token = await getAuthToken();
    const payload = {
      ...newCart,
      user: newCart.user ? Number(newCart.user) : null,
    };
    const created = await api.post<Cart>("/carts/", payload, token || undefined);
    const enriched = enrichCartWithUserEmail(created, users);
    setCarts((prev) => [enriched, ...prev]);
  };

  const updateCart = async (id: number | string, updatedFields: Partial<Cart>) => {
    const token = await getAuthToken();
    const payload = {
      ...updatedFields,
      ...(updatedFields.user !== undefined && {
        user: updatedFields.user ? Number(updatedFields.user) : null,
      }),
    };
    const updated = await api.patch<Cart>(`/carts/${id}/`, payload, token || undefined);
    const enriched = enrichCartWithUserEmail(updated, users);
    setCarts((prev) => prev.map((c) => (c.id === id ? enriched : c)));
  };

  const deleteCart = async (id: number | string) => {
    const token = await getAuthToken();
    await api.delete(`/carts/${id}/`, token || undefined);
    setCarts((prev) => prev.filter((c) => c.id !== id));
  };

  useEffect(() => {
    if (users.length >= 0) {
      if (!carts.length) fetchCarts();
    }
  }, [users, accessToken, carts, fetchCarts]);


  // CartItems State & Modals
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCartItemForView, setSelectedCartItemForView] = useState<CartItem | null>(null);
  const [selectedCartItemForEdit, setSelectedCartItemForEdit] = useState<CartItem | null>(null);
  const [isAddCartItemModalOpen, setIsAddCartItemModalOpen] = useState<boolean>(false);

  // Helper to map and enrich Foreign Keys (Cart & ProductVariant) for CartItem
  const enrichCartItemWithRelations = useCallback(
    (
      item: any,
      cartList: Cart[],
      variantList: ProductVariant[],
      productList: Product[],
      userList: User[]
    ): CartItem => {
      const cartId = item.cart_id ?? (typeof item.cart === "object" ? item.cart?.id : item.cart);
      const variantId =
        item.product_variant_id ??
        (typeof item.product_variant === "object" ? item.product_variant?.id : item.product_variant);

      // Resolve Cart & User
      const matchedCart = cartList.find((c) => Number(c.id) === Number(cartId));
      // const userId = matchedCart?.user ? (typeof matchedCart.user === "object" ? matchedCart.user.id : matchedCart.user) : null;
      const userId = matchedCart?.user
        ? typeof matchedCart.user === "object"
          ? (matchedCart.user as User).id
          : matchedCart.user
        : null;
      const matchedUser = userList.find((u) => Number(u.id) === Number(userId));
      const userEmail = matchedUser?.email || "No User Email";
      const sessionKey = matchedCart?.session_key || "No Session";

      const cartDisplayLabel = matchedCart
        ? `Cart #${matchedCart.id} [Session: ${sessionKey} | Email: ${userEmail}]`
        : `Cart #${cartId}`;

      // Resolve ProductVariant & Product Name
      const matchedVariant = variantList.find((v) => Number(v.id) === Number(variantId));
      const prodId = matchedVariant?.product ? (typeof matchedVariant.product === "object" ? matchedVariant.product.id : matchedVariant.product) : null;
      const matchedProduct = productList.find((p) => Number(p.id) === Number(prodId));

      const prodName = matchedProduct?.name || "Product";
      const variantSku = matchedVariant?.sku || `SKU#${variantId}`;

      const variantDisplayLabel = `${prodName} (SKU: ${variantSku})`;

      return {
        ...item,
        cart: Number(cartId),
        product_variant: Number(variantId),
        cart_display_label: cartDisplayLabel,
        product_variant_label: variantDisplayLabel,
      };
    },
    []
  );

  const fetchCartItems = useCallback(async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;
      //if (!enabled) return;
      const data = await api.get<CartItem[]>("/cart-items/", token || undefined);
      const enriched = data.map((item) =>
        enrichCartItemWithRelations(item, carts, productVariants, products, users)
      );
      setCartItems(enriched);
    } catch (err: any) {
      console.error("Failed to fetch cart items:", err);
    }
  }, [carts, productVariants, products, users, enrichCartItemWithRelations, getAuthToken]);

  const addCartItem = async (newItem: Omit<CartItem, "id" | "added_at">) => {
    const token = await getAuthToken();
    const payload = {
      cart: Number(newItem.cart),
      product_variant: Number(newItem.product_variant),
      quantity: Number(newItem.quantity),
    };
    const created = await api.post<CartItem>("/cart-items/", payload, token || undefined);
    const enriched = enrichCartItemWithRelations(created, carts, productVariants, products, users);
    setCartItems((prev) => [enriched, ...prev]);
  };

  const updateCartItem = async (id: number | string, updatedFields: Partial<CartItem>) => {
    const token = await getAuthToken();
    const payload = {
      ...updatedFields,
      ...(updatedFields.cart !== undefined && { cart: Number(updatedFields.cart) }),
      ...(updatedFields.product_variant !== undefined && { product_variant: Number(updatedFields.product_variant) }),
      ...(updatedFields.quantity !== undefined && { quantity: Number(updatedFields.quantity) }),
    };
    const updated = await api.patch<CartItem>(`/cart-items/${id}/`, payload, token || undefined);
    const enriched = enrichCartItemWithRelations(updated, carts, productVariants, products, users);
    setCartItems((prev) => prev.map((item) => (item.id === id ? enriched : item)));
  };

  const deleteCartItem = async (id: number | string) => {
    const token = await getAuthToken();
    await api.delete(`/cart-items/${id}/`, token || undefined);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    if (carts.length >= 0 && productVariants.length >= 0) {
      if (!cartItems.length) fetchCartItems();
    }
  }, [carts, productVariants, accessToken, cartItems, fetchCartItems]);

  const fetchNotifications = useCallback(async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;
      //if (!enabled) return;
      const data = await api.get<Notification[]>("/notifications/", token || undefined);
      const enriched = data.map((n) => enrichNotificationWithUserEmail(n, users));
      setNotifications(enriched);
    } catch (err: any) {
      console.error("Failed to fetch notifications:", err);
    }
  }, [users, enrichNotificationWithUserEmail, getAuthToken]);

  const addNotification = async (data: Omit<Notification, "id" | "created_at">) => {
    const token = await getAuthToken();
    const payload = {
      ...data,
      user: Number(data.user),
    };
    const created = await api.post<Notification>("/notifications/", payload, token || undefined);
    const enriched = enrichNotificationWithUserEmail(created, users);
    setNotifications((prev) => [enriched, ...prev]);
  };

  const updateNotification = async (id: number | string, data: Partial<Notification>) => {
    const token = await getAuthToken();
    const payload = {
      ...data,
      ...(data.user !== undefined && { user: Number(data.user) }),
    };
    const updated = await api.patch<Notification>(`/notifications/${id}/`, payload, token || undefined);
    const enriched = enrichNotificationWithUserEmail(updated, users);
    setNotifications((prev) => prev.map((n) => (n.id === id ? enriched : n)));
  };

  const deleteNotification = async (id: number | string) => {
    const token = await getAuthToken();
    await api.delete(`/notifications/${id}/`, token || undefined);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    console.log(notifications.length, "notifications.length")
    if (users.length > 0) {
      if (!notifications.length) {
        console.log("Notifications not found")
        fetchNotifications();
      }
    }
    // }, [users, accessToken, notifications, fetchNotifications]);
  }, [users, accessToken, notifications, fetchNotifications]);
  const fetchAttributeValues = useCallback(async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;
      //if (!enabled) return;
      const data = await api.get<AttributeValue[]>("/attribute-values/", token || undefined);
      setAttributeValues(data);
    } catch (err: any) {
      console.error("Failed to fetch attribute values:", err);
    }
  }, [getAuthToken]);

  const fetchProductVariants = useCallback(async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;
      //if (!enabled) return;
      const data = await api.get<ProductVariant[]>("/product-variants/", token || undefined);
      const mapped = data.map((v) => enrichVariantWithRelationNames(v, products));
      setProductVariants(mapped);
    } catch (err: any) {
      console.error("Failed to fetch product variants:", err);
    }
  }, [products, enrichVariantWithRelationNames, getAuthToken]);

  const addProductVariant = async (newVariant: FormData | Partial<ProductVariant>) => {
    const token = await getAuthToken();
    const response = await api.post<ProductVariant>("/product-variants/", newVariant, token || undefined);
    const enriched = enrichVariantWithRelationNames(response, products);
    setProductVariants((prev) => [enriched, ...prev]);
  };

  const updateProductVariant = async (
    id: number | string,
    updatedFields: FormData | Partial<ProductVariant>
  ) => {
    const token = await getAuthToken();
    const response = await api.patch<ProductVariant>(`/product-variants/${id}/`, updatedFields, token || undefined);
    const enriched = enrichVariantWithRelationNames(response, products);
    setProductVariants((prev) => prev.map((v) => (v.id === id ? enriched : v)));
  };

  const deleteProductVariant = async (id: number | string) => {
    const token = await getAuthToken();
    await api.delete(`/product-variants/${id}/`, token || undefined);
    setProductVariants((prev) => prev.filter((v) => v.id !== id));
  };

  useEffect(() => {
    if (!attributeValues.length) fetchAttributeValues();
  }, [accessToken, attributeValues, fetchAttributeValues]);

  useEffect(() => {
    if (products.length > 0) {
      if (!productVariants.length) fetchProductVariants();
    }
  }, [products, accessToken, productVariants, fetchProductVariants]);


  // Attribute Values CRUD Actions
  const addAttributeValue = async (newAttrVal: Omit<AttributeValue, "id">) => {
    const token = await getAuthToken();
    const created = await api.post<AttributeValue>("/attribute-values/", newAttrVal, token || undefined);
    setAttributeValues((prev) => [created, ...prev]);
  };

  const updateAttributeValue = async (id: number | string, updatedFields: Partial<AttributeValue>) => {
    const token = await getAuthToken();
    const updated = await api.patch<AttributeValue>(`/attribute-values/${id}/`, updatedFields, token || undefined);
    setAttributeValues((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  const deleteAttributeValue = async (id: number | string) => {
    const token = await getAuthToken();
    await api.delete(`/attribute-values/${id}/`, token || undefined);
    setAttributeValues((prev) => prev.filter((item) => item.id !== id));
  };

  // Orders CRUD
  // const addOrder = async (newOrder: Omit<Order, "id">) => {
  //   const created = await api.post<Order>("/orders/", newOrder);
  //   setOrders((prev) => [created, ...prev]);
  // };

  // const updateOrder = async (id: string | number, updated: Partial<Order>) => {
  //   const res = await api.patch<Order>(`/orders/${id}/`, updated);
  //   setOrders((prev) => prev.map((ord) => (ord.id === id ? res : ord)));
  // };

  // const deleteOrder = async (id: string | number) => {
  //   await api.delete(`/orders/${id}/`);
  //   setOrders((prev) => prev.filter((o) => o.id !== id));
  // };
  const addOrder = async (orderData: Partial<Order>) => {
    const token = await getAuthToken();
    const newOrder = await api.post<Order>("/orders/", orderData, token || undefined);
    setOrders((prev) => [enrichOrderWithRelationNames(newOrder, users, addresses), ...prev]);
    const userId = newOrder.user_id ?? (typeof newOrder.user === "object" ? newOrder.user?.id : newOrder.user);
    const matchedUser = users.find((u) => String(u.id) === String(userId));
    const response = await api.post<Notification>(`/notifications/`, { notification_type: "system", title: "New order placed", message: `Order #${newOrder.order_number} placed by ${matchedUser?.email}. Total: ${newOrder.currency} ${newOrder.grand_total}` }, token || undefined);
    setNotifications((prev) => [response, ...prev]);


  };

  const updateOrder = async (id: string | number, orderData: Partial<Order>) => {
    const token = await getAuthToken();
    const updated = await api.patch<Order>(`/orders/${id}/`, orderData, token || undefined);
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? enrichOrderWithRelationNames(updated, users, addresses) : o))
    );
  };

  const deleteOrder = async (id: string | number) => {
    const token = await getAuthToken();
    await api.delete(`/orders/${id}/`, token || undefined);
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  // const updateOrderStatus = async (id: string | number, status: OrderStatus) => {
  //   await updateOrder(id, { status });
  // };


  const fetchOrderItems = useCallback(async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;
      //if (!enabled) return;
      const data = await api.get<OrderItem[]>("/order-items/", token || undefined);
      const enriched = data.map((item) =>
        enrichOrderItemWithRelations(item, orders, products, productVariants, users)
      );
      setOrderItems(enriched);
    } catch (err: any) {
      console.error("Failed to fetch order items:", err);
    }
  }, [orders, products, productVariants, users, enrichOrderItemWithRelations, getAuthToken]);
  const addOrderItem = async (newItem: Omit<OrderItem, "id" | "subtotal">) => {
    const token = await getAuthToken();
    const payload = {
      ...newItem,
      order: Number(newItem.order),
      product: newItem.product ? Number(newItem.product) : null,
      product_variant: newItem.product_variant ? Number(newItem.product_variant) : null,
      unit_price: Number(newItem.unit_price),
      quantity: Number(newItem.quantity),
      subtotal: (Number(newItem.unit_price) * Number(newItem.quantity)).toFixed(2),
    };
    const created = await api.post<OrderItem>("/order-items/", payload, token || undefined);
    const enriched = enrichOrderItemWithRelations(created, orders, products, productVariants, users);
    setOrderItems((prev) => [enriched, ...prev]);
  };

  const updateOrderItem = async (id: number | string, updatedFields: Partial<OrderItem>) => {
    const token = await getAuthToken();
    const payload = {
      ...updatedFields,
      ...(updatedFields.order !== undefined && { order: Number(updatedFields.order) }),
      ...(updatedFields.product !== undefined && { product: updatedFields.product ? Number(updatedFields.product) : null }),
      ...(updatedFields.product_variant !== undefined && { product_variant: updatedFields.product_variant ? Number(updatedFields.product_variant) : null }),
      ...(updatedFields.unit_price !== undefined && { unit_price: Number(updatedFields.unit_price) }),
      ...(updatedFields.quantity !== undefined && { quantity: Number(updatedFields.quantity) }),
    };
    if (payload.unit_price !== undefined || payload.quantity !== undefined) {
      const current = orderItems.find((i) => String(i.id) === String(id));
      const price = payload.unit_price ?? Number(current?.unit_price || 0);
      const qty = payload.quantity ?? Number(current?.quantity || 1);
      payload.subtotal = (Number(price) * Number(qty)).toFixed(2);
    }

    const updated = await api.patch<OrderItem>(`/order-items/${id}/`, payload, token || undefined);
    const enriched = enrichOrderItemWithRelations(updated, orders, products, productVariants, users);
    setOrderItems((prev) => prev.map((item) => (item.id === id ? enriched : item)));
  };

  const deleteOrderItem = async (id: number | string) => {
    const token = await getAuthToken();
    await api.delete(`/order-items/${id}/`, token || undefined);
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    if (orders.length >= 0 && products.length >= 0 && productVariants.length >= 0) {
      if (!orderItems.length) fetchOrderItems();
    }
  }, [orders, products, productVariants, accessToken, orderItems, fetchOrderItems]);



  const fetchPayments = useCallback(async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;
      //if (!enabled) return;
      const data = await api.get<Payment[]>("/payments/", token || undefined);
      const enriched = data.map((p) => enrichPaymentWithOrderDetails(p, orders, users));
      setPayments(enriched);
    } catch (err: any) {
      console.error("Failed to fetch payments:", err);
    }
  }, [orders, users, enrichPaymentWithOrderDetails, getAuthToken]);

  const addPayment = async (newPayment: Omit<Payment, "id" | "created_at">) => {
    const token = await getAuthToken();
    const payload = {
      ...newPayment,
      order: Number(newPayment.order),
      amount: Number(newPayment.amount),
    };
    const created = await api.post<Payment>("/payments/", payload, token || undefined);
    const enriched = enrichPaymentWithOrderDetails(created, orders, users);
    setPayments((prev) => [enriched, ...prev]);
    if (newPayment.status == "failed") {
      const response = await api.post<Notification>(`/notifications/`, { notification_type: "system", title: "Payment failed", message: `Payment failed for Order #${enriched.order_number_display} placed by ${enriched.order_display_label}. Total: $${enriched.amount}` }, token || undefined);
      setNotifications((prev) => [response, ...prev]);
    }
  };

  const updatePayment = async (id: number | string, updatedFields: Partial<Payment>) => {
    const token = await getAuthToken();
    const payload = {
      ...updatedFields,
      ...(updatedFields.order !== undefined && { order: Number(updatedFields.order) }),
      ...(updatedFields.amount !== undefined && { amount: Number(updatedFields.amount) }),
    };
    const updated = await api.patch<Payment>(`/payments/${id}/`, payload, token || undefined);
    const enriched = enrichPaymentWithOrderDetails(updated, orders, users);
    setPayments((prev) => prev.map((p) => (p.id === id ? enriched : p)));
    console.log("updatedFields.status", updatedFields.status);
    if (updatedFields.status === "failed") {
      console.log("hereinfailed")
      const response = await api.post<Notification>(`/notifications/`, { notification_type: "system", title: "Payment failed", message: `Payment failed for Order #${enriched.order_number_display} placed by ${enriched.user_email_display}. Total: $${enriched.amount}` }, token || undefined);
      setNotifications((prev) => [response, ...prev]);
    }
  };

  const deletePayment = async (id: number | string) => {
    const token = await getAuthToken();
    await api.delete(`/payments/${id}/`, token || undefined);
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    if (orders.length >= 0) {
      if (!payments.length) fetchPayments();
    }
  }, [orders, accessToken, payments, fetchPayments]);


  // ShippingMethods State & Modals
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingMethodForView, setSelectedShippingMethodForView] = useState<ShippingMethod | null>(null);
  const [selectedShippingMethodForEdit, setSelectedShippingMethodForEdit] = useState<ShippingMethod | null>(null);
  const [isAddShippingMethodModalOpen, setIsAddShippingMethodModalOpen] = useState(false);

  // ShippingMethods CRUD Operations
  const fetchShippingMethods = useCallback(async () => {
    try {

      const token = await getAuthToken();
      if (!token) return;
      //if (!enabled) return;
      //if (!token) return;
      const data = await api.getWithToken<ShippingMethod[]>("/shipping-methods/", token ?? "");
      setShippingMethods(data);
    } catch (err: any) {
      console.error("Failed to fetch shipping methods:", err);
    }
  }, [getAuthToken]);

  const addShippingMethod = async (newMethod: Omit<ShippingMethod, "id">) => {
    const token = await getAuthToken();
    const payload = {
      ...newMethod,
      cost: Number(newMethod.cost),
      estimated_days_min: Number(newMethod.estimated_days_min),
      estimated_days_max: Number(newMethod.estimated_days_max),
    };
    const created = await api.post<ShippingMethod>("/shipping-methods/", payload, token || undefined);
    setShippingMethods((prev) => [created, ...prev]);
  };

  const updateShippingMethod = async (id: number | string, updatedFields: Partial<ShippingMethod>) => {
    const token = await getAuthToken();
    const payload = {
      ...updatedFields,
      ...(updatedFields.cost !== undefined && { cost: Number(updatedFields.cost) }),
      ...(updatedFields.estimated_days_min !== undefined && { estimated_days_min: Number(updatedFields.estimated_days_min) }),
      ...(updatedFields.estimated_days_max !== undefined && { estimated_days_max: Number(updatedFields.estimated_days_max) }),
    };
    const updated = await api.patch<ShippingMethod>(`/shipping-methods/${id}/`, payload, token || undefined);
    setShippingMethods((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  const deleteShippingMethod = async (id: number | string) => {
    const token = await getAuthToken();
    await api.delete(`/shipping-methods/${id}/`, token || undefined);
    setShippingMethods((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    if (!shippingMethods.length) fetchShippingMethods();
  }, [accessToken, shippingMethods, fetchShippingMethods]);



  // Shipments State & Modals
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipmentForView, setSelectedShipmentForView] = useState<Shipment | null>(null);
  const [selectedShipmentForEdit, setSelectedShipmentForEdit] = useState<Shipment | null>(null);
  const [isAddShipmentModalOpen, setIsAddShipmentModalOpen] = useState<boolean>(false);

  // Foreign Key Helper for Shipments (Maps Order + User Email, and ShippingMethod Name)
  const enrichShipmentWithRelations = useCallback(
    (
      shipment: any,
      orderList: Order[],
      shippingMethodList: ShippingMethod[],
      userList: User[]
    ): Shipment => {
      const orderId = shipment.order_id ?? (typeof shipment.order === "object" ? shipment.order?.id : shipment.order);
      const shippingMethodId =
        shipment.shipping_method_id ??
        (typeof shipment.shipping_method === "object" ? shipment.shipping_method?.id : shipment.shipping_method);

      // 1. Resolve Order & associated User Email
      const matchedOrder = orderList.find((o) => String(o.id) === String(orderId));
      const userId = matchedOrder?.user_id ?? (typeof matchedOrder?.user === "object" ? (matchedOrder.user as any)?.id : matchedOrder?.user);
      const matchedUser = userList.find((u) => String(u.id) === String(userId));

      const orderNumDisplay = matchedOrder?.order_number || `Order #${orderId}`;
      const userEmailDisplay = matchedUser?.email || (matchedOrder as any)?.user_email || "Guest / N/A";
      const orderDisplayLabel = `${orderNumDisplay} (${userEmailDisplay})`;

      // 2. Resolve Shipping Method Name
      const matchedShippingMethod = shippingMethodList.find((sm) => String(sm.id) === String(shippingMethodId));
      const shippingMethodName = matchedShippingMethod?.name || (typeof shipment.shipping_method === "object" ? shipment.shipping_method?.name : "N/A");

      return {
        ...shipment,
        order: Number(orderId),
        shipping_method: shippingMethodId ? Number(shippingMethodId) : null,
        order_number_display: orderNumDisplay,
        user_email_display: userEmailDisplay,
        order_display_label: orderDisplayLabel,
        shipping_method_name_display: shippingMethodName,
      };
    },
    []
  );

  // Fetch Shipments API
  const fetchShipments = useCallback(async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;
      //if (!enabled) return;
      const data = await api.get<Shipment[]>("/shipments/", token || undefined);
      const enriched = data.map((item) =>
        enrichShipmentWithRelations(item, orders, shippingMethods, users)
      );
      setShipments(enriched);
    } catch (err: any) {
      console.error("Failed to fetch shipments:", err);
    }
  }, [orders, shippingMethods, users, enrichShipmentWithRelations, getAuthToken]);
  // useEffect(() => {
  //   if (!shipments.length) fetchShipments();
  // }, [accessToken, shipments, fetchShipments]);

  // Add Shipment
  const addShipment = async (newShipment: Omit<Shipment, "id">) => {
    const token = await getAuthToken();
    const payload = {
      ...newShipment,
      order: Number(newShipment.order),
      shipping_method: newShipment.shipping_method ? Number(newShipment.shipping_method) : null,
      shipped_at: newShipment.shipped_at || null,
      delivered_at: newShipment.delivered_at || null,
    };
    const created = await api.post<Shipment>("/shipments/", payload, token || undefined);
    const enriched = enrichShipmentWithRelations(created, orders, shippingMethods, users);
    setShipments((prev) => [enriched, ...prev]);
  };

  // Update Shipment
  const updateShipment = async (id: number | string, updatedFields: Partial<Shipment>) => {
    const token = await getAuthToken();
    const payload = {
      ...updatedFields,
      ...(updatedFields.order !== undefined && { order: Number(updatedFields.order) }),
      ...(updatedFields.shipping_method !== undefined && {
        shipping_method: updatedFields.shipping_method ? Number(updatedFields.shipping_method) : null,
      }),
      ...(updatedFields.shipped_at !== undefined && { shipped_at: updatedFields.shipped_at || null }),
      ...(updatedFields.delivered_at !== undefined && { delivered_at: updatedFields.delivered_at || null }),
    };
    const updated = await api.patch<Shipment>(`/shipments/${id}/`, payload, token || undefined);
    const enriched = enrichShipmentWithRelations(updated, orders, shippingMethods, users);
    setShipments((prev) => prev.map((item) => (item.id === id ? enriched : item)));
  };

  // Delete Shipment
  const deleteShipment = async (id: number | string) => {
    const token = await getAuthToken();
    await api.delete(`/shipments/${id}/`, token || undefined);
    setShipments((prev) => prev.filter((item) => item.id !== id));
  };

  // Auto-fetch effect for Shipments when dependent relational data is available
  useEffect(() => {
    if (orders.length >= 0 && shippingMethods.length >= 0) {
      if (!shipments.length) fetchShipments();

    }
  }, [orders, shippingMethods, accessToken, shipments, fetchShipments]);

  // Customers CRUD
  const addCustomer = async (
    newCust: Omit<Customer, "id" | "joinDate" | "totalOrders" | "totalSpend">
  ) => {
    const created = await api.post<Customer>("/customers/", newCust);
    setCustomers((prev) => [created, ...prev]);
  };

  const updateCustomer = async (id: string | number, updated: Partial<Customer>) => {
    const res = await api.patch<Customer>(`/customers/${id}/`, updated);
    setCustomers((prev) => prev.map((c) => (c.id === id ? res : c)));
  };

  const deleteCustomer = async (id: string | number) => {
    await api.delete(`/customers/${id}/`);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  // Categories CRUD
  const addCategory = async (newCat: Omit<CategoryItem, "id"> | FormData) => {
    const token = await getAuthToken();
    const created = await api.post<CategoryItem>("/categories/", newCat, token || undefined);
    setCategories((prev) => [created, ...prev]);
  };

  const updateCategory = async (id: string | number, updated: Partial<CategoryItem> | FormData) => {
    const token = await getAuthToken();
    const res = await api.patch<CategoryItem>(`/categories/${id}/`, updated, token || undefined);
    setCategories((prev) => prev.map((cat) => (cat.id === id ? res : cat)));
  };

  const deleteCategory = async (id: string | number) => {
    const token = await getAuthToken();
    await api.delete(`/categories/${id}/`, token || undefined);
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };


  // Users CRUD
  const addUser = async (user: Partial<User>) => {
    const token = await getAuthToken();
    const created = await api.post<User>("/users/", user, token || undefined);
    setUsers((prev) => [...prev, created]);
  };

  const updateUser = async (id: number | string, user: Partial<User>) => {
    const token = await getAuthToken();
    const updated = await api.patch<User>(`/users/${id}/`, user, token || undefined);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
  };

  const deleteUser = async (id: number | string) => {
    const token = await getAuthToken();
    await api.delete(`/users/${id}/`, token || undefined);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };
  // Address Modal & State
  const [selectedAddressForView, setSelectedAddressForView] = useState<Address | null>(null);
  const [selectedAddressForEdit, setSelectedAddressForEdit] = useState<Address | null>(null);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);

  // Address CRUD Actions
  const fetchAddresses = useCallback(async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;
      //if (!enabled) return;
      const data = await api.get<Address[]>("/addresses/", token || undefined);
      const enriched = data.map((addr) => enrichAddressWithUserEmail(addr, users));
      setAddresses(enriched);
    } catch (err: any) {
      console.error("Failed to fetch addresses:", err);
    }
  }, [users, enrichAddressWithUserEmail, getAuthToken]);
  useEffect(() => {
    if (!addresses.length) fetchAddresses();
  }, [accessToken, addresses, fetchAddresses]);
  const addAddress = async (newAddr: Omit<Address, "id" | "created_at">) => {
    const token = await getAuthToken();
    const payload = {
      ...newAddr,
      user: Number(newAddr.user),
    };
    const created = await api.post<Address>("/addresses/", payload, token || undefined);
    const enriched = enrichAddressWithUserEmail(created, users);
    setAddresses((prev) => [enriched, ...prev]);
  };

  const updateAddress = async (id: number | string, updatedFields: Partial<Address>) => {
    const token = await getAuthToken();
    const payload = {
      ...updatedFields,
      ...(updatedFields.user !== undefined && { user: Number(updatedFields.user) }),
    };
    const updated = await api.patch<Address>(`/addresses/${id}/`, payload, token || undefined);
    const enriched = enrichAddressWithUserEmail(updated, users);
    setAddresses((prev) => prev.map((a) => (a.id === id ? enriched : a)));
  };

  const deleteAddress = async (id: number | string) => {
    const token = await getAuthToken();
    await api.delete(`/addresses/${id}/`, token || undefined);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };
  // Notifications & Messages
  const markNotificationRead = async (id: number) => {
    console.log(id);
    try {
      const token = await getAuthToken();
      await api.patch<Notification>(`/notifications/${id}/`, { is_read: true }, token || undefined);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (err: any) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // const markAllNotificationsRead = async () => {
  //   try {
  //     const token = await getAuthToken();
  //     notifications.map(async notify => {
  //       await api.patch<Notification>(`/notifications/${notify.id}/`, { is_read: true }, token || undefined);
  //     })

  //     setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  //   } catch (err: any) {
  //     console.error("Failed to mark all notifications as read:", err);
  //   }
  // };
  const markAllNotificationsRead = async () => {
    const unread = notifications.filter((n) => !n.is_read);
    if (!unread.length) return;

    // optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

    try {
      const token = await getAuthToken();

      // wait for ALL requests to finish
      const results = await Promise.allSettled(
        unread.map((n) =>
          api.patch<Notification>(`/notifications/${n.id}/`, { is_read: true }, token || undefined)
        )
      );

      // roll back only the ones that failed
      const failedIds = unread
        .filter((_, i) => results[i].status === "rejected")
        .map((n) => n.id);

      if (failedIds.length) {
        console.error("Failed to mark some notifications as read:", failedIds);
        setNotifications((prev) =>
          prev.map((n) => (failedIds.includes(n.id) ? { ...n, is_read: false } : n))
        );
      }
    } catch (err: any) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };
  // const markNotificationRead = (id: number) => {
  //   console.log(id);
  //   updateNotification(id, { is_read: true });
  // };

  // const markAllNotificationsRead = () => {
  //   setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  // };

  // Fetch Testimonials
  // const fetchTestimonials = useCallback(async () => {
  //   try {
  //     const data = await api.get<Testimonial[]>("/testimonials/");
  //     setTestimonials(data);
  //   } catch (err: any) {
  //     console.error("Failed to fetch testimonials:", err);
  //   }
  // }, []);

  // Helper to ensure we have a valid auth token

  // Testimonials CRUD Operations
  const addTestimonial = async (newTestimonial: Omit<Testimonial, "id" | "created_at">) => {
    const token = await getAuthToken();
    const created = await api.post<Testimonial>("/testimonials/", newTestimonial, token || undefined);
    setTestimonials((prev) => [created, ...prev]);
  };

  const updateTestimonial = async (id: number | string, updatedFields: Partial<Testimonial>) => {
    const token = await getAuthToken();
    const response = await api.patch<Testimonial>(`/testimonials/${id}/`, updatedFields, token || undefined);
    setTestimonials((prev) => prev.map((t) => (t.id === id ? response : t)));
  };

  const deleteTestimonial = async (id: number | string) => {
    const token = await getAuthToken();
    await api.delete(`/testimonials/${id}/`, token || undefined);
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };


  // Socials State & Modals
  const [socials, setSocials] = useState<Social[]>([]);
  const [selectedSocialForView, setSelectedSocialForView] = useState<Social | null>(null);
  const [selectedSocialForEdit, setSelectedSocialForEdit] = useState<Social | null>(null);
  const [isAddSocialModalOpen, setIsAddSocialModalOpen] = useState<boolean>(false);

  // Socials CRUD Operations
  const fetchSocials = useCallback(async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;
      //if (!enabled) return;
      const data = await api.get<Social[]>("/socials/", token || undefined);
      setSocials(data);
    } catch (err: any) {
      console.error("Failed to fetch socials:", err);
    }
  }, [getAuthToken]);

  const addSocial = async (newSocial: Omit<Social, "id" | "created_at">) => {
    const token = await getAuthToken();
    const created = await api.post<Social>("/socials/", newSocial, token || undefined);
    setSocials((prev) => [created, ...prev]);
  };

  const updateSocial = async (id: number | string, updatedFields: Partial<Social>) => {
    const token = await getAuthToken();
    const updated = await api.patch<Social>(`/socials/${id}/`, updatedFields, token || undefined);
    setSocials((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };

  const deleteSocial = async (id: number | string) => {
    const token = await getAuthToken();
    await api.delete(`/socials/${id}/`, token || undefined);
    setSocials((prev) => prev.filter((s) => s.id !== id));
  };

  // useEffect(() => {
  //   fetchSocials();
  // }, [fetchSocials]);
  useEffect(() => {
    if (!socials.length) fetchSocials();   // empty array → fetch → new empty array → fetch...
  }, [socials, accessToken, fetchSocials]);
  const unreadNotificationsCount = notifications.filter((n) => !n.is_read && n.notification_type == "system").length;
  const unreadMessagesCount = messages.filter((m) => m.unread).length;

  return (
    <AdminContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebarCollapsed,
        theme,
        toggleTheme,
        isLoading,
        error,

        products,
        views,
        categories,
        brands,
        orders,
        customers,

        fetchProducts,
        fetchViews,
        fetchCategories,
        fetchBrands,
        fetchOrders,
        //fetchCustomers,

        // Brands
        addBrand,
        updateBrand,
        deleteBrand,
        selectedBrandForView,
        setSelectedBrandForView,
        selectedBrandForEdit,
        setSelectedBrandForEdit,
        isAddBrandModalOpen,
        setIsAddBrandModalOpen,

        // Products
        addProduct,
        updateProduct,
        deleteProduct,
        selectedProductForView,
        setSelectedProductForView,
        selectedProductForEdit,
        setSelectedProductForEdit,
        isAddProductModalOpen,
        setIsAddProductModalOpen,


        // Warehouses
        warehouses,
        fetchWarehouses,
        addWarehouse,
        updateWarehouse,
        deleteWarehouse,
        selectedWarehouseForView,
        setSelectedWarehouseForView,
        selectedWarehouseForEdit,
        setSelectedWarehouseForEdit,
        isAddWarehouseModalOpen,
        setIsAddWarehouseModalOpen,


        // Inventory Context Value
        inventories,
        fetchInventories,
        addInventory,
        updateInventory,
        deleteInventory,
        selectedInventoryForView,
        setSelectedInventoryForView,
        selectedInventoryForEdit,
        setSelectedInventoryForEdit,
        isAddInventoryModalOpen,
        setIsAddInventoryModalOpen,


        // Place these new fields inside the AdminContextValue interface first (above).

        // Carts CRUD & State
        carts,
        fetchCarts,
        addCart,
        updateCart,
        deleteCart,
        selectedCartForView,
        setSelectedCartForView,
        selectedCartForEdit,
        setSelectedCartForEdit,
        isAddCartModalOpen,
        setIsAddCartModalOpen,


        // CartItems CRUD & State
        cartItems,
        fetchCartItems,
        addCartItem,
        updateCartItem,
        deleteCartItem,
        selectedCartItemForView,
        setSelectedCartItemForView,
        selectedCartItemForEdit,
        setSelectedCartItemForEdit,
        isAddCartItemModalOpen,
        setIsAddCartItemModalOpen,

        // Notifications CRUD & Modals
        notifications,
        fetchNotifications,
        addNotification,
        updateNotification,
        deleteNotification,
        selectedNotificationForView,
        setSelectedNotificationForView,
        selectedNotificationForEdit,
        setSelectedNotificationForEdit,
        isAddNotificationModalOpen,
        setIsAddNotificationModalOpen,

        // Product Variants & Attributes
        productVariants,
        attributeValues,
        fetchProductVariants,
        fetchAttributeValues,
        addProductVariant,
        updateProductVariant,
        deleteProductVariant,
        selectedProductVariantForView,
        setSelectedProductVariantForView,
        selectedProductVariantForEdit,
        setSelectedProductVariantForEdit,
        isAddProductVariantModalOpen,
        setIsAddProductVariantModalOpen,

        // Attribute Values CRUD & Modals
        addAttributeValue,
        updateAttributeValue,
        deleteAttributeValue,
        selectedAttributeValueForView,
        setSelectedAttributeValueForView,
        selectedAttributeValueForEdit,
        setSelectedAttributeValueForEdit,
        isAddAttributeValueModalOpen,
        setIsAddAttributeValueModalOpen,

        // Orders
        users,
        isAddOrderModalOpen,
        setIsAddOrderModalOpen,
        selectedOrderForModal,
        setSelectedOrderForModal,
        selectedOrderForEdit,
        setSelectedOrderForEdit,
        fetchUsersAndAddresses,

        addOrder,
        updateOrder,
        deleteOrder,

        // OrderItems Context Value
        orderItems,
        fetchOrderItems,
        addOrderItem,
        updateOrderItem,
        deleteOrderItem,
        selectedOrderItemForView,
        setSelectedOrderItemForView,
        selectedOrderItemForEdit,
        setSelectedOrderItemForEdit,
        isAddOrderItemModalOpen,
        setIsAddOrderItemModalOpen,
        // updateOrderStatus,


        payments,
        fetchPayments,
        addPayment,
        updatePayment,
        deletePayment,
        selectedPaymentForView,
        setSelectedPaymentForView,
        selectedPaymentForEdit,
        setSelectedPaymentForEdit,
        isAddPaymentModalOpen,
        setIsAddPaymentModalOpen,


        // ShippingMethods
        shippingMethods,
        fetchShippingMethods,
        addShippingMethod,
        updateShippingMethod,
        deleteShippingMethod,
        selectedShippingMethodForView,
        setSelectedShippingMethodForView,
        selectedShippingMethodForEdit,
        setSelectedShippingMethodForEdit,
        isAddShippingMethodModalOpen,
        setIsAddShippingMethodModalOpen,


        // Add inside provider value:
        shipments,
        fetchShipments,
        addShipment,
        updateShipment,
        deleteShipment,
        selectedShipmentForView,
        setSelectedShipmentForView,
        selectedShipmentForEdit,
        setSelectedShipmentForEdit,
        isAddShipmentModalOpen,
        setIsAddShipmentModalOpen,

        // Customers
        addCustomer,
        updateCustomer,
        deleteCustomer,
        selectedCustomerForView,
        setSelectedCustomerForView,
        selectedCustomerForEdit,
        setSelectedCustomerForEdit,
        isAddCustomerModalOpen,
        setIsAddCustomerModalOpen,

        // Categories
        addCategory,
        updateCategory,
        deleteCategory,
        selectedCategoryForView,
        setSelectedCategoryForView,
        selectedCategoryForEdit,
        setSelectedCategoryForEdit,
        isAddCategoryModalOpen,
        setIsAddCategoryModalOpen,

        // Users
        addUser,
        updateUser,
        deleteUser,
        selectedUserForView,
        setSelectedUserForView,
        selectedUserForEdit,
        setSelectedUserForEdit,
        isAddUserModalOpen,
        setIsAddUserModalOpen,

        // Notifications & Messages
        //notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationsCount,
        messages,
        unreadMessagesCount,

        setNotifications,

        // Search
        searchQuery,
        setSearchQuery,

        // Address State & Actions
        addresses,
        fetchAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        selectedAddressForView,
        setSelectedAddressForView,
        selectedAddressForEdit,
        setSelectedAddressForEdit,
        isAddAddressModalOpen,
        setIsAddAddressModalOpen,


        // Testimonials
        testimonials,
        fetchTestimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        selectedTestimonialForView,
        setSelectedTestimonialForView,
        selectedTestimonialForEdit,
        setSelectedTestimonialForEdit,
        isAddTestimonialModalOpen,
        setIsAddTestimonialModalOpen,


        socials,
        fetchSocials,
        addSocial,
        updateSocial,
        deleteSocial,
        selectedSocialForView,
        setSelectedSocialForView,
        selectedSocialForEdit,
        setSelectedSocialForEdit,
        isAddSocialModalOpen,
        setIsAddSocialModalOpen,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}