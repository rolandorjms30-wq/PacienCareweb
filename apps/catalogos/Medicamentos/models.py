from django.db import models
from apps.catalogos.Pacientes.models import Pacientes
from apps.catalogos.Medicos.models import Medicos

class Medicamentos(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    paciente = models.ForeignKey(Pacientes, on_delete=models.PROTECT)
    medico = models.ForeignKey(Medicos, on_delete=models.PROTECT)
    fecha_prescripcion = models.DateField()

    class Meta:
        verbose_name_plural = "Medicamentos"

    def __str__(self):
        return f"{self.nombre} para {self.paciente}"


# Create your models here.
