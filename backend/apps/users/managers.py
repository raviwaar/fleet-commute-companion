from django.contrib.auth.models import BaseUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email


class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifier
    for authentication instead of usernames.
    """

    # Helper function to validate and normalize email
    def email_validator(self, email):
        try:
            validate_email(email)
        except ValidationError:
            raise ValueError('You must provide a valid email address')
        return self.normalize_email(email)

    def create_user(self, email, password, **extra_fields):
        """
        Creates and saves a regular user with the given email and a required password.
        The password must be passed to set_password() for hashing.
        """
        if not email:
            raise ValueError('The Email field must be set')
        if not password:
            # Enforcing password requirement here
            raise ValueError('The Password field must be set for user creation')

        email = self.email_validator(email)

        user = self.model(email=email, **extra_fields)

        # Hashing the password (guaranteed to be set now)
        user.set_password(password)

        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Creates and saves a superuser with the given email and password.
        Note: The password requirement is already handled by create_user.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        # We rely on create_user to enforce the password check
        return self.create_user(email, password, **extra_fields)