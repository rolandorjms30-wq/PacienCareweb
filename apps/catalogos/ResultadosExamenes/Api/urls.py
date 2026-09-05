from django.urls import path
from .views import ResultadosExamenesListAPIView, ResultadosExamenesDetailAPIView

urlpatterns = [
    path('', ResultadosExamenesListAPIView.as_view(), name='ResultadosExamenes-list'),
    path('<int:pk>/', ResultadosExamenesDetailAPIView.as_view(), name='ResultadosExamenes-detail'),
]