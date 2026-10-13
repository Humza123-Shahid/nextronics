import re
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework import viewsets
from .models import User, Address, Category, Brand, Product, ProductVariant, AttributeValue, Inventory, Warehouse, Cart, CartItem, Order, OrderItem, Payment, ShippingMethod, Shipment, Notification, Testimonial, Social,PageVisit
from .serializers import UserSerializer, AddressSerializer, CategorySerializer, BrandSerializer, ProductSerializer, ProductVariantSerializer, AttributeValueSerializer, InventorySerializer, WarehouseSerializer, CartSerializer, CartItemSerializer, OrderSerializer, OrderItemSerializer, PaymentSerializer, ShippingMethodSerializer, ShipmentSerializer, NotificationSerializer, TestimonialSerializer, SocialSerializer,PageVisitSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer

class AttributeValueViewSet(viewsets.ModelViewSet):
    queryset = AttributeValue.objects.all()
    serializer_class = AttributeValueSerializer

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer

class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class ShippingMethodViewSet(viewsets.ModelViewSet):
    queryset = ShippingMethod.objects.all()
    serializer_class = ShippingMethodSerializer

class ShipmentViewSet(viewsets.ModelViewSet):
    queryset = Shipment.objects.all()
    serializer_class = ShipmentSerializer


class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer

class SocialViewSet(viewsets.ModelViewSet):
    queryset = Social.objects.all()
    serializer_class = SocialSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer


class PageVisitViewSet(viewsets.ModelViewSet):
    queryset = PageVisit.objects.all()
    serializer_class = PageVisitSerializer

    def perform_create(self, serializer):
        # 1. Get the User-Agent string from request headers
        user_agent = self.request.META.get('HTTP_USER_AGENT', '').lower()
        
        # 2. Match the string against common mobile and tablet patterns
        if re.search(r'(tablet|ipad|playbook|silk)|(android(?!.*mobile))', user_agent):
            detected_device = 'Tablet'
        elif re.search(r'(mobile|iphone|ipod|blackberry|android|kindle|opera mini|opera mobi)', user_agent):
            detected_device = 'Mobile'
        else:
            detected_device = 'Desktop' if user_agent else 'Unknown'

        # 3. Extract client IP address
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = self.request.META.get('REMOTE_ADDR')

        # 4. Associate authenticated user if available
        user = self.request.user if self.request.user.is_authenticated else None

        # 5. Save the data to the database
        serializer.save(
            device_type=detected_device,
            ip_address=ip,
            user=user
        )
