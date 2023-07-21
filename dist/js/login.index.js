$(function () {
    $(document).on("click","#pwvisibility",function(){
        var input = $("#password");
        if (input.attr("type") === "password") {
          input.attr("type", "text");
          $("#pwvisibility").html("<span class=\"fas fa-eye-slash\"></span>");
        } else {
          input.attr("type", "password");
          $("#pwvisibility").html("<span class=\"fas fa-eye\"></span>");
        }
    })

$('#login-form').validate({
        rules: {
            username: {
                required: true
            },
            password: {
                required: true
            }
        },
        messages: {
            username: {
                required: "Please fillout username!"
            },
            password: {
                required: "Please fillout new password!"
            }
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.input-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        },
        submitHandler: function () {
            var username = $("#username").val();
            var password = $("#password").val();
            $(".login-box-msg").text("Sign in to start your session")
            $(".login-box-msg").css("color","currentColor")
            $.ajax({
                url: "http://localhost:8080/api/auth/authenticate",
                method: "post",
                data: JSON.stringify({ "email": username + "@gmail.com", "password": password }),
                contentType: 'application/json',
                success: function (data) {
                    localStorage.setItem("jwt_token", data.token);
                    $("#username").val(undefined);
                    $("#password").val(undefined);
                    window.history.pushState({}, '', '/');
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