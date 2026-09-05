var graficosCreados = false;

async function cargarGraficos() {
  if (graficosCreados) return;

  try {
    var respuesta = await fetch('/dashboard/stats/');
    var stats = await respuesta.json();

    console.log("RAW RESPONSE:", JSON.stringify(stats, null, 2));

    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';

    // ═════════════════════════════════════════════
    // 1. PACIENTES (ACTIVO / INACTIVO)
    // ═════════════════════════════════════════════
    new Chart(document.getElementById('graficoPacientes'), {
      type: 'bar',
      data: {
        labels: stats.pacientes_estado.labels,
        datasets: [{
          label: 'Pacientes',
          data: stats.pacientes_estado.data,
          backgroundColor: 'rgba(59,130,246,0.75)',
          borderRadius: 4,
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });

    // ═════════════════════════════════════════════
    // 2. CITAS POR MÉDICO
    // ═════════════════════════════════════════════
    new Chart(document.getElementById('graficoCitas'), {
      type: 'line',
      data: {
        labels: stats.citas_por_medico.labels,
        datasets: [{
          label: 'Citas',
          data: stats.citas_por_medico.data,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.12)',
          fill: true,
          tension: 0.4,
          pointRadius: 5,
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });

    // ═════════════════════════════════════════════
    // 3. EXÁMENES POR MES (DONA)
    // ═════════════════════════════════════════════
    const coloresMeses = [
      '#3b82f6','#10b981','#f59e0b','#ef4444',
      '#8b5cf6','#31051b','#06b6d4','#84cc16',
      '#f97316','#6366f1','#d946ef','#14b8a6'
    ];

    new Chart(document.getElementById('graficoExamenes'), {
      type: 'doughnut',
      data: {
        labels: stats.examenes_por_mes.labels,
        datasets: [{
          data: stats.examenes_por_mes.data,
          backgroundColor: coloresMeses,
          borderWidth: 0,
        }]
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: (context) =>
                `${context.label}: ${context.raw} exámenes`
            }
          }
        },
        cutout: '60%'
      }
    });

    // ═════════════════════════════════════════════
    // 4. MEDICAMENTOS POR MES 
    // ═════════════════════════════════════════════
    new Chart(document.getElementById('graficoMedicamentos'), {
      type: 'bar',
      data: {
        labels: stats.medicamentos_por_mes.labels,
        datasets: [{
          label: 'Medicamentos',
          data: stats.medicamentos_por_mes.data,
          backgroundColor: '#10b981',
          borderRadius: 4,
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true } }
      }
    });

    graficosCreados = true;

  } catch (error) {
    console.error('Error al cargar gráficos:', error);
  }

   


}