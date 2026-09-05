from django.urls import path
from .views import UsuariosAPIView
from . import views  

app_name = 'Usuarios'

urlpatterns = [
    path('', UsuariosAPIView.as_view(), name='usuarios'),
    path('login/', views.login_view, name='login_view'),

    path('dashboard/', views.dashboard_view, name='dashboard'),
    

    
]