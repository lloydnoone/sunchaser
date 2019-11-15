from django.urls import path
from .views import ClosestSun, JourneyListView, CommentListView, JourneyDetailView

urlpatterns = [
    path('closestsun', ClosestSun.as_view()),
    path('journeys', JourneyListView.as_view()),
    path('journeys/<int:pk>/', JourneyDetailView.as_view()),
    path('journeys/<int:pk>/comments/', CommentListView.as_view())
]
