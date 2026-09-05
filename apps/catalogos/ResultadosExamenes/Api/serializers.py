from rest_framework import serializers
from ..models import ResultadosExamenes

class ResultadosExamenesSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.ReadOnlyField(source='paciente.nombres')
    medico_nombre = serializers.ReadOnlyField(source='medico.nombres')

    class Meta:
        model = ResultadosExamenes
        fields = [
            'id',
            'paciente',          # Para recibir el ID al guardar
            'paciente_nombre',   # Para leer el texto en la tabla
            'medico',            # Para recibir el ID al guardar
            'medico_nombre',     # Para leer el texto en la tabla
            'nombre_examen',
            'resultado',
            'fecha'
        ]