from django.urls import path
from .views import (
    CitasMedicasListCreateView,
    CitasMedicasDetailView
)

urlpatterns = [
    path('', CitasMedicasListCreateView.as_view(), name='citasmedicas-list'),
    path('<int:pk>/', CitasMedicasDetailView.as_view(), name='citasmedicas-detail'),
]