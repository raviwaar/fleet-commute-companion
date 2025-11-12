from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.core.models import AbstractBaseModel  # Assuming this import path


class User(AbstractUser, AbstractBaseModel):
    """
    Core user identity model inheriting UUID primary key and timestamps.
    Organizational ties are managed via OrganizationMembership.
    """

    SUPER_ADMIN = 'SUPER_ADMIN'
    MEMBER = 'MEMBER'

    ROLE_NAMES = [SUPER_ADMIN, MEMBER]

    # Inherited Fields: id (UUID), created_at, updated_at, username, groups, etc.

    profile_image = models.URLField(
        max_length=200,
        null=True,
        blank=True,
        help_text="URL to the user's profile image (optional)."
    )

    phone_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(unique=True)

    # --- PERMISSION CHECKING METHODS ---

    def has_role(self, role_name: str) -> bool:
        """
        Checks if the user belongs to a specific Global Group (Role).
        """
        if role_name == self.SUPER_ADMIN:
            return self.is_superuser or self.groups.filter(name=self.SUPER_ADMIN).exists()
        return self.groups.filter(name=role_name).exists()

    def is_super_admin(self):
        return self.has_role(self.SUPER_ADMIN)

    def is_org_admin_of(self, organisation_id) -> bool:
        """
        Checks if the user is an admin of a specific organization via the junction table.
        """
        return self.memberships.filter(
            organisation__id=organisation_id,
            is_org_admin=True
        ).exists()

    # --- META AND METHODS ---

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.username} ({self.id})"