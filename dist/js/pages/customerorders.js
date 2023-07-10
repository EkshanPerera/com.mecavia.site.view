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
    var unitrate = undefined;
    var addmoddel = undefined;
    var selectedcode = undefined;
    var jwtPayload = undefined;
    var producthash;
    var t32 = $("#table32").DataTable({
        "autoWidth": false,
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t31 = $("#table31").DataTable({
        "autoWidth": false,
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        columns: [
            null,
            null,
            {
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        var symbol = "Rs. ";
                        var num = $.fn.dataTable.render.number(',', '.', 2, symbol).display(data);
                        return '<div style="text-align: right;">' + num + '</div>';
                    } else {
                        return data;
                    }

                },

            },
            null,
        ]
    });
    var t33 = $("#table33").DataTable({
        "autoWidth": false,
        "columns": [
            { "width": "30%" },
            null,
        ],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body popup"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
    });
    var t34 = $("#table34").DataTable({
        "autoWidth": false,
        "columns": [
            { "width": "30%" },
            null,
        ],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body popup"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
    });
    var Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });
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
            },
            customerorderjobno: {
                required: true
            }
        },
        messages: {
            customerorderremark: {
                required: "Please fillout the remark!"
            },
            customerorderjobno: {
                required: "Please fillout the job number!"
            }
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
                if (addmoddel) {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, save it!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            switch (addmoddel) {
                                case "add":
                                    var code = genaratecode();
                                    var remark = $("#customerorder_remark").val()
                                    var jobno = $("#customerorder_jobno").val()
                                    var totalamount = 0;
                                    $.each(customerOrderProductsobjarr, function (i, item) {
                                        totalamount += parseFloat(item.unitrate) * parseFloat(item.quantity);
                                    })
                                    var customerOrderProducts = customerOrderProductsobjarr;
                                    var status = "PENDING";
                                    var customerid;
                                    if (cli_obj) customerid = cli_obj;
                                    else customerid = undefined;
                                    setNewValues(code, remark, totalamount, status, customerid, customerOrderProducts, jobno);
                                    submit();
                                    break;
                                case "mod":
                                    var code = undefined;
                                    var remark = undefined;
                                    var jobno = undefined;
                                    var totalamount = undefined;
                                    var status = "SUBMIT";
                                    var customerid = undefined;
                                    var customerOrderProducts = undefined;
                                    setNewValues(code, remark, totalamount, status, customerid, customerOrderProducts, jobno);
                                    submit();
                                    break;
                                case "del":
                                    var code = undefined;
                                    var remark = undefined;
                                    var jobno = undefined;
                                    var totalamount = undefined;
                                    var status = "EXPIRE";
                                    var customerid = undefined;
                                    var customerOrderProducts = undefined;
                                    setNewValues(code, remark, totalamount, status, customerid, customerOrderProducts, jobno);
                                    submit();
                                    break;
                                default:
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'In order to save, please complete the operation first.',
                                    });
                            }
                        }
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'In order to save, please complete the operation first.',
                    });
                }
            } else {
                if (!cli_obj.id) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'In order to save, please select the customer.',
                    });
                }
                if (customerOrderProductsobjarr.length == 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'In order to save, please add the product.',
                    });
                }
            }
        }
    });
    $('#quickForm9').validate({
        rules: {
            customerorderunitrate: {
                required: true
            },
            customerorderquntity: {
                required: true
            }

        },
        messages: {
            customerorderquntity: {
                required: "Please fillout the quntity!"
            },
            customerorderunitrate: {
                required: "Please fillout the unit rate!"
            }

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
            if (product_obj != undefined) {
                if (product_obj.id != undefined && unitrate != undefined) {
                    var quantity = $("#customerorder_quntity").val();
                    customerorder_col.addcustomerOrderProductstoArray(undefined, undefined, product_obj, unitrate, quantity);
                    refreshcoproducttable();
                    $("#modal-customerOrderProducts").modal("hide")
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'In order to add, please select the product with a valid price.',
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'In order to add, please select the product.',
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
        customerorder_col.clear();
        product_col.clear();
        cli_col.clear();
        addmoddel = undefined;
        selectedcode = undefined;
        selectedcode = undefined;
        t32.clear().draw(false);
        t31.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/customerorderctrl/getcustomerorders",
            dataType: "JSON",
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                $.each(data.content, function (i, item) {
                    customerorder_col.addCustomerOrdertoArray(item.id, item.code, item.jobID, item.jobNumber, item.customerid, item.totalAmount, item.grossAmount, item.remark, item.customerOrderProducts, item.printeddate, item.status);
                    t32.row.add([item.code, item.jobID, item.customerid.code, item.customerid.firstname + " " + item.customerid.lastname, item.status]).draw(false);
                });
                setValues();
                var $tableRow = $("#table32 tr td:contains('" + selectedcode + "')").closest("tr");
                $tableRow.trigger("click");
                refreshproducttable();
                fadepageloder();

            },
            error: function (xhr, status, error) {
                fadepageloder();
            }
        })
    }
    function refreshcoproducttable() {
        customerOrderProductsobjarr = customerorder_col.allCustomerOrderProducts();
        t31.clear().draw(false);
        var total = 0;
        $.each(customerOrderProductsobjarr, function (i, item) {
            var hashval;
            if (item.hash == undefined) {
                hashval += i
            } else {
                hashval = item.hash
            }
            t31.row.add([hashval, item.product.name, item.unitrate, item.quantity]).draw(false);
            total += parseFloat(item.unitrate) * parseFloat(item.quantity);
        })

        $('#customerorder_totalamount').val(commaSeparateNumber(String(total)));
    }
    function refreshproducttable() {
        product_col.clear()
        t33.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/productctrl/getproducts",
            dataType: "JSON",
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                $.each(data.content, function (i, item) {
                    if (item.status == "ACTIVE") {
                        product_col.addProducttoArray(item.id, item.code, item.desc, item.name, item.status, item.pricelist);
                        t33.row.add([item.code, item.name]).draw(false);
                    }
                })
                refreshcustomertable();
                var $tableRow = $("#table33 tr td:contains('" + selectedcode + "')").closest("tr");
                $tableRow.trigger("click");
            }
        })
    }
    function refreshcustomertable() {
        cli_col.clear();
        t34.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/clientctrl/getclients",
            dataType: "JSON",
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                $.each(data.content, function (i, item) {
                    if (item.businessRole == "CUSTOMER" && item.status == "ACTIVE") {
                        cli_col.addClitoArray(item.id, item.code, item.firstname, item.middlename, item.lastname, item.email, item.businessRole, item.status, item.clientGroupid, item.roleid);
                        t34.row.add([item.code, item.firstname + " " + item.lastname]).draw(false);
                    }
                });
                var $tableRow = $("#table34 tr td:contains('" + selectedcode + "')").closest("tr");
                $tableRow.trigger("click");
            }
        });

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
    //definded functions
    function submit() {
        showpageloder();
        var url;
        var method;

        switch (addmoddel) {
            case "add":
                url = "http://localhost:8080/api/customerorderctrl/savecustomerorder";
                method = "POST";
                break;
            case "mod":
            case "del":
                url = "http://localhost:8080/api/customerorderctrl/activeinactivecustomerorder";
                method = "POST";
                break;
        }
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(customerorderobj),
            contentType: 'application/json',
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                switch (addmoddel) {
                    case "add":
                        Swal.fire(
                            'Added!',
                            'New record has been added.',
                            'success'
                        )
                        break;
                    case "mod":
                        Swal.fire(
                            'Submitted!',
                            'The Customer Order has been submitted for the production.',
                            'success'
                        )
                        break;
                    case "del":
                        Swal.fire(
                            'Expired!',
                            'The Customer Order has been expired.',
                            'success'
                        )
                        break;
                }
                refreshtable();
            }, error: function (xhr, error, status) {
                Swal.fire(
                    'Error!',
                    'Please contact the Administator',
                    'error'
                )
            }
        })
    }
    function formctrl() {
        $(".formfillin").prop("disabled", true);
    }
    function enablefillin(fillinid) {
        $(fillinid).prop("disabled", false)
    }
    function setValues(code) {
        formctrl();
        addmoddel = undefined;
        if (code) {
            customerorderobj = customerorder_col.getCustomerOrder(code);
            customerOrderProductsobjarr = customerorderobj.customerOrderProducts;
            $("#customerorder_code").val(customerorderobj.code);
            $("#customerorder_jobcode").val(customerorderobj.jobID);
            $("#customerorder_unitrate").val(customerorderobj.unitrate)
            $("#customerorder_quntity").val(customerorderobj.quntity)
            $("#customerorder_remark").val(customerorderobj.remark);
            $("#customerorder_jobno").val(customerorderobj.jobNumber);
            $("#customerorder_totalamount").val(commaSeparateNumber(String(customerorderobj.totalAmount)));
            $("#customerorder_status").val(customerorderobj.status);
            if (customerorderobj.customerid) {
                cli_obj = customerorderobj.customerid;
                $("#customerorder_customerid").val(customerorderobj.customerid.code + " - " + customerorderobj.customerid.firstname + " " + customerorderobj.customerid.lastname);
            }
            if (customerorderobj.customerOrderProducts) {
                t31.clear().draw(false);
                $.each(customerorderobj.customerOrderProducts, function (i, item) {
                    t31.row.add([i + 1, item.product.name, item.unitrate, item.quantity]).draw(false);
                })
            }

        } else {
            customerorderobj = undefined;
            t31.clear().draw(false);
            customerorder_col.clearcop();
            customerOrderProductsobjarr = [];
            total = undefined;
            cli_obj = undefined;
            $("#customerorder_code").val(undefined);
            $("#customerorder_jobcode").val(undefined);
            $("#customerorder_unitrate").val(undefined);
            $("#customerorder_quntity").val(undefined);
            $("#customerorder_remark").val(undefined);
            $("#customerorder_jobno").val(undefined);
            $("#customerorder_totalamount").val(undefined);
            $("#customerorder_status").val(undefined);
            $("#customerorder_customerid").val(undefined);


        }
    }
    function setClientValues(code) {
        $("#modal-customerlist").modal("hide");
        if (code) {
            cli_obj = cli_col.getClient(code);
            $("#customerorder_customerid").val(cli_obj.code + " - " + cli_obj.firstname + " " + cli_obj.lastname);

        } else {
            cli_obj = undefined;
            $("#customerorder_customerid").val(undefined);

        }
    }
    function setProductValues(code) {
        $("#modal-productlist").modal("hide");
        if (code) {
            product_obj = product_col.getProduct(code);
            var proprice = product_col.getActivePrice(code);
            if (proprice) {
                if (proprice.price) unitrate = proprice.price;
                else unitrate = undefined;
            } else unitrate = undefined;
            if (unitrate != undefined) {
                $("#customerorder_unitrate").val(commaSeparateNumber(String(unitrate)));
            } else {
                $("#customerorder_unitrate").val(" ");
            }

        } else {
            product_obj = undefined;
            unitrate = undefined;
            $("#customerorder_unitrate").val(undefined);

        }
    }
    function setNewValues(code, remark, totalamount, status, customerid, customerOrderProducts, jobno) {
        if (customerorderobj) {
            if (code) customerorderobj.code = code;
            if (remark) customerorderobj.remark = remark;
            if (totalamount) customerorderobj.totalAmount = totalamount;
            if (status) customerorderobj.status = status;
            if (customerid) customerorderobj.customerid = customerid;
            if (jobno) customerorderobj.jobNumber = jobno;
            if (customerOrderProducts) customerorderobj.customerOrderProducts = customerOrderProducts;
        } else {
            customerorderobj = customerorderClassesInstence.customerorder;
            setNewValues(code, remark, totalamount, status, customerid, customerOrderProducts, jobno);
        }
    }
    function resetform(element) {
        $(element).find(".invalid-feedback").remove();
        $(element).find(".is-invalid").removeClass("is-invalid");
        $(element).find(".is-valid").removeClass("is-valid");
    }
    function genaratecode() {
        let customerorderlist = customerorder_col.allCustomerOrder()
        let customerordercode = customerorderClassesInstence.CustomerOrderSerial.genarateCustomerOrderCode(customerorderlist.length);
        return customerordercode;
    }
    //end of functions
    //triggers
    $('#table32 tbody').on('click', 'tr', function () {
        resetform("#quickForm8");
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            setValues();
            selectedcode = "";
        } else {
            t32.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            selectedcode = $(this).children("td:nth-child(1)").text();
            setValues($(this).children("td:nth-child(1)").text());
        }
    });
    $('#table34 tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            setClientValues();
        } else {
            t34.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            setClientValues($(this).children("td:nth-child(1)").text());
        }
    });
    $('#table33 tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            setProductValues();
        } else {
            t33.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            setProductValues($(this).children("td:nth-child(1)").text());
        }
    });
    $('#table31 tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            producthash = "";
        } else {
            t31.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            producthash = $(this).children("td:nth-child(1)").text();
        }
    });
    $(document).off("click", "#addProductbtn");
    $(document).off("click", "#addCustomerOrders");
    $(document).off("click", "#setCustomerOrders");
    $(document).off("click", "#removaCustomerOrders");
    $(document).off("click", "#customerorder_unitrate");
    $(document).off("click", "#customerorder_quntity");
    $(document).off("click", "#removeProductbtn");


    $(document).on("click", "#addProductbtn", function () {
        if ($("#table33 tbody tr").hasClass('selected')) {
            product_obj = undefined;
            $("#table33 tbody tr").removeClass('selected');
        }
        $("#customerorder_unitrate").val(undefined);
        $("#customerorder_quntity").val(undefined);
    })
    $(document).on("click", "#removeProductbtn", function () {
        customerorder_col.removeCustomerOrderProductfromArray(producthash);
        refreshcoproducttable();
    })
    $(document).on("click", "#addCustomerOrders", function () {
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI00301") != undefined || jwtPayload.businessRole == "ADMIN") {
            selectedcode = "";
            setValues(undefined);
            addmoddel = "add";
            $("#customerorder_code").val(genaratecode());
            $("#table32 tbody tr").removeClass('selected');
            enablefillin("#customerorder_quntity");
            enablefillin("#customerorder_remark");
            enablefillin("#customerbtn");
            enablefillin("#productbtn");
            enablefillin("#addProductbtn");
            enablefillin("#removeProductbtn");
            enablefillin("#customerorder_jobno");
            $("#customerorder_status").val("PENDING");
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI00301)',
            });
        }
    });
    $(document).on("click", "#setCustomerOrders", function () {
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI00305") != undefined || jwtPayload.businessRole == "ADMIN") {
            if (selectedcode) {
                if (customerorderobj.status == "INITIATED") {
                    setValues(selectedcode);
                    addmoddel = "mod";
                    $("#customerorder_status").val("SUBMIT");
                    Toast.fire({
                        icon: 'info',
                        title: 'Please press save to compleate!'
                    });
                } else {
                    switch (customerorderobj.status) {
                        case "EXPIRE":
                            Swal.fire({
                                icon: 'warning',
                                title: 'Warning!',
                                text: 'The PR you are attempting to submit is currently expired!',
                            });
                            break;
                        case "ACCEPTED":
                            Swal.fire({
                                icon: 'warning',
                                title: 'Warning!',
                                text: 'The PR you are attempting to submit is currently accepted!',
                            });
                            break;
                        case "REJECTED":
                            Swal.fire({
                                icon: 'warning',
                                title: 'Warning!',
                                text: 'The PR you are attempting to submit is rejected!',
                            });
                            break;
                        case "SUBMIT":
                            Swal.fire({
                                icon: 'warning',
                                title: 'Warning!',
                                text: 'The PR you are attempting to submit is already submitted!',
                            });
                            break;
                        case "PRINTED":
                            Swal.fire({
                                icon: 'warning',
                                title: 'Warning!',
                                text: 'PO is genarated under this PR!',
                            });
                        case "PENDING":
                            Swal.fire({
                                icon: 'warning',
                                title: 'Warning!',
                                text: 'Please make sure enter the BOM',
                            });
                            break;
                    }

                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please select a PR!',
                })
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI00305)',
            });
        }
    });
    $(document).on("click", "#removaCustomerOrders", function () {
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI00306") != undefined || jwtPayload.businessRole == "ADMIN") {
            if (selectedcode) {
                if (customerorderobj.status == "PENDING") {
                    setValues(selectedcode);
                    addmoddel = "del";
                    $("#customerorder_status").val("EXPIRE");
                    Toast.fire({
                        icon: 'info',
                        title: 'Please press save to compleate!'
                    });
                } else {
                    switch (customerorderobj.status) {
                        case "EXPIRE":
                            Swal.fire({
                                icon: 'warning',
                                title: 'Warning!',
                                text: 'The PR you are attempting to expire is already expired!',
                            });
                            break;
                        case "ACCEPTED":
                            Swal.fire({
                                icon: 'warning',
                                title: 'Warning!',
                                text: 'The PR you are attempting to expire is currently accepted!',
                            });
                            break;
                        case "REJECTED":
                            Swal.fire({
                                icon: 'warning',
                                title: 'Warning!',
                                text: 'The PR you are attempting to expire is rejected!',
                            });
                            break;
                        case "INITIATED":
                            Swal.fire({
                                icon: 'warning',
                                title: 'Warning!',
                                text: 'The PR you are attempting to expire is currently initiated!',
                            });
                            break;
                        case "SUBMIT":
                            Swal.fire({
                                icon: 'warning',
                                title: 'Warning!',
                                text: 'The PR you are attempting to expire is currently submitted!',
                            });
                            break;
                        case "PRINTED":
                            Swal.fire({
                                icon: 'warning',
                                title: 'Warning!',
                                text: 'PO is genarated under this PR!',
                            });
                            break;
                    }


                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please select a PR!',
                })
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI00306)',
            });
        }
    });
    $(document).on('input', '#customerorder_unitrate', function () {
        var value = $('#customerorder_unitrate').val();
        value = value.replace(/[^\d.]/g, '');
        value = value.replace(/\.{2,}/g, '.');
        value = value.replace(/^0+(?=\d)/, '');
        var parts = value.split('.');
        if (parts.length > 1) {
            parts[1] = parts[1].slice(0, 2);
            value = parts.join('.');
        }
        $('#customerorder_unitrate').val(value);
    });
    $(document).on('input', '#customerorder_quntity', function () {
        var value = $('#customerorder_quntity').val();
        value = value.replace(/[^\d.]/g, '');
        value = value.replace(/\.{2,}/g, '.');
        value = value.replace(/^0+(?=\d)/, '');
        var parts = value.split('.');
        if (parts.length > 1) {
            parts[1] = "00";
            value = parts.join('.');
        }
        $('#customerorder_quntity').val(value);
    });
    //end of triggers
    jwtPayload = getJwtPayload();
    formctrl();
    refreshtable();

});

