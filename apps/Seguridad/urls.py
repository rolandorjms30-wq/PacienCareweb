from django.urls import path, include


app_name = 'Usuarios'

urlpatterns = [

    path('Usuarios/',include ('apps.Seguridad.Usuarios.urls')),
    
]