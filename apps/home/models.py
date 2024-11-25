# -*- encoding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission, AbstractBaseUser
from datetime import timedelta
from django.conf import settings 
import uuid

class Coupon(models.Model):
    name = models.CharField(max_length=64, default="")
    duration = models.IntegerField()  # Duration in days
    price = models.FloatField()

    def __str__(self):
        return f"{self.name} , Validité: {self.duration} jours"


class Abonnement(models.Model):
    date_debut = models.DateField()
    coupon = models.ForeignKey(Coupon, on_delete=models.CASCADE)
    date_expiration = models.DateField()

    def save(self, *args, **kwargs):
        if not self.date_expiration:
            self.date_expiration = self.date_debut + timedelta(days=self.coupon.duration)
        super().save(*args, **kwargs)


class Car(models.Model):
    car_matricule = models.CharField(default="", max_length=16, blank=True)
    car_marque = models.CharField(default="", max_length=64, blank=True)
    car_modele = models.CharField(default="", max_length=64, blank=True)
    car_age = models.IntegerField(null=True, blank=True)
    car_nombre_place = models.IntegerField(null=True, blank=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # This references the custom User model
        on_delete=models.CASCADE,
        related_name="cars",  # Allows reverse access to all cars owned by a user
        null=False,
        blank=False
    )


class User(AbstractUser):
    USER_TYPE_CHOICES = [
        ('Passenger', 'Passenger'),
        ('Driver', 'Driver'),
    ]
    SEX_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
    ]
    type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    status = models.CharField(default="", max_length=64, blank=True)
    sexe = models.CharField(choices=SEX_CHOICES, max_length=1, blank=True)
    phone = models.CharField(default="", max_length=15, blank=False)
    whatsapp = models.CharField(default="", max_length=15, blank=True)
    abonnement = models.ForeignKey('Abonnement', on_delete=models.CASCADE, null=True, blank=True)
    bagage = models.CharField(default="Leger", max_length=16)
    
    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_set",  # Custom related name to avoid clashes
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions_set",  # Custom related name to avoid clashes
        blank=True
    )
    
    def is_driver(self):
        return self.type == 'Driver'

    def is_passenger(self):
        return self.type == 'Passenger'


class Bagage(models.Model):
    TYPE_CHOICES = [
        ('Valise', 'Valise'),
        ('Sac', 'Sac'),
        ('Carton', 'Carton'),
    ]
    SIZE_CHOICES = [
        ('P', 'Petite'),
        ('M', 'Moyenne'),
        ('G', 'Grande'),
    ]
    type_bagage = models.CharField(max_length=64, choices=TYPE_CHOICES, default="Valise")
    taille = models.CharField(max_length=1, choices=SIZE_CHOICES, default="M")


class Trajet(models.Model):
    source = models.CharField(max_length=64, default="", db_index=True)
    destination = models.CharField(max_length=64, default="", db_index=True)
    price_per_seat = models.FloatField()
    passengers_sex = models.CharField(default="", max_length=16)
    bagage = models.CharField(default="Leger", max_length=16)
    date = models.DateField(db_index=True)
    heure = models.TimeField(db_index=True)
    driver = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'type': 'Driver'})
    places = models.IntegerField()
    status = models.CharField(default="", max_length=64)
    is_full = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['source', 'destination', 'date']),
        ]


class Trip(models.Model):
    passenger = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'type': 'Passenger'}, db_index=True)
    source = models.CharField(max_length=64, default="", db_index=True)
    destination = models.CharField(max_length=64, default="", db_index=True)
    driver_sexe = models.CharField(max_length=1, choices=User.SEX_CHOICES)
    price_max = models.FloatField()
    confirmed_price = models.FloatField(default=0, blank=True)
    date = models.DateField(db_index=True)
    confirmed_heure = models.CharField(max_length=64, default="", blank=True)
    heure_min = models.TimeField()
    heure_max = models.TimeField()
    bagage = models.CharField(default="Leger", max_length=16)
    is_confirmed = models.BooleanField(default=False)
    is_expired = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['source', 'destination', 'date']),
            models.Index(fields=['is_confirmed']),
        ]

class TripChat(models.Model):
    trajet = models.ForeignKey(Trajet, on_delete=models.CASCADE)
    passenger_list = models.ManyToManyField(Trip, blank=True)
