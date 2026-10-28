from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, AddressViewSet, CategoryViewSet, BrandViewSet, ProductViewSet,
    ProductVariantViewSet, AttributeValueViewSet, InventoryViewSet, WarehouseViewSet,
    CartViewSet, CartItemViewSet, OrderViewSet, OrderItemViewSet, PaymentViewSet,
    ShippingMethodViewSet, ShipmentViewSet, NotificationViewSet, TestimonialViewSet,
    SocialViewSet, PageVisitViewSet, login_view, signup_view,admin_check,SpecialHighlightsView
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'addresses', AddressViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'brands', BrandViewSet)
router.register(r'products', ProductViewSet)
router.register(r'product-variants', ProductVariantViewSet)
router.register(r'attribute-values', AttributeValueViewSet)
router.register(r'inventories', InventoryViewSet)
router.register(r'warehouses', WarehouseViewSet)
router.register(r'carts', CartViewSet)
router.register(r'cart-items', CartItemViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order-items', OrderItemViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'shipping-methods', ShippingMethodViewSet)
router.register(r'shipments', ShipmentViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'socials', SocialViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'page-visits', PageVisitViewSet)

urlpatterns = [
    path('auth/login/', login_view, name='auth-login'),
    path('auth/signup/', signup_view, name='auth-signup'),
    path('admin/check/', admin_check),
    path('products/special-highlights/', SpecialHighlightsView.as_view()),
    path('', include(router.urls)),
]
