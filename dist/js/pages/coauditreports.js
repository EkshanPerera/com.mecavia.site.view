$(function () {
    //variables
    var customerorderClassesInstence = customerorderClasses.customerorderClassesInstence()
    let customerorder_col = customerorderClassesInstence.customerorder_service;
    let customerorderobjarr = [];
    var jwtPayload = undefined;
    var lofilter = false;
    var total = 0;
    var t18 = $("#table18").DataTable({
        "order": [[0, "desc"]],
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        "autoWidth": false,
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

            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to get another original copy!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, print it!'
            }).then((result) => {
                if (result.isConfirmed) {

                    // setNewValues(date);
                    // submit();
                    $("#podiv").show();
                    $("#podiv").print();
                    $("#podiv").hide();

                }
            })
        }
    });
    $('#fromdt,#todt').datepicker({ dateFormat: 'yy-mm-dd' });

    //definded functions
    function getJwtPayload() {
        var parts = jwt.split('.');
        var encodedPayload = parts[1];
        var decodedPayload = atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'));
        var payload = JSON.parse(decodedPayload);
        return payload;
    }
    function refreshtable() {
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI00602") != undefined || jwtPayload.businessRole == "ADMIN") {
            t18.clear().draw(false);
            $.ajax({
                url: "http://localhost:8080/api/customerorderctrl/getcustomerorders",
                dataType: "JSON",
                headers: {
                    "Authorization": jwt
                },
                success: function (data) {
                    $.each(data.content, function (i, item) {
                        customerorder_col.addCustomerOrdertoArray(item.id, item.code, item.jobID, item.jobNumber, item.customerid, item.totalAmount, item.grossAmount, item.remark, item.customerOrderProducts, item.printeddate, item.status,item.enteredUser,item.enteredDate,item.acceptedUser,item.acceptedDate,item.invoices,item.inventoryItems,item.billOfMaterial);
                    });
                    filter(false)
                    setValues();
                    fadepageloder();
                }
            })
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI00602)',
            });
        }
    }

    //definded functions
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
    function filter(iffilter, customerOrderid, jobnumber, fromdate, todate, status) {
        lofilter = false;
        customerorderobjarr = customerorder_col.allCustomerOrder();
        if (iffilter) {
            lofilter = true;
            var fromDateObj = new Date(fromdate);
            var toDateObj = new Date(todate);
            customerorderobjarr = customerorderobjarr.filter(function (customerorder) {
                var enterdDateObj = new Date(customerorder.enteredDate);
                return (
                    (customerorder.code == customerOrderid || customerOrderid == "") &&
                    (customerorder.jobNumber == jobnumber || jobnumber == "") &&
                    ((fromdate == "" && todate == "") || (enterdDateObj >= fromDateObj && enterdDateObj <= toDateObj)) &&
                    (status == "" || customerorder.status == status)
                );
            });
        }
    }
    function setValues() {
        total = 0;
       
        t18.clear().draw(false);
        var dataset = "";
        $.each(customerorderobjarr, function (i, item) {
            var copdataset = "";
            var quantityset = "";
            var totfinishedcoutset= "";
            var brset;
            $.each(item.customerOrderProducts, function (i, itemcop) {
                if ((i + 1) < item.customerOrderProducts.length) brset = "<br>";
                else brset = "";
                copdataset += itemcop.product.code + brset;
                quantityset += commaSeparateNumber(String(itemcop.quantity)) + brset;
                totfinishedcoutset += commaSeparateNumber(String(itemcop.totFinishedCount)) + brset;
            })

           
            var itituser = "-";
            var ititdate = "-";
            var accepteduser = "-";
            var accepteddate = "-";
            if(item.billOfMaterial != null){
                itituser = item.billOfMaterial.enteredUser.email.split('@')[0];
                ititdate = item.billOfMaterial.enteredDate;
            }
            if(item.acceptedUser != null){
                accepteduser = item.acceptedUser.email.split('@')[0];
                accepteddate = item.acceptedDate;
            }
            t18.row.add([item.code, item.jobNumber, item.customerid.firstname + " " + item.customerid.lastname ,    item.enteredUser.email.split('@')[0],
             item.enteredDate,
             itituser,
             ititdate,
             accepteduser,
             accepteddate,
            item.status]).draw(false);


            dataset += "<tr><td>" + (i + 1) + "</td><td>" + item.code + "</td><td>" + item.jobNumber + "</td><td>" + item.customerid.firstname + " " + item.customerid.lastname + "</td><td>" + item.enteredUser.email.split('@')[0] + "</td><td>" + item.enteredDate + "</td><td>" + itituser+ "</td><td>" + ititdate + "</td><td>" + accepteduser + "</td><td>" + accepteddate + "</td><td>" + item.status+ "</td></tr>";

        })
        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        var day = new Date().getDate();
        var date = year + "-" + (parseInt(month) + 1) + "-" + day ;
        var customerordid = $("#customerordid").val();
        var jobno = $("#jobno").val();
        var status = $("#status").val();
        var fromdate = $("#fromdt").val();
        var todt = $("#todt").val();
        $("#totamt").text(commaSeparateNumber(String(total)));
        $("#todate").text(function(){
            if(todt == "" && fromdate == ""){
                return date;
            }else{
                return "From : " + fromdate + " To: " + todt;
            }
        })
        $("#rptcoid").text(customerordid);
        $("#rptjobno").text(jobno);
        $("#rptstatus").text(status);
        $("#potablebody").html(dataset);
        total = 0
    }
    //end of functions
    //triggers
    $(document).off("click", "#btnprmpo");
    $(document).off("click", "#cancelPRPrint");
    $(document).off("click", "#filter");
    
    $(document).on("click", "#btnprmpo", function () {
        selectedcode = $("#purchaserequisition_code").val();
        refreshtable();
    })
    $(document).on("click", "#cancelPRPrint", function () {
        selectedcode = "";
        $("#customerordid").val("");
        $("#jobno").val("");
        $("#status").val("");
        $("#fromdate").val("");
        $("#todt").val("");
        filter(false)
        setValues();
    })
    $(document).on("click", "#filter", function () {
        var customerordid = $("#customerordid").val();
        var jobno = $("#jobno").val();
        var status = $("#status").val();
        var fromdate = $("#fromdt").val();
        var todt = $("#todt").val();
        filter(true, customerordid, jobno, fromdate, todt, status)
        setValues();
        Swal.fire(
            'Added!',
            'Data Filter has been added',
            'success'
        )
    })

    //end of triggers
    jwtPayload = getJwtPayload();
    $("#podiv").hide();
    refreshtable();

});

