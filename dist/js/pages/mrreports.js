$(function () {
    //variables
    var mrClassesInstence = mrClasses.mrClassesInstence();
    let materialrequisition_col = mrClassesInstence.materialRequisition_service;
    let materialrequisitionobjarr = [];
    var total = 0;
    var jwtPayload = undefined;
    var lofilter = false;
    var t18 = $("#table18").DataTable({
        "order": [[0, "desc"]],
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        "autoWidth": false
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
                url: "http://localhost:8080/api/materialrequisitionctrl/getmaterialrequisitions",
                dataType: "JSON",
                headers: {
                    "Authorization": jwt
                },
                success: function (data) {
                    $.each(data.content, function (i, item) {
                        materialrequisition_col.addMRtoArray(item.id, item.code, item.enterddate, item.billOfMaterial, item.materialRequisitionMaterials, item.printeddate, item.status, item.enteredUser);

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
    function filter(iffilter, customerOrderid, jobnumber, fromdate, todate, status) {
        lofilter = false;
        materialrequisitionobjarr = materialrequisition_col.allMR();
        if (iffilter) {
            lofilter = true;
            var fromDateObj = new Date(fromdate);
            var toDateObj = new Date(todate);
            materialrequisitionobjarr = materialrequisitionobjarr.filter(function (materialrequisition) {
                var enterdDateObj = new Date(materialrequisition.enterddate);
                return (
                    (materialrequisition.billOfMaterial.customerOrder.customerid.code == customerOrderid || customerOrderid == "") &&
                    (materialrequisition.billOfMaterial.customerOrder.jobNumber == jobnumber || jobnumber == "") &&
                    ((fromdate == "" && todate == "") || (enterdDateObj >= fromDateObj && enterdDateObj <= toDateObj)) &&
                    (status == "" || materialrequisition.status == status)
                );
            });
        }
    }
    function setValues() {
        t18.clear().draw(false);
        var dataset = "";
        console.log(materialrequisitionobjarr);
        $.each(materialrequisitionobjarr, function (i, item) {
            var grnmdataset = "";
            var requestedcountwithuom = "";
            var requestedcountwithoutuom = "";
            var uomlist = "";
            var bulckcodeset = "";
            var brset;
            $.each(item.materialRequisitionMaterials, function (i, itemgrnm) {
                if ((i + 1) < item.materialRequisitionMaterials.length) brset = "<br>";
                else brset = "";
                bulckcodeset += itemgrnm.ordercode + brset;
                grnmdataset += itemgrnm.bommaterial.material.code + brset;
                requestedcountwithoutuom += "<div style=\"text-align: right;\">"+ commaSeparateNumber(String(itemgrnm.requestedCount))+ "</div>" 
                uomlist += itemgrnm.bommaterial.material.uomid.scode + brset;
                requestedcountwithuom += commaSeparateNumber(String(itemgrnm.requestedCount)) +" "+ itemgrnm.bommaterial.material.uomid.scode + brset;
                // totfinishedcoutset += commaSeparateNumber(String(itemprm.totArrivedCount)) + itemprm.material.uomid.scode + brset;
            })
            t18.row.add([item.code, item.billOfMaterial.customerOrder.code, grnmdataset, bulckcodeset, requestedcountwithoutuom,uomlist, item.status, item.enterddate]).draw(false);
            dataset += "<tr><td>" + (i + 1) + "</td><td>" + item.code + "</td><td>" + item.billOfMaterial.customerOrder.code + "</td><td>" + grnmdataset + "</td><td>" + bulckcodeset + "</td><td><div style=\"text-align: right;\"> " + requestedcountwithuom + "</div></td><td>" + item.status + "</td><td>" + item.enterddate + "</td></tr>";
        })
        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        var day = new Date().getDate();
        var date = year + "-" + (parseInt(month) + 1) + "-" + day;
        var customerid = $("#customerid").val();
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
        $("#rptcoid").text(customerid);
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
        $("#customerid").val("");
        $("#jobno").val("");
        $("#status").val("");
        $("#fromdate").val("");
        $("#todt").val("");
        filter(false);
        setValues();
    })
    $(document).on("click", "#filter", function () {
        var customerid = $("#customerid").val();
        var jobno = $("#jobno").val();
        var status = $("#status").val();
        var fromdate = $("#fromdt").val();
        var todt = $("#todt").val();
        filter(true, customerid, jobno, fromdate, todt, status)
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

