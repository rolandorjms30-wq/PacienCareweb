from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UsuarioSerializer 
from .models import User 
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.hashers import check_password
from django.shortcuts import render

class UsuariosAPIView(APIView):
    def get(self, request):
      
        usuarios = User.objects.all() 
        
        serializer = UsuarioSerializer(usuarios, many=True)
        
        return Response({'Usuarios': serializer.data})
    
@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        # Buscamos al usuario
        user = User.objects.filter(username=username).first()
        
        
        if user and check_password(password, user.password):
            return JsonResponse({'status': 'success', 'message': 'Bienvenido'}, status=200)
        else:
            return JsonResponse({'status': 'error', 'message': 'Credenciales incorrectas'}, status=401)
            
    return JsonResponse({'message': 'Método no permitido'}, status=405)



def dashboard_view(request):
  
   
    return render(request, 'dashboard.html')