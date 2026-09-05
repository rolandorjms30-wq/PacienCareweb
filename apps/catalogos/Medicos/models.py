from django.db import models

class Medicos(models.Model):
    codigo_minsa = models.CharField(max_length=20, unique=True)
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    especialidad = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    activo = models.BooleanField(default=True)

    

    class Meta:
        verbose_name_plural = "Medicos"

    def __str__(self):
        return f"Dr. {self.nombres} {self.apellidos} - {self.especialidad}"

# Create your models here.
