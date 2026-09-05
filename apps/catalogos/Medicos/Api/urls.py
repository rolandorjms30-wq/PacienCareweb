from django.urls import path
from .views import MedicosListCreateView, MedicosDetailView

urlpatterns = [
    path('', MedicosListCreateView.as_view(), name='medicos-list'),
    path('<int:pk>/', MedicosDetailView.as_view(), name='medicos-detail'),
]