function functionLogout(){
    fetch('/api/sessions/logout')
    .then(result=> result.status)
    .then(status=>{
        location.assign("/api/views/login");
      });
    
};