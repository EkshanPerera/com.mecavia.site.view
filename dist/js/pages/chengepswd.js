$(function () {
    $.validator.addMethod("pswdtally", function (value, element) {
        var newpassword = $("#newpassword").val();
        return newpassword == value;
    });
    $(document).on("click",".pwvisibility",function(){
        var input = $(this).parent().parent().children(':first-child');
        if (input.attr("type") === "password") {
          input.attr("type", "text");
          $(this).html("<span class=\"fas fa-eye-slash\"></span>");
        } else {
          input.attr("type", "password");
          $(this).html("<span class=\"fas fa-eye\"></span>");
        }
    })
    $('#chengepswd-form').validate({
        rules: {
            password: {
                required: true
            },
            newpassword: {
                required: true
            },
            confirmpassword: {
                required: true,
                pswdtally: true
            }
        },
        messages: {
            password: {
                required: "Please fillout password!"
            },
            newpassword: {
                required: "Please fillout new password!"
            },
            confirmpassword: {
                required: "Please fillout confirmation password!",
                pswdtally: "Please make sure your password match"
            },
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
            var password = $("#password").val();
            var newpassword = $("#newpassword").val();
            var parts = jwt.split('.');
            var encodedPayload = parts[1];
            var decodedPayload = atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'));
            var payload = JSON.parse(decodedPayload);
            $(".login-box-msg").text("Sign in to start your session")
            $(".login-box-msg").css("color", "currentColor")
            $.ajax({
                url: "http://localhost:8080/api/auth/changepswd",
                method: "POST",
                data: JSON.stringify({ "email": payload.sub , "password": password,"newPassword": newpassword }),
                contentType: 'application/json',
                headers: {
                    "Authorization": jwt
                },
                success: function (data) {
                    localStorage.setItem("jwt_token", data.token);
                    jwt = "Bearer " + localStorage.getItem("jwt_token");
                    Swal.fire(
                        'Changed!',
                        'Password has been changed',
                        'success'
                    )
                },
                error: function (xhr, status, error) {
                    $(".login-box-msg").text("Password incorrect,Please try agin!")
                    $(".login-box-msg").css("color", "red")
                }
            })
        }
    });
});