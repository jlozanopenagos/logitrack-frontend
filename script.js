
// URL de la API (backend)
//  Asegúrate de que el backend esté corriendo en el puerto 8080
const API_URL = 'https://logitrack-6fb99.containers.snapdeploy.app/api/envios';




function cargarEnvios() {
    console.log('Cargando envíos...');

    // Hacemos una petición GET a la API
    fetch(API_URL)
        .then(response => {

            // Verificar si la respuesta fue exitosa
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();  // Convertir la respuesta a JSON
        })
        .then(envios => {
            console.log(' Envíos recibidos:', envios);
            mostrarEnvios(envios);
        })
        .catch(error => {
            console.error(' Error al cargar envíos:', error);
            alert('No se pudo conectar con el servidor. Asegúrate de que Spring Boot esté ejecutándose.');
        });
}



function mostrarEnvios(envios) {
    const lista = document.getElementById('enviosLista');
    lista.innerHTML = '';  

    if (envios.length === 0) {
        lista.innerHTML = '<li>No hay envíos registrados</li>';
        return;
    }

    envios.forEach(envio => {
        const li = document.createElement('li');
        li.className = 'envio-item';
        li.innerHTML = `
            <div>
                <strong> ${envio.cliente}</strong>
                <span>Destino: ${envio.destino}</span>
                <span>Peso: ${envio.pesoKg} kg</span>
                <span>Estado: ${envio.estado}</span>
                <span> $${envio.costo}</span>
            </div>
            <button onclick="eliminarEnvio('${envio.id}')">Eliminar</button>
        `;
        lista.appendChild(li);
    });
}




function crearEnvio(event) {
    event.preventDefault();

    
    const cliente = document.getElementById('cliente').value;
    const destino = document.getElementById('destino').value;
    const pesoKg = parseFloat(document.getElementById('pesoKg').value);
    const estado = document.getElementById('estado').value;

   
    const nuevoEnvio = {
        cliente: cliente,
        destino: destino,
        pesoKg: pesoKg,
        estado: estado
    };

    console.log('Creando nuevo envío:', nuevoEnvio);

   
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoEnvio)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(envioCreado => {
            console.log('Envío creado:', envioCreado);
            alert('Envío creado exitosamente');
           
            cargarEnvios();
           
            document.getElementById('envioForm').reset();
        })
        .catch(error => {
            console.error('Error al crear envío:', error);
            alert('Error al crear el envío. Verifica que los datos sean correctos.');
        });
}




function eliminarEnvio(id) {
    if (!confirm(`¿Estás seguro de eliminar el envío con ID: ${id}?`)) {
        return;
    }

    console.log(` Eliminando envío con ID: ${id}`);

    fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            console.log(' Envío eliminado');
    
            cargarEnvios();
        })
        .catch(error => {
            console.error('Error al eliminar envío:', error);
            alert('Error al eliminar el envío');
        });
}




document.addEventListener('DOMContentLoaded', function () {
    console.log('LogiTrack Frontend cargado');
    cargarEnvios();
});


document.getElementById('envioForm').addEventListener('submit', crearEnvio);


document.getElementById('cargarBtn').addEventListener('click', cargarEnvios);