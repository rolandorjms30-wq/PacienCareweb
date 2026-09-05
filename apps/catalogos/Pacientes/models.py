from django.db import models
from datetime import date 

class Pacientes(models.Model):
    SEXO_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    ]

    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    edad = models.PositiveIntegerField(editable=False)
    patologia_cronica = models.TextField(blank=True, null=True)
    sexo = models.CharField(max_length=1, choices=SEXO_CHOICES)
    direccion = models.CharField(max_length=200, blank=True, null=True)
    fecha_nacimiento = models.DateField()
    telefono = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    activo = models.BooleanField(default=True) 

    class Meta:
        verbose_name_plural = "Pacientes"
    def save(self, *args, **kwargs):
        # Calcular edad automáticamente
        if self.fecha_nacimiento:
            today = date.today()
            self.edad = today.year - self.fecha_nacimiento.year - (
                (today.month, today.day) < (self.fecha_nacimiento.month, self.fecha_nacimiento.day)
            )
        super(Pacientes, self).save(*args, **kwargs) 

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"

