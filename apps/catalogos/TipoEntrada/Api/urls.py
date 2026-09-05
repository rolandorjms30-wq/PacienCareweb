from django.urls import path
from .views import TipoEntradaListAPIView

urlpatterns = [
    
    path('', TipoEntradaListAPIView.as_view(), name='TipoEntrada'),
]