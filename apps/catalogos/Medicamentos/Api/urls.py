from django.urls import path
from .views import MedicamentosListAPIView, MedicamentosDetailAPIView # <-- Importa la nueva vista

urlpatterns = [
    path('', MedicamentosListAPIView.as_view(), name='Medicamentos-list'),
    path('<int:pk>/', MedicamentosDetailAPIView.as_view(), name='Medicamentos-detail'), # <-- NUEVA RUTA
]