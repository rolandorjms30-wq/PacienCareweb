from rest_framework import generics
from ..models import Pacientes
from .serializers import PacientesSerializers


# Usamos RetrieveUpdateDestroyAPIView para habilitar GET (detalle), PUT, PATCH y DELETE
class PacientesDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pacientes.objects.all()
    serializer_class = PacientesSerializers

    def perform_destroy(self, instance):
        # 1. Eliminamos primero las dependencias protegidas
        instance.citasmedicas_set.all().delete()
        # 2. Eliminamos al paciente
        instance.delete()


class PacientesListAPIView(generics.ListCreateAPIView):
    queryset = Pacientes.objects.all()
    serializer_class = PacientesSerializers