from rest_framework import serializers
from .models import User, Address, Category, Brand, Product, ProductVariant, AttributeValue, Inventory, Warehouse, Cart, CartItem, Order, OrderItem, Payment, ShippingMethod, Shipment, Notification, Testimonial, Social,PageVisit

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'

#product variant for cart add
class ProductVariantCartSerializer(serializers.ModelSerializer):
    # product = ProductSerializer(read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    price = serializers.SerializerMethodField()
    class Meta:
        model = ProductVariant
        #fields = '__all__'
        # fields = ['id', 'sku', 'price','price_override', 'stock_quantity', 'image','is_active', 'product_name','product']
        fields = ['id', 'sku', 'price','price_override', 'stock_quantity', 'image','is_active', 'product_name']

    def get_price(self, obj):
        return obj.price_override if obj.price_override is not None else obj.product.price


class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantCartSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug','description','short_description','sku', 'category','brand', 'price', 'compare_at_price', 'cost_price',
            'tax_class','weight_kg','dimensions','rating','stock_quantity','is_active','is_featured','meta_title','meta_description',
            'attributes' ,'image', 'variants', 'is_active', 'status','created_at','updated_at','sales_count','rating_count'
        ]
        # fields = '__all__'

#product variant for cart display or view
class ProductVariantSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    #product_name = serializers.CharField(source='product.name', read_only=True)
    #price = serializers.SerializerMethodField()
    class Meta:
        model = ProductVariant
        #fields = '__all__'
        # fields = ['id', 'sku', 'price','price_override', 'stock_quantity', 'image','is_active', 'product_name','product']
        fields = ['id', 'sku','price_override', 'stock_quantity', 'image','is_active', 'product']

    # def get_price(self, obj):
    #     return obj.price_override if obj.price_override is not None else obj.product.price   

class AttributeValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributeValue
        fields = '__all__'

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = '__all__'

class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):
    product_variant = ProductVariantSerializer(read_only=True)
    product_variant_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.all(), write_only=True, source='product_variant'
    )
    subtotal = serializers.SerializerMethodField()
    class Meta:
        model = CartItem
        #fields = '__all__'
        fields = ['id', 'product_variant', 'product_variant_id','cart', 'quantity', 'subtotal', 'added_at']
        
    def get_subtotal(self, obj):
        price = obj.product_variant.price_override if obj.product_variant.price_override is not None else obj.product_variant.product.price
        return float(price) * obj.quantity
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    class Meta:
        model = Cart
        fields = ['id', 'user', 'session_key', 'items', 'created_at','total_price', 'updated_at']
        # fields = '__all__'
        
    def get_total_price(self, obj):
        return sum(
            float(item.product_variant.price_override or item.product_variant.product.price) * item.quantity
            for item in obj.items.all()
        )


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class ShippingMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingMethod
        fields = '__all__'

class ShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = '__all__'


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'

class SocialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Social
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class PageVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageVisit
        fields = '__all__'