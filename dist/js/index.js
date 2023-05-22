$(document).ready(function () {
    // Initial content to load
    // $("#content").load("dashboard.html");

    // Login form submit event handler
    $("#login-form").submit(function (event) {
        event.preventDefault();

        // Perform login validation and redirect to index.html
        // Replace the code below with your login validation logic
        var username = $("#username").val();
        var password = $("#password").val();

        if (username === "admin" && password === "password") {
            window.location.href = "index.html";
        } else {
            alert("Invalid credentials!");
        }
    });
    // Usergroup click event handler
    $("#lnkusergroup").click(function () {
        $("#content").load("pages/corporate/usergroups.html");
    });

     // Usergroup click event handler
     $("#lnkuser").click(function () {
        $("#content").load("pages/corporate/users.html");
    });
     // Usergroup click event handler
     $("#lnkclient").click(function () {
        $("#content").load("pages/corporate/clients.html");
    });
     // Usergroup click event handler
     $("#lnkmaterial").click(function () {
        $("#content").load("pages/corporate/materials.html");
    });
     // Usergroup click event handler
     $("#lnkproduct").click(function () {
        $("#content").load("pages/corporate/products.html");
    });
    // PR click event handler
    $("#pr").click(function () {
        $(".content").load("pr.html");
    });

    // GRN click event handler
    $("#grn").click(function () {
        $(".content").load("grn.html");
        window.history.pushState("", "", "/procurement/grn");
    });
});