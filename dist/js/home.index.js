var indexjs = $(function () {
    if (localStorage.getItem("jwt_token") === undefined || localStorage.getItem("jwt_token") === "" || localStorage.getItem("jwt_token") === null) {
        window.location.href = "../";
        jwt = "";
    } else {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $.ajax({
            url: "http://localhost:8080/api/auth/chkjwtvalidity",
            method: "post",
            headers: {
                "Authorization": jwt
            },
            contentType: 'application/json',
            error: function (xhr, status, error) {
                jwt = ""
                localStorage.removeItem("jwt_token")
                window.location.href = "../";
            }
        })
    }
    $("#lnkusergroup").click(function () {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $('.leaf-node a').removeClass('active');
        $(this).children().addClass('active');
    });

    $("#lnkuser").click(function () {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $('.leaf-node a').removeClass('active');
        $(this).children().addClass('active');
    });
    // Usergroup click event handler
    $("#lnkclient").click(function () {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $('.leaf-node a').removeClass('active');
        $(this).children().addClass('active');
    });
    // Usergroup click event handler
    $("#lnkmaterial").click(function () {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $('.leaf-node a').removeClass('active');
        $(this).children().addClass('active');
    });
    // Usergroup click event handler
    $("#lnkproduct").click(function () {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $('.leaf-node a').removeClass('active');
        $(this).children().addClass('active');
    });
    // Usergroup click event handler
    $("#lnkcreatepr").click(function () {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $('.leaf-node a').removeClass('active');
        $(this).children().addClass('active');
    });
    // Usergroup click event handler
    $("#lnkprapprove").click(function () {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $('.leaf-node a').removeClass('active');
        $(this).children().addClass('active');
    });
    // Usergroup click event handler
    $("#lnkprintpo").click(function () {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $('.leaf-node a').removeClass('active');
        $(this).children().addClass('active');
    });
    // Usergroup click event handler
    $("#lnkgrn").click(function () {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $('.leaf-node a').removeClass('active');
        $(this).children().addClass('active');
    });
    // Usergroup click event handler
    $("#lnkmr").click(function () {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $('.leaf-node a').removeClass('active');
        $(this).children().addClass('active');
    });
    // Usergroup click event handler
    $("#lnkcreatejob").click(function () {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $('.leaf-node a').removeClass('active');
        $(this).children().addClass('active');
    });
    // Usergroup click event handler
    $("#lnkbom").click(function () {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $('.leaf-node a').removeClass('active');
        $(this).children().addClass('active');
    });
    // Usergroup click event handler
    $("#lnkcreatejobid").click(function () {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $('.leaf-node a').removeClass('active');
        $(this).children().addClass('active');
    });
    // Usergroup click event handler
    $("#lnkuom").click(function () {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $('.leaf-node a').removeClass('active');
        $(this).children().addClass('active');
    });
    // Usergroup click event handler
    $("#lnkfgin").click(function () {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $('.leaf-node a').removeClass('active');
        $(this).children().addClass('active');
    });
    $("#lnkprintpr").click(function () {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $('.leaf-node a').removeClass('active');
        $(this).children().addClass('active');
    });
    $("#lnkgsreports").click(function () {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $('.leaf-node a').removeClass('active');
        $(this).children().addClass('active');
    });
    $("#lnkprreports").click(function () {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $('.leaf-node a').removeClass('active');
        $(this).children().addClass('active');
    });
    $("#lnkcoreports").click(function () {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $('.leaf-node a').removeClass('active');
        $(this).children().addClass('active');
    });  
    $("#lnkgrnreports").click(function () {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $('.leaf-node a').removeClass('active');
        $(this).children().addClass('active');
    });
    // GRN click event handler
    $("#grn").click(function () {
        jwt = "Bearer " + localStorage.getItem("jwt_token");
        $('.leaf-node a').removeClass('active');
        $(this).children().addClass('active');
        // window.history.pushState("", "", "/procurement/grn");
    });
});