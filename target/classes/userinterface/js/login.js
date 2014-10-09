function login() {
    //do call to backend here
    var form = $("#form-login");
    if (loginRequest(form.serialize()) === "true") {
        window.history.pushState('obj', "MedStock Main", "/home");
    } else {
        alert("Login Failed, please try again");
    }
}

function loginRequest(parameters) {
    return $.ajax({
        type: "GET",
        url: "/login?"+parameters,
        async: false
    }).responseText;
}