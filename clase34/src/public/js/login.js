const form = document.getElementById('loginForm');
form.addEventListener('submit', async evt => {
    try {
        evt.preventDefault();
        const data = new FormData(form);
        const obj = {};
        data.forEach((value,key)=>obj[key] = value);

        const headers = {
            'Content-Type': 'application/json',
        
        };
        const method = 'POST';
        const body = JSON.stringify(obj);

        const response = await fetch('/api/sessions/login',{
            headers,
            method,
            body,
        })
        /* const responseData = await response.json();
        console.log(responseData);
        localStorage.setItem('authToken', responseData.token)
        // Redirigir a la vista /api/views/products
        location.assign("/api/views/products"); */
        //////////////////////////////////

        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData);
            localStorage.setItem('authToken', responseData.token);
            // Redirigir a la vista /api/views/products
            location.assign("/api/views/products");
        } else {
            // Si la respuesta no es exitosa (por ejemplo, error de autenticación)
            const errorData = await response.json(); // Puedes parsear la respuesta como un objeto JSON si hay un mensaje de error
            console.log(`Error: ${response.status} - ${errorData.message}`);
            // Manejar el error, por ejemplo, mostrar un mensaje al usuario
            // Puedes actualizar el DOM para mostrar un mensaje de error
            // Por ejemplo:
            // const errorElement = document.getElementById('error-message');
            // errorElement.innerText = `Error: ${response.status} - ${errorData.message}`;
        }
        //////////////////////////////////////
    } catch (error) {
        console.log(`Error en la solicitud: ${error}`);
        responseLogin.innerText = `Tenemos un error ${error.error}`;
    }
    
});

function goToRegister() {
    location.href = '/api/views/register';
}