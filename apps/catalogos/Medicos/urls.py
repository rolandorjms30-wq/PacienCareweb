from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicosViewSet

router = DefaultRouter()
# El basename es el nombre base para tus URLs
router.register(r'Medicos', MedicosViewSet, basename='Medicos')

urlpatterns = [
    # Aquí es donde le asignas el prefijo 'catalogos/'
    path('catalogos/', include(router.urls)),
]