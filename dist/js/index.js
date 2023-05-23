!$(function () {
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
        $("#content").load("pages/corporate/material.html");
    });
     // Usergroup click event handler
     $("#lnkproduct").click(function () {
        $("#content").load("pages/corporate/product.html");
    });
    // Usergroup click event handler
    $("#lnkcreatepr").click(function () {
        $("#content").load("pages/corporate/purchaserequisition.html");
    });
    // Usergroup click event handler
     $("#lnkprapprove").click(function () {
        $("#content").load("pages/corporate/prapprove.html");
    });
    // Usergroup click event handler
    $("#lnkprintpo").click(function () {
        $("#content").load("pages/corporate/purchaseorder.html");
    });
    // Usergroup click event handler
     $("#lnkgrn").click(function () {
        $("#content").load("pages/corporate/grn.html");
    });
      // Usergroup click event handler
      $("#lnkmr").click(function () {
        $("#content").load("pages/corporate/materialrequisition.html");
    });
      // Usergroup click event handler
      $("#lnkcreatejob").click(function () {
        $("#content").load("pages/corporate/customerorder.html");
    });
    // Usergroup click event handler
    $("#lnkbom").click(function () {
        $("#content").load("pages/corporate/bom.html");
    });
    // Usergroup click event handler
    $("#lnkcreatejobid").click(function () {
        $("#content").load("pages/corporate/caaccept.html");
    });
    // Usergroup click event handler
    $("#lnkfgin").click(function () {
        $("#content").load("pages/corporate/fgin.html");
    });
    // PR click event handler
    $("#pr").click(function () {
        $(".content").load("pr.html");
    });
    // GRN click event handler
    $("#grn").click(function () {
        $(".content").load("grn.html");
        // window.history.pushState("", "", "/procurement/grn");
    });
});