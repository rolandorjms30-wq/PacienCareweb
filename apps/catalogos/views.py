from django.shortcuts import render
from django.http import JsonResponse
from django.db import connections

def index(request):
    return render(request, 'index.html')

def dashboard_stats(request):
    try:
        
        with connections['tismadw_connection'].cursor() as cursor:
            
            # 1. PACIENTES ACTIVOS / INACTIVOS 
            cursor.execute("""
                SELECT 
                    CASE WHEN ACTIVO = 1 THEN 'ACTIVO' ELSE 'INACTIVO' END,
                    COUNT(*)
                FROM DIM_PACIENTE
                GROUP BY ACTIVO
            """)
            pacientes = cursor.fetchall()

            # 2. CITAS POR MÉDICO 
            cursor.execute("""
                SELECT m.NOMBRECOMPLETO, COUNT(*)
                FROM FACT_CITAS c
                JOIN DIM_MEDICO m ON c.IDMEDICODW = m.IDMEDICODW
                GROUP BY m.NOMBRECOMPLETO
            """)
            citas = cursor.fetchall()

            # 3. EXÁMENES POR MES 
            cursor.execute("""
                SELECT CONCAT(t.MES, '-', t.ANIO), COUNT(*)
                FROM FACT_RESULTADOS_EXAMENES e
                JOIN DIM_TIEMPO t ON e.IDTIEMPODW = t.IDTIEMPODW
                GROUP BY t.MES, t.ANIO
                ORDER BY t.ANIO, t.MES
            """)
            examenes = cursor.fetchall()

            # 4. MEDICAMENTOS POR MES
            cursor.execute("""
                SELECT CONCAT(t.MES, '-', t.ANIO), COUNT(*)
                FROM FACT_MEDICAMENTOS m
                JOIN DIM_TIEMPO t ON m.IDTIEMPODW = t.IDTIEMPODW
                GROUP BY t.MES, t.ANIO
                ORDER BY t.ANIO, t.MES
            """)
            medicamentos_mes = cursor.fetchall()

        # Construcción del diccionario de datos
        data = {
            "pacientes_estado": {
                "labels": [x[0] for x in pacientes],
                "data": [x[1] for x in pacientes]
            },
            "citas_por_medico": {
                "labels": [x[0] for x in citas],
                "data": [x[1] for x in citas]
            },
            "examenes_por_mes": {
                "labels": [x[0] for x in examenes],
                "data": [x[1] for x in examenes]
            },
            "medicamentos_por_mes": {
                "labels": [x[0] for x in medicamentos_mes],
                "data": [x[1] for x in medicamentos_mes]
            }
        }

        response = JsonResponse(data)
        response["Cache-Control"] = "no-store"
        return response

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)