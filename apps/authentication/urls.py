# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from django.urls import path
from .views import login_view
from .views import SignUpWizard
from .views import logoutView

urlpatterns = [
    path('login/', login_view, name="login"),
    #path('register/', register_user, name="register"),
    path('signup/', SignUpWizard.as_view(), name='signup_wizard'),
    path("logout/", logoutView, name="logout")
]
