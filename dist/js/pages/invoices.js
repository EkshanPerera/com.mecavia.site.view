$(function () {
    //variables
    var customerorderClassesInstence = customerorderClasses.customerorderClassesInstence()
    let customerorder_col = customerorderClassesInstence.customerorder_service;
    let customerorderobj = customerorderClassesInstence.customerorder;
    let customerOrderProductsobjarr = [];
    var productClassesInstence = productClasses.productClassesInstence();
    let product_col = productClassesInstence.product_service;
    let productobj = productClassesInstence.product;
    var clientClassesInstence = clientClasses.clientClassesInstence();
    let cli_col = clientClassesInstence.cli_service;
    let cli_obj = clientClassesInstence.client;

    var addmoddel = undefined;
    var selectedcode = undefined;
    var jwtPayload = undefined;

    var t35 = $("#table35").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });

    var Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });
    var t13 = $("#table13").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body popup"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        "autoWidth": false,
    })
    //end of variables
    //functions
    //defalt functions

    // $.validator.setDefaults({ 
    // });
    // Get the input element

    $('#quickForm8').validate({
        rules: {
            customerorderremark: {
                required: true
            }

        },
        messages: {
            customerorderremark: {
                required: "Please fillout the remark!"
            },
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('is-invalid');
        }, submitHandler: function () {
            if (cli_obj.id && customerOrderProductsobjarr.length != 0) {
                if (customerorderobj.status == "ACCEPTED" || customerorderobj.status == "INVOICED") {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, accept it!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            if (customerorderobj.status == "ACCEPTED") {
                                var code = genaratecode();
                                var status = "INVOICED";
                                var year = new Date().getFullYear();
                                var month = new Date().getMonth();
                                var day = new Date().getDate();
                                var date = day + "/" + (parseInt(month) + 1) + "/" + year;
                                setNewValues(code, status, date);
                                submit();
                            }
                            $("#podiv").show();
                            $("#podiv").print();
                            $("#podiv").hide();
                        }
                    })
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please enter the valid PR number!',
                });
            }
        }
    });
    //definded functions
    function getJwtPayload() {
        var parts = jwt.split('.');
        var encodedPayload = parts[1];
        var decodedPayload = atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'));
        var payload = JSON.parse(decodedPayload);
        return payload;
    }
    function refreshtable() {
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI00304") != undefined || jwtPayload.businessRole == "ADMIN") {
            customerorder_col.clear();
            product_col.clear();
            cli_col.clear();
            addmoddel = undefined;
            t35.clear().draw(false);
            t13.clear().draw(false);
            $.ajax({
                url: "http://localhost:8080/api/customerorderctrl/getcustomerorders",
                dataType: "JSON",
                headers: {
                    "Authorization": jwt
                },
                success: function (data) {
                    $.each(data.content, function (i, item) {
                        if (item.status == "ACCEPTED" || item.status == "INVOICED") {
                            customerorder_col.addCustomerOrdertoArray(item.id, item.code, item.jobID, item.jobNumber, item.customerid, item.totalAmount, item.grossAmount, item.remark, item.customerOrderProducts, item.printeddate, item.status, item.enteredUser, item.enteredDate, item.acceptedUser, item.acceptedDate, item.invoices);
                            t13.row.add([item.code, item.jobNumber]).draw(false);
                        }
                    });
                    var $tableRow = $("#table13 tr td:contains('" + selectedcode + "')").closest("tr");
                    $tableRow.addClass("selected");
                    setValues(selectedcode);
                    fadepageloder();
                },
                error: function (xhr, status, error) {
                    fadepageloder();
                }
            })
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI00401)',
            });
        }
    }
    //definded functions
    function submit() {
        showpageloder();
        var url;
        var method;

        url = "http://localhost:8080/api/customerorderctrl/updatecustomerorder";
        method = "PUT";
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(customerorderobj),
            contentType: 'application/json',
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                var enteredUser = customerorderobj.enteredUser
                var enteredUserEmail = enteredUser.email;
                var enteredUserTpNo = enteredUser.contactNumbers.find(contactnoitem => contactnoitem.isdef == true).tpno
                // sendEmail(enteredUserEmail,"Accepted Customer Order (CO ID: "+customerorderobj.code+")","Hello "+ enteredUser.firstname +",\nCustomer Order ID of "+ customerorderobj.code +" which is entered by you, have been accepted by "+jwtPayload.firstname +" " +jwtPayload.lastname +".  The Job ID is "+ customerorderobj.jobID +".");
                // sendSMS(enteredUserTpNo,"Hello%20"+ enteredUser.firstname +",%20Customer%20Order%20ID%20of%20"+ customerorderobj.code +"%20which%20is%20entered%20by%20you,%20have%20been%20accepted%20by%20"+jwtPayload.firstname +"%20" +jwtPayload.lastname +".%20The%20Job%20ID%20is%20"+ customerorderobj.jobID +".");
                refreshtable();
                selectedcode = undefined;
            }
        })
    }
    function sendEmail(recipent, subject, body) {
        $.ajax({
            url: "http://localhost:8080/api/emailctrl/sendemail",
            method: "POST",
            data: JSON.stringify({ "toEmail": recipent, "subject": subject, "body": body }),
            contentType: 'application/json',
            headers: {
                "Authorization": jwt
            }
        })
    }
    function sendSMS(receiver, massage) {
        $.ajax({
            url: "http://localhost:8080/api/smsctrl/sendsms",
            method: "POST",
            data: JSON.stringify({ "receiver": receiver, "massage": massage }),
            contentType: 'application/json',
            headers: {
                "Authorization": jwt
            }
        })
    }
    function formctrl() {
        $(".formfillin").prop("disabled", true);
    }
    function commaSeparateNumber(val) {
        while (/(\d+)(\d{3})/.test(val.toString())) {
            val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
        }
        if (val != "") {
            if (val.indexOf('.') == -1) {
                val = val + ".00";
            } else {
                val = val;
            }
        } else {
            val = val;
        }
        return val;

    }
    function setValues(code) {
        formctrl();
        addmoddel = undefined;
        if (code) {
            customerorderobj = customerorder_col.getCustomerOrder(code);
            if (customerorderobj != undefined) {
                customerOrderProductsobjarr = customerorderobj.customerOrderProducts;
                $("#customerorder_code").val(customerorderobj.code);
                $("#customerorder_jobcode").val(customerorderobj.jobID);
                $("#customerorder_unitrate").val(customerorderobj.unitrate)
                $("#customerorder_quntity").val(customerorderobj.quntity)
                $("#customerorder_remark").val(customerorderobj.remark);
                $("#customerorder_jobno").val(customerorderobj.jobNumber);
                $("#customerorder_totalamount").val(customerorderobj.totalAmount);
                $("#customerorder_status").val(customerorderobj.status);
                var year = new Date().getFullYear();
                var month = new Date().getMonth();
                var day = new Date().getDate();
                var date = day + "/" + (parseInt(month) + 1) + "/" + year;

                if (customerorderobj.printeddate) {
                    $("#podate").text(customerorderobj.printeddate)
                } else {
                    $("#podate").text(date);
                }
                if (customerorderobj.customerid) {
                    cli_obj = customerorderobj.customerid;
                    $("#customerorder_customerid").val(customerorderobj.customerid.code + " - " + customerorderobj.customerid.firstname + " " + customerorderobj.customerid.lastname);
                    $("#suppliername").text(customerorderobj.customerid.firstname + " " + customerorderobj.customerid.lastname);
                    $.each(customerorderobj.customerid.addresses, function (i, item) {
                        if (item.isdef == true) {
                            $("#supplieraddline01").text(item.line01)
                            $("#supplieraddline02").text(item.line02)
                            if (item.line04)
                                $("#supplieraddline03").text(item.line03 + "," + item.line04 + ".");
                            else
                                $("#supplieraddline03").text(item.line03 + ".");
                        }
                    })
                    $.each(customerorderobj.customerid.contactNumbers, function (i, item) {
                        if (item.isdef == true) {
                            $("#supplercontact").text(item.tpno);
                        }
                    })
                    if (customerorderobj.customerid.email) {
                        $("#supplieremail").text(customerorderobj.customerid.email);
                    }
                }
                if (customerorderobj.product) {
                    product_obj = customerorderobj.product;
                    $("#customerorder_productid").val(customerorderobj.product.code + " - " + customerorderobj.product.name);
                }
                if (customerorderobj.customerOrderProducts) {
                    t35.clear().draw(false);
                    var dataset = "";
                    var icont = 1;
                    $.each(customerorderobj.customerOrderProducts, function (i, item) {
                        icont += 1;
                        t35.row.add([i + 1, item.product.name, item.quantity]).draw(false);
                        dataset += "<tr><td>" + (i + 1) + "</td><td>" + item.product.desc + "</td><td> <div style=\"text-align: right;\"> Rs. " + commaSeparateNumber(String(item.unitrate)) + "</div></td><td><div style=\"text-align: right;\">" + commaSeparateNumber(String(item.quantity)) + "</div></td><td><div style=\"text-align: right;\">Rs. " + commaSeparateNumber(String(item.unitrate * item.quantity)) + "</div></td></tr>";

                    })
                    do {
                        dataset += "<tr><td>" + icont + "</td><td> </td><td> </td><td> </td><td> </td></tr>"
                        icont++;
                    }
                    while (icont < 17);

                    $("#potablebody").html(dataset);
                }
                $("#printeddate").text(date);
                $("#invoiceno").text(genaratecode());
                $("#qoano").text("CASH");
                if (customerorderobj.status == "INVOICED") {
                    $("#coppyornot").text("TRUE COPY");
                    $("#printeddate").text(customerorderobj.invoices[0].enteredDate);
                    $("#reprintdate").text(date);
                }
                $("#nettotal").text(commaSeparateNumber(customerorderobj.totalAmount));
                $(".tax").text("0.0%")
                $("#grosstotal").text(commaSeparateNumber((customerorderobj.totalAmount) * (100 + 0.0) / 100));
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Your Oreder is not submitted yet or the order number is incorrect.',
                });
            }
        } else {
            customerorderobj = undefined;
            t35.clear().draw(false);
            customerorder_col.clearcop();
            customerOrderProductsobjarr = [];
            total = undefined;
            invoiceobj = undefined;
            $("#customerorder_code").val(undefined);
            $("#customerorder_jobcode").val(undefined);
            $("#customerorder_unitrate").val(undefined);
            $("#customerorder_quntity").val(undefined);
            $("#customerorder_remark").val(undefined);
            $("#customerorder_jobno").val(undefined);
            $("#customerorder_totalamount").val(undefined);
            $("#customerorder_status").val(undefined);
            $("#customerorder_customerid").val(undefined);
            $("#customerorder_productid").val(undefined);

        }
    }
    function setNewValues(code, status, invoiceEnDate) {
        if (customerorderobj) {
            if (status) customerorderobj.status = "INVOICED";
            let invoiceobj = customerorderClassesInstence.Invoice;
            invoiceobj.code = code;
            invoiceobj.status = "ACTIVE";
            invoiceobj.enteredDate = invoiceEnDate;
            invoiceobj.enteredUser = jwtPayload;
            invoiceobj.totPrice = customerorderobj.totalAmount;
            customerorderobj.invoices.push(invoiceobj);
        }
    }
    function genaratecode() {
        let jobcode = customerorderClassesInstence.CustomerOrderSerial.genarateInvoiceCode(0, customerorderobj.jobID);
        return jobcode;
    }
    //end of functions
    //triggers
    $('#table13 tbody').on('click', 'tr', function () {
        $("#modal-colist").modal("hide");
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            selectedcode = undefined;
            $("#customerorder_code").val(selectedcode)
            refreshtable();
        } else {
            t13.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            selectedcode = $(this).children("td:nth-child(1)").text();
            $("#customerorder_code").val(selectedcode)
            refreshtable();
        }
    });
    $(document).off("click", "#btnprm");
    $(document).on("click", "#btnprm", function () {
        $("#modal-colist").modal("show");
        // selectedcode = $("#customerorder_code").val();
        // refreshtable();
    })

    //end of triggers
    $("#podiv").hide();
    jwtPayload = getJwtPayload();
    formctrl();
    refreshtable();

});

