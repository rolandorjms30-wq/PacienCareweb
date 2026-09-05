from django.db import models
from apps.catalogos.Pacientes.models import Pacientes
from apps.catalogos.Medicos.models import Medicos

class ResultadosExamenes(models.Model):
    paciente = models.ForeignKey(Pacientes, on_delete=models.PROTECT)
    medico = models.ForeignKey(Medicos, on_delete=models.PROTECT)
    nombre_examen = models.CharField(max_length=100)
    resultado = models.TextField()
    fecha = models.DateField()

    class Meta:
        verbose_name_plural = "Resultados de Examenes"

    def __str__(self):
        return f"{self.nombre_examen} de {self.paciente} - {self.fecha}"

