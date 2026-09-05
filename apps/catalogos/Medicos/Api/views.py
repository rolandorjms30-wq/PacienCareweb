from rest_framework import generics
from ..models import Medicos
from .serializers import MedicosSerializer

class MedicosListCreateView(generics.ListCreateAPIView):
    queryset = Medicos.objects.all()
    serializer_class = MedicosSerializer

class MedicosDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Medicos.objects.all()
    serializer_class = MedicosSerializer