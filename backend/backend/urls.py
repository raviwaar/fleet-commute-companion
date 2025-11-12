from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings # Import settings to check DEBUG status
from graphene_django.views import GraphQLView

# Get the value for the 'graphiql' flag based on Django's DEBUG setting
# This ensures the interactive interface is only available in development.
SHOULD_ENABLE_GRAPHIQL = settings.DEBUG

urlpatterns = [
    # Standard Django Admin
    path('admin/', admin.site.urls),

    # GraphQL Endpoint
    path(
        'graphql/',
        csrf_exempt(
            GraphQLView.as_view(
                graphiql=SHOULD_ENABLE_GRAPHIQL
            )
        ),
        name='graphql_endpoint' # Giving it a name is good practice
    ),
]