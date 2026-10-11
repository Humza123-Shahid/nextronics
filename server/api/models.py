import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify

# Create your models here.

def generate_order_number():
    # This function will be executed freshly for every new row
    return uuid.uuid4().hex[:12]


class User(AbstractUser):
    """Custom user model (extends Django's built-in auth user)."""
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    is_seller = models.BooleanField(default=False)
    date_of_birth = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Address(models.Model):
    """A user can have multiple shipping/billing addresses."""
    ADDRESS_TYPE_CHOICES = [('shipping', 'Shipping'), ('billing', 'Billing')]
 
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    address_type = models.CharField(max_length=10, choices=ADDRESS_TYPE_CHOICES)
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Category(models.Model):
    """Self-referential category tree (supports subcategories)."""
    name = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE,
                                null=True, blank=True, related_name='children')
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
 
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
 
    class Meta:
        verbose_name_plural = 'Categories'



class Brand(models.Model):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    logo = models.ImageField(upload_to='brands/', blank=True, null=True)
    description = models.TextField(blank=True)
 
 
class Product(models.Model):
    STATUS_CHOICES = [('draft', 'Draft'), ('active', 'Active'), ('archived', 'Archived')]
 
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    short_description = models.CharField(max_length=500, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    sku = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_at_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)  # MSRP / strike-through
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    tax_class = models.CharField(max_length=50, blank=True)
    weight_kg = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    dimensions = models.JSONField(blank=True, null=True)  # {"l":..,"w":..,"h":..}
    stock_quantity = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.CharField(max_length=500, blank=True)
    attributes = models.JSONField(blank=True, null=True)  # arbitrary key/value specs
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        indexes = [models.Index(fields=['slug']), models.Index(fields=['sku'])]

class AttributeValue(models.Model):
    """e.g. Red, XL, Cotton"""
    attributeName = models.CharField(max_length=100)
    value = models.CharField(max_length=100)
 
    class Meta:
        unique_together = ('attributeName', 'value')

class ProductVariant(models.Model):
    """A purchasable variant of a product, e.g. Red / XL."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    sku = models.CharField(max_length=100, unique=True)
    attribute_values = models.ManyToManyField(AttributeValue, related_name='variants')
    price_override = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='variants/', blank=True, null=True)
    is_active = models.BooleanField(default=True)

class Warehouse(models.Model):
    name = models.CharField(max_length=150)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
 
 
class Inventory(models.Model):
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='inventories')
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='inventories')
    quantity = models.PositiveIntegerField(default=0)
    reserved_quantity = models.PositiveIntegerField(default=0)  # reserved by open carts/orders
    updated_at = models.DateTimeField(auto_now=True)
 
    class Meta:
        unique_together = ('product_variant', 'warehouse')
 
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='carts')
    session_key = models.CharField(max_length=100, blank=True, null=True)  # for guest carts
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
 
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)
 
    class Meta:
        unique_together = ('cart', 'product_variant')

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'), ('confirmed', 'Confirmed'), ('processing', 'Processing'),
        ('shipped', 'Shipped'), ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'), ('refunded', 'Refunded'),
    ]
    PAYMENT_STATUS_CHOICES = [('unpaid', 'Unpaid'), ('paid', 'Paid'), ('failed', 'Failed'), ('refunded', 'Refunded')]
 
    # order_number = models.CharField(max_length=32, unique=True, default=uuid.uuid4().hex[:12])
    order_number = models.CharField(
        max_length=32, 
        unique=True, 
        default=generate_order_number  # Pass the function itself, NO parentheses ()
    )
    order_number = models.CharField(max_length=12, unique=True, default=generate_order_number)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='unpaid')
    shipping_address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, related_name='shipping_orders')
    billing_address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, related_name='billing_orders')
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    discount_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    shipping_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    grand_total = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default='USD')
    notes = models.TextField(blank=True)
    placed_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
 
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product_variant = models.ForeignKey(ProductVariant, on_delete=models.SET_NULL, null=True)
    product_name_snapshot = models.CharField(max_length=255)  # preserve name at purchase time
    sku_snapshot = models.CharField(max_length=100)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)

class Payment(models.Model):
    STATUS_CHOICES = [('pending', 'Pending'), ('success', 'Success'), ('failed', 'Failed'), ('refunded', 'Refunded')]
 
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    payment_method = models.CharField(max_length=100, unique=True)  #"e.g. Credit Card, PayPal, Cash on Delivery, Stripe, Razorpay"
    transaction_id = models.CharField(max_length=255, unique=True, blank=True, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    gateway_response = models.JSONField(blank=True, null=True)
    paid_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ShippingMethod(models.Model):
    name = models.CharField(max_length=100)  # Standard, Express, Overnight
    cost = models.DecimalField(max_digits=8, decimal_places=2)
    estimated_days_min = models.PositiveIntegerField()
    estimated_days_max = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
 
 
class Shipment(models.Model):
    STATUS_CHOICES = [('pending', 'Pending'), ('in_transit', 'In Transit'),
                       ('delivered', 'Delivered'), ('returned', 'Returned')]
 
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='shipments')
    shipping_method = models.ForeignKey(ShippingMethod, on_delete=models.SET_NULL, null=True)
    carrier = models.CharField(max_length=100, blank=True)  # FedEx, UPS, DHL
    tracking_number = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    shipped_at = models.DateTimeField(blank=True, null=True)
    delivered_at = models.DateTimeField(blank=True, null=True)



#null=True,blank=True are used like required=false
class Testimonial(models.Model):
    patientName = models.CharField(max_length=100)
    profession = models.CharField(max_length=100,null=True,blank=True)
    rating= models.PositiveSmallIntegerField()
    comment = models.TextField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Social(models.Model):
    platformName = models.CharField(max_length=100,null=True,blank=True)
    url = models.CharField(max_length=100,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

 
class Notification(models.Model):
    TYPE_CHOICES = [('order', 'Order'), ('promo', 'Promotion'), ('system', 'System')]
 
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='system')
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class PageVisit(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True) # Tracks logged-in users
    session_key = models.CharField(max_length=100, blank=True, null=True) # Tracks guest users via session
    path = models.CharField(max_length=255, default='/') # e.g., '/products/slug'
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    visited_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['visited_at']),
        ]

# class Author(models.Model):
#     name = models.CharField(max_length=100)
#     email = models.EmailField(unique=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.name

# class Book(models.Model):
#     title = models.CharField(max_length=200)
#     publication_date = models.DateField()
#     author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='books')
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.title