$(function () {
    //variables
    var purchaserequisitionClassesInstence = purchaserequisitionClasses.purchaserequisitionClassesInstence();
    let purchaserequisition_col = purchaserequisitionClassesInstence.purchaserequisition_service;
    let purchaserequisitioarr = [];
    var jwtPayload = undefined;
    var total = 0;
    var lofilter = false;
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
    $('#fromdt,#todt').datepicker({ dateFormat: 'yy-mm-dd' });
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
                url: "http://localhost:8080/api/purchaserequisitionctrl/getpurchaserequisitions",
                dataType: "JSON",
                headers: {
                    "Authorization": jwt
                },
                success: function (data) {
                    $.each(data.content, function (i, item) {
                        purchaserequisition_col.addPurchaseRequisitiontoArray(item.id, item.prcode, item.pocode, item.supplierid, item.status, item.remark, item.totalAmount, item.purchaseRequisitionMaterials,  item.prprinteddate, item.quotationno,item.enteredUser, item.printededUser, item.acceptedUser, item.poPrintededUser,item.printeddate);
                    });
                    filter(false);
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
    function filter(iffilter, sulierid, prno, quatno, fromdate, todate, status) {
        lofilter = false;
        purchaserequisitioarr = purchaserequisition_col.allPurchaseEequisitions();
        if (iffilter) {
            lofilter = true;
            var fromDateObj = new Date(fromdate);
            var toDateObj = new Date(todate);
            purchaserequisitioarr = purchaserequisitioarr.filter(function (purchaserequisition) {
                var enterdDateObj = new Date(purchaserequisition.prprinteddate);
                return (
                    (purchaserequisition.supplierid.code == sulierid || sulierid == "") &&
                    (purchaserequisition.prcode == prno || prno == "") &&
                    (purchaserequisition.quotationno == quatno || quatno == "") &&
                    ((fromdate == "" && todate == "") || (enterdDateObj >= fromDateObj && enterdDateObj <= toDateObj)) &&
                    (status == "" || purchaserequisition.status == status)
                );
            });
        }
    }
    function setValues() {
        total = 0;
        t18.clear().draw(false);
        var dataset = "";
        $.each(purchaserequisitioarr, function (i, item) {
            // if(item.materialid.status == "ACTIVE"){
            var accepteduser = "-";
            var pouser = "-";
            var pruser = "-";
           
            if(item.acceptedUser != null){
                accepteduser = item.acceptedUser.email.split('@')[0];
            }
            if(item.printededUser != null){
                pruser = item.printededUser.email.split('@')[0];
            }
            if(item.poPrintededUser != null){
                pouser = item.poPrintededUser.email.split('@')[0];
            }
            t18.row.add([item.prcode, item.quotationno, item.supplierid.firstname + " " + item.supplierid.lastname ,    item.enteredUser.email.split('@')[0],
             pruser,
             accepteduser,
             pouser,
             item.prprinteddate,
             item.printeddate,
            item.status]).draw(false);


            dataset += "<tr><td>" + (i + 1) + "</td><td>" + item.prcode + "</td><td>" + item.quotationno + "</td><td>" + item.supplierid.firstname + " " + item.supplierid.lastname + "</td><td>" + item.enteredUser.email.split('@')[0] + "</td><td>" + pruser + "</td><td>" + accepteduser+ "</td><td>" + pouser + "</td><td>" + item.prprinteddate + "</td><td>" + item.printeddate + "</td><td>" + item.status+ "</td></tr>";
        })
        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        var day = new Date().getDate();
        var date = year + "-" + (parseInt(month) + 1) + "-" + day ;
        var sulierid = $("#sulierid").val();
        var prno = $("#prno").val();
        var quatno = $("#quatno").val();
        var status = $("#status").val();
        var fromdate = $("#fromdt").val();
        var todt = $("#todt").val();
        $("#totamt").text(commaSeparateNumber(String(total)));
        $("#todate").text(function(){
            if(todt == "" && fromdate == ""){
                return date;
            }else{
                return "From : " + fromdate + "  To: " + todt;
            }
        })
        $("#rptsulierid").text(sulierid);
        $("#rptprno").text(prno);
        $("#rptstatus").text(status);
        $("#rptquatno").text(quatno);
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
        filter(false)
        setValues();
    })
    $(document).on("click", "#filter", function () {
        var sulierid = $("#sulierid").val();
        var prno = $("#prno").val();
        var status = $("#status").val();
        var quatno = $("#quatno").val();
        var fromdate = $("#fromdt").val();
        var todt = $("#todt").val();
        filter(true, sulierid, prno,quatno, fromdate, todt, status)
        setValues();
        Swal.fire(
            'Added!',
            'Data Filter has been added',
            'success'
        )
    })
    //end of triggers
    $("#podiv").hide();
    jwtPayload = getJwtPayload();
    refreshtable();

});

