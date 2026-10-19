import re
from django.db.models import Q
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
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


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Authenticate user or admin, supporting both email/username and hashed/plain passwords."""
    data = request.data or {}
    identifier = str(data.get('username') or data.get('email') or '').strip()
    password = str(data.get('password') or '').strip()
    role = str(data.get('role') or '').lower()  # 'admin' or 'user'

    if not identifier or not password:
        return Response({'detail': 'Please provide both username/email and password.'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.filter(Q(username__iexact=identifier) | Q(email__iexact=identifier)).first()
    if not user:
        return Response({'detail': 'Invalid username/email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

    # Check password (support Django PBKDF2 hash or legacy plain string)
    password_valid = user.check_password(password) or (user.password == password)
    if not password_valid:
        return Response({'detail': 'Invalid username/email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.is_active:
        return Response({'detail': 'This account is currently disabled. Please contact support.'}, status=status.HTTP_403_FORBIDDEN)

    is_admin = bool(user.is_staff or user.is_superuser)

    # If the user specifically attempted to log into the Admin portal:
    if role == 'admin' and not is_admin:
        return Response({'detail': 'Access denied: This account does not possess administrator credentials.'}, status=status.HTTP_403_FORBIDDEN)

    return Response({
        'success': True,
        'message': 'Login successful',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone_number': user.phone_number,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'is_seller': user.is_seller,
            'is_verified': user.is_verified,
        },
        'isAdmin': is_admin,
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    """Register a new customer user (admin accounts are managed securely)."""
    data = request.data or {}
    username = str(data.get('username') or '').strip()
    email = str(data.get('email') or '').strip().lower()
    password = str(data.get('password') or '').strip()
    first_name = str(data.get('first_name') or '').strip()
    last_name = str(data.get('last_name') or '').strip()
    phone_number = str(data.get('phone_number') or '').strip()

    if not username:
        return Response({'detail': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)
    if not email:
        return Response({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
    if not password or len(password) < 5:
        return Response({'detail': 'Password must be at least 5 characters.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username__iexact=username).exists():
        return Response({'detail': 'This username is already taken. Please choose another.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email__iexact=email).exists():
        return Response({'detail': 'An account with this email address already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    user = User(
        username=username,
        email=email,
        first_name=first_name,
        last_name=last_name,
        phone_number=phone_number,
        is_staff=False,
        is_superuser=False,
        is_active=True,
    )
    user.set_password(password)
    user.save()

    return Response({
        'success': True,
        'message': 'Account created successfully',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone_number': user.phone_number,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'is_seller': user.is_seller,
            'is_verified': user.is_verified,
        },
        'isAdmin': False,
    }, status=status.HTTP_201_CREATED)

