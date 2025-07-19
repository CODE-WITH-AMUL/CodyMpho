from django.urls import path
from .views import *


urlpatterns = [
    path('' , indexview.as_view() , name="index")
]
