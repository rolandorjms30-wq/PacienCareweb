from django.contrib import admin
from .models import CitasMedicas

@admin.register(CitasMedicas)
class CitasMedicasAdmin(admin.ModelAdmin):
    list_display = ('paciente', 'medico', 'fecha_hora', 'atendida')
    list_filter = ('atendida', 'medico')
    ordering = ('fecha_hora',)  
