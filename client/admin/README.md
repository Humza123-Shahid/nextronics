# Nextronics TailAdmin Admin Panel

A responsive, feature-packed TailAdmin admin panel built for the Nextronics e-commerce store with Tailwind CSS, React, and Next.js.

## Directory Structure

```
client/admin/
├── components/          # Reusable TailAdmin components (Sidebar, Header, MetricCard, Charts, OrdersTable, Modals)
├── context/             # AdminContext managing reactive state (theme, sidebar collapse, orders, products, etc.)
├── data/                # Initial realistic electronic mock data tailored to Nextronics
├── types/               # TypeScript interfaces for products, orders, customers, metrics
├── views/               # Complete views: DashboardView, ProductsView, OrdersView, CustomersView, AnalyticsView, SettingsView
└── index.ts             # Public barrel export
```

## Routes Integration

The admin panel is routed via Next.js App Router under `/admin`:
- `/admin` — eCommerce Dashboard (KPIs, revenue charts, device stats, recent orders)
- `/admin/products` — Product Catalog Management (category filters, stock levels, add/edit/delete)
- `/admin/orders` — Orders Management (order status transitions, invoice preview)
- `/admin/customers` — Customer Directory (spend metrics, order histories)
- `/admin/analytics` — Advanced Analytics & conversion funnels
- `/admin/settings` — Store Configuration & Security settings

## Key Features

- **Responsive Design**: Drawer menu on mobile screens, collapsible sidebar on desktop, fluid grids and horizontally scrollable tables.
- **Dark/Light Mode**: Signature TailAdmin toggle switch with automatic theme synchronization.
- **Interactive Visualizations**: Revenue & Sales area charts, profit bar charts, and visitor device donut diagrams.
- **Product & Order Management**: Modals for adding products and inspecting full order invoices with print capability.
- **Live Search & Filters**: Global instant search across orders, products, and customer records.
