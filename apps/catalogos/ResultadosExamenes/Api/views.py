from rest_framework import generics
from ..models import ResultadosExamenes
from .serializers import ResultadosExamenesSerializer
from rest_framework import status
from rest_framework.response import Response

# Listar y Crear
class ResultadosExamenesListAPIView(generics.ListCreateAPIView):
    queryset = ResultadosExamenes.objects.all()
    serializer_class = ResultadosExamenesSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Errores de validación:", serializer.errors)  
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return super().post(request, *args, **kwargs)

# NUEVA: Detalle, Editar y Eliminar
class ResultadosExamenesDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ResultadosExamenes.objects.all()
    serializer_class = ResultadosExamenesSerializer