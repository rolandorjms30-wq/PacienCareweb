from django.db import models


class TipoEntrada(models.Model):
    codigo = models.CharField(max_length=20, unique=True)
    descripcion = models.CharField(max_length=200)
    estado = models.PositiveSmallIntegerField(default=1)  # 1 = activo, 0 = inactivo

    class Meta:
        verbose_name_plural = "Tipos de Entrada"

    def __str__(self):
        return f"{self.codigo} - {self.descripcion}"

