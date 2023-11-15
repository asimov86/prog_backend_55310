function functionLogout(){
    fetch('/api/sessions/logout')
    .then(result=> result.status)
    .then(status=>{
        console.log(status);
        location.assign("/api/views/login");
      });
    
};