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
        const responseData = await response.json();
        console.log(responseData);
        localStorage.setItem('authToken', responseData.token)
        // Redirigir a la vista /api/views/products
        location.assign("/api/views/products");
    } catch (error) {
        console.log(error);
        responseLogin.innerText = `Tenemos un error ${error.error}`;
    }
    
});

function goToRegister() {
    location.href = '/api/views/register';
}