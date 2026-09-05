from django.contrib import admin
from apps.catalogos.Medicos.models import Medicos

@admin.register(Medicos)
class MedicosAdmin(admin.ModelAdmin):
    list_display = ('codigo_minsa', 'nombres', 'apellidos', 'especialidad', 'telefono', 'email', 'activo')
    search_fields = ('nombres', 'apellidos', 'codigo_minsa', 'especialidad')
    list_filter = ('activo',)
    actions = ['activar_medicos', 'desactivar_medicos']