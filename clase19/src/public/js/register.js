const form = document.getElementById('registerForm');

form.addEventListener('submit', evt => {
    evt.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key] = value);
    form.reset();
    fetch('/api/sessions/register',{
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result=>result.json())
    .then(json=>console.log(json));
});

function goToLogin() {
    location.href = '/api/views/login';
}