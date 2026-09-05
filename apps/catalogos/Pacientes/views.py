from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny

from .models import Pacientes
from .Api.serializers import PacientesSerializers


class PacientesViewSet(ModelViewSet):
    queryset = Pacientes.objects.all()
    serializer_class = PacientesSerializers

    
    permission_classes = [AllowAny]
