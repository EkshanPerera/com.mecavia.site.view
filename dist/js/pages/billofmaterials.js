$(function () {
    //variables
    var customerorderClassesInstence = customerorderClasses.customerorderClassesInstence()
    let customerorder_col = customerorderClassesInstence.customerorder_service;
    let customerorderobj = customerorderClassesInstence.customerorder;
    var billofmaterialClassesInstence = billofmaterialClasses.billofmaterialClassesInstence();
    let billofmaterial_col = billofmaterialClassesInstence.billofmaterial_service;
    let billofmaterialobj = billofmaterialClassesInstence.billofmaterial;
    let bomMaterialobjArry = [];
    var productClassesInstence = productClasses.productClassesInstence();
    let product_col = productClassesInstence.product_service;
    let product_obj = productClassesInstence.product;
    var materialClassesInstence = materialClasses.materialClassesInstence();
    let material_obj = materialClassesInstence.material;
    let material_col = materialClassesInstence.material_service;
    var clientClassesInstence = clientClasses.clientClassesInstence();
    let cli_col = clientClassesInstence.cli_service;
    let cli_obj = clientClassesInstence.client;

    var addmoddel = undefined;
    var selectedcode = undefined;
    var jwtPayload = undefined;

    var t36 = $("#table36").DataTable({
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t37 = $("#table37").DataTable({
        "order": [[0, "desc"]],
        pageLength: 7,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body met"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
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
    var t38 = $("#table38").DataTable({
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
    var t13 = $("#table13").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body popup"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        "autoWidth": false,
    })
    //end of variables
    //functions
    //defalt functions

    // $.validator.setDefaults({ 
    // });
    // Get the input element

    function getJwtPayload() {
        var parts = jwt.split('.');
        var encodedPayload = parts[1];
        var decodedPayload = atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'));
        var payload = JSON.parse(decodedPayload);
        return payload;
    }
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
            if (cli_obj.id && bomMaterialobjArry.length != 0) {
                if (customerorderobj.status == "PENDING") {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, add it!!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            var totalcost = 0;
                            $.each(bomMaterialobjArry, function (i, item) {
                                totalcost += parseFloat(item.materialCost) * parseFloat(item.quantity);
                            })
                            var status = "ACTIVE";
                            var code = genaratecode();
                            var year = new Date().getFullYear();
                            var month = new Date().getMonth();
                            var day = new Date().getDate();
                            var date = year + "-" + (parseInt(month) + 1) + "-" + day ;
                            var enteredDate = date;
                            setNewValues(code, customerorderobj, bomMaterialobjArry, totalcost, enteredDate, status);
                            submit();
                        }
                    })
                } else if (customerorderobj.status == "ACCEPTED" || customerorderobj.status == "INITIATED" || customerorderobj.status == "SUBMIT") {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Warning!',
                        text: 'BOM is already genarated',
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please enter the valid CO number!',
                });
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
                    if (material_obj.price != 0) {
                        var unitrate = material_obj.price;
                        var quantity = $("#purchaserequisition_quntity").val();
                        billofmaterial_col.addbommaterialtoArray(undefined, undefined, material_obj, unitrate, quantity);
                        refreshprmatarialtable();
                        $("#modal-purchaseRequisitionMaterials").modal("hide")
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Please add a velue to the selected material. ',
                        });
                    }
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
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI00302") != undefined || jwtPayload.businessRole == "ADMIN") {
            customerorder_col.clear();
            product_col.clear();
            cli_col.clear();
            billofmaterial_col.clear();
            material_col.clear();
            addmoddel = undefined;
            bomMaterialobjArry = [];
            total = undefined;
            material_obj = undefined;
            t36.clear().draw(false);
            t37.clear().draw(false);
            t13.clear().draw(false);
            $.ajax({
                url: "http://localhost:8080/api/customerorderctrl/getcustomerorders",
                dataType: "JSON",
                headers: {
                    "Authorization": jwt
                },
                success: function (data) {
                    $.each(data.content, function (i, item) {
                        if (item.status == "SUBMIT" || item.status == "ACCEPTED" || item.status == "PRINTED" || item.status == "INITIATED" || item.status == "PENDING") {
                            customerorder_col.addCustomerOrdertoArray(item.id, item.code, item.jobID, item.jobNumber, item.customerid, item.totalAmount, item.grossAmount, item.remark, item.customerOrderProducts, item.printeddate, item.status, item.enteredUser, item.enteredDate, item.acceptedUser, item.acceptedDate);
                            if (item.billOfMaterial) {
                                billofmaterial_col.addBillOfMaterialtoArray(item.billOfMaterial.id, item.billOfMaterial.code, item.billOfMaterial.customerOrder, item.billOfMaterial.bomMaterials, item.billOfMaterial.totalcost, item.billOfMaterial.status, item.enteredDate, item.enteredUser);
                            }
                            if (item.status == "PENDING") t13.row.add([item.code, item.jobNumber]).draw(false);
                            var $tableRow = $("#table13 tr td:contains('" + selectedcode + "')").closest("tr");
                            $tableRow.addClass("selected");
                        }
                    });
                    setValues(selectedcode);
                    refreshmatarialtable();
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
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI00302)',
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
    function refreshmatarialtable() {
        material_col.clear()
        t38.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/materialctrl/getmaterials",
            dataType: "JSON",
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                $.each(data.content, function (i, item) {
                    if (item.materialType == "ROW" && item.status == "ACTIVE") {
                        material_col.addMaterialtoArray(item.id, item.code, item.description, item.materialType, item.uomid, item.status, item.price);
                        t38.row.add([item.code, item.description]).draw(false);
                    }
                })
                var $tableRow = $("#table38 tr td:contains('" + selectedcode + "')").closest("tr");
                $tableRow.trigger("click");
            }
        })
    }
    function refreshprmatarialtable() {
        bomMaterialobjArry = billofmaterial_col.allBillOfMaterialMaterials();
        t37.clear().draw(false);
        var total = 0;
        $.each(bomMaterialobjArry, function (i, item) {
            t37.row.add([item.hash, item.material.description, item.materialCost, item.quantity, item.material.uomid.scode]).draw(false);
            total += parseFloat(item.materialCost) * parseFloat(item.quantity);
        })
        $('#purchaserequisition_totalamount').val(commaSeparateNumber(String(total)));
    }
    //definded functions
    function submit() {
        showpageloder();
        var url;
        var method;
        url = "http://localhost:8080/api/billofmaterialctrl/savebillofmaterial";
        method = "POST";
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(billofmaterialobj),
            contentType: 'application/json',
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                Swal.fire(
                    'Added!',
                    'The BOM details has been added.',
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
    function setValues(code) {
        formctrl();
        addmoddel = undefined;
        if (code) {
            customerorderobj = customerorder_col.getCustomerOrder(code);
            $("#customerorder_code").val(customerorderobj.code);
            $("#customerorder_jobcode").val(customerorderobj.jobID);
            $("#customerorder_unitrate").val(customerorderobj.unitrate)
            $("#customerorder_quntity").val(customerorderobj.quntity)
            $("#customerorder_remark").val(customerorderobj.remark);
            $("#customerorder_jobno").val(customerorderobj.jobNumber);
            $("#customerorder_status").val(customerorderobj.status);
            customerorder_col.clearcop();
            enablefillin("#addMaterialbtn");
            enablefillin("#removeMaterialbtn");
            if (customerorderobj.customerid) {
                enablefillin("#purchaserequisition_quntity");
                cli_obj = customerorderobj.customerid;
                $("#customerorder_customerid").val(customerorderobj.customerid.code + " - " + customerorderobj.customerid.firstname + " " + customerorderobj.customerid.lastname);
            }
            if (customerorderobj.product) {
                product_obj = customerorderobj.product;
                $("#customerorder_productid").val(customerorderobj.product.code + " - " + customerorderobj.product.name);
            }
            if (customerorderobj.customerOrderProducts) {
                t36.clear().draw(false);
                $.each(customerorderobj.customerOrderProducts, function (i, item) {
                    t36.row.add([i + 1, item.product.name, item.quantity]).draw(false);
                })
            }

        } else {
            customerorderobj = undefined;
            t37.clear().draw(false);
            t36.clear().draw(false);
            customerorder_col.clearcop();
            customerorder_col.clear();
            bomMaterialobjArry = [];
            total = undefined;
            material_obj = undefined;
            $("#table13 tr").removeClass("selected")
            $("#customerorder_code").val(undefined);
            $("#customerorder_jobcode").val(undefined);
            $("#customerorder_unitrate").val(undefined);
            $("#customerorder_quntity").val(undefined);
            $("#customerorder_remark").val(undefined);
            $("#customerorder_jobno").val(undefined);
            $("#customerorder_totalamount").val(undefined);
            $("#customerorder_status").val(undefined);
            $("#customerorder_customerid").val(undefined);
            $("#customerorder_productid").val(undefined);

        }
    }
    function setNewValues(code, customerOrder, bomMaterials, totalcost, enteredDate, status) {
        billofmaterialobj = billofmaterialClassesInstence.billofmaterial;
        if (code) billofmaterialobj.code = code;
        if (customerOrder) billofmaterialobj.customerOrder = customerOrder;
        if (bomMaterials) billofmaterialobj.bomMaterials = bomMaterials;
        if (totalcost) billofmaterialobj.totalcost = totalcost;
        if (status) billofmaterialobj.status = status;
        if (enteredDate) billofmaterialobj.enteredDate = enteredDate;
        if (!billofmaterialobj.enteredUser) billofmaterialobj.enteredUser = jwtPayload;
    }
    function setMatarialalues(code) {
        $("#modal-matariallist").modal("hide");
        if (code) {
            material_obj = material_col.getMaterial(code);
            $("#purchaserequisition_unitrate").val(commaSeparateNumber(String(material_obj.price)));
            $("#pr_material_code").text(material_obj.uomid.scode);
        } else {
            material_obj = undefined;
            $("#purchaserequisition_unitrate").val(undefined);
            $("#pr_material_code").text(" ");

        }
    }
    function genaratecode() {
        let code = billofmaterialClassesInstence.BillOfMaterialSerial.genarateBillOfMaterialCode(0, selectedcode);
        return code;
    }
    function enablefillin(fillinid) {
        $(fillinid).prop("disabled", false)
    }
    //end of functions
    //triggers
    $('#table38 tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            setMatarialalues();
        } else {
            t38.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            setMatarialalues($(this).children("td:nth-child(1)").text());
        }
    });
    $('#table37 tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            materialhash = "";
        } else {
            t37.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            materialhash = $(this).children("td:nth-child(1)").text();
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
    $(document).off("click", "#addMaterialbtn");
    $(document).off("click", "#removeMaterialbtn");
    $(document).off("click", "#btnprm");
    $(document).off("click", "#purchaserequisition_unitrate");
    $(document).off("click", "#purchaserequisition_quntity");
    $(document).off("click", "#cancelBOM");
    $(document).on("click", "#addMaterialbtn", function () {
        if ($("#table38 tbody tr").hasClass('selected')) {
            material_obj = undefined;
            $("#table38 tbody tr").removeClass('selected');
        }
        $("#purchaserequisition_unitrate").val(undefined);
        $("#purchaserequisition_quntity").val(undefined);
    });
    $(document).on("click", "#removeMaterialbtn", function () {
        billofmaterial_col.removebommaterialfromArray(materialhash);
        refreshprmatarialtable();
    })
    $(document).on("click", "#btnprm", function () {
        $("#modal-colist").modal("show");
        // selectedcode = $("#customerorder_code").val();
        // refreshtable();
    })
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
    $(document).on("click", "#cancelBOM", function () {
        selectedcode = "";
        setValues();
    });
    //end of triggers
    jwtPayload = getJwtPayload();
    formctrl();
    refreshtable();

});

