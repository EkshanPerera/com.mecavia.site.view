$(function () {
    //variables
    var grnClassesInstence = grnClasses.grnClassesInstence();
    let purchaserequisition_col = grnClassesInstence.purchaserequisition_service;
    let goodsreceivednote_col = grnClassesInstence.goodsReceivedNote_service;
    let purchaserequisitionobj = grnClassesInstence.purchaserequisition;
    let prmobj = grnClassesInstence.purchaseRequisitionMaterial;
    let goodsreceivednoteobj = grnClassesInstence.goodsreceivednote;
    let purchaseRequisitionMaterialsobjarr = [];
    let goodsReceivedNoteMaterialsobjarr = [];
    var outstangingcount = 0;
    var addmoddel = undefined;
    var selectedcode = undefined;
    var jwtPayload = undefined;
    var selectedpomcode = undefined;
    var temphash;
    var t25 = $("#table25").DataTable({
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
            null
        ]
    });
    var t26 = $("#table26").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t27 = $("#table27").DataTable({
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
            null
        ]
    });
    $('#grn_invoicedate,#grn_mradate').datepicker({ dateFormat: 'dd/mm/yy' });

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
            grn_invoceno: {
                required: true
            },
            grn_invoicedate: {
                required: true
            },
            grn_mrano: {
                required: true
            },
            grn_mradate: {
                required: true
            },
            grn_remark: {
                required: true
            }
        },
        messages: {
            grn_invoceno: {
                required: "Please fillout the invoce number."
            },
            grn_invoicedate: {
                required: "Please fillout the invoce date."
            },
            grn_mrano: {
                required: "Please fillout the mra number."
            },
            grn_mradate: {
                required: "Please fillout the mra date."
            },
            grn_remark: {
                required: "Please fillout the invoce remark."
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
                        let index = goodsreceivednote_col.getGRNsByPOCode(selectedcode).length
                        let prcode = purchaserequisitionobj.prcode;
                        let grncode = grnClassesInstence.GoodsRecevedNoteSerial.genarateGRNCode(index, prcode);
                        var invoicenumber = $("#grn_invoiceno").val();
                        var invocedate = $("#grn_invoicedate").val();
                        var code = grncode;
                        var mradate = $("#grn_mradate").val();
                        var mrano = $("#grn_mrano").val();
                        var enterddate = date;
                        var remark = $("#grn_remark").val();
                        var status = "SUBMIT";
                        var purchaseRequisition = purchaserequisitionobj;
                        var goodsReceivedNoteMaterials = goodsreceivednote_col.allNewGRNNMaterials();
                        setNewValues(invoicenumber, invocedate, code, mradate, mrano, enterddate, remark, status, purchaseRequisition, goodsReceivedNoteMaterials,);
                        submit();
                    }
                })
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
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05010") != undefined || jwtPayload.businessRole == "ADMIN") {
            purchaserequisition_col.clear();
            goodsreceivednote_col.clear();
            addmoddel = undefined;
            t25.clear().draw(false);
            t26.clear().draw(false);
            $.ajax({
                url: "http://localhost:8080/api/purchaserequisitionctrl/getpurchaserequisitions",
                dataType: "JSON",
                headers: {
                    "Authorization": jwt
                },
                success: function (data) {
                    $.each(data.content, function (i, item) {
                        if (item.status == "PRINTED") {
                            $.each(item.purchaseRequisitionMaterials, function (i, item) {
                                purchaserequisition_col.addpurchaseRequisitionMaterialstoArray(item.id, item.code, item.material, item.unitrate, item.quantity);
                            })
                            purchaserequisition_col.addPurchaseRequisitiontoArray(item.id, item.prcode, item.pocode, item.supplierid, item.status, item.remark, item.totalAmount, item.purchaseRequisitionMaterials, item.printeddate);
                        }
                    });
                    $.ajax({
                        url: "http://localhost:8080/api/goodsreceivednotectrl/getgoodsreceivednotes",
                        dataType: "JSON",
                        headers: {
                            "Authorization": jwt
                        },
                        success: function (data) {
                            $.each(data.content, function (i, item) {
                                $.each(item.goodsReceivedNoteMaterials, function (i, item) {
                                    goodsreceivednote_col.addGRNMaterialstoArray(item.id, item.code, item.ordercode, item.goodsReceivedNote, item.prmaterial, item.arrivedCount);
                                });
                                goodsreceivednote_col.addGRNtoArray(item.id, item.invoicenumber, item.invocedate, item.code, item.mradate, item.mrano, item.enterddate, item.remark, item.status, item.purchaseRequisition, item.goodsReceivedNoteMaterials, item.printeddate);
                            });
                            setValues(selectedcode);
                            fadepageloder();
                        },
                        error: function (xhr, status, error) {
                            fadepageloder();
                        }
                    })

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
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI00506)',
            });
        }
    }
    function refreshgrnmtable() {
        t27.clear().draw(false);
        let grnmlist = goodsreceivednote_col.allNewGRNNMaterials();
        $.each(grnmlist, function (i, item) {
            t27.row.add([item.hash, item.ordercode, item.arrivedCount, item.prmaterial.material.uomid.scode]).draw(false);
        })
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

        url = "http://localhost:8080/api/goodsreceivednotectrl/savegoodsreceivednote";
        method = "POST";
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(goodsreceivednoteobj),
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
    function setPOMValues(ordercode) {
        if (ordercode) {
            t26.clear().draw(false);
            goodsReceivedNoteMaterialsobjarr = [];
            goodsReceivedNoteMaterialsobjarr = goodsreceivednote_col.allGRNsByOrderCode(ordercode).GRNMs;
            setOutstanding(ordercode);
            if (addmoddel == "add") {
                $("#grn_orderno").val(selectedpomcode);
            }
            if (goodsReceivedNoteMaterialsobjarr.length != 0) {
                $.each(goodsReceivedNoteMaterialsobjarr, function (i, item) {
                    if (item.id != undefined)
                        t26.row.add([item.goodsReceivedNote.code, item.code, item.arrivedCount, item.prmaterial.material.uomid.scode, item.goodsReceivedNote.enterddate,
                        item.goodsReceivedNote.invoicenumber, item.goodsReceivedNote.invocedate, item.goodsReceivedNote.mrano, item.goodsReceivedNote.mradate]).draw(false);
                })
            }
        } else {
            t26.clear().draw(false);
            goodsReceivedNoteMaterialsobjarr = [];
            $("#grn_outstanding").val(undefined);
            $("#grn_orderno").val(undefined);
            $("#grn_arrivedcount").val(undefined)
        }
    }
    function setOutstanding(ordercode) {
        if (ordercode) {
            var totarrived = goodsreceivednote_col.allGRNsByOrderCode(ordercode).totarrived;
            prmobj = purchaserequisition_col.getPRMsByOrderCode(ordercode);
            outstangingcount = prmobj.quantity - totarrived;
            $("#grn_outstanding").val(commaSeparateNumber(String(outstangingcount)));
        } else {
            outstangingcount = 0;
            $("#grn_outstanding").val(undefined);
        }
    }
    function setGRMValues() {
        setOutstanding(selectedpomcode);
        var index = goodsreceivednote_col.getNewGRNNMaterialsByOrderCode(selectedpomcode).length;
        var grnmcode = grnClassesInstence.GoodsRecevedNoteSerial.genarateGRNMCode(index, selectedpomcode);
        var arrivedCount = $("#grn_arrivedcount").val();
        var res = goodsreceivednote_col.addNewGRNMaterialstoArray(undefined, undefined, selectedpomcode, goodsreceivednoteobj, prmobj, arrivedCount, outstangingcount);
        if (res) {
            Swal.fire(
                'Added!',
                'The new record has been added.',
                'success'
            )
            $("#grn_arrivedcount").val(undefined);
            refreshgrnmtable();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'GRN material counts are not tallied with the outstanding amount',
            });
        }
    }
    function setValues(code) {
        formctrl();
        addmoddel = undefined;
        if (code) {
            purchaserequisitionobj = purchaserequisition_col.getPurchaseOrder(code);
            if (purchaserequisitionobj) {
                purchaseRequisitionMaterialsobjarr = purchaserequisitionobj.purchaseRequisitionMaterials;
                $("#purchaserequisition_code").val(purchaserequisitionobj.prcode);
                $("#purchaseorder_code").val(purchaserequisitionobj.pocode);
                $("#grn_lastgrn").val(goodsreceivednote_col.getlastGRNByPOCode(code));
                if (purchaserequisitionobj.supplierid) {
                    cli_obj = purchaserequisitionobj.supplierid;
                    $("#purchaserequisition_supplierid").val(purchaserequisitionobj.supplierid.code + " - " + purchaserequisitionobj.supplierid.firstname + " " + purchaserequisitionobj.supplierid.lastname);
                }
                if (purchaserequisitionobj.purchaseRequisitionMaterials) {
                    t25.clear().draw(false);
                    $.each(purchaserequisitionobj.purchaseRequisitionMaterials, function (i, item) {
                        t25.row.add([item.code, item.material.description, item.quantity, item.material.uomid.scode]).draw(false);

                    })
                }
            } else {
                setValues();
            }
        } else {
            t25.clear().draw(false);
            t27.clear().draw(false);
            prmobj = null;
            goodsreceivednoteobj = null;
            goodsReceivedNoteMaterialsobjarr = [];
            outstangingcount = 0
            addmoddel = undefined;
            selectedcode = undefined;
            selectedpomcode = undefined;
            purchaserequisitionobj = null;
            purchaserequisition_col.clearprm();
            goodsreceivednote_col.cleargrnm();
            purchaserequisition_col.clear();
            goodsreceivednote_col.clear();
            purchaseRequisitionMaterialsobjarr = [];
            $("#purchaserequisition_code").val(undefined);
            $("#purchaserequisition_supplierid").val(undefined);
            $("#grn_lastgrn").val(undefined);
            $("#purchaserequisition_supplierid").val(undefined);
            $("#grn_arrivedcount").val(undefined)
            $("#grn_code").val(undefined);
            $("#grn_invoiceno").val(undefined);
            $("#grn_invoicedate").val(undefined);
            $("#grn_mrano").val(undefined);
            $("#grn_mradate").val(undefined);
            $("#grn_remark").val(undefined);
            $("#grn_orderno").val(undefined);
            $("#grn_outstanding").val(undefined);
        }
    }
    function setNewValues(invoicenumber, invocedate, code, mradate, mrano, enterddate, remark, status, purchaseRequisition, goodsReceivedNoteMaterials, printeddate) {
        goodsreceivednoteobj = grnClassesInstence.goodsreceivednote;
        if (invoicenumber) goodsreceivednoteobj.invoicenumber = invoicenumber;
        if (invocedate) goodsreceivednoteobj.invocedate = invocedate;
        if (code) goodsreceivednoteobj.code = code;
        if (mradate) goodsreceivednoteobj.mradate = mradate;
        if (mrano) goodsreceivednoteobj.mrano = mrano;
        if (enterddate) goodsreceivednoteobj.enterddate = enterddate;
        if (remark) goodsreceivednoteobj.remark = remark;
        if (status) goodsreceivednoteobj.status = status;
        if (purchaseRequisition) goodsreceivednoteobj.purchaseRequisition = purchaseRequisition;
        if (goodsReceivedNoteMaterials) goodsreceivednoteobj.goodsReceivedNoteMaterials = goodsReceivedNoteMaterials;
    }
    //end of functions
    //triggers
    $('#table25 tbody').on('click', 'tr', function () {
        if (purchaseRequisitionMaterialsobjarr.length != 0 && addmoddel == "add") {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                setPOMValues();
                selectedpomcode = undefined;
            } else {
                t25.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                selectedpomcode = $(this).children("td:nth-child(1)").text();
                setPOMValues($(this).children("td:nth-child(1)").text());
            }
        }

    });
    $('#table27 tbody').on('click', 'tr', function () {
        if (purchaseRequisitionMaterialsobjarr.length != 0 && addmoddel == "add") {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                temphash = undefined;
            } else {
                t27.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                temphash = $(this).children("td:nth-child(1)").text();
            }
        }
    });
    $(document).off("click", "#btnprmpo");
    $(document).off("click", "#addGRN");
    $(document).off("click", "#addPOM");
    $(document).on("click", "#btnprmpo", function () {
        selectedcode = $("#purchaseorder_code").val();
        refreshtable();
    })
    $(document).on("click", "#addGRN", function () {
        if (purchaserequisitionobj) {
            addmoddel = "add";
            let index = goodsreceivednote_col.getGRNsByPOCode(selectedcode).length
            let prcode = purchaserequisitionobj.prcode;
            let grncode = grnClassesInstence.GoodsRecevedNoteSerial.genarateGRNCode(index, prcode);
            $("#grn_code").val(grncode);
            enablefillin("#grn_arrivedcount");
            enablefillin("#grn_invoiceno");
            enablefillin("#grn_mrano");
            enablefillin("#grn_remark");
        }

    })
    $(document).on("click", "#addPOM", function () {
        setGRMValues()
    })
    $(document).on("focusout", "#addPOM", function () {
        var val = $("#grn_arrivedcount").val();
        if (val != "") {
            if (val.indexOf('.') == -1) {
                val = val + ".00";
            } else {
                val = val;
            }
        } else {
            val = val;
        }
        $("#grn_arrivedcount").val(val)
    })
    $(document).on("click", "#removePOM", function () {
        if (temphash != undefined) {
            goodsreceivednote_col.removeNewGRNMaterialstoArray(temphash);
            refreshgrnmtable();
        }
    })

    //end of triggers
    $("#podiv").hide();
    jwtPayload = getJwtPayload();
    formctrl();
    refreshtable();

});

