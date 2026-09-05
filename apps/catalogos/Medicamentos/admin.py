from django.contrib import admin
from apps.catalogos.Medicamentos.models import Medicamentos


@admin.register(Medicamentos)
class MedicamentosAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'descripcion', 'paciente', 'medico', 'fecha_prescripcion')
    search_fields = ('nombre', 'descripcion', 'paciente__nombres', 'paciente__apellidos', 'medico__nombres', 'medico__apellidos')
    list_filter = ('fecha_prescripcion',)