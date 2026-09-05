from django.contrib import admin
from apps.catalogos.ResultadosExamenes.models import ResultadosExamenes

@admin.register(ResultadosExamenes)
class ResultadosExamenesAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'medico', 'nombre_examen', 'resultado', 'fecha')
    search_fields = ('paciente__nombres', 'paciente__apellidos', 'medico__nombres', 'medico__apellidos', 'nombre_examen', 'resultado')
    list_filter = ('fecha', 'medico')

    