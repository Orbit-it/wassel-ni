from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect
from formtools.wizard.views import SessionWizardView
from ..home.models import User as WasselniUser, Abonnement, Coupon
from .forms import LoginForm, SignUpStep1Form, SignUpStep2Form, SignUpStep3Form
from django.db import IntegrityError
import logging
import random
from datetime import date, timedelta





logger = logging.getLogger(__name__)

# View for login using username and password
def login_view(request):
    form = LoginForm()
    msg = None
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")
            
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect("/")
            else:
                msg = "Nom d'utilisateur ou mot de passe incorrect."
    
    return render(request, "accounts/login.html", {"msg": msg, "form": form})


def logoutView(request):
    # Déconnexion de l'utilisateur
    logout(request)
    # Redirection après la déconnexion
    return redirect('login')  # Remplacez 'login' par l'URL souhaitée


# Class to manage signup with a wizard

class SignUpWizard(SessionWizardView):
    
    form_list = [SignUpStep1Form, SignUpStep2Form, SignUpStep3Form]
    template_name = "accounts/signup_wizard.html"
    def done(self, form_list, **kwargs):
        step1_data = form_list[0].cleaned_data
        step2_data = form_list[1].cleaned_data
        step3_data = form_list[2].cleaned_data

        free_coupon = Coupon.objects.get(id = 1)
        today = date.today()
        # Create the Abonnement with the free coupon
        abonnement = Abonnement.objects.create(
        date_debut=today,
        coupon=free_coupon
       )
        try:
            wasselniuser = WasselniUser.objects.create(
                username=step1_data.get('username'),
                phone=step1_data.get('phone'),
                email=step2_data.get('email'),
                sexe=step1_data.get('genre'),
                type=step2_data.get('type'),
                status=step2_data.get('status'),
                abonnement = abonnement,
            )
            wasselniuser.set_password(step3_data['password1'])
            wasselniuser.save()

            return HttpResponseRedirect('/')

        except IntegrityError as e:
            logger.error(f"IntegrityError: {e}")
            error_message = f"Une erreur est survenue lors de la création de votre compte. {e}"
            return render(self.request, "accounts/signup_wizard.html", {
                "form": self.get_form(step=self.steps.current),
                "error_message": error_message
            })
