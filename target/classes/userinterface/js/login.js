function login(){
    //do call to backend here
    var pass = true;
    if (pass){
       window.history.pushState('obj',"MedStock Main", "/home");
        alert("done");
    }else{
        alert("Login Failed, please try again");
    }
}