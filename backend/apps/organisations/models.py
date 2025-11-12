from django.conf import settings
from django.db import models
from apps.core.models import AbstractBaseModel  # Assuming this import path


# --- 1. ORGANISATION MEMBERSHIP MODEL (The Junction Table) ---

class OrganisationMembership(AbstractBaseModel):
    """
    Junction table defining the relationship between a User and an Organisation.
    Inherits UUID id, created_at, and updated_at.
    """
    # Fields id, created_at, updated_at are inherited.

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='memberships',
        help_text='The user belonging to the organisation.'
    )

    organisation = models.ForeignKey(
        'organisations.Organisation',
        on_delete=models.CASCADE,
        related_name='memberships',
        help_text='The organisation the user belongs to.'
    )

    is_org_admin = models.BooleanField(
        default=False,
        help_text='If True, the user has administrative privileges within this specific organisation.'
    )

    class Meta:
        # Crucial for preventing duplicate membership
        unique_together = ('user', 'organisation')
        verbose_name = 'Organisation Membership'
        verbose_name_plural = 'Organisation Memberships'

    def __str__(self):
        status = "Admin" if self.is_org_admin else "Member"
        return f"{self.user.username} in {self.organisation.name} ({status})"


# --- 2. ORGANISATION MODEL ---

class Organisation(AbstractBaseModel):
    """
    Organisation model, inheriting UUID id and timestamps.
    """
    # Fields id, created_at (formerly date_created), updated_at (formerly date_modified) are inherited.

    name = models.CharField(max_length=255, unique=True, help_text='The full name of the organisation.')
    slug = models.SlugField(max_length=255, unique=True, help_text='A URL-friendly short name for the organisation.')
    is_active = models.BooleanField(default=True, help_text='Designates whether the organisation account is active.')

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='organisations_created',
        help_text='The user who created this organisation record.'
    )

    users = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through='OrganisationMembership',
        related_name='organisations'
    )

    class Meta:
        verbose_name = 'Organisation'
        verbose_name_plural = 'Organisations'

    def __str__(self):
        return self.name