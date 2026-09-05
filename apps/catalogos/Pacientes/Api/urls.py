from django.urls import path
from .views import PacientesListAPIView, PacientesDetailAPIView

urlpatterns = [
    # Esta vista solo maneja GET (lista) y POST (crear)
    path('', PacientesListAPIView.as_view(), name='pacientes-lista'),
    
    # Esta vista maneja GET (detalle), PUT y DELETE (borrar)
    path('<int:pk>/', PacientesDetailAPIView.as_view(), name='pacientes-detalle'),
]