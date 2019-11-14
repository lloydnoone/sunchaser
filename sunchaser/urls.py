from django.urls import path
from .views import ClosestSun

urlpatterns = [
    path('closestsun', ClosestSun.as_view())
]
