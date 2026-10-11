from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User,Address,Category,Brand,Product,AttributeValue,ProductVariant,Warehouse,Inventory,Cart,CartItem,Order,OrderItem,Payment,ShippingMethod,Shipment,Testimonial, Social,Notification,PageVisit

# Register your models here.
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'email', 'is_seller', 'is_verified', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('phone_number', 'is_verified', 'is_seller', 'date_of_birth')}),
    )

admin.site.register(User, CustomUserAdmin)
admin.site.register(Address)
admin.site.register(Category)
admin.site.register(Brand)
admin.site.register(Product)
admin.site.register(AttributeValue)
admin.site.register(ProductVariant)
admin.site.register(Warehouse)
admin.site.register(Inventory)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Payment)
admin.site.register(ShippingMethod)
admin.site.register(Shipment)
admin.site.register(Testimonial)
admin.site.register(Social)
admin.site.register(Notification)
admin.site.register(PageVisit)