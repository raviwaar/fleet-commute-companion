import graphene
from graphene_django.types import DjangoObjectType
from django.contrib.auth import get_user_model
from graphql import GraphQLError
import graphql_jwt
from graphql_jwt.shortcuts import get_token
from graphql_jwt.decorators import login_required

User = get_user_model()


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "profile_image"
        )


class CreateUser():
    def create(self, username, password, email):
        user = get_user_model()(
            username=username,
            email=email,
        )
        user.set_password(password)
        user.save()
        return user


# --- Registration Mutation (Generates User AND Token) ---
class RegisterUser(graphene.Mutation):
    user = graphene.Field(UserType)
    token = graphene.String()

    class Arguments:
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    def mutate(self, info, username, email, password):
        if User.objects.filter(username=username).exists():
            raise GraphQLError("Username already exists")
        if User.objects.filter(email=email).exists():
            raise GraphQLError("Email already exists")

        user = CreateUser().create(
            username=username,
            email=email,
            password=password)

        # 🔑 Minimal change to generate JWT token using the shortcut
        token = get_token(user)

        return RegisterUser(user=user, token=token)


class UpdateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        first_name = graphene.String(required=False)
        last_name = graphene.String(required=False)
        profile_image = graphene.String(required=False)
        phone_number = graphene.String(required=False)

    @login_required
    def mutate(self, info, **input):
        user = info.context.user

        ALLOWED_FIELDS = ['first_name', 'last_name', 'phone_number', 'profile_image']

        for field, value in input.items():
            if value is not None:

                if field not in ALLOWED_FIELDS:
                    raise GraphQLError(f"Attempted to update an unauthorized field: {field}")

                if field == 'phone_number':
                    UserModel = get_user_model()
                    if UserModel.objects.filter(phone_number=value).exclude(pk=user.pk).exists():
                        raise GraphQLError("Phone number already registered to another user.")

                setattr(user, field, value)

        try:
            user.full_clean()
            user.save()
        except Exception as e:
            raise GraphQLError(f"Update failed due to validation error: {e}")

        return UpdateUser(user=user)


class UserMutation(graphene.ObjectType):
    # 1. Registration: Your custom mutation
    register_user = RegisterUser.Field()

    # 2. Login: The built-in mutation from django-graphql-jwt
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()

    # 3. Utilities: Built-in mutations for security
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    update_user = UpdateUser.Field()


class UserQuery(graphene.ObjectType):
    me = graphene.Field(UserType)
    users = graphene.List(UserType)

    def resolve_users(self, info):
        return get_user_model().objects.all()

    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('Authentication credentials were not provided')
        return user