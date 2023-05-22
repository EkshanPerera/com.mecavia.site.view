$(function () {
    //variables
    let purchaserequisition_col = new purchaserequisition_service();
    let purchaserequisitionobj = new purchaserequisition();
    let purchaseRequisitionMaterialsobjarr = [];
    let material_col = new material_service();
    let material_obj = new material();
    let cli_col = new cli_service();
    let cli_obj = new client();

    var addmoddel;
    var selectedcode;
    var t9 = $("#table9").DataTable({
        "order": [[ 0, "desc" ]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t10 = $("#table10").DataTable({
        "order": [[ 0, "desc" ]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t8 = $("#table8").DataTable({
        "order": [[ 0, "desc" ]]
    });
    var t4 = $("#table4").DataTable({
        "order": [[ 0, "desc" ]]
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
            purchaserequisitionremark: {
                required: true
            }

        },
        messages: {
            purchaserequisitionremark: {
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
            if (cli_obj.id && purchaseRequisitionMaterialsobjarr.length != 0) {
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
                                    var remark = $("#purchaserequisition_remark").val()
                                    var totalamount = 0;
                                    $.each(purchaseRequisitionMaterialsobjarr, function (i, item) {
                                        totalamount += parseFloat(item.unitrate) * parseFloat(item.quantity);
                                    })
                                    var purchaseRequisitionMaterials = purchaseRequisitionMaterialsobjarr;
                                    var status = "PENDING";
                                    var supplierid;
                                    if (cli_obj) supplierid = cli_obj;
                                    else supplierid = undefined;
                                    setNewValues(code, remark, totalamount, status, supplierid, purchaseRequisitionMaterials);
                                    submit();
                                    Swal.fire(
                                        'Added!',
                                        'New record has been added.',
                                        'success'
                                    )
                                    break;
                                case "mod":
                                    var code = undefined;
                                    var remark = undefined;
                                    var totalamount = undefined;
                                    var status = "SUBMIT";
                                    var supplierid = undefined;
                                    var purchaseRequisitionMaterials = undefined;
                                    setNewValues(code, remark, totalamount, status, supplierid, purchaseRequisitionMaterials);
                                    submit();
                                    Swal.fire(
                                        'Submitted!',
                                        'The PR has been submitted for approval.',
                                        'success'
                                    )
                                    break;
                                case "del":
                                    var code = undefined;
                                    var remark = undefined;
                                    var totalamount = undefined;
                                    var status = "EXPIRE";
                                    var supplierid = undefined;
                                    var purchaseRequisitionMaterials = undefined;
                                    setNewValues(code, remark, totalamount, status, supplierid, purchaseRequisitionMaterials);
                                    submit();
                                    Swal.fire(
                                        'Expired!',
                                        'The PR has been expired.',
                                        'success'
                                    )
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
                        text: 'In order to save, please select the supplier.',
                    });
                }
                if (purchaseRequisitionMaterialsobjarr.length == 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'In order to save, please add the material.',
                    });
                }
            }
        }
    });
    $('#quickForm9').validate({
        rules: {
            purchaserequisitionunitrate: {
                required: true
            },
            purchaserequisitionquntity: {
                required: true
            }

        },
        messages: {
            purchaserequisitionquntity: {
                required: "Please fillout the quntity!"
            },
            purchaserequisitionunitrate: {
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
            if (material_obj != undefined) {
                if (material_obj.id != undefined) {
                    var unitrate = $("#purchaserequisition_unitrate").val();
                    var quantity = $("#purchaserequisition_quntity").val();
                    purchaserequisition_col.addpurchaseRequisitionMaterialstoArray(undefined, undefined, material_obj, unitrate, quantity);
                    refreshprmatarialtable();
                    $("#modal-purchaseRequisitionMaterials").modal("hide")
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'In order to add, please select the material.',
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'In order to add, please select the material.',
                });
            }
        }
    });
    //definded functions
    function refreshtable() {
        purchaserequisition_col.clear();
        material_col.clear();
        cli_col.clear();
        addmoddel = undefined;
        selectedcode = undefined;
        t9.clear().draw(false);
        t10.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/purchaserequisitionctrl/getpurchaserequisitions",
            dataType: "JSON",
            success: function (data) {
                $.each(data.content, function (i, item) {
                    purchaserequisition_col.addPurchaseRequisitiontoArray(item.id, item.prcode, item.pocode, item.supplierid, item.status, item.remark, item.totalAmount, item.purchaseRequisitionMaterials);
                    t9.row.add([item.prcode, item.pocode, item.supplierid.code, item.supplierid.firstname + " " + item.supplierid.lastname, item.status]).draw(false);
                    setValues();
                    var $tableRow = $("#table9 tr td:contains('" + selectedcode + "')").closest("tr");
                    $tableRow.trigger("click");
                });
                refreshmatarialtable();
                refreshsuppliertable();
            }
        })
    }
    function refreshprmatarialtable() {
        purchaseRequisitionMaterialsobjarr = purchaserequisition_col.allPurchaseRequisitionMaterials();
        t10.clear().draw(false);
        var total = 0;
        $.each(purchaseRequisitionMaterialsobjarr, function (i, item) {
            t10.row.add([i + 1, item.material.description, item.unitrate, item.quantity, item.material.uomid.scode]).draw(false);
            total += parseFloat(item.unitrate) * parseFloat(item.quantity);
        })
        $('#purchaserequisition_totalamount').val(total);
    }
    function refreshmatarialtable() {
        material_col.clear()
        t8.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/materialctrl/getmaterials",
            dataType: "JSON",
            success: function (data) {
                $.each(data.content, function (i, item) {
                    if (item.materialType == "ROW" && item.status == "ACTIVE") {
                        material_col.addMaterialtoArray(item.id, item.code, item.description, item.materialType, item.uomid, item.status,item.price);
                        t8.row.add([item.code, item.description]).draw(false);
                    }
                })
                var $tableRow = $("#table8 tr td:contains('" + selectedcode + "')").closest("tr");
                $tableRow.trigger("click");
            }
        })
    }
    function refreshsuppliertable() {
        cli_col.clear();
        t4.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/clientctrl/getclients",
            dataType: "JSON",
            success: function (data) {
                $.each(data.content, function (i, item) {
                    if (item.businessRole == "SUPPLIER" && item.status == "ACTIVE") {
                        cli_col.addClitoArray(item.id, item.code, item.firstname, item.middlename, item.lastname, item.email, item.businessRole, item.status, item.clientGroupid, item.roleid);
                        t4.row.add([item.code, item.firstname + " " + item.lastname]).draw(false);
                    }
                });
                var $tableRow = $("#table4 tr td:contains('" + selectedcode + "')").closest("tr");
                $tableRow.trigger("click");
            }
        });

    }
    //definded functions

    function submit() {
        var url;
        var method;
        var token = localStorage.getItem("jwt_token");
        switch (addmoddel) {
            case "add":
                url = "http://localhost:8080/api/purchaserequisitionctrl/savepurchaserequisition";
                method = "POST";
                break;
            case "mod":
            case "del":
                url = "http://localhost:8080/api/purchaserequisitionctrl/updatepurchaserequisition";
                method = "PUT";
                break;
            // case "del":
            //     url = "http://localhost:8080/api/purchaserequisitionctrl/activeinactivepurchaserequisition";
            //     method = "POST";
            //     break;
        }
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(purchaserequisitionobj),
            contentType: 'application/json',
            success: function (data) {
                refreshtable();
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
            purchaserequisitionobj = purchaserequisition_col.getPurchaseRequisition(code);
            purchaseRequisitionMaterialsobjarr = purchaserequisitionobj.purchaseRequisitionMaterials;
            $("#purchaserequisition_code").val(purchaserequisitionobj.prcode);
            $("#purchaseorder_code").val(purchaserequisitionobj.pocode);
            $("#purchaserequisition_unitrate").val(purchaserequisitionobj.unitrate)
            $("#purchaserequisition_quntity").val(purchaserequisitionobj.quntity)
            $("#purchaserequisition_remark").val(purchaserequisitionobj.remark)
            $("#purchaserequisition_totalamount").val(purchaserequisitionobj.totalAmount);
            $("#purchaserequisition_status").val(purchaserequisitionobj.status);
            if (purchaserequisitionobj.supplierid) {
                cli_obj = purchaserequisitionobj.supplierid;
                $("#purchaserequisition_supplierid").val(purchaserequisitionobj.supplierid.code + " - " + purchaserequisitionobj.supplierid.firstname + " " + purchaserequisitionobj.supplierid.lastname);
            }
            if (purchaserequisitionobj.material) {
                material_obj = purchaserequisitionobj.material;
                $("#purchaserequisition_matarialid").val(purchaserequisitionobj.material.code + " - " + purchaserequisitionobj.material.description);
            }
            if (purchaserequisitionobj.purchaseRequisitionMaterials) {
                t10.clear().draw(false);
                $.each(purchaserequisitionobj.purchaseRequisitionMaterials, function (i, item) {
                    t10.row.add([i + 1, item.material.description, item.unitrate, item.quantity, item.material.uomid.scode]).draw(false);
                })
            }

        } else {
            purchaserequisitionobj = undefined;
            t10.clear().draw(false);
            purchaserequisition_col.clearprm();
            purchaseRequisitionMaterialsobjarr = [];
            total = undefined;
            $("#purchaserequisition_code").val(undefined);
            $("#purchaseorder_code").val(undefined);
            $("#purchaserequisition_unitrate").val(undefined)
            $("#purchaserequisition_quntity").val(undefined)
            $("#purchaserequisition_remark").val(undefined)
            $("#purchaserequisition_totalamount").val(undefined);
            $("#purchaserequisition_status").val(undefined);
            $("#purchaserequisition_supplierid").val(undefined);
            $("#purchaserequisition_materialid").val(undefined);

        }
    }
    function setClientValues(code) {
        $("#modal-supplierlist").modal("hide");
        if (code) {
            cli_obj = cli_col.getClient(code);
            $("#purchaserequisition_supplierid").val(cli_obj.code + " - " + cli_obj.firstname + " " + cli_obj.lastname);

        } else {
            cli_obj = undefined;
            $("#purchaserequisition_supplierid").val(undefined);

        }
    }
    function setMatarialalues(code) {
        $("#modal-matariallist").modal("hide");
        if (code) {
            material_obj = material_col.getMaterial(code);
            $("#purchaserequisition_matarialid").val(material_obj.code + " - " + material_obj.description);

        } else {
            material_obj = undefined;
            $("#purchaserequisition_matarialid").val(undefined);

        }
    }
    function setNewValues(code, remark, totalamount, status, supplierid, purchaseRequisitionMaterials) {
        if (purchaserequisitionobj) {
            if (code) purchaserequisitionobj.prcode = code;
            if (remark) purchaserequisitionobj.remark = remark;
            if (totalamount) purchaserequisitionobj.totalAmount = totalamount;
            if (status) purchaserequisitionobj.status = status;
            if (supplierid) purchaserequisitionobj.supplierid = supplierid;
            if (purchaseRequisitionMaterials) purchaserequisitionobj.purchaseRequisitionMaterials = purchaseRequisitionMaterials;
        } else {
            purchaserequisitionobj = new purchaserequisition();
            setNewValues(code, remark, totalamount, status, supplierid, purchaseRequisitionMaterials);
        }
    }
    function resetform(element) {
        $(element).find(".invalid-feedback").remove();
        $(element).find(".is-invalid").removeClass("is-invalid");
        $(element).find(".is-valid").removeClass("is-valid");
    }
    function genaratecode() {
        let purchaserequisitionlist = purchaserequisition_col.allPurchaseRequisition()
        let purchaserequisitioncode = new PurchaseRequisitionSerial().genaratePurchaseRequisitionCode(purchaserequisitionlist.length);
        return purchaserequisitioncode;
    }
    //end of functions
    //triggers
    $('#table9 tbody').on('click', 'tr', function () {
        resetform("#quickForm8");
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            setValues();
            selectedcode = "";
        } else {
            t9.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            selectedcode = $(this).children("td:nth-child(1)").text();
            setValues($(this).children("td:nth-child(1)").text());
        }
    });
    $('#table4 tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            setClientValues();
        } else {
            t4.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            setClientValues($(this).children("td:nth-child(1)").text());
        }
    });
    $('#table8 tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            setMatarialalues();
        } else {
            t8.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            setMatarialalues($(this).children("td:nth-child(1)").text());
        }
    });
    $(document).on("click", "#addMaterialbtn", function () {
        if ($("#table8 tbody tr").hasClass('selected')) {
            material_obj = undefined;
            $("#table8 tbody tr").removeClass('selected');
        }
        $("#purchaserequisition_unitrate").val(undefined);
        $("#purchaserequisition_quntity").val(undefined);
    })
    $(document).on("click", "#addPurchaseRequisitions", function () {
        selectedcode = "";
        setValues(undefined);
        addmoddel = "add";
        $("#purchaserequisition_code").val(genaratecode());
        $("#table9 tbody tr").removeClass('selected');
        enablefillin("#purchaserequisition_unitrate");
        enablefillin("#purchaserequisition_quntity");
        enablefillin("#purchaserequisition_remark");
        enablefillin("#supplierbtn");
        enablefillin("#matarialbtn");
        enablefillin("#addMaterialbtn");
        $("#purchaserequisition_status").val("PENDING");
    });
    $(document).on("click", "#setPurchaseRequisitions", function () {
        if (selectedcode) {
            if (purchaserequisitionobj.status == "PENDING") {
                setValues(selectedcode);
                addmoddel = "mod";
                $("#purchaserequisition_status").val("SUBMIT");
                Toast.fire({
                    icon: 'info',
                    title: 'Please press save to compleate!'
                });
            } else {
                switch (purchaserequisitionobj.status) {
                    case "EXPIRE":
                        Swal.fire({
                            icon: 'warning',
                            title: 'Warning!',
                            text: 'The PR you are attempting to submit is currently expired!',
                        });
                        break;
                    case "APPROVED":
                        Swal.fire({
                            icon: 'warning',
                            title: 'Warning!',
                            text: 'The PR you are attempting to submit is currently approved!',
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
    });
    $(document).on("click", "#removaPurchaseRequisitions", function () {
        if (selectedcode) {
            if (purchaserequisitionobj.status == "PENDING") {
                setValues(selectedcode);
                addmoddel = "del";
                $("#purchaserequisition_status").val("EXPIRE");
                Toast.fire({
                    icon: 'info',
                    title: 'Please press save to compleate!'
                });
            } else {
                switch (purchaserequisitionobj.status) {
                    case "EXPIRE":
                        Swal.fire({
                            icon: 'warning',
                            title: 'Warning!',
                            text: 'The PR you are attempting to expire is already expired!',
                        });
                        break;
                    case "APPROVED":
                        Swal.fire({
                            icon: 'warning',
                            title: 'Warning!',
                            text: 'The PR you are attempting to expire is currently approved!',
                        });
                        break;
                    case "REJECTED":
                        Swal.fire({
                            icon: 'warning',
                            title: 'Warning!',
                            text: 'The PR you are attempting to expire is rejected!',
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
    });
    $(document).on('input', '#purchaserequisition_unitrate', function () {
        var value = $('#purchaserequisition_unitrate').val();
        value = value.replace(/[^\d.]/g, '');
        value = value.replace(/\.{2,}/g, '.');
        value = value.replace(/^0+(?=\d)/, '');
        var parts = value.split('.');
        if (parts.length > 1) {
            parts[1] = parts[1].slice(0, 2);
            value = parts.join('.');
        }
        $('#purchaserequisition_unitrate').val(value);
    });
    $(document).on('input', '#purchaserequisition_quntity', function () {
        var value = $('#purchaserequisition_quntity').val();
        value = value.replace(/[^\d.]/g, '');
        value = value.replace(/\.{2,}/g, '.');
        value = value.replace(/^0+(?=\d)/, '');
        var parts = value.split('.');
        if (parts.length > 1) {
            parts[1] = parts[1].slice(0, 2);
            value = parts.join('.');
        }
        $('#purchaserequisition_quntity').val(value);
    });
    //end of triggers
    formctrl();
    refreshtable();
 
});
