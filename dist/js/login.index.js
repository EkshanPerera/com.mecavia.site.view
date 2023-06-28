$(function () {
    $("#login-form").submit(function (event) {
        event.preventDefault();
        var username = $("#username").val();
        var password = $("#password").val();
        if(username==="" || password ===""){
           alert("username or password can't be null")
        }else{
            $(".login-box-msg").text("Sign in to start your session")
            $(".login-box-msg").css("color","currentColor")
            $.ajax({
                url: "http://localhost:8080/api/auth/authenticate",
                method: "post",
                data: JSON.stringify({ "email": username + "@grsgarment.com", "password": password }),
                contentType: 'application/json',
                success: function (data) {
                    localStorage.setItem("jwt_token", data.token);
                    window.location.href = "home/";
                },
                error: function (xhr, status, error) {
                    localStorage.removeItem("jwt_token");
                    $(".login-box-msg").text("Invalid username or password, Try agin!")
                    $(".login-box-msg").css("color","red")
                    return false;
                }
            })
        }
    });
})