from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import TipoEntrada
from .serializers import TipoEntradaSerializer

class TipoEntradaListAPIView(APIView):
    def get(self, request):
        datos = TipoEntrada.objects.all()
        serializer = TipoEntradaSerializer(datos, many=True)
        return Response(serializer.data)

# Create your views here.
