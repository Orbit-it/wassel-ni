from django.urls import  re_path
from .consumers import TripConsumer


ws_urlpatterns = [
  re_path(r'ws/trips/$', TripConsumer.as_asgi()),
]
