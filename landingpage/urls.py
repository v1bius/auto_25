from django.urls import path
from . import views
from .views import IndexView, SearchView

urlpatterns = [
    path("", IndexView.as_view(), name="index")
]
