# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from django.urls import path, re_path
from apps.home import views

urlpatterns = [

    # The home page
    path('', views.index, name='home'),
    path('add-car-ajax/', views.add_car_ajax, name='add_car_ajax'),
    path('add_trajet_ajax/', views.add_trajet_ajax, name='add_trajet_ajax'),
    path('add_trip_ajax/', views.add_trip_ajax, name='add_trip_ajax'),
    path('update-bagage/', views.update_bagage, name='update_bagage'),

    # Matches any html file
    re_path(r'^.*\.*', views.pages, name='pages'),

]
