$(function () {
    //variables
    var purchaseorderClassesInstence = purchaseorderClasses.purchaseorderClassesInstence();
    let purchaserequisition_col = purchaseorderClassesInstence.purchaserequisition_service;
    let purchaserequisitionobj = purchaseorderClassesInstence.purchaserequisition;
    let purchaseRequisitionMaterialsobjarr = [];
    var materialClassesInstence = materialClasses.materialClassesInstence();
    let material_obj = materialClassesInstence.material;
    let material_col = materialClassesInstence.material_service;
    var clientClassesInstence = clientClasses.clientClassesInstence();
    let cli_col = clientClassesInstence.cli_service;
    let cli_obj = clientClassesInstence.client;

    var addmoddel = undefined;
    var selectedcode = undefined;
    var jwtPayload = undefined;

    var t18 = $("#table18").DataTable({
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
            if (cli_obj.id && purchaseRequisitionMaterialsobjarr.length != 0 && (purchaserequisitionobj.status == "APPROVED" || purchaserequisitionobj.status == "PRINTED")) {
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
                        var status = "PRINTED";
                        setNewValues(status, date);
                        submit();
                        $("#podiv").show();
                        $("#podiv").print();
                        $("#podiv").hide();

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
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI00106") != undefined || jwtPayload.businessRole == "ADMIN") {
            purchaserequisition_col.clear();
            material_col.clear();
            cli_col.clear();
            addmoddel = undefined;
            t13.clear().draw(false);
            t18.clear().draw(false);
            $.ajax({
                url: "http://localhost:8080/api/purchaserequisitionctrl/getpurchaserequisitions",
                dataType: "JSON",
                headers: {
                    "Authorization": jwt
                },
                success: function (data) {
                    $.each(data.content, function (i, item) {
                        if (item.status == "SUBMIT" || item.status == "APPROVED" || item.status == "PRINTED") {
                            purchaserequisition_col.addPurchaseRequisitiontoArray(item.id, item.prcode, item.pocode, item.supplierid, item.status, item.remark, item.totalAmount, item.purchaseRequisitionMaterials, item.printeddate, item.quotationno, item.enteredUser, item.printededUser, item.acceptedUser, item.poPrintededUser);
                            if (item.status == "APPROVED" || item.status == "PRINTED") t13.row.add([item.pocode,item.prcode,item.quotationno]).draw("false")
                        
                        }
                        var $tableRow = $("#table13 tr td:contains('" + selectedcode + "')").closest("tr");
                        $tableRow.addClass("selected");
                    });
                    setValues(selectedcode);
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
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI00106)',
            });
        }
    }
    //definded functions
    function submit() {
        showpageloder();
        var url;
        var method;

        url = "http://localhost:8080/api/purchaserequisitionctrl/updatepurchaserequisition";
        method = "PUT";
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(purchaserequisitionobj),
            contentType: 'application/json',
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                refreshtable();
            }
        })
    }
    function formctrl() {
        $(".formfillin").prop("disabled", true);
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
    function setValues(code) {
        formctrl();
        addmoddel = undefined;
        if (code) {
            purchaserequisitionobj = purchaserequisition_col.getPurchaseOrder(code);
            if (purchaserequisitionobj != undefined) {
                purchaseRequisitionMaterialsobjarr = purchaserequisitionobj.purchaseRequisitionMaterials;
                $("#purchaserequisition_code").val(purchaserequisitionobj.prcode);
                $("#purchaseorder_code").val(purchaserequisitionobj.pocode);
                $("#purchaserequisition_unitrate").val(purchaserequisitionobj.unitrate)
                $("#purchaserequisition_quntity").val(purchaserequisitionobj.quntity)
                $("#purchaserequisition_remark").val(purchaserequisitionobj.remark)
                $("#purchaserequisition_quotationno").val(purchaserequisitionobj.quotationno)
                $("#purchaserequisition_totalamount").val(commaSeparateNumber(String(purchaserequisitionobj.totalAmount)));
                $("#purchaserequisition_status").val(purchaserequisitionobj.status);
                var year = new Date().getFullYear();
                var month = new Date().getMonth();
                var day = new Date().getDate();
                var date = day + "/" + (parseInt(month) + 1) + "/" + year;

                if (purchaserequisitionobj.printeddate) {
                    $("#podate").text(purchaserequisitionobj.printeddate)
                } else {
                    $("#podate").text(date);
                }
                if (purchaserequisitionobj.supplierid) {
                    cli_obj = purchaserequisitionobj.supplierid;
                    $("#purchaserequisition_supplierid").val(purchaserequisitionobj.supplierid.code + " - " + purchaserequisitionobj.supplierid.firstname + " " + purchaserequisitionobj.supplierid.lastname);
                    $("#suppliername").text(purchaserequisitionobj.supplierid.firstname + " " + purchaserequisitionobj.supplierid.lastname);

                    $.each(purchaserequisitionobj.supplierid.addresses, function (i, item) {
                        if (item.isdef == true) {
                            $("#supplieraddline01").text(item.line01)
                            $("#supplieraddline02").text(item.line02)
                            if (item.line04)
                                $("#supplieraddline03").text(item.line03 + "," + item.line04 + ".");
                            else
                                $("#supplieraddline03").text(item.line03 + ".");
                        }
                    })
                    $.each(purchaserequisitionobj.supplierid.contactNumbers, function (i, item) {
                        if (item.isdef == true) {
                            $("#supplercontact").text(item.tpno);
                        }
                    })
                    if (purchaserequisitionobj.supplierid.email) {
                        $("#supplieremail").text(purchaserequisitionobj.supplierid.email);
                    }
                }
                if (purchaserequisitionobj.material) {
                    material_obj = purchaserequisitionobj.material;
                    $("#purchaserequisition_matarialid").val(purchaserequisitionobj.material.code + " - " + purchaserequisitionobj.material.description);
                }
                if (purchaserequisitionobj.purchaseRequisitionMaterials) {
                    t18.clear().draw(false);
                    var dataset = "";
                    var icont = 1;
                    $.each(purchaserequisitionobj.purchaseRequisitionMaterials, function (i, item) {
                        icont += 1;
                        t18.row.add([i + 1, item.material.description, item.unitrate, item.quantity, item.material.uomid.scode]).draw(false);
                        dataset += "<tr><td>" + (i + 1) + "</td><td>" + item.material.description + "</td><td> <div style=\"text-align: right;\"> Rs. " + commaSeparateNumber(String(item.unitrate)) + "</div></td><td><div style=\"text-align: right;\">" + commaSeparateNumber(String(item.quantity)) + item.material.uomid.scode + "</div></td><td><div style=\"text-align: right;\">Rs. " + commaSeparateNumber(String(item.unitrate * item.quantity)) + "</div></td></tr>";
                    })
                    do {
                        dataset += "<tr><td>" + icont + "</td><td> </td><td> </td><td> </td><td> </td></tr>"
                        icont++;
                    }
                    while (icont < 17);

                    $("#potablebody").html(dataset);
                }
                $("#printeddate").text(date);
                $("#pono").text(purchaserequisitionobj.pocode);
                $("#qoano").text(purchaserequisitionobj.quotationno);
                if (purchaserequisitionobj.status == "PRINTED") {
                    $("#coppyornot").text("TRUE COPY");
                    $("#printeddate").text(purchaserequisitionobj.printeddate);
                    $("#reprintdate").text(date);
                }
                $("#nettotal").text(purchaserequisitionobj.totalAmount);
                $(".tax").text("0.0%")
                $("#grosstotal").text((purchaserequisitionobj.totalAmount) * (100 + 0.0) / 100);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please enter the valid PR number!',
                });
                setValues();
            }

        } else {
            purchaserequisitionobj = undefined;
            t18.clear().draw(false);
            purchaserequisition_col.clearprm();
            purchaseRequisitionMaterialsobjarr = [];
            total = undefined;
            $("#purchaserequisition_code").val(undefined);
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
    function setNewValues(status, printeddate) {
        if (purchaserequisitionobj) {
            if (status) purchaserequisitionobj.status = status;
            if (!purchaserequisitionobj.printeddate) purchaserequisitionobj.printeddate = printeddate;
            if (!purchaserequisitionobj.poPrintededUser) purchaserequisitionobj.poPrintededUser = jwtPayload;
        } else {
            purchaserequisitionobj = purchaseorderClassesInstence.purchaserequisition;
            setNewValues(status);
        }
    }
    //end of functions
    //triggers
    $('#table13 tbody').on('click', 'tr', function () {
        $("#modal-polist").modal("hide");
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            selectedcode = undefined;
            $("#purchaserequisition_code").val(selectedcode)
            refreshtable();
        } else {
            t13.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            selectedcode = $(this).children("td:nth-child(1)").text();
            $("#purchaserequisition_code").val(selectedcode)
            refreshtable();
        }
    });
    $(document).off("click", "#btnprmpo");
    $(document).off("click", "#cancelPOPrint");
    $(document).on("click", "#btnprmpo", function () {
        $("#modal-polist").modal("show");
        // selectedcode = $("#purchaseorder_code").val();
        // refreshtable();
    })
    $(document).on("click", "#cancelPOPrint", function () {
        selectedcode = "";
        setValues();

    })

    //end of triggers
    $("#podiv").hide();
    jwtPayload = getJwtPayload();
    formctrl();
    refreshtable();

});

