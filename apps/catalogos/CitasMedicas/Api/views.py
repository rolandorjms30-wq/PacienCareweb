from rest_framework import generics
from ..models import CitasMedicas
from .serializers import CitasMedicasSerializer


class CitasMedicasListCreateView(generics.ListCreateAPIView):
    queryset = CitasMedicas.objects.all()
    serializer_class = CitasMedicasSerializer


class CitasMedicasDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CitasMedicas.objects.all()
    serializer_class = CitasMedicasSerializer