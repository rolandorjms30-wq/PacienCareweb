from rest_framework import serializers
from ..models import CitasMedicas 

class CitasMedicasSerializer(serializers.ModelSerializer):
    # Agregamos campos de solo lectura que toman la representación de cadena (str) 
    # de los modelos relacionados (Paciente y Medico)
    paciente_nombre = serializers.ReadOnlyField(source='paciente.__str__')
    medico_nombre = serializers.ReadOnlyField(source='medico.__str__')

    class Meta:
        model = CitasMedicas
        fields = '__all__'