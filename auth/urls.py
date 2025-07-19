# mimolearn-backend/auth/urls.py

from django.urls import path
from .views import RegisterView, LoginView

urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    # No token refresh endpoint needed for this simple token authentication
]