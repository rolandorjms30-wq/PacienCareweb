from django.db import models
from apps.catalogos.Pacientes.models import Pacientes
from apps.catalogos.Medicos.models import Medicos

# Modelo para representar una cita médica entre un paciente y un médico
class CitasMedicas(models.Model):
    paciente = models.ForeignKey(Pacientes, on_delete=models.PROTECT)
    medico = models.ForeignKey(Medicos, on_delete=models.PROTECT)
    fecha_hora = models.DateTimeField()
    motivo = models.TextField()
    atendida = models.BooleanField(default=False)
    class Meta:
        verbose_name_plural = "Citas Medicas"


    def __str__(self):
        # Mejorada la representación de la cita
        return f"Cita de {self.paciente.nombres} {self.paciente.apellidos} con {self.medico.nombres} {self.medico.apellidos} el {self.fecha_hora}"




# Create your models here.
