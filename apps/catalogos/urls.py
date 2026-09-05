
from django.urls import path, include
from . import views

urlpatterns = [
    path('TipoEntrada/', include('apps.catalogos.TipoEntrada.Api.urls')),
    path('Pacientes/', include('apps.catalogos.Pacientes.Api.urls')),
    path('Medicos/', include('apps.catalogos.Medicos.Api.urls')),
    path('CitasMedicas/', include('apps.catalogos.CitasMedicas.Api.urls')),
    path('Medicamentos/', include('apps.catalogos.Medicamentos.Api.urls')),
    path('ResultadosExamenes/', include('apps.catalogos.ResultadosExamenes.Api.urls')), 
    path('dashboard/stats/', views.dashboard_stats, name='dashboard_stats'),
]