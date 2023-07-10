$(function () {
    //variables
    var purchaserequisitionClassesInstence = purchaserequisitionClasses.purchaserequisitionClassesInstence();
    let purchaserequisition_col = purchaserequisitionClassesInstence.purchaserequisition_service;
    let purchaserequisitionobj = purchaserequisitionClassesInstence.purchaserequisition;
    let purchaseRequisitionMaterialsobjarr = [];
    var materialClassesInstence = materialClasses.materialClassesInstence();
    let material_obj = materialClassesInstence.material;
    let material_col = materialClassesInstence.material_service;
    var clientClassesInstence = clientClasses.clientClassesInstence();
    let cli_col = clientClassesInstence.cli_service;
    let cli_obj = clientClassesInstence.client;
    var materialhash;
    var addmoddel = undefined;
    var selectedcode = undefined;
    var jwtPayload = undefined;
    var t17 = $("#table17").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t21 = $("#table21").DataTable({
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
    var t20 = $("#table20").DataTable({
        "autoWidth": false,
        "columns": [
            { "width": "30%" },
            null,
        ],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body popup"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
    });
    var t19 = $("#table19").DataTable({
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
            purchaserequisitionremark: {
                required: true
            },
            purchaserequisitionquotationno: {
                required: true
            }
        },
        messages: {
            purchaserequisitionremark: {
                required: "Please fillout the remark!"
            },
            purchaserequisitionquotationno: {
                required: "Please fillout the quatation number!"
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
                                    selectedcode = code;
                                    var remark = $("#purchaserequisition_remark").val()
                                    var quotationno = $("#purchaserequisition_quotationno").val()
                                    var totalamount = 0;
                                    $.each(purchaseRequisitionMaterialsobjarr, function (i, item) {
                                        totalamount += parseFloat(item.unitrate) * parseFloat(item.quantity);
                                    })
                                    var purchaseRequisitionMaterials = purchaseRequisitionMaterialsobjarr;
                                    var status = "PENDING";
                                    var supplierid;
                                    if (cli_obj) supplierid = cli_obj;
                                    else supplierid = undefined;
                                    setNewValues(code, remark, totalamount, status, supplierid, purchaseRequisitionMaterials, quotationno);
                                    submit();
                                    break;
                                case "mod":
                                    var code = undefined;
                                    var remark = undefined;
                                    var quotationno = undefined;
                                    var totalamount = undefined;
                                    var status = "SUBMIT";
                                    var supplierid = undefined;
                                    var purchaseRequisitionMaterials = undefined;
                                    setNewValues(code, remark, totalamount, status, supplierid, purchaseRequisitionMaterials, quotationno);
                                    submit();
                                    break;
                                case "del":
                                    var code = undefined;
                                    var remark = undefined;
                                    var quotationno = undefined;
                                    var totalamount = undefined;
                                    var status = "EXPIRE";
                                    var supplierid = undefined;
                                    var purchaseRequisitionMaterials = undefined;
                                    setNewValues(code, remark, totalamount, status, supplierid, purchaseRequisitionMaterials, quotationno);
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
    function getJwtPayload() {
        var parts = jwt.split('.');
        var encodedPayload = parts[1];
        var decodedPayload = atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'));
        var payload = JSON.parse(decodedPayload);
        return payload;
    }
    function refreshtable() {
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI00103") != undefined || jwtPayload.businessRole == "ADMIN") {
            purchaserequisition_col.clear();
            material_col.clear();
            cli_col.clear();
            addmoddel = undefined;
            selectedcode = undefined;
            t17.clear().draw(false);
            t21.clear().draw(false);
            $.ajax({
                url: "http://localhost:8080/api/purchaserequisitionctrl/getpurchaserequisitions",
                dataType: "JSON",
                headers: {
                    "Authorization": jwt
                },
                success: function (data) {
                    $.each(data.content, function (i, item) {
                        purchaserequisition_col.addPurchaseRequisitiontoArray(item.id, item.prcode, item.pocode, item.supplierid, item.status, item.remark, item.totalAmount, item.purchaseRequisitionMaterials, item.quotationno);
                        t17.row.add([item.prcode, item.pocode, item.quotationno, item.supplierid.code, item.supplierid.firstname + " " + item.supplierid.lastname, item.status]).draw(false);
                    });
                    setValues();
                    var $tableRow = $("#table17 tr td:contains('" + selectedcode + "')").closest("tr");
                    $tableRow.trigger("click");
                    refreshmatarialtable();
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
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI00103)',
            });
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
    function refreshprmatarialtable() {
        purchaseRequisitionMaterialsobjarr = purchaserequisition_col.allPurchaseRequisitionMaterials();
        t21.clear().draw(false);
        var total = 0;
        $.each(purchaseRequisitionMaterialsobjarr, function (i, item) {
            var hashval;
            if (item.hash == undefined) {
                hashval += i
            } else {
                hashval = item.hash
            }
            t21.row.add([hashval, item.material.description, item.unitrate, item.quantity, item.material.uomid.scode]).draw(false);
            total += parseFloat(item.unitrate) * parseFloat(item.quantity);
        })
        $('#purchaserequisition_totalamount').val(commaSeparateNumber(String(total)));
    }
    function refreshmatarialtable() {
        material_col.clear()
        t20.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/materialctrl/getmaterials",
            dataType: "JSON",
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                $.each(data.content, function (i, item) {
                    material_col.addMaterialtoArray(item.id, item.code, item.description, item.materialType, item.uomid, item.status, item.price);
                    if (item.status == "ACTIVE") {
                        t20.row.add([item.code, item.description]).draw(false);
                    }
                })
                refreshsuppliertable();
                var $tableRow = $("#table20 tr td:contains('" + selectedcode + "')").closest("tr");
                $tableRow.trigger("click");
            }
        })
    }
    function refreshsuppliertable() {
        cli_col.clear();
        t19.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/clientctrl/getclients",
            dataType: "JSON",
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                $.each(data.content, function (i, item) {
                    if (item.businessRole == "SUPPLIER" && item.status == "ACTIVE") {
                        cli_col.addClitoArray(item.id, item.code, item.firstname, item.middlename, item.lastname, item.email, item.businessRole, item.status, item.clientGroupid, item.roleid);
                        t19.row.add([item.code, item.firstname + " " + item.lastname]).draw(false);
                    }
                });
                var $tableRow = $("#table19 tr td:contains('" + selectedcode + "')").closest("tr");
                $tableRow.trigger("click");
            }
        });

    }
    //definded functions
    function submit() {
        showpageloder();
        var url;
        var method;

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
        }
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(purchaserequisitionobj),
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
                            'The PR has been submitted for approval.',
                            'success'
                        )
                        break;
                    case "del":
                        Swal.fire(
                            'Expired!',
                            'The PR has been expired.',
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
            purchaserequisitionobj = purchaserequisition_col.getPurchaseRequisition(code);
            purchaseRequisitionMaterialsobjarr = purchaserequisitionobj.purchaseRequisitionMaterials;
            $("#purchaserequisition_code").val(purchaserequisitionobj.prcode);
            $("#purchaseorder_code").val(purchaserequisitionobj.pocode);
            $("#purchaserequisition_unitrate").val(purchaserequisitionobj.unitrate)
            $("#purchaserequisition_quntity").val(purchaserequisitionobj.quntity)
            $("#purchaserequisition_remark").val(purchaserequisitionobj.remark)
            $("#purchaserequisition_quotationno").val(purchaserequisitionobj.quotationno)
            $("#purchaserequisition_totalamount").val(commaSeparateNumber(String(purchaserequisitionobj.totalAmount)));
            $("#purchaserequisition_status").val(purchaserequisitionobj.status);
            if (purchaserequisitionobj.supplierid) {
                cli_obj = purchaserequisitionobj.supplierid;
                $("#purchaserequisition_supplierid").val(purchaserequisitionobj.supplierid.code + " - " + purchaserequisitionobj.supplierid.firstname + " " + purchaserequisitionobj.supplierid.lastname);
            }
            if (purchaserequisitionobj.purchaseRequisitionMaterials) {
                t21.clear().draw(false);
                $.each(purchaserequisitionobj.purchaseRequisitionMaterials, function (i, item) {
                    t21.row.add([i + 1, item.material.description, item.unitrate, item.quantity, item.material.uomid.scode]).draw(false);
                })
            }

        } else {
            purchaserequisitionobj = undefined;
            t21.clear().draw(false);
            purchaserequisition_col.clearprm();
            purchaseRequisitionMaterialsobjarr = [];
            total = undefined;
            materialhash = undefined;
            cli_obj = undefined;
            $("#purchaserequisition_code").val(undefined);
            $("#purchaseorder_code").val(undefined);
            $("#purchaserequisition_unitrate").val(undefined)
            $("#purchaserequisition_quntity").val(undefined)
            $("#purchaserequisition_remark").val(undefined)
            $("#purchaserequisition_quotationno").val(undefined)
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
            $("#pr_material_code").text(material_obj.uomid.scode);

        } else {
            material_obj = undefined;
            $("#pr_material_code").text(" ");

        }
    }
    function setNewValues(code, remark, totalamount, status, supplierid, purchaseRequisitionMaterials, quotationno) {
        if (purchaserequisitionobj) {
            if (code) purchaserequisitionobj.prcode = code;
            if (remark) purchaserequisitionobj.remark = remark;
            if (totalamount) purchaserequisitionobj.totalAmount = totalamount;
            if (status) purchaserequisitionobj.status = status;
            if (supplierid) purchaserequisitionobj.supplierid = supplierid;
            if (purchaseRequisitionMaterials) purchaserequisitionobj.purchaseRequisitionMaterials = purchaseRequisitionMaterials;
            if (quotationno) purchaserequisitionobj.quotationno = quotationno;

        } else {
            purchaserequisitionobj = purchaserequisitionClassesInstence.purchaserequisition;
            setNewValues(code, remark, totalamount, status, supplierid, purchaseRequisitionMaterials, quotationno);
        }
    }
    function resetform(element) {
        $(element).find(".invalid-feedback").remove();
        $(element).find(".is-invalid").removeClass("is-invalid");
        $(element).find(".is-valid").removeClass("is-valid");
    }
    function genaratecode() {
        let purchaserequisitionlist = purchaserequisition_col.allPurchaseRequisition()
        let purchaserequisitioncode = purchaserequisitionClassesInstence.PurchaseRequisitionSerial.genaratePurchaseRequisitionCode(purchaserequisitionlist.length);
        return purchaserequisitioncode;
    }
    function fillter(type) {
        if (type != "") {
            t20.clear().draw(false);
            var fillteredarry = material_col.allMaterial().filter(material => (material.materialType == type));
            $.each(fillteredarry, function (i, item) {
                if (item.status == "ACTIVE") {
                    t20.row.add([item.code, item.description]).draw(false);
                }
            })
        } else {
            t20.clear().draw(false);
            var fillteredarry = material_col.allMaterial()
            $.each(fillteredarry, function (i, item) {
                if (item.status == "ACTIVE") {
                    t20.row.add([item.code, item.description]).draw(false);
                }
            })
        }
    }
    //end of functions
    //triggers
    $('#table17 tbody').on('click', 'tr', function () {
        resetform("#quickForm8");
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            setValues();
            selectedcode = "";
        } else {
            t17.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            selectedcode = $(this).children("td:nth-child(1)").text();
            setValues($(this).children("td:nth-child(1)").text());
        }
    });
    $('#table19 tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            setClientValues();
        } else {
            t19.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            setClientValues($(this).children("td:nth-child(1)").text());
        }
    });
    $('#table20 tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            setMatarialalues();
        } else {
            t20.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            setMatarialalues($(this).children("td:nth-child(1)").text());
        }
    });
    $('#table21 tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            materialhash = "";
        } else {
            t21.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            materialhash = $(this).children("td:nth-child(1)").text();
        }
    });

    $(document).off("click", "#addMaterialbtn");
    $(document).off("click", "#removeMaterialbtn");
    $(document).off("click", "#addPurchaseRequisitions");
    $(document).off("click", "#setPurchaseRequisitions");
    $(document).off("click", "#removaPurchaseRequisitions");
    $(document).off("input", "#purchaserequisition_unitrate");
    $(document).off("focusout", "#purchaserequisition_unitrate");
    $(document).off("focusout", "#purchaserequisition_quntity");
    $(document).off("input", "#purchaserequisition_quntity");
    $(document).off("click", "#filter_material_type");
    $(document).off("click", "#cancelPR");


    $(document).on("click", "#addMaterialbtn", function () {
        if ($("#table20 tbody tr").hasClass('selected')) {
            material_obj = undefined;
            $("#table20 tbody tr").removeClass('selected');
        }
        $("#purchaserequisition_unitrate").val(undefined);
        $("#purchaserequisition_quntity").val(undefined);
    })
    $(document).on("click", "#removeMaterialbtn", function () {
        purchaserequisition_col.removepurchaseRequisitionMaterialsfromArray(materialhash);
        refreshprmatarialtable();
    })
    $(document).on("click", "#addPurchaseRequisitions", function () {
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI00101") != undefined || jwtPayload.businessRole == "ADMIN") {
            selectedcode = "";
            setValues(undefined);
            addmoddel = "add";
            $("#purchaserequisition_code").val(genaratecode());
            $("#table17 tbody tr").removeClass('selected');
            enablefillin("#purchaserequisition_unitrate");
            enablefillin("#purchaserequisition_quntity");
            enablefillin("#purchaserequisition_remark");
            enablefillin("#purchaserequisition_quotationno");
            enablefillin("#supplierbtn");
            enablefillin("#matarialbtn");
            enablefillin("#addMaterialbtn");
            enablefillin("#removeMaterialbtn");
            $("#purchaserequisition_status").val("PENDING");
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI00101)',
            });
        }
    });
    $(document).on("click", "#setPurchaseRequisitions", function () {
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI00109") != undefined || jwtPayload.businessRole == "ADMIN") {
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
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI00109)',
            });
        }
    });
    $(document).on("click", "#removaPurchaseRequisitions", function () {
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI01010") != undefined || jwtPayload.businessRole == "ADMIN") {
            if (selectedcode) {
                if (purchaserequisitionobj.status == "PENDING" || purchaserequisitionobj.status == "INITIATED") {
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
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI01010)',
            });
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
    $(document).on('focusout', '#purchaserequisition_unitrate', function () {
        var value = $('#purchaserequisition_unitrate').val();
        if (value != "") {
            if (value.indexOf('.') == -1) {
                value = value + ".00";
            } else {
                value = value;
            }
        } else {
            value = value;
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
    $(document).on('focusout', '#purchaserequisition_quntity', function () {
        var value = $('#purchaserequisition_quntity').val();
        if (value != "") {
            if (value.indexOf('.') == -1) {
                value = value + ".00";
            } else {
                value = value;
            }
        } else {
            value = value;
        }
        $('#purchaserequisition_quntity').val(value);
    });
    $(document).on("click", "#filter_material_type", function () {
        fillter($("#filter_material_type").val());
    });
    $(document).on("click", "#cancelPR", function () {
        selectedcode = "";
        setValues();
    });

    //end of triggers
    jwtPayload = getJwtPayload();
    formctrl();
    refreshtable();

});

