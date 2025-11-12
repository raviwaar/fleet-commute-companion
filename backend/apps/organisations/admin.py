from django.contrib import admin
from .models import Organisation, OrganisationMembership


# --- 1. Inline for OrganisationMembership ---

class OrganisationMembershipInline(admin.TabularInline):
    """
    Allows management of members directly on the Organisation page.
    """
    model = OrganisationMembership
    extra = 1  # Number of empty forms to display
    fields = ('user', 'is_org_admin', 'created_at')
    readonly_fields = ('created_at',)
    raw_id_fields = ('user',)  # Use raw ID for better performance


# --- 2. Organisation Admin Configuration ---

@admin.register(Organisation)
class OrganisationAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'slug',
        'is_active',
        'created_by',
        'created_at',
        'id'  # Showing the ID can be useful
    )
    list_filter = ('is_active',)
    search_fields = ('name', 'slug', 'created_by__username')
    prepopulated_fields = {'slug': ('name',)}

    # Organize fields into logical groups
    fieldsets = (
        ('Organisation Details', {
            'fields': ('name', 'slug', 'is_active')
        }),
        ('Audit/System Info', {
            'fields': ('id', 'created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)  # Collapse this section by default
        }),
    )

    inlines = [OrganisationMembershipInline]

    # Read-only fields
    readonly_fields = ('id', 'created_by', 'created_at', 'updated_at')

    # Set 'created_by' automatically on creation
    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


# --- 3. OrganisationMembership Admin Configuration ---

@admin.register(OrganisationMembership)
class OrganisationMembershipAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'organisation',
        'is_org_admin',
        'created_at'
    )
    list_filter = ('is_org_admin', 'organisation',)
    search_fields = ('user__username', 'organisation__name')
    raw_id_fields = ('user', 'organisation')
    readonly_fields = ('created_at', 'updated_at')