from rest_framework import generics
from ..models import Medicamentos
from .serializers import MedicamentoSerializer

# Esta ya la tienes (Listar y Crear)
class MedicamentosListAPIView(generics.ListCreateAPIView):
    queryset = Medicamentos.objects.all()
    serializer_class = MedicamentoSerializer

# AGREGA ESTA NUEVA CLASE (Ver detalle, Editar y Eliminar)
class MedicamentosDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Medicamentos.objects.all()
    serializer_class = MedicamentoSerializer