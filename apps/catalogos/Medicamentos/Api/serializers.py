from rest_framework import serializers
from ..models import Medicamentos  

class MedicamentoSerializer(serializers.ModelSerializer):
  
    paciente_nombre = serializers.ReadOnlyField(source='paciente.nombres')
    medico_nombre = serializers.ReadOnlyField(source='medico.nombres')

    class Meta:
        model = Medicamentos
       
        fields = [
            'id', 
            'nombre', 
            'descripcion', 
            'fecha_prescripcion', 
            'paciente',         
            'paciente_nombre',  
            'medico',           
            'medico_nombre'     
        ]