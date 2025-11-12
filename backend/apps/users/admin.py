from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model

User = get_user_model()


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom Django Admin configuration for the User model.
    """
    # Define the fields shown in the list view
    list_display = (
        'id',
        'username',
        'email',
        'first_name',
        'is_staff',
        'is_active',
        'created_at'
    )
    # Fields that can be used for searching
    search_fields = ('username', 'email', 'first_name', 'last_name')
    # Fields that can be filtered
    list_filter = ('is_staff', 'is_active', 'is_superuser', 'groups')

    # Define the fields shown in the detail view, organized into fieldsets
    fieldsets = (
        (None, {'fields': ('username', 'password', 'id')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'phone_number', 'profile_image')}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined', 'created_at', 'updated_at')}),
    )

    # Ensure ID and timestamps from AbstractBaseModel are read-only
    readonly_fields = ('id', 'last_login', 'date_joined', 'created_at', 'updated_at')