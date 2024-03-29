$(function () {
    //variables
    var mrClassesInstence = mrClasses.mrClassesInstence();
    let materialrequisition_col = mrClassesInstence.materialRequisition_service;
    var billofmaterialClassesInstence = billofmaterialClasses.billofmaterialClassesInstence();
    let billofmaterial_col = billofmaterialClassesInstence.billofmaterial_service;
    let billofmaterialobj = billofmaterialClassesInstence.billofmaterial;
    let bommobj = billofmaterialClassesInstence.bommaterial;
    let materialrequisitionobj = mrClassesInstence.materialrequisition;
    let bomMaterialsobjarr = [];
    let materialRequisitionMaterialsobjarr = [];
    var outstangingcount = 0;
    var addmoddel = undefined;
    var selectedcode = undefined;
    var jwtPayload = undefined;
    var selectedpomcode = undefined;
    var temphash = undefined;

    var t22 = $("#table22").DataTable({
        pageLength: 5,
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
            null
        ]
    });
    var t23 = $("#table23").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
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
            null
        ]
    });
    var t24 = $("#table24").DataTable({
        "order": [[0, "desc"]],
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body met"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
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
            null
        ]
    });
    var t13 = $("#table13").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body popup"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        "autoWidth": false,
    })
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
            if (addmoddel && materialrequisition_col.allNewMRNMaterials().length != 0 ) {
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
                        var year = new Date().getFullYear();
                        var month = new Date().getMonth();
                        var day = new Date().getDate();
                        var date = year + "-" + (parseInt(month) + 1) + "-" + day ;
                        let index = materialrequisition_col.getMRsByBOMCode(billofmaterialobj.code).length
                        let bomcode = billofmaterialobj.code;
                        let mrcode = mrClassesInstence.MaterialRequisitionSerial.genarateMRCode(index, bomcode);
                        var code = mrcode;
                        var enterddate = date;
                        var status = "PENDING";
                        var billOfMaterial = billofmaterialobj;
                        var materialRequisitionMaterials = materialrequisition_col.allNewMRNMaterials();
                        setNewValues(code, enterddate, billOfMaterial, materialRequisitionMaterials, undefined, status);
                        submit();
                    }
                })
            } else {
                if(addmoddel == undefined){
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please enter the valid Customer Order Number!',
                    });
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Requesting Material List can not be empty!',
                    });
                }
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
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI00201") != undefined || jwtPayload.businessRole == "ADMIN") {
            billofmaterial_col.clear();
            materialrequisition_col.clear();
            addmoddel = undefined;
            t22.clear().draw(false);
            t23.clear().draw(false);
            t13.clear().draw(false);
            $.ajax({
                url: "http://localhost:8080/api/billofmaterialctrl/getbillofmaterials",
                dataType: "JSON",
                headers: {
                    "Authorization": jwt
                },
                success: function (data) {
                    $.each(data.content, function (i, item) {
                        if (item.customerOrder.status == "ACCEPTED" && item.bomMaterials.length != 0) {
                            $.each(item.bomMaterials, function (i, item) {
                                billofmaterial_col.addbommaterialtoArray(item.id, item.code, item.material, item.materialCost, item.quantity);
                            })
                            billofmaterial_col.addBillOfMaterialtoArray(item.id, item.code, item.customerOrder, item.bomMaterials, item.totalcost, item.status);
                            t13.row.add([item.customerOrder.code,item.customerOrder.jobID,item.customerOrder.jobNumber]).draw(false);
                            var $tableRow = $("#table13 tr td:contains('" + selectedcode + "')").closest("tr");
                            $tableRow.addClass("selected");
                        }
                    });
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
                                materialrequisition_col.addMRtoArray(item.id, item.code, item.enterddate, item.billOfMaterial, item.materialRequisitionMaterials, item.printeddate, item.status, item.enteredUser);

                            });
                            setValues(selectedcode);
                            fadepageloder();
                        },
                        error: function (xhr, status, error) {
                            Swal.fire(
                                'Error!',
                                'Please contact the Administator',
                                'error'
                            )
                        }
                    })
                    fadepageloder();
                },
                error: function (xhr, status, error) {
                    Swal.fire(
                        'Error!',
                        'Please contact the Administator',
                        'error'
                    )
                }
            })
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI00201)',
            });
        }
    }
    function refreshmrmtable() {
        t24.clear().draw(false);
        let mrmlist = materialrequisition_col.allNewMRNMaterials();
        $.each(mrmlist, function (i, item) {
            t24.row.add([item.code, item.ordercode, item.requestedCount, item.bommaterial.material.uomid.scode]).draw(false);
        })
        $("#mr_requestedcount").val("");
    }
    //definded functions
    function submit() {
        showpageloder();
        var url;
        var method;
        url = "http://localhost:8080/api/materialrequisitionctrl/savematerialrequisition";
        method = "POST";
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(materialrequisitionobj),
            contentType: 'application/json',
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                Swal.fire(
                    'Added!',
                    'New record has been added.',
                    'success'
                )
                refreshtable();
                setValues();
            }
        })
    }
    function formctrl() {
        $(".formfillin").prop("disabled", true);
    }
    function enablefillin(fillinid) {
        $(fillinid).prop("disabled", false)
    }
    function setBOMMValues(ordercode) {
        if (ordercode) {
            t23.clear().draw(false);
            materialRequisitionMaterialsobjarr = [];
            materialRequisitionMaterialsobjarr = materialrequisition_col.allMRsByOrderCode(ordercode).MRMs;
            setOutstanding(ordercode);
            if (addmoddel == "add") {
                $("#mr_orderno").val(selectedpomcode);
                $("#mr_requestedcount").val(undefined)
            }
            if (materialRequisitionMaterialsobjarr.length != 0) {
                $.each(materialRequisitionMaterialsobjarr, function (i, item) {
                    if (item.id != undefined)
                        t23.row.add([item.materialRequisition.code, item.code, item.requestedCount, item.bommaterial.material.uomid.scode, item.materialRequisition.enterddate
                        ]).draw(false);
                })
            }
        } else {
            t23.clear().draw(false);
            materialRequisitionMaterialsobjarr = [];
            $("#mr_outstanding").val(undefined);
            $("#mr_orderno").val(undefined);
            $("#mr_requestedcount").val(undefined)
        }
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
    function setOutstanding(ordercode) {
        if (ordercode) {
            var totrequested = materialrequisition_col.allMRsByOrderCode(ordercode).totrequested;
            bommobj = billofmaterial_col.getBOMMaterialbycode(ordercode, billofmaterialobj.code);
            outstangingcount = bommobj.quantity - totrequested;
            $("#mr_outstanding").val(commaSeparateNumber(String(outstangingcount)));
        } else {
            outstangingcount = 0;
            $("#mr_outstanding").val(undefined);
        }
    }
    function setMRMValues() {
        setOutstanding(selectedpomcode);
        var index = materialrequisition_col.getNewMRNMaterialsByOrderCode(selectedpomcode).length;
        var mrmcode = mrClassesInstence.MaterialRequisitionSerial.genarateMRMCode(index, selectedpomcode);
        var requestedCount = $("#mr_requestedcount").val();
        var res = materialrequisition_col.addNewMRMaterialstoArray(undefined, mrmcode, selectedpomcode, materialrequisitionobj, bommobj, requestedCount, outstangingcount);
        console.log(requestedCount)
        if (res) {
            Swal.fire(
                'Added!',
                'The new record has been added.',
                'success'
            )
            refreshmrmtable();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'MR material counts are not tallied with the outstanding amount',
            });
        }

    }
    function setValues(code) {
        formctrl();
        addmoddel = undefined;
        if (code) {
            billofmaterialobj = billofmaterial_col.getBillOfMaterialByCOcode(code);
            if (billofmaterialobj != undefined) {
                bomMaterialsobjarr = billofmaterialobj.bomMaterials;
                $("#billofmaterial_code").val(undefined);
                $("#billofmaterial_customerid").val(undefined);
                $("#mr_lastmr").val(undefined);
                $("#mr_requestedcount").val(undefined);
                $("#mr_code").val(undefined);
                $("#mr_remark").val(undefined);
                $("#mr_outstanding").val(undefined);
                $("#mr_orderno").val(undefined);
                $("#billofmaterial_code").val(billofmaterialobj.code);
                materialrequisition_col.clearmrm();
                t24.clear().draw(false);
                $("#mr_lastmr").val(materialrequisition_col.getlastMRByCOCode(code));
                if (billofmaterialobj.customerOrder.customerid) {
                    cli_obj = billofmaterialobj.customerOrder.customerid;
                    $("#billofmaterial_customerid").val(billofmaterialobj.customerOrder.customerid.code + " - " + billofmaterialobj.customerOrder.customerid.firstname + " " + billofmaterialobj.customerOrder.customerid.lastname);
                }
                if (billofmaterialobj.bomMaterials) {
                    t22.clear().draw(false);
                    $.each(billofmaterialobj.bomMaterials, function (i, item) {
                        t22.row.add([item.code, item.material.description, item.quantity, item.material.uomid.scode]).draw(false);

                    })
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please select a valid Customer Order Number',
                });
                setValues();
            }

        } else {
            t22.clear().draw(false);
            t24.clear().draw(false);
            t23.clear().draw(false);
            bommobj = null;
            materialrequisitionobj = null;
            materialRequisitionMaterialsobjarr = [];
            outstangingcount = 0
            addmoddel = undefined;
            selectedcode = undefined;
            selectedpomcode = undefined;
            billofmaterialobj = null;
            billofmaterial_col.clear();
            materialrequisition_col.clear();
            bomMaterialsobjarr = [];
            $("#table13 tr").removeClass("selected")
            $("#billofmaterial_code").val(undefined);
            $("#billofmaterial_customerid").val(undefined);
            $("#mr_lastmr").val(undefined);
            $("#mr_requestedcount").val(undefined)
            $("#mr_code").val(undefined);
            $("#mr_remark").val(undefined);
            $("#mr_outstanding").val(undefined);
            $("#mr_orderno").val(undefined);
        }
    }
    function setNewValues(code, enterddate, billOfMaterial, materialRequisitionMaterials, printeddate, status) {
        materialrequisitionobj = mrClassesInstence.materialrequisition;
        if (code) materialrequisitionobj.code = code;
        if (enterddate) materialrequisitionobj.enterddate = enterddate;
        if (billOfMaterial) materialrequisitionobj.billOfMaterial = billOfMaterial;
        if (status) materialrequisitionobj.status = status;
        if (materialRequisitionMaterials) materialrequisitionobj.materialRequisitionMaterials = materialRequisitionMaterials;
        if (!materialrequisitionobj.enteredUser) materialrequisitionobj.enteredUser = jwtPayload;

    }
    //end of functions
    //triggers
    $('#table22 tbody').on('click', 'tr', function () {
        if (bomMaterialsobjarr.length != 0 && addmoddel == "add") {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                setBOMMValues();
                selectedpomcode = undefined;
            } else {
                t22.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                selectedpomcode = $(this).children("td:nth-child(1)").text();
                setBOMMValues($(this).children("td:nth-child(1)").text());
            }
        }

    });
    $('#table24 tbody').on('click', 'tr', function () {
        if (bomMaterialsobjarr.length != 0 && addmoddel == "add") {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                temphash = undefined;
            } else {
                t24.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                temphash = $(this).children("td:nth-child(1)").text();
            }
        }
    });
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
    $(document).off("click", "#btnprmpo");
    $(document).off("click", "#addMR");
    $(document).off("click", "#addPOM");
    $(document).off("click", "#removePOM");
    $(document).off("click", "#cancelMR");

    $(document).on("click", "#btnprmpo", function () {
        $("#modal-colist").modal("show");
        // selectedcode = $("#customerorder_code").val();
        // refreshtable();
    })
    $(document).on("click", "#addMR", function () {
        if (billofmaterialobj) {
            addmoddel = "add";
            let index = materialrequisition_col.getMRsByBOMCode(billofmaterialobj.code).length
            let code = billofmaterialobj.code;
            let mrcode = mrClassesInstence.MaterialRequisitionSerial.genarateMRCode(index, code);
            $("#mr_code").val(mrcode);
            enablefillin("#mr_requestedcount");
        }

    })
    $(document).on("click", "#addPOM", function () {
        setMRMValues()
    })
    $(document).on("focusout", "#addPOM", function () {
        var val = $("#mr_requestedcount").val();
        val = String(val);
        if (val != "") {
            if (val.indexOf('.') == -1) {
                val = val + ".00";
            } else {
                val = val;
            }
        } else {
            val = val;
        }
        $("#mr_requestedcount").val(val)
    })
    $(document).on("click", "#removePOM", function () {
        if (temphash != undefined) {
            materialrequisition_col.removeNewMRMaterialstoArray(temphash);
            refreshmrmtable();
        }
    })
    $(document).on("click", "#cancelMR", function () {
        selectedcode = "";
        setValues();
    });
    //end of triggers
    $("#podiv").hide();
    jwtPayload = getJwtPayload();
    formctrl();
    refreshtable();

});

