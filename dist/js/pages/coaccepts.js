$(function () {
    //variables
    let customerorder_col = new customerorder_service();
    let customerorderobj = new customerorder();
    let customerOrderProductsobjarr = [];
    let product_col = new product_service();
    let product_obj = new product();
    let cli_col = new cli_service();
    let cli_obj = new client();

    var addmoddel;
    var selectedcode;

    var t10 = $("#table10").DataTable({
        "order": [[ 0, "desc" ]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
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
                if (customerorderobj.status == "SUBMIT") {
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
                            var code = genaratecode();
                            var status = "ACCEPTED";
                            setNewValues(code, status);
                            submit();
                            Swal.fire(
                                'Submitted!',
                                'The PR has been accepted.',
                                'success'
                            )
                        }
                    })
                }else if(customerorderobj.status == "ACCEPTED" || customerorderobj.status == "PRINTED"){
                    Swal.fire({
                        icon: 'warning',
                        title: 'Warning!',
                        text: 'The PR you are attempting to accept is already accepted!',
                    });
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
    function refreshtable() {
        customerorder_col.clear();
        product_col.clear();
        cli_col.clear();
        addmoddel = undefined;
        t10.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/customerorderctrl/getcustomerorders",
            dataType: "JSON",
            success: function (data) {
                $.each(data.content, function (i, item) {
                    if (item.status == "SUBMIT" || item.status == "ACCEPTED" || item.status == "PRINTED") {
                        customerorder_col.addCustomerOrdertoArray(item.id,item.code,item.jobID,item.jobNumber,item.customerid,item.totalAmount,item.grossAmount,item.remark,item.customerOrderProducts,item.printeddate,item.status);
                    }
                });
                setValues(selectedcode);
            }
        })
    }
    //definded functions
    function submit() {
        var url;
        var method;
        var token = localStorage.getItem("jwt_token");
        url = "http://localhost:8080/api/customerorderctrl/updatecustomerorder";
        method = "PUT";
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(customerorderobj),
            contentType: 'application/json',
            success: function (data) {
                refreshtable();
            }
        })
    }
    function formctrl() {
        $(".formfillin").prop("disabled", true);
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
            $("#customerorder_totalamount").val(customerorderobj.totalAmount);
            $("#customerorder_status").val(customerorderobj.status);
            if (customerorderobj.customerid) {
                cli_obj = customerorderobj.customerid;
                $("#customerorder_customerid").val(customerorderobj.customerid.code + " - " + customerorderobj.customerid.firstname + " " + customerorderobj.customerid.lastname);
            }
            if (customerorderobj.product) {
                product_obj = customerorderobj.product;
                $("#customerorder_productid").val(customerorderobj.product.code + " - " + customerorderobj.product.name);
            }
            if (customerorderobj.customerOrderProducts) {
                t10.clear().draw(false);
                $.each(customerorderobj.customerOrderProducts, function (i, item) {
                    t10.row.add([i + 1, item.product.name, item.quantity]).draw(false);
                })
            }

        } else {
            customerorderobj = undefined;
            t10.clear().draw(false);
            customerorder_col.clearprm();
            customerOrderProductsobjarr = [];
            total = undefined;
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
    function setNewValues(code, status) {
        if (customerorderobj) {
            if (code) customerorderobj.jobID = code;
            if (status) customerorderobj.status = status;
        } else {
            customerorderobj = new customerorder();
            setNewValues(code, status);
        }
    }
    function genaratecode() {
        let joblist = customerorder_col.allJobs()
        let jobcode = new CustomerOrderSerial().genarateJobCode(joblist.length, selectedcode);
        return jobcode;
    }
    //end of functions
    //triggers
    $(document).on("click", "#btnprm", function () {
        selectedcode = $("#customerorder_code").val();
        refreshtable();
    })

    //end of triggers
    formctrl();
    refreshtable();
});

