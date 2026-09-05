
const API_LOCAL = 'http://127.0.0.1:8000'; 

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('usuario').value;
            const password = document.getElementById('password').value;
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

            try {
                const response = await fetch(API_LOCAL + '/Seguridad/login/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken 
                    },
                    body: JSON.stringify({ username, password })
                });

                if (response.status === 200) {
                    console.log("¡Login exitoso!");

                    

                    
                    window.location.href = "/Seguridad/dashboard/";

                   
                    
                } else {
                    alert('Usuario o contraseña incorrectos.');
                }
            } catch (error) {
                console.error('Error de conexión:', error);
                alert('No se pudo conectar con el servidor.');
            }
        });
    }
});