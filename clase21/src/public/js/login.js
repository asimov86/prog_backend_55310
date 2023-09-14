const form = document.getElementById('loginForm');
form.addEventListener('submit', evt => {
    evt.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key] = value);
    fetch('/api/sessions/login',{
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
        
        }
    }) .then(result=> result.status)
    .then(status=>{
        location.assign("/api/views/products");
      });
    
});

function goToRegister() {
    location.href = '/api/views/register';
}