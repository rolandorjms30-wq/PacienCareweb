

var pacientesIdActual = null;
// ======================================================
// LISTAR PACIENTES
// ======================================================

async function cargarPacientes() {

    const cargando = document.getElementById('cargandoPacientes');
    const tabla    = document.getElementById('tablaPacientes');
    const tbody = document.getElementById('bodyPacientes');

    cargando.style.display = 'block';

    try {

        const res = await fetch(`${API_LOCAL}/catalogos/Pacientes/`);
        const data = await res.json();

        const pacientes = Array.isArray(data) ? data : data.results;

        let filas = '';

        pacientes.forEach((p, i) => {

            const patologiaSegura = (p.patologia_cronica ?? '').replace(/'/g, "\\'");
            const nombresSeguros = (p.nombres ?? '').replace(/'/g, "\\'");
            const apellidosSeguros = (p.apellidos ?? '').replace(/'/g, "\\'");
            const direccionSegura = (p.direccion ?? '').replace(/'/g, "\\'");

            // Evaluación del estado booleano
            const esActivo = p.activo !== false && p.activo !== 'false' && p.activo !== 0;
            const estadoTexto = esActivo ? '🟢 Activo' : '🔴 Inactivo';

            


            filas += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${p.nombres}</td>
                    <td>${p.apellidos}</td>
                    <td>${p.edad ?? ''}</td>
                    <td>${p.sexo}</td>
                    <td>${p.fecha_nacimiento}</td>
                    <td>${p.patologia_cronica ?? ''}</td>
                    <td>${p.direccion ?? ''}</td>
                    <td>${p.telefono ?? ''}</td>
                    <td>${p.email ?? ''}</td>
                    <td><strong>${estadoTexto}</strong></td>

                    <td>
                        <div class="btn-accion-group">
                            <button class="btn-accion btn-editar"
                                onclick="abrirModalPacientes(
                                    'editar',
                                    ${p.id},
                                    '${p.nombres ?? ''}',
                                    '${p.apellidos ?? ''}',
                                    '${p.sexo ?? ''}',
                                    '${p.fecha_nacimiento ?? ''}',
                                    '${p.patologia_cronica ?? ''}',
                                    '${p.direccion ?? ''}',
                                    '${p.telefono ?? ''}',
                                    '${p.email ?? ''}'
                                    
                                )">
                                ✏ Editar
                            </button>

                            <button class="btn-accion btn-eliminar"
                                onclick="eliminarPacientes(${p.id}, '${p.nombres}')">
                                🗑 Eliminar
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

       
        tbody.innerHTML = filas;
        
        
        cargando.style.display = 'none'; 
        tabla.classList.add('visible');
       
    } catch (error) {
    
    }
}

// ======================================================
// BUSCADORES PACIENTES
// ======================================================


function activarBuscadorPacientes() {
  const buscador = document.getElementById('buscarPacientes');
  if (!buscador) return; // Validación extra

  buscador.addEventListener('input', function() {
    const textoBusqueda = buscador.value.toLowerCase();
    const filas = document.querySelectorAll('#bodyPacientes tr');
    filas.forEach(fila => {
      fila.style.display = fila.textContent.toLowerCase().includes(textoBusqueda) ? '' : 'none';
    });
  });
}
// ======================================================
// MODAL
// ======================================================

function abrirModalPacientes(
    modo,
    id = null,
    nombres = '',
    apellidos = '',
    sexo = '',
    fechaNacimiento = '',
    patologia = '',
    direccion = '',
    telefono = '',
    email = '',
    activo = true
) {

    document.getElementById('modalPacTitulo').textContent =
        modo === 'crear' ? 'Nuevo Paciente' : 'Editar Paciente';

    document.getElementById('nomPaciente').value = nombres;
    document.getElementById('apePaciente').value = apellidos;
    document.getElementById('sexoPaciente').value = sexo;
    document.getElementById('fechaNacimiento').value = fechaNacimiento;
    document.getElementById('direccionPaciente').value = direccion;
    document.getElementById('telefonoPaciente').value = telefono;
    document.getElementById('emailPaciente').value = email;
     
    const selectActivo = document.getElementById('activoPaciente');
    if (selectActivo) {
        // Convierte el booleano true/false a string "true"/"false" para el <select>
        selectActivo.value = String(activo); 
    }

    const todosLosCheckboxes = document.querySelectorAll('input[name="patologias_chk"]');
    todosLosCheckboxes.forEach(chk => chk.checked = false);

    // Si estamos editando, marcamos las casillas que correspondan al string de la BD
    if (modo === 'editar' && patologia && patologia !== 'Ninguna') {
        const patologiasArray = patologia.split(', ');
        patologiasArray.forEach(p => {
            const chk = document.querySelector(`input[name="patologias_chk"][value="${p}"]`);
            if (chk) chk.checked = true;
        });
    }
    

    document.getElementById('pacienteError').textContent = '';

    pacienteIdActual = modo === 'editar' ? id : null;

    document.getElementById('modalPacientes').classList.add('activo');
}


// ======================================================
// CERRAR MODAL
// ======================================================

function cerrarModal(id) {
    document.getElementById(id).classList.remove('activo');
}


// ======================================================
// GUARDAR (POST / PUT)
// ======================================================

async function guardarPacientes() {

    const nombres = document.getElementById('nomPaciente').value.trim();
    const apellidos = document.getElementById('apePaciente').value.trim();
    const sexo = document.getElementById('sexoPaciente').value;
    const fecha_nacimiento = document.getElementById('fechaNacimiento').value;
    const checkboxes = document.querySelectorAll('input[name="patologias_chk"]:checked');
    const listaValores = Array.from(checkboxes).map(chk => chk.value);
    const patologia_cronica = listaValores.length > 0 ? listaValores.join(', ') : "Ninguna";
    const direccion = document.getElementById('direccionPaciente').value;
    const telefono = document.getElementById('telefonoPaciente').value;
    const email = document.getElementById('emailPaciente').value;
    const selectActivo = document.getElementById('activoPaciente');
    const activo = selectActivo ? (selectActivo.value === "true") : true;

    const errorEl = document.getElementById('pacienteError');

    if (!nombres || !apellidos || !sexo || !fecha_nacimiento) {
        errorEl.textContent = 'Complete los campos obligatorios';
        return;
    }

    const body = JSON.stringify({
        nombres,
        apellidos,
        sexo,
        fecha_nacimiento,
        patologia_cronica,
        direccion,
        telefono,
        email,
        activo: activo
    });

    const url = pacienteIdActual === null
        ? `${API_LOCAL}/catalogos/Pacientes/`
        : `${API_LOCAL}/catalogos/Pacientes/${pacienteIdActual}/`;

    const metodo = pacienteIdActual === null ? 'POST' : 'PUT';

    try {
        const res = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        });

        if (res.ok) {
            cerrarModal('modalPacientes');
            cargarPacientes();
            cargarDashboard();
        } else {
            const errorText = await res.text();
            errorEl.textContent = errorText;
        }

    } catch (error) {
        console.error(error);
        errorEl.textContent = 'Error de conexión con la API';
    }
}


// ======================================================
// ELIMINAR
// ======================================================

async function eliminarPacientes(id, nombre) {

    if (!id) return alert("ID inválido");

    if (!confirm('¿Desea eliminar a ' + nombre + '?')) return;

    try {

        const res = await fetch(
            `${API_LOCAL}/catalogos/Pacientes/${id}/`,
            { method: 'DELETE' }
        );

        if (res.ok) {
            cargarPacientes();
            cargarDashboard();
            
        } else {
            alert("No se pudo eliminar (quizá ya no existe)");
        }

    } catch (error) {
        console.error(error);
    }
}

// ======================================================
// LISTAR MEDICOS
// ======================================================
var medicosIdActual = null;
async function cargarMedicos() {

    const cargando = document.getElementById('cargandoMedicos');
    const tabla    = document.getElementById('tablaMedicos');
    const tbody = document.getElementById('bodyMedicos');

    cargando.style.display = 'block';

    try {

        const res = await fetch(`${API_LOCAL}/catalogos/Medicos/`);
        const data = await res.json();

        const medicos = Array.isArray(data) ? data : data.results;

        let filas = '';

        medicos.forEach((m, i) => {
            filas += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${m.codigo_minsa}</td>
                    <td>${m.nombres}</td>
                    <td>${m.apellidos}</td>
                    <td>${m.especialidad ?? ''}</td>
                    <td>${m.telefono ?? ''}</td>
                    <td>${m.email ?? ''}</td>

                    <td>
                        <div class="btn-accion-group">
                            <button class="btn-accion btn-editar"
                                onclick="abrirModalMedicos(
                                    'editar',
                                    ${m.id},
                                    '${m.codigo_minsa ?? ''}',
                                    '${m.nombres ?? ''}',
                                    '${m.apellidos ?? ''}',
                                    '${m.especialidad ?? ''}',
                                    '${m.telefono ?? ''}',
                                    '${m.email ?? ''}'
                                )">
                                ✏ Editar
                            </button>

                            <button class="btn-accion btn-eliminar"
                               onclick="eliminarMedicos(${m.id}, '${m.nombres}')">
                                🗑 Eliminar
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

       
        tbody.innerHTML = filas;
        
        
        cargando.style.display = 'none'; 
        tabla.classList.add('visible');
       
    } catch (error) {
    
    }
}

function activarBuscadorMedicos() {
  const buscador = document.getElementById('buscarMedicos');
  if (!buscador) return; // Validación extra

  buscador.addEventListener('input', function() {
    const textoBusqueda = buscador.value.toLowerCase();
    const filas = document.querySelectorAll('#bodyMedicos tr');
    filas.forEach(fila => {
      fila.style.display = fila.textContent.toLowerCase().includes(textoBusqueda) ? '' : 'none';
    });
  });
}

// ======================================================
// MODAL
// ======================================================

function abrirModalMedicos(
    modo,
    id = null,
    codigo_minsa ='',
    nombres = '',
    apellidos = '',
    especialidad = '',
    telefono = '',
    email = ''
) {

    document.getElementById('modalMedTitulo').textContent =
        modo === 'crear' ? 'Nuevo Medicos' : 'Editar Medicos';
 
    document.getElementById('codigo_minsa').value = codigo_minsa;
    document.getElementById('nomMedicos').value = nombres;
    document.getElementById('apeMedicos').value = apellidos;
    document.getElementById('especialidad').value = especialidad;
    document.getElementById('telefonoMedicos').value = telefono;
    document.getElementById('emailMedicos').value = email;

    document.getElementById('MedicosError').textContent = '';

    medicosIdActual= modo === 'editar' ? id : null;

    document.getElementById('modalMedicos').classList.add('activo');
}


// ======================================================
// CERRAR MODAL
// ======================================================

function cerrarModal(id) {
    document.getElementById(id).classList.remove('activo');
}


// ======================================================
// GUARDAR (POST / PUT)
// ======================================================

async function guardarMedicos() {


    const codigo_minsa= document.getElementById('codigo_minsa').value;
    const nombres = document.getElementById('nomMedicos').value.trim();
    const apellidos = document.getElementById('apeMedicos').value.trim();
    const especialidad = document.getElementById('especialidad').value;
    const telefono = document.getElementById('telefonoMedicos').value;
    const email = document.getElementById('emailMedicos').value;

    const errorEl = document.getElementById('MedicosError');

    if (!nombres || !apellidos || !codigo_minsa || !especialidad) {
    if (errorEl) { 
        errorEl.textContent = 'Complete los campos obligatorios';
    } else {
        alert('Complete los campos obligatorios'); 
    }
    return;
}

    const body = JSON.stringify({
        codigo_minsa,
        nombres,
        apellidos,
        especialidad,
        telefono,
        email,
        activo: true
    });

    const url = medicosIdActual === null
        ? `${API_LOCAL}/catalogos/Medicos/`
        : `${API_LOCAL}/catalogos/Medicos/${medicosIdActual}/`;

    const metodo = medicosIdActual === null ? 'POST' : 'PUT';

    try {
         const res = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        });

        if (res.ok) {
            cerrarModal('modalMedicos');
            cargarMedicos();
            cargarDashboard();
        } 

    } catch (error) {
        console.error(error);
        errorEl.textContent = 'Error de conexión con la API';
    }
}



// ======================================================
// ELIMINAR
// ======================================================


async function eliminarMedicos(id, nombre) {
    // 1. Validaciones básicas
    if (!id) return alert("ID inválido");

    // 2. Confirmación visual
    if (!confirm('¿Está seguro de que desea eliminar al médico: ' + nombre + '?')) return;

    try {
        // 3. Ejecución del DELETE
        
        const res = await fetch(`${API_LOCAL}/catalogos/Medicos/${id}/`, {
            method: 'DELETE'
        });

        // 4. Manejo de la respuesta
        if (res.ok) {
            // Si todo sale bien, actualizamos la interfaz
            cargarMedicos();
            cargarDashboard();
        } else {
            // Si el servidor devuelve un error (como el ProtectedError),
            // lo capturamos para informar al usuario en lugar de dejarlo en consola.
            const errorData = await res.text();
            console.error("Error al eliminar médico:", errorData);
            
            
            alert("No se puede eliminar este médico porque tiene citas médicas asignadas. Primero debe eliminar o reasignar sus citas.");
        }
    } catch (error) {
        // 5. Manejo de errores de red
        console.error("Error de conexión:", error);
        alert("Error de conexión con el servidor. Verifique que la API esté activa.");
    }
}


var citasMedicasIdActual = null;

// ======================================================
// CARGAR CITAS MÉDICAS
// ======================================================
async function cargarCitasMedicas() {
    const cargando = document.getElementById('cargandoCitasMedicas');
    const tbody = document.getElementById('bodyCitasMedicas');
    
    cargando.style.display = 'block';
    
    try {
        const respuesta = await fetch(API_LOCAL + '/catalogos/CitasMedicas/');
        const data = await respuesta.json();

        const citas = Array.isArray(data) ? data : data.results || [];
        tbody.innerHTML = ''; // Limpiar tabla

        citas.forEach(c => {
            const pNombre = c.paciente_nombre || c.paciente;
            const mNombre = c.medico_nombre || c.medico;

            const pNombreSeguro = String(pNombre ?? '').replace(/'/g, "\\'");
            const motivoSeguro = String(c.motivo ?? '').replace(/'/g, "\\'");
            
            let fechaTexto = (c.fecha_hora ?? '').replace(/[-+]\d{2}:\d{2}$/, '');
            fechaTexto = fechaTexto.trim().replace(' ', 'T');
            const fechaCita = new Date(fechaTexto);
            const ahora = new Date();

            const tiempoCita = isNaN(fechaCita.getTime()) ? 0 : fechaCita.getTime();
            const tiempoAhora = ahora.getTime();

            // 3. Evaluación de asistencia (Manual por BD o Automática por tiempo cumplido)
            const esAtendida = c.atendida === true || 
                               c.atendida === 'true' || 
                               c.atendida === 1 || 
                               c.atendida === '1' ||
                               (tiempoCita > 0 && tiempoCita <= tiempoAhora);

            const atendidaIcono = esAtendida 
                ? '<span style="color: #28a745; font-size: 1.2rem; font-weight: bold;">✔</span>' 
                : '<span style="color: #dc3545; font-size: 1.2rem; font-weight: bold;">❌</span>';
            
            tbody.innerHTML += `
                <tr>
                    <td>${pNombre}</td>
                    <td>${mNombre}</td>
                    <td>${(c.fecha_hora ?? '').replace('T', ' ')}</td>
                    <td>${c.motivo ?? ''}</td>
                    <td style="text-align: center;">${atendidaIcono}</td>
                    <td class="td-acciones">
                        <button class="btn-accion btn-editar" 
                            onclick="abrirModalCitasMedicas(
                                'editar', 
                                ${c.id}, 
                                ${c.paciente},
                                ${c.medico}, 
                                '${c.fecha_hora}', 
                                ${esAtendida},
                                '${motivoSeguro}'
                            )">✏Editar</button>
                        <button class="btn-accion btn-eliminar"
                            onclick="eliminarCitasMedicas(${c.id}, '${pNombreSeguro}')">🗑Eliminar</button>
                    </td>
                </tr>
            `;
        });
        
        cargando.style.display = 'none';
    } catch (error) {
        console.error('Error en cargarCitasMedicas:', error);
        cargando.style.display = 'none';
    }
}

// ======================================================
// CARGAR OPCIONES (SELECTS)
// ======================================================
async function cargarOpcionesCitasMedicas() {
    const selectPacientes = document.getElementById('nomCitasMedicas');
    const selectMedicos = document.getElementById('cdCitasMedicas');

    if (!selectPacientes || !selectMedicos) {
        console.error('No se encontraron los select de pacientes o médicos');
        return;
    }

    selectPacientes.innerHTML = '<option value="">-- Seleccione Paciente --</option>';
    selectMedicos.innerHTML = '<option value="">-- Seleccione Médico --</option>';

    try {
        // PACIENTES
        const respPacientes = await fetch(API_LOCAL + '/catalogos/Pacientes/');
        if (!respPacientes.ok) throw new Error('Error cargando pacientes');
        const datosPacientes = await respPacientes.json();
        const pacientes = Array.isArray(datosPacientes) ? datosPacientes : datosPacientes.results || [];

        for (const p of pacientes) {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = `${p.nombres} ${p.apellidos}`;
            selectPacientes.appendChild(option);
        }

        // MÉDICOS
        const respMedicos = await fetch(API_LOCAL + '/catalogos/Medicos/');
        if (!respMedicos.ok) throw new Error('Error cargando médicos');
        const datosMedicos = await respMedicos.json();
        const medicos = Array.isArray(datosMedicos) ? datosMedicos : datosMedicos.results || [];

        for (const m of medicos) {
            const option = document.createElement('option');
            option.value = m.id;
            option.textContent = `${m.nombres} ${m.apellidos}`;
            selectMedicos.appendChild(option);
        }
        
    } catch (error) {
        console.error('No se pudieron cargar pacientes y médicos:', error);
    }
}

// ======================================================
// BUSCADOR
// ======================================================
function activarBuscador() {
    const buscador = document.getElementById('buscarCitasMedicas');
    if (!buscador) return;

    buscador.addEventListener('input', function() {
        const textoBusqueda = buscador.value.toLowerCase();
        const filas = document.querySelectorAll('#bodyCitasMedicas tr');

        filas.forEach(function(fila) {
            const textoDeFila = fila.textContent.toLowerCase();
            fila.style.display = textoDeFila.includes(textoBusqueda) ? '' : 'none';
        });
    });
}

// ======================================================
// MODAL (ABRIR)
// ======================================================
async function abrirModalCitasMedicas(modo, id, paciente, medico, fecha_hora, atendida, motivo) {
    document.getElementById('modalCMTitulo').textContent =
        modo === 'crear' ? 'Nueva Cita Médica' : 'Editar Cita Médica';

    document.getElementById('CitasMedicasError').textContent = '';
    citasMedicasIdActual = modo === 'editar' ? id : null;

    await cargarOpcionesCitasMedicas();

    document.getElementById('fecha_hora').value = fecha_hora || '';
    document.getElementById('motivo').value = motivo || '';

    const selectAtendida = document.getElementById('atendidaCita');
    if (selectAtendida) {
        // Si es una creación forzamos cadena "false", si es edición respetamos el valor booleano
        selectAtendida.value = modo === 'crear' ? "false" : String(atendida); 
    }
  
    if (modo === 'editar') {
        document.getElementById('nomCitasMedicas').value = paciente;
        document.getElementById('cdCitasMedicas').value = medico;
    }

    document.getElementById('modalCitasMedicas').classList.add('activo');
}

// ======================================================
// CERRAR MODAL
// ======================================================
function cerrarModal(id) {
    document.getElementById(id).classList.remove('activo');
}

// ======================================================
// GUARDAR (POST / PUT)
// ======================================================
async function guardarCitasMedicas() {
    var paciente    = document.getElementById('nomCitasMedicas').value;
    var medico      = document.getElementById('cdCitasMedicas').value;
    var fecha_hora  = document.getElementById('fecha_hora').value;
    var motivo      = document.getElementById('motivo').value;
    
    
    var fechaFormulario = document.getElementById('fecha_hora').value; 

    
    const fechaCita = new Date(fechaFormulario);
    const ahora = new Date();

    const tiempoCita = isNaN(fechaCita.getTime()) ? 0 : fechaCita.getTime();
    const tiempoAhora = ahora.getTime();

   
    let atendida = (tiempoCita > 0 && tiempoCita <= tiempoAhora);
    var errorEl = document.getElementById('CitasMedicasError');

    if (!paciente || !medico || !fecha_hora) {
        errorEl.textContent = 'Todos los campos obligatorios deben completarse.';
        return;
    }

    var body = JSON.stringify({
        paciente: Number(paciente),
        medico: Number(medico),
        fecha_hora: fecha_hora,
        motivo: motivo,
        atendida: atendida
    });

    var metodo = citasMedicasIdActual === null ? 'POST' : 'PUT';
    var url = citasMedicasIdActual === null
        ? API_LOCAL + '/catalogos/CitasMedicas/'
        : API_LOCAL + '/catalogos/CitasMedicas/' + citasMedicasIdActual + '/';

    try {
        var respuesta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: body
        });

        if (respuesta.ok) {
            cerrarModal('modalCitasMedicas');
            cargarCitasMedicas();
            if (typeof cargarDashboard === 'function') cargarDashboard();
        } else {
            var errores = await respuesta.json();
            errorEl.textContent = JSON.stringify(errores);
        }

    } catch (error) {
        errorEl.textContent = 'Error de conexión con la API.';
        console.error('Error en guardarCitasMedicas:', error);
    }
}

// ======================================================
// ELIMINAR
// ======================================================
async function eliminarCitasMedicas(id, nombre) {
    if (!id) return alert("ID inválido");
    if (!confirm('¿Desea eliminar la cita de ' + nombre + '?')) return;

    try {
        const res = await fetch(`${API_LOCAL}/catalogos/CitasMedicas/${id}/`, { 
            method: 'DELETE' 
        });

        if (res.ok) {
            cargarCitasMedicas();
            if (typeof cargarDashboard === 'function') cargarDashboard();
        } else {
            const errorData = await res.text();
            console.error("Error al eliminar:", errorData);
            alert("No se puede eliminar: Este registro tiene información vinculada.");
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error de conexión con el servidor.");
    }
}


// ======================================================
//                       MEDICAMENTOS
// ======================================================
var medicamentosIdActual = null;


async function cargarMedicamentos() {
    const cargando = document.getElementById('cargandoMedicamentos');
    const tbody = document.getElementById('bodyMedicamentos');
    
    if (!tbody) return;
    if (cargando) cargando.style.display = 'block';
    
    try {
        const respuesta = await fetch(API_LOCAL + '/catalogos/Medicamentos/');
        const data = await respuesta.json();

        const registros = Array.isArray(data) ? data : data.results || [];
        tbody.innerHTML = ''; 

        registros.forEach(rm => {
            const pNombre = rm.paciente_nombre || rm.paciente;
            const mNombre = rm.medico_nombre || rm.medico;

            const pNombreSeguro = String(pNombre ?? '').replace(/'/g, "\\'");
            const nombreSeguro = String(rm.nombre ?? '').replace(/'/g, "\\'");
            const descripcionSegura = String(rm.descripcion ?? '').replace(/'/g, "\\'");

            tbody.innerHTML += `
                <tr>
                    <td>${rm.nombre ?? ''}</td>
                    <td>${pNombre}</td>
                    <td>${mNombre}</td>
                    <td>${rm.fecha_prescripcion ?? ''}</td>
                    <td>${rm.descripcion ?? ''}</td>
                    <td class="td-acciones">
                        <button class="btn-accion btn-editar" 
                            onclick="abrirModalMedicamentos(
                                'editar', 
                                ${rm.id}, 
                                ${rm.paciente},
                                ${rm.medico}, 
                                '${nombreSeguro}', 
                                '${rm.fecha_prescripcion}', 
                                '${descripcionSegura}'
                            )">✏Editar</button>
                        <button class="btn-accion btn-eliminar"
                            onclick="eliminarMedicamentos(${rm.id}, '${pNombreSeguro}')">🗑Eliminar</button>
                    </td>
                </tr>
            `;
        });
        
        if (cargando) cargando.style.display = 'none';
    } catch (error) {
        console.error('Error en cargarMedicamentos:', error);
        if (cargando) cargando.style.display = 'none';
    }
}


function activarBuscadorMedicamentos() {
  const buscador = document.getElementById('buscarMedicamentos');
  if (!buscador) return; // Validación extra

  buscador.addEventListener('input', function() {
    const textoBusqueda = buscador.value.toLowerCase();
    const filas = document.querySelectorAll('#bodyMedicamentos tr');
    filas.forEach(fila => {
      fila.style.display = fila.textContent.toLowerCase().includes(textoBusqueda) ? '' : 'none';
    });
  });
}

// ======================================================
// 2. CONFIGURAR Y ABRIR LA VENTANA MODAL
// ======================================================
async function abrirModalMedicamentos(modo, id, paciente, medico, nombre, fecha_prescripcion, descripcion) {
    document.getElementById('modalMTitulo').textContent =
        modo === 'crear' ? 'Nuevo Medicamento' : 'Editar Medicamento';

    document.getElementById('MedicamentosError').textContent = '';
    medicamentosIdActual = modo === 'editar' ? id : null;

    // Llama a la función encargada de llenar las opciones de Pacientes y Médicos
    if (typeof cargarOpcionesMedicamentos === 'function') {
        await cargarOpcionesMedicamentos();
    }

    if (modo === 'editar') {
        document.getElementById('nomMedicamentos').value = paciente;
        document.getElementById('mdMedicamentos').value = medico;
        document.getElementById('nombre').value = nombre || '';
        document.getElementById('fecha_prescripcion').value = fecha_prescripcion ? fecha_prescripcion.split('T')[0] : '';
        document.getElementById('descripcion').value = descripcion || '';
    } else {
        document.getElementById('nomMedicamentos').value = '';
        document.getElementById('mdMedicamentos').value = '';
        document.getElementById('nombre').value = '';
        document.getElementById('fecha_prescripcion').value = '';
        document.getElementById('descripcion').value = '';
    }

    document.getElementById('modalMedicamentos').classList.add('activo');
}

// ======================================================
//                         GUARDAR 
// ======================================================
async function guardarMedicamentos() {
    const paciente = document.getElementById('nomMedicamentos').value;
    const medico = document.getElementById('mdMedicamentos').value;
    const nombre = document.getElementById('nombre').value;
    const fecha_prescripcion = document.getElementById('fecha_prescripcion').value;
    const descripcion = document.getElementById('descripcion').value;
    const errorEl = document.getElementById('MedicamentosError');

    if (!paciente || !medico || !nombre || !fecha_prescripcion) {
        errorEl.textContent = 'Paciente, Médico, Nombre y Fecha de Prescripción son campos obligatorios.';
        return;
    }

    const bodyData = JSON.stringify({
        paciente: Number(paciente),
        medico: Number(medico),
        nombre: nombre,
        fecha_prescripcion: fecha_prescripcion,
        descripcion: descripcion
    });

    const metodo = medicamentosIdActual === null ? 'POST' : 'PUT';
    const url = medicamentosIdActual === null
        ? API_LOCAL + '/catalogos/Medicamentos/'
        : `${API_LOCAL}/catalogos/Medicamentos/${medicamentosIdActual}/`;

    try {
        const respuesta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: bodyData
        });

        if (respuesta.ok) {
            cerrarModal('modalMedicamentos');
            cargarMedicamentos();
            if (typeof cargarDashboard === 'function') cargarDashboard();
        } else {
            
            const contentType = respuesta.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errores = await respuesta.json();
                errorEl.textContent = JSON.stringify(errores);
            } else {
                
                const textoHtml = await respuesta.text();
                console.group("🛑 ERROR DETALLADO DE DJANGO");
                console.error("Código de Estado:", respuesta.status);
                console.log("Respuesta del Servidor:");
                console.log(textoHtml.substring(0, 1000)); 
                console.groupEnd();

                errorEl.textContent = `Error ${respuesta.status}: Revisa la consola (F12) o la terminal de Django.`;
            }
        }
    } catch (error) {
        console.error('Error en guardarMedicamentos:', error);
        errorEl.textContent = 'Error en el canal de comunicación con la API.';
    }
}

// ======================================================
// 4. CARGAR SELECTS DE PACIENTES Y MÉDICOS 
// ======================================================
async function cargarOpcionesMedicamentos() {
    const selectPacientes = document.getElementById('nomMedicamentos');
    const selectMedicos = document.getElementById('mdMedicamentos');

   
    if (!selectPacientes || !selectMedicos) return;

   
    selectPacientes.innerHTML = '<option value="">-- Seleccione Paciente--</option>';
    selectMedicos.innerHTML = '<option value="">-- Seleccione Médico --</option>';

    try {
        
        const [respPacientes, respMedicos] = await Promise.all([
            fetch(API_LOCAL + '/catalogos/Pacientes/'),
            fetch(API_LOCAL + '/catalogos/Medicos/')
        ]);

        const datosPacientes = await respPacientes.json();
        const datosMedicos = await respMedicos.json();

        
        const pacientes = Array.isArray(datosPacientes) ? datosPacientes : datosPacientes.results || [];
        const medicos = Array.isArray(datosMedicos) ? datosMedicos : datosMedicos.results || [];

        // Llenamos el selector de Pacientes
        pacientes.forEach(p => {
            const op = document.createElement('option');
            op.value = p.id;
            op.textContent = `${p.nombres} ${p.apellidos}`;
            selectPacientes.appendChild(op);
        });

        // Llenamos el selector de Médicos
        medicos.forEach(m => {
            const op = document.createElement('option');
            op.value = m.id;
            op.textContent = `${m.nombres} ${m.apellidos}`;
            selectMedicos.appendChild(op);
        });

    } catch (error) {
        console.error('Error cargando listas desplegables de medicamentos:', error);
    }
}

// ======================================================
// 5. ELIMINAR REGISTRO DE MEDICAMENTOS 
// ======================================================
async function eliminarMedicamentos(id, nombrePaciente) {
    if (!id) return;
    
    // Alerta de confirmación nativa del navegador usando el nombre del paciente
    if (!confirm(`¿Desea eliminar de forma permanente este medicamento asignado a ${nombrePaciente}?`)) return;

    try {
        const respuesta = await fetch(`${API_LOCAL}/catalogos/Medicamentos/${id}/`, { 
            method: 'DELETE' 
        });

        if (respuesta.ok) {
           
            cargarMedicamentos();
            if (typeof cargarDashboard === 'function') cargarDashboard();
        } else {
            alert("El servidor no permitió borrar el registro. Verifique restricciones de integridad.");
        }
    } catch (error) {
        console.error("Error al conectar con la API para eliminar:", error);
        alert("Ocurrió un error en la comunicación de red.");
    }
}



var resultadosExamenesIdActual = null;

// ======================================================
// 1. CARGAR DATOS EN LA TABLA
// ======================================================
// ======================================================
// 1. CARGAR DATOS EN LA TABLA (CON ESCUDO DE PRESENCIA)
// ======================================================
async function cargarResultadosExamenes() {
    const cargando = document.getElementById('cargandoResultadosExamenes');
    const tbody = document.getElementById('bodyResultadosExamenes');
    
    // ESCUDO DE PRESENCIA: Si el elemento de la tabla no está renderizado en el DOM,
    // la función se detiene inmediatamente (return) de forma silenciosa.
    if (!tbody) return;
    
    if (cargando) cargando.style.display = 'block';
    
    try {
        const respuesta = await fetch(API_LOCAL + '/catalogos/ResultadosExamenes/');
        const data = await respuesta.json();

        const registros = Array.isArray(data) ? data : data.results || [];
        tbody.innerHTML = ''; 

        registros.forEach(re => {
            const pNombre = re.paciente_nombre || re.paciente;
            const mNombre = re.medico_nombre || re.medico;

            // Escapamos cadenas de texto para evitar roturas por comillas simples
            const pNombreSeguro = String(pNombre ?? '').replace(/'/g, "\\'");
            const examenSeguro = String(re.nombre_examen ?? '').replace(/'/g, "\\'");
            const resultadoSeguro = String(re.resultado ?? '').replace(/'/g, "\\'");

            tbody.innerHTML += `
                <tr>
                    <td>${pNombre}</td>
                    <td>${mNombre}</td>
                    <td>${re.nombre_examen ?? ''}</td>
                    <td>${re.resultado ?? ''}</td>
                    <td>${re.fecha ?? ''}</td>
                    <td class="td-acciones">
                        <button class="btn-accion btn-editar" 
                            onclick="abrirModalResultadosExamenes(
                                'editar', 
                                ${re.id}, 
                                ${re.paciente},
                                ${re.medico}, 
                                '${examenSeguro}', 
                                '${resultadoSeguro}', 
                                '${re.fecha}'
                            )">✏Editar</button>
                        <button class="btn-accion btn-eliminar"
                            onclick="eliminarResultadosExamenes(${re.id}, '${pNombreSeguro}')">🗑Eliminar</button>
                    </td>
                </tr>
            `;
        });
        
        if (cargando) cargando.style.display = 'none';
    } catch (error) {
        console.error('Error en cargarResultadosExamenes:', error);
        if (cargando) cargando.style.display = 'none';
    }
}

function activarBuscadorResultadosExamenes() {
  const buscador = document.getElementById('buscarResultadosExamenes');
  if (!buscador) return; // Validación extra

  buscador.addEventListener('input', function() {
    const textoBusqueda = buscador.value.toLowerCase();
    const filas = document.querySelectorAll('#bodyResultadosExamenes tr');
    filas.forEach(fila => {
      fila.style.display = fila.textContent.toLowerCase().includes(textoBusqueda) ? '' : 'none';
    });
  });
}


// ======================================================
//  MODAL
// ======================================================
async function abrirModalResultadosExamenes(modo, id, paciente, medico, nombre_examen, resultado, fecha) {
    document.getElementById('modalRETitulo').textContent =
        modo === 'crear' ? 'Nuevo Resultado' : 'Editar Resultado';

    document.getElementById('ResultadosExamenesError').textContent = '';
    resultadosExamenesIdActual = modo === 'editar' ? id : null;

    // Poblar las opciones dinámicas de Pacientes y Médicos
    await cargarOpcionesResultados();

    if (modo === 'editar') {
        document.getElementById('nomResultadosExamenes').value = paciente;
        document.getElementById('cdResultadosExamenes').value = medico;
        document.getElementById('nombre_examen').value = nombre_examen || '';
        document.getElementById('resultado').value = resultado || '';
        document.getElementById('fecha').value = fecha ? fecha.split('T')[0] : '';
    } else {
        document.getElementById('nomResultadosExamenes').value = '';
        document.getElementById('cdResultadosExamenes').value = '';
        document.getElementById('nombre_examen').value = '';
        document.getElementById('resultado').value = '';
        document.getElementById('fecha').value = '';
    }

    document.getElementById('modalResultadosExamenes').classList.add('activo');
}

// ======================================================
// 3. ENVIAR DATOS A DJANGO (POST / PUT)
// ======================================================
async function guardarResultadosExamenes() {
    const paciente = document.getElementById('nomResultadosExamenes').value;
    const medico = document.getElementById('cdResultadosExamenes').value;
    const nombre_examen = document.getElementById('nombre_examen').value;
    const resultado = document.getElementById('resultado').value;
    const fecha = document.getElementById('fecha').value;
    const errorEl = document.getElementById('ResultadosExamenesError');

    if (!paciente || !medico || !nombre_examen || !resultado || !fecha) {
        errorEl.textContent = 'Todos los campos son obligatorios.';
        return;
    }

    const bodyData = JSON.stringify({
        paciente: Number(paciente),
        medico: Number(medico),
        nombre_examen: nombre_examen,
        resultado: resultado,
        fecha: fecha
    });

    const metodo = resultadosExamenesIdActual === null ? 'POST' : 'PUT';
    const url = resultadosExamenesIdActual === null
        ? API_LOCAL + '/catalogos/ResultadosExamenes/'
        : `${API_LOCAL}/catalogos/ResultadosExamenes/${resultadosExamenesIdActual}/`;

    try {
        const respuesta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: bodyData
        });

        if (respuesta.ok) {
            cerrarModal('modalResultadosExamenes');
            cargarResultadosExamenes();
            if (typeof cargarDashboard === 'function') cargarDashboard();
        } else {
            const contentType = respuesta.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errores = await respuesta.json();
                errorEl.textContent = typeof errores === 'object' ? JSON.stringify(errores) : 'Error en los datos.';
            } else {
                const textoHtml = await respuesta.text();
                console.error("Error HTML de Django:", textoHtml);
                errorEl.textContent = `Error del servidor (${respuesta.status}). Revisa la terminal.`;
            }
        }
    } catch (error) {
        console.error('Error en guardarResultadosExamenes:', error);
        errorEl.textContent = 'Error de red al conectar con la API.';
    }
}

// ======================================================
// 4. CARGAR SELECTS DE PACIENTES Y MÉDICOS
// ======================================================
async function cargarOpcionesResultados() {
    const selectPacientes = document.getElementById('nomResultadosExamenes');
    const selectMedicos = document.getElementById('cdResultadosExamenes');

    if (!selectPacientes || !selectMedicos) return;

    selectPacientes.innerHTML = '<option value="">-- Seleccione Paciente --</option>';
    selectMedicos.innerHTML = '<option value="">-- Seleccione Médico --</option>';

    try {
        const [respPacientes, respMedicos] = await Promise.all([
            fetch(API_LOCAL + '/catalogos/Pacientes/'),
            fetch(API_LOCAL + '/catalogos/Medicos/')
        ]);

        const datosPacientes = await respPacientes.json();
        const datosMedicos = await respMedicos.json();

        const pacientes = Array.isArray(datosPacientes) ? datosPacientes : datosPacientes.results || [];
        const medicos = Array.isArray(datosMedicos) ? datosMedicos : datosMedicos.results || [];

        pacientes.forEach(p => {
            const op = document.createElement('option');
            op.value = p.id;
            op.textContent = `${p.nombres} ${p.apellidos}`;
            selectPacientes.appendChild(op);
        });

        medicos.forEach(m => {
            const op = document.createElement('option');
            op.value = m.id;
            op.textContent = `${m.nombres} ${m.apellidos}`;
            selectMedicos.appendChild(op);
        });
    } catch (error) {
        console.error('Error al poblar listas desplegables:', error);
    }
}

// ======================================================
// 5. ELIMINAR REGISTRO (DELETE)
// ======================================================
async function eliminarResultadosExamenes(id, nombrePaciente) {
    if (!id) return;
    if (!confirm(`¿Desea eliminar permanentemente el examen del paciente ${nombrePaciente}?`)) return;

    try {
        const respuesta = await fetch(`${API_LOCAL}/catalogos/ResultadosExamenes/${id}/`, { 
            method: 'DELETE' 
        });

        if (respuesta.ok) {
            cargarResultadosExamenes();
            if (typeof cargarDashboard === 'function') cargarDashboard();
        } else {
            alert("No se pudo eliminar el registro desde el servidor.");
        }
    } catch (error) {
        console.error("Error en eliminarResultadosExamenes:", error);
        alert("Error de red al intentar eliminar.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    activarBuscadorPacientes();
    activarBuscadorMedicos();
    activarBuscador();
    activarBuscadorMedicamentos();
    activarBuscadorResultadosExamenes();
   
});
