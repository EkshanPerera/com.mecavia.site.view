$(function () {
    //variables
    var grnClassesInstence = grnClasses.grnClassesInstence();
    let goodsreceivednote_col = grnClassesInstence.goodsReceivedNote_service;
    let goodsreceivednoteobjarr = [];
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
                url: "http://localhost:8080/api/goodsreceivednotectrl/getgoodsreceivednotes",
                dataType: "JSON",
                headers: {
                    "Authorization": jwt
                },
                success: function (data) {
                    $.each(data.content, function (i, item) {
                        goodsreceivednote_col.addGRNtoArray(item.id, item.invoicenumber, item.invocedate, item.code, item.mradate, item.mrano, item.enterddate, item.remark, item.status, item.purchaseRequisition, item.goodsReceivedNoteMaterials, item.printeddate);
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

    function filter(iffilter, sulierid, prno, grnno, fromdate, todate, status) {
        lofilter = false;
        goodsreceivednoteobjarr = goodsreceivednote_col.allGRN();
        if (iffilter) {
            lofilter = true;
            var fromDateObj = new Date(fromdate);
            var toDateObj = new Date(todate);
            goodsreceivednoteobjarr = goodsreceivednoteobjarr.filter(function (goodsreceivednote) {
                var enterdDateObj = new Date(goodsreceivednote.enterddate);
                return (
                    (goodsreceivednote.purchaseRequisition.supplierid.code == sulierid || sulierid == "") &&
                    (goodsreceivednote.purchaseRequisition.prcode == prno || prno == "") &&
                    (goodsreceivednote.code == grnno || grnno == "") &&
                    ((fromdate == "" && todate == "") || (enterdDateObj >= fromDateObj && enterdDateObj <= toDateObj)) &&
                    (status == "" || goodsreceivednote.status == status)
                );
            });
        }
    }
    $('#fromdt,#todt').datepicker({ dateFormat: 'yy-mm-dd' });
    function setValues() {
        total = 0;
        t18.clear().draw(false);
        var dataset = "";
        $.each(goodsreceivednoteobjarr, function (i, item) {
            // if(item.materialid.status == "ACTIVE"){
            // t18.row.add([item.materialid.code, item.materialid.description, item.itemcount, item.materialid.uomid.scode, item.materialid.price, item.itemcount*item.materialid.price]).draw(false);
            var grnmdataset = "";
            // var totfinishedcoutset = ""; 
            var arrivedcount = "";
            var bulckcodeset = "";
            var brset;
            $.each(item.goodsReceivedNoteMaterials, function (i, itemgrnm) {
                if ((i + 1) < item.goodsReceivedNoteMaterials.length) brset = "<br>";
                else brset = "";
                bulckcodeset += itemgrnm.ordercode + brset;
                grnmdataset += itemgrnm.prmaterial.material.code + brset;
                arrivedcount += commaSeparateNumber(String(itemgrnm.arrivedCount)) + itemgrnm.prmaterial.material.uomid.scode + brset;
                // totfinishedcoutset += commaSeparateNumber(String(itemprm.totArrivedCount)) + itemprm.material.uomid.scode + brset;
            })
            t18.row.add([item.code, item.invoicenumber, item.mrano, grnmdataset, bulckcodeset, arrivedcount,item.enterddate,item.status]).draw(false);
            dataset += "<tr><td>" + (i + 1) + "</td><td>" + item.code + "</td><td>" + item.invoicenumber + "</td><td>" + item.mrano + "</td><td>" + grnmdataset + "</td><td>" + bulckcodeset + "</td><td><div style=\"text-align: right;\"> " + arrivedcount + "</div></td><td>" + item.enterddate + "</td></td><td>" + item.status + "</td></tr>";
        })
        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        var day = new Date().getDate();
        var sulierid = $("#sulierid").val();
        var prno = $("#prno").val();
        var grnno = $("#grnno").val();
        var status = $("#status").val();
        var fromdate = $("#fromdt").val();
        var todt = $("#todt").val();
        var date = year + "-" + (parseInt(month) + 1) + "-" + day ;
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
        $("#rptgrnno").text(grnno);
        $("#potablebody").html(dataset);
        total = 0
    }
    //end of functions
    //triggers
    $(document).off("click", "#btnprmpo");
    $(document).off("click", "#cancelPRPrint");
    $(document).off("click", "#filter");
    $(document).on("click", "#btnprmpo", function () {
        selectedcode = $("#goodsreceivednote_code").val();
        refreshtable();
    })
    $(document).on("click", "#cancelPRPrint", function () {
        selectedcode = "";
        filter(false);
        setValues();
    })
    $(document).on("click", "#filter", function () {
        var sulierid = $("#sulierid").val();
        var prno = $("#prno").val();
        var status = $("#status").val();
        var grnno = $("#grnno").val();
        var fromdate = $("#fromdt").val();
        var todt = $("#todt").val();
        filter(true, sulierid, prno,grnno, fromdate, todt, status)
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

