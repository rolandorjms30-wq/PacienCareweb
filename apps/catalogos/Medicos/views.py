from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny

from .models import Medicos
from .Api.serializers import MedicosSerializer


class MedicosViewSet(ModelViewSet):
    queryset = Medicos.objects.all()
    serializer_class = MedicosSerializer

    
    permission_classes = [AllowAny]
