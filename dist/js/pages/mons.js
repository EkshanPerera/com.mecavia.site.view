$(function () {
    //variables
    var mrClassesInstence = mrClasses.mrClassesInstence();
    var monClassesInstence = materialOutNoteClasses.MaterialOutNoteClassesInstence();
    var monObject = monClassesInstence.MaterialOutNoteDto;
    var materialOutNote_col = monClassesInstence.materialOutNote_service;
    let materialrequisition_col = mrClassesInstence.materialRequisition_service;
    let materialrequisitionobj = mrClassesInstence.materialrequisition;
    var GeneralStoreDtosInstence = genaralStoreClasses.genaralStoreClassesInstence();
    let GeneralStoreDtos_col = GeneralStoreDtosInstence.GeneralStoreDto_service;
    let GeneralStoreDtosarr = [];
    var addmoddel = undefined;
    var selectedcode = undefined;
    var jwtPayload = undefined;

    var t22 = $("#table22").DataTable({
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        "autoWidth": false
    });
    var t23 = $("#table23").DataTable({
        "order": [[0, "desc"]],
        "autoWidth": false,
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        columns: [
            null,
            null,
            null,
            {
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        var num = $.fn.dataTable.render.number(',', '.', 2).display(data);
                        return '<div style="text-align: right;">' + num + '</div>';
                    } else {
                        return data;
                    }

                },

            },
            null
        ]
    });
    var t24 = $("#table24").DataTable({
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        "autoWidth": false,
        columns: [
            null,
            null,
            {
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        var num = $.fn.dataTable.render.number(',', '.', 2).display(data);
                        return '<div style="text-align: right;">' + num + '</div>';
                    } else {
                        return data;
                    }

                },

            },
            null,
            {
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        var num = $.fn.dataTable.render.number(',', '.', 2).display(data);
                        return '<div style="text-align: right;">' + num + '</div>';
                    } else {
                        return data;
                    }

                },

            },
            null,
        ]
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

    $('#quickForm10').validate({
        rules: {
            materialoutnoteremark: {
                required: true
            }
        },
        messages: {
            materialoutnoteremark: {
                required: "Please fillout the remark."
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
            if (addmoddel) {
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
                        var year = new Date().getFullYear();
                        var month = new Date().getMonth();
                        var day = new Date().getDate();
                        var date = day + "/" + (parseInt(month) + 1) + "/" + year;
                        let index = materialOutNote_col.allMON().length;
                        let mrcode = monClassesInstence.MONSerial.genarateMONCode(index);
                        var code = mrcode;
                        var enterddate = date;
                        var status = "PENDING";
                        var materialOutNoteMaterials = materialOutNote_col.allMONM();
                        var remark = $("#materialoutnote_remark").val();
                        var materialRequisition = materialrequisitionobj;
                        setNewValues(code, enterddate, materialRequisition, materialOutNoteMaterials, undefined, remark, status);
                        submit();
                        Swal.fire(
                            'Submitted!',
                            'The PR has been approved.',
                            'success'
                        )
                    }
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please enter the valid MR ID!',
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
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI00202") != undefined || jwtPayload.businessRole == "ADMIN") {
            materialrequisition_col.clear();
            addmoddel = undefined;
            materialavild = undefined;
            t22.clear().draw(false);
            t23.clear().draw(false);
            $.ajax({
                url: "http://localhost:8080/api/materialrequisitionctrl/getmaterialrequisitions",
                dataType: "JSON",
                headers: {
                    "Authorization": jwt
                },
                success: function (data) {
                    $.each(data.content, function (i, item) {
                        $.each(item.materialRequisitionMaterials, function (i, item) {
                            materialrequisition_col.addMRMaterialstoArray(item.id, item.code, item.ordercode, item.materialRequisition, item.bommaterial, item.requestedCount);
                        });
                        materialrequisition_col.addMRtoArray(item.id, item.code, item.enterddate, item.billOfMaterial, item.materialRequisitionMaterials, item.printeddate, item.status,item.enteredUser);
                        if (item.status == "PENDING")
                            t22.row.add([item.code, item.billOfMaterial.customerOrder.code, item.billOfMaterial.code, item.enterddate]).draw(false);
                    });
                    setValues();
                    fadepageloder();
                    refreshmaterialoutnotes();
                },
                error: function (xhr, status, error) {
                    fadepageloder();
                }
            })
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI00202)',
            });
        }
    }
    function refreshgsmtable() {
        t24.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/generalstorectrl/getgeneralstorelist",
            dataType: "JSON",
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                $.each(data.content, function (i, item) {
                    if (item.status == "ACTIVE") {
                        t24.row.add([item.materialid.code, item.materialid.description, item.itemcount - item.releasedItemcount, item.materialid.uomid.scode, item.requestedItemcount - item.releasedItemcount, item.materialid.uomid.scode]).draw(false);
                        GeneralStoreDtos_col.addGeneralStoreDtostoArray(item.id, item.materialid, item.itemcount, item.requestedItemcount, item.releasedItemcount, item.status, item.enteredUser);
                    }
                });

            }
        })
    }
    function refreshmaterialoutnotes() {
        $.ajax({
            url: "http://localhost:8080/api/materialoutnotectrl/getmaterialoutnotes",
            dataType: "JSON",
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                $.each(data.content, function (i, item) {
                    materialOutNote_col.addMONtoArray(item.id, item.code, item.enterddate, item.materialRequisition, item.materialOutNoteMaterials, item.printeddate, item.remark, item.status)
                });
                refreshgsmtable();
            }
        })
    }
    //definded functions
    function submit() {
        showpageloder();
        var url;
        var method;
        url = "http://localhost:8080/api/materialoutnotectrl/savematerialoutnote";
        method = "POST";
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(monObject),
            contentType: 'application/json',
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                var enteredUser = materialrequisitionobj.enteredUser
                var enteredUserEmail = enteredUser.email;
                var enteredUserTpNo = enteredUser.contactNumbers.find(contactnoitem => contactnoitem.isdef == true).tpno
                sendEmail(enteredUserEmail,"Material Out Note (MR IR: "+materialrequisitionobj.code+")","Hello "+ enteredUser.firstname +",\nMaterial Requisition ID of "+ materialrequisitionobj.code + " which is requested by you, have been released by "+jwtPayload.firstname +" " +jwtPayload.lastname +". The Material Out Note ID is "+ monObject.code +".");
                sendSMS(enteredUserTpNo,"Hello%20"+ enteredUser.firstname +",%20Material%20Requisition%20ID%20of%20"+ materialrequisitionobj.code +"%20which%20is%20entered%20by%20you,%20have%20been%20released%20by%20"+jwtPayload.firstname +"%20" +jwtPayload.lastname +".%20The%20Material%20Out%20Note%20ID%20is%20"+ monObject.code +".");
                refreshtable();
            }
        })
    }
    function sendEmail(recipent,subject,body){
        $.ajax({
            url: "http://localhost:8080/api/emailctrl/sendemail",
            method: "POST",
            data: JSON.stringify({"toEmail": recipent,"subject":subject,"body":body}),
            contentType: 'application/json',
            headers: {
                "Authorization": jwt
            }
        })
    }
    function sendSMS(receiver,massage){
        $.ajax({
            url: "http://localhost:8080/api/smsctrl/sendsms",
            method: "POST",
            data: JSON.stringify({"receiver":receiver,"massage":massage}),
            contentType: 'application/json',
            headers: {
                "Authorization": jwt
            }
        })
    }
    function formctrl() {
        $(".formfillin").prop("disabled", true);
    }
    function enablefillin(fillinid) {
        $(fillinid).prop("disabled", false)
    }
    function setValues(ordercode) {
        formctrl();
        addmoddel = undefined;
        t23.clear().draw(false);
        if (ordercode) {
            materialrequisitionobj = materialrequisition_col.getMR(ordercode);
            materialRequisitionMaterialsobjarr = materialrequisitionobj.materialRequisitionMaterials;
            $.each(materialrequisitionobj.materialRequisitionMaterials, function (i, item) {
                t23.row.add([item.ordercode, item.bommaterial.material.code, item.bommaterial.material.description, item.requestedCount, item.bommaterial.material.uomid.scode]).draw(false);
            });
            $("#materialoutnote_customerid").val(materialrequisitionobj.billOfMaterial.customerOrder.customerid.code + " - " + materialrequisitionobj.billOfMaterial.customerOrder.customerid.firstname + " " + materialrequisitionobj.billOfMaterial.customerOrder.customerid.lastname);
        } else {
            materialrequisitionobj = null;
            materialRequisitionMaterialsobjarr = [];
            addmoddel = undefined;
            materialavild = undefined;
            bomMaterialsobjarr = [];
            $("#materialoutnote_customerid").val(undefined);
            $("#materialoutnote_id").val(undefined);
            $("#materialoutnote_remark").val(undefined);
            
        }
    }
    function setNewValues(code, enterddate, materialRequisition, materialOutNoteMaterials, printeddate, remark, status) {
        monObject = monClassesInstence.MaterialOutNoteDto;
        if (code) monObject.code = code;
        if (enterddate) monObject.enterddate = enterddate;
        if (materialRequisition) monObject.materialRequisition = materialRequisition;
        if (materialOutNoteMaterials) monObject.materialOutNoteMaterials = materialOutNoteMaterials;
        if (printeddate) monObject.printeddate = printeddate;
        if (remark) monObject.remark = remark;
        if (status) monObject.status = status;
        if (!monObject.enteredUser) monObject.enteredUser = jwtPayload;
    }
    function getgsdata(materilaid) {
        var gsdto = GeneralStoreDtos_col.getGeneralStoreDtoByMaterialCode(materilaid);
        if (((gsdto.itemcount - gsdto.releasedItemcount) - (gsdto.requestedItemcount - gsdto.releasedItemcount)) > 0) {
            return true;
        } else {
            return false;
        }
    }
    function checkavilability() {
        var response = [];
        var truematerials = [];
        var falsematerials = [];
        $.each(materialRequisitionMaterialsobjarr, function (i, item) {
            if (getgsdata(item.bommaterial.material.code) == true) {
                var code = item.bommaterial.material.code;
                var truematerial = truematerials.find(material => material.code === code);
                if (!truematerial) {
                    item.bommaterial.material.releaseCount = item.requestedCount;
                    truematerials.push(item.bommaterial.material);
                } else {
                    truematerial.releaseCount += item.requestedCount;
                }
            } else {
                var code = item.bommaterial.material.code;
                if (!falsematerials.find(material => material.code === code)) {
                    falsematerials.push(item.bommaterial.material);
                }
            }
        });
        response["truematerials"] = truematerials;
        response["falsematerials"] = falsematerials;
        return response;
    }
    //end of functions
    //triggers
    $('#table22 tbody').on('click', 'tr', function () {
        if (materialrequisition_col.allMRPending().length != 0) {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                setValues();
                selectedcode = undefined;
            } else {
                t22.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                selectedcode = $(this).children("td:nth-child(1)").text();
                setValues($(this).children("td:nth-child(1)").text());
            }
        }
    });

    $(document).off("click", "#btnprmpo");
    $(document).off("click", "#addMON");
    $(document).off("click", "#addPOM");

    $(document).on("click", "#btnprmpo", function () {
        selectedcode = $("#customerorder_code").val();
        refreshtable();
    })
    $(document).on("click", "#addMON", function () {
        var res = checkavilability();
        if (res.falsematerials.length == 0 && res.truematerials.length != 0) {
            addmoddel = "add";
            let index = materialOutNote_col.allMON().length;
            let mrcode = monClassesInstence.MONSerial.genarateMONCode(index);
            $("#materialoutnote_id").val(mrcode);
            enablefillin("#materialoutnote_remark");
            $.each(res.truematerials, function (i, item) {
                materialOutNote_col.addMONMtoArray(undefined, undefined, undefined, item, item.releaseCount)
            })
        } else {
            addmoddel = undefined;
            var fmtstr = "";
            $.each(res.falsematerials, function (i, item) {
                fmtstr += item.code + ", ";
            })
            fmtstr = fmtstr.replace(/,\s*$/, "");
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'Material Shortage on ' + fmtstr + '. Therefor, material Out note can not process at the moment.',
            });
        }


    })
    $(document).on("click", "#addPOM", function () {
        setMRMValues()
    })

    //end of triggers
    $("#podiv").hide();
    jwtPayload = getJwtPayload();
    formctrl();
    refreshtable();

});

