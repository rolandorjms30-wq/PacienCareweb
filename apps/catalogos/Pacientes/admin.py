from django.contrib import admin
from .models import Pacientes
from datetime import date

@admin.register(Pacientes)
class PacientesAdmin(admin.ModelAdmin):
    list_display = ('nombres', 'apellidos', 'sexo', 'telefono', 'email', 'calcular_edad', 'direccion', 'patologia_cronica', 'fecha_nacimiento', 'activo')
    search_fields = ('nombres', 'apellidos', 'telefono', 'email')
    list_filter = ('sexo', 'activo')
    actions = ['activar_pacientes', 'desactivar_pacientes', 'ordenar_pacientes']

    def calcular_edad(self, obj):
        return date.today().year - obj.fecha_nacimiento.year
    calcular_edad.short_description = 'Edad'


    