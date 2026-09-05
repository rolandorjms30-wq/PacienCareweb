from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PacientesViewSet

router = DefaultRouter()
router.register(r'Pacientes', PacientesViewSet, basename='Pacientes')

urlpatterns = [
    path('', include(router.urls)),
]