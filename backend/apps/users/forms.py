from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from .models import User


class CustomUserCreationForm(forms.ModelForm):
    """
    Form for creating new users, used by Django Admin.
    Adds password confirmation and proper validation.
    """
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'organisation')

    def clean_password2(self):
        # Validate that both passwords match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don’t match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class CustomUserChangeForm(forms.ModelForm):
    """
    Form for updating users in Django Admin.
    Shows hashed password field and allows status/permissions editing.
    """
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = User
        fields = (
            'email', 'first_name', 'last_name', 'is_staff', 'is_active',
            'organisation', 'groups', 'user_permissions'
        )
