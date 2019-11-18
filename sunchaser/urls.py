from django.urls import path
from .views import ClosestSun, JourneyListView, CommentListView, JourneyDetailView, JourneySearchView, CommentDetailView

urlpatterns = [
    path('closestsun', ClosestSun.as_view()),
    path('journeys', JourneyListView.as_view()),
    path('journeys/<int:pk>/', JourneyDetailView.as_view()),
    path('journeys/<int:pk>/comments/', CommentListView.as_view()),
    path('journeys/<int:pk>/comments/<int:comment_pk>/', CommentDetailView.as_view()),
    path('journeys/<str:start>&<str:end>/', JourneySearchView.as_view())
]
