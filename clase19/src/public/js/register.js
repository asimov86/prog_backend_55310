const form = document.getElementById('createUserForm');
const response = document.getElementById('response');
form.addEventListener('submit', evt => {
    evt.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key] = value);

    fetch('/api/sessions/register',{
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(obj),
    }).then( (response) => response.json())
    .then( data => (response.innerHTML = data.message))
    .catch( (err) => console.log(err) );
});

function goToLogin() {
    location.href = '/api/views/login';
}