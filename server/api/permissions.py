from rest_framework.permissions import BasePermission

class IsAdminUserCustom(BasePermission):
    """
    Allows access only to authenticated users who are marked as staff/admin.
    """
    def has_permission(self, request, view):
        # 1. Check if the user is authenticated
        if not (request.user and request.user.is_authenticated):
            return False
        
        # 2. Check if the user is an admin/staff member
        return bool(request.user.is_staff or request.user.is_superuser)

class IsAdminUserStrict(BasePermission):
    def has_permission(self, request, view):
        u = request.user
        return bool(u and u.is_authenticated and u.is_active and (u.is_staff or u.is_superuser))