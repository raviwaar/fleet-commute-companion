from django.apps import AppConfig


class UsersConfig(AppConfig):
    # This is the full Python path where the app lives.
    # This matches the entry in INSTALLED_APPS (before the config class name).
    name = 'apps.users'

    # CRITICAL FIX: This explicitly tells Django that the app's internal label
    # for migrations and model references is 'users', not 'apps.users'.
    label = 'users'

    # Optional: A human-readable name for the admin site
    verbose_name = 'Users'