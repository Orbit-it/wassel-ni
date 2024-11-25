from django import forms
from django.core.exceptions import ValidationError
import re

# LoginForm - for user login using username and password
class LoginForm(forms.Form):
    username = forms.CharField(
        widget=forms.TextInput(
            attrs={"placeholder": "Nom d'utilisateur", "class": "form-control"}
        )
    )
    password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={"placeholder": "Mot de passe", "class": "form-control"}
        )
    )

# SignUpStep1Form - collects username, phone, and optional display name

class SignUpStep1Form(forms.Form):
    GENRE_CHOICES = [
        ('Femme', 'Femme'),
        ('Homme', 'Homme'),
    ]
    username = forms.CharField(
        required=True,
        label="Choisisez un Nom d'utilisateur:",
        widget=forms.TextInput(
            attrs={"placeholder": "Nom d'utilisateur", "class": "form-control"}
        )
    )
    phone = forms.CharField(
        required=True,
        label="Entrer votre numéro de Téléphone:",
        widget=forms.TextInput(
            attrs={"placeholder": "Téléphone", "class": "form-control"}
        )
    )
    genre = forms.ChoiceField(
        required=True,
        label="Etes vous une Femme ou un Homme ?",
        choices=GENRE_CHOICES,
        widget=forms.Select(attrs={"class": "form-select"})
    )

    def clean_phone(self):
        phone = self.cleaned_data['phone']
        if not re.match(r'^\+?\d{8,15}$', phone):
            raise ValidationError("Numéro de téléphone invalide.")
        return phone

# SignUpStep2Form - collects email, type, and status
class SignUpStep2Form(forms.Form):
    STATUT_CHOICES = [
        ('professionnel', 'Professionnel'),
        ('etudiant', 'Étudiant'),
    ]
    TYPE_CHOICES = [
        ('Passenger', 'Passager'),
        ('Driver', 'Chauffeur'),
    ]
    email = forms.EmailField(
        required=False,
        widget=forms.EmailInput(
            attrs={"placeholder": "Email", "class": "form-control"}
        )
    )
    type = forms.ChoiceField(
        choices=TYPE_CHOICES,
        widget=forms.Select(attrs={"class": "form-select"})
    )
    status = forms.ChoiceField(
        required=True,
        choices=STATUT_CHOICES,
        widget=forms.Select(attrs={"class": "form-select"})
    )

# SignUpStep3Form - handles password and password confirmation
class SignUpStep3Form(forms.Form):
    password1 = forms.CharField(
        widget=forms.PasswordInput(
            attrs={"placeholder": "Mot de Passe", "class": "form-control"}
        )
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput(
            attrs={"placeholder": "Vérification du Mot de Passe", "class": "form-control"}
        )
    )

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")

        if password1 and password2 and password1 != password2:
            raise ValidationError("Les mots de passe ne correspondent pas.")
        return cleaned_data
