import uuid
from django.db import models


class AbstractBaseModel(models.Model):
    """
    An abstract base class that provides common fields for all models:
    - id (UUID primary key)
    - created_at (DateTime, auto_now_add=True)
    - updated_at (DateTime, auto_now=True)

    Any model inheriting from this will automatically gain these fields.
    """

    # Use a universally unique identifier (UUID) as the primary key
    # for better distribution and security.
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="The unique primary key for this object."
    )

    # Timestamp when the object was first created.
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="The date and time this object was created."
    )

    # Timestamp when the object was last updated.
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="The date and time this object was last updated."
    )

    class Meta:
        # This model will not create its own database table.
        abstract = True
        # Default ordering for all derived models.
        ordering = ('-created_at',)

    def __str__(self):
        # Provides a default string representation using the UUID for models
        # that don't override this method.
        return str(self.id)