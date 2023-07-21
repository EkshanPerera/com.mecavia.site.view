$(function () {
    //variables
    var customerorderClassesInstence = customerorderClasses.customerorderClassesInstence();
    var finishedGoodsOutNoteClassesInstence = finishedGoodsOutNoteClasses.FinishedGoodsOutNoteClassesInstence();
    var finishedGoodsOutNoteObject = finishedGoodsOutNoteClassesInstence.FinishedGoodsOutNoteDto;
    var finishedGoodsOutNote_col = finishedGoodsOutNoteClassesInstence.finishedGoodsOutNote_service;
    let customerorder_col = customerorderClassesInstence.customerorder_service;
    let customerorderobj = customerorderClassesInstence.customerorder;
    var GeneralStoreDtosInstence = genaralStoreClasses.genaralStoreClassesInstence();
    let GeneralStoreDtos_col = GeneralStoreDtosInstence.GeneralStoreDto_service;
    let GeneralStoreDtosarr = [];
    var addmoddel = undefined;
    var selectedcode = undefined;
    var jwtPayload = undefined;
    var lablgenareted = false;

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
            finishedgoodsoutnoteremark: {
                required: true
            }
        },
        messages: {
            finishedgoodsoutnoteremark: {
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
                    text: "You won't be able to revert this!",
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
                        var date = year + "-" + (parseInt(month) + 1) + "-" + day ;
                        let index = finishedGoodsOutNote_col.allFGON().length;
                        let customerordercode = finishedGoodsOutNoteClassesInstence.FGONSerial.genarateFGONCode(index);
                        var code = customerordercode;
                        var enterddate = date;
                        var status = "CLOSED";
                        var finishedGoodsOutNoteProducts = finishedGoodsOutNote_col.allFGONP();
                        var remark = $("#finishedgoodsoutnote_remark").val();
                        var customerOrder = customerorderobj;
                        setNewValues(code, enterddate, customerOrder, finishedGoodsOutNoteProducts, undefined, remark, status);
                        submit();
                        
                    }
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please enter the valid Customer Order ID!',
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
            customerorder_col.clear();
            finishedGoodsOutNote_col.clear();
            addmoddel = undefined;
            materialavild = undefined;
            selectedcode = undefined;
            t22.clear().draw(false);
            t23.clear().draw(false);
            $.ajax({
                url: "http://localhost:8080/api/customerorderctrl/getcustomerorders",
                dataType: "JSON",
                headers: {
                    "Authorization": jwt
                },
                success: function (data) {
                    $.each(data.content, function (i, item) {
                        $.each(item.customerOrderProducts, function (i, item) {
                            customerorder_col.addcustomerOrderProductstoArray(item.id, item.code, item.ordercode, item.customerOrder, item.bommaterial, item.requestedCount);
                        });
                        customerorder_col.addCustomerOrdertoArray(item.id, item.code, item.jobID, item.jobNumber, item.customerid, item.totalAmount, item.grossAmount, item.remark, item.customerOrderProducts, item.printeddate, item.status, item.enteredUser, item.enteredDate, item.acceptedUser, item.acceptedDate, item.invoices,item.inventoryItems);
                        if (item.status == "INVOICED")
                            t22.row.add([item.code, item.jobID, item.jobNumber, item.invoices[0].enteredDate]).draw(false);
                    });
                    setValues();
                    refreshfinishedgoodsoutnotes();
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
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI00202)',
            });
        }
    }
    function refreshfinishedgoodsoutnotes() {
        $.ajax({
            url: "http://localhost:8080/api/finishedgoodsoutnotectrl/getfinishedgoodsoutnotes",
            dataType: "JSON",
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                $.each(data.content, function (i, item) {
                    finishedGoodsOutNote_col.addFGONtoArray(item.id, item.code, item.enterddate, item.customerOrder, item.finishedGoodsOutNoteProducts, item.printeddate, item.remark, item.status)
                });
            }
        })
    }
    //definded functions
    function submit() {
        showpageloder();
        var url;
        var method;
        url = "http://localhost:8080/api/finishedgoodsoutnotectrl/savefinishedgoodsoutnote";
        method = "POST";
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(finishedGoodsOutNoteObject),
            contentType: 'application/json',
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                Swal.fire(
                    'Saved!',
                    'The record has been saved.',
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
    function resetform(element) {
        $(element).find(".invalid-feedback").remove();
        $(element).find(".is-invalid").removeClass("is-invalid");
        $(element).find(".is-valid").removeClass("is-valid");
    }
    function setValues(ordercode) {
        resetform("#quickForm10");
        formctrl();
        addmoddel = undefined;
        t23.clear().draw(false);
        if (ordercode) {
            customerorderobj = customerorder_col.getCustomerOrder(ordercode);
            customerOrderProductsobjarr = customerorderobj.customerOrderProducts;
            $.each(customerorderobj.customerOrderProducts, function (i, item) {
                t23.row.add([item.code, item.product.code, item.product.name, item.product.desc, item.quantity]).draw(false);
            });
            $("#finishedgoodsoutnote_id").val(undefined);
            $("#finishedgoodsoutnote_remark").val(undefined);
            $("#finishedgoodsoutnote_customerid").val(customerorderobj.customerid.code + " - " + customerorderobj.customerid.firstname + " " + customerorderobj.customerid.lastname);
        } else {
            customerorderobj = null;
            customerOrderProductsobjarr = [];
            addmoddel = undefined;
            materialavild = undefined;
            bomMaterialsobjarr = [];
            $("#finishedgoodsoutnote_customerid").val(undefined);
            $("#finishedgoodsoutnote_id").val(undefined);
            $("#finishedgoodsoutnote_remark").val(undefined);

        }
    }
    function setNewValues(code, enterddate, customerOrder, finishedGoodsOutNoteProducts, printeddate, remark, status) {
        finishedGoodsOutNoteObject = finishedGoodsOutNoteClassesInstence.FinishedGoodsOutNoteDto;
        if (code) finishedGoodsOutNoteObject.code = code;
        if (enterddate) finishedGoodsOutNoteObject.enterddate = enterddate;
        if (customerOrder) finishedGoodsOutNoteObject.customerOrder = customerOrder;
        if (finishedGoodsOutNoteProducts) finishedGoodsOutNoteObject.finishedGoodsOutNoteProducts = finishedGoodsOutNoteProducts;
        if (printeddate) finishedGoodsOutNoteObject.printeddate = printeddate;
        if (remark) finishedGoodsOutNoteObject.remark = remark;
        if (status) finishedGoodsOutNoteObject.status = status;
        if (!finishedGoodsOutNoteObject.enteredUser) finishedGoodsOutNoteObject.enteredUser = jwtPayload;
    }
    function checkavilability() {
        var response = [];
        var trueproducts = [];
        var falseproducts = [];
        $.each(customerOrderProductsobjarr, function (i, item) {
            if ((item.quantity - item.totFinishedCount) <= 0) {
                var trueproduct = trueproducts.find(product => product.code === item.code);
                if (!trueproduct) {
                    trueproducts.push(item);
                } else {
                    trueproduct.totFinishedCount += item.totFinishedCount;
                }
            } else {
                if (!falseproducts.find(product => product.code === item.code)) {
                    falseproducts.push(item);
                }
            }
        });
        response["trueproducts"] = trueproducts;
        response["falseproducts"] = falseproducts;
        return response;
    }
    //end of functions
    //triggers
    $('#table22 tbody').on('click', 'tr', function () {
        if (customerorder_col.allInvoicedCustomerOrders().length != 0) {
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
    $(document).off("click", "#addFGON");
    $(document).off("click", "#addPOM");
    $(document).off("click", "#genLable");
    $(document).off("click", "#cancelFGON");

    $(document).on("click", "#btnprmpo", function () {
        selectedcode = $("#customerorder_code").val();
        refreshtable();
    })
    
    $(document).on("click", "#genLable", function () {
        if(customerorderobj){
        var codestr = "";
        // if(lablgenareted == false){
        //     lablgenareted = true;
            $.each(customerorderobj.inventoryItems, function (i, item) {
                codestr += "<svg class=\"barcode\" jsbarcode-format=\"CODE128\" jsbarcode-value=\""+ item.fgiBulck.coproduct.product.code+"|"+item.code+"\" jsbarcode-textmargin=\"0\" jsbarcode-fontoptions=\"bold\"></svg>";
            })
            $("#podiv").html(codestr);
            JsBarcode(".barcode").init();
            $("#podiv").show();
            $("#podiv").print();
            $("#podiv").hide();
        // }else{
        //     Swal.fire({
        //         icon: 'warning',
        //         title: 'Warning!',
        //         text: 'You have already genarated the barcodes',
        //     });
        // }
        }
    })
    $(document).on("click", "#addFGON", function () {
        if (customerorderobj) {
            var res = checkavilability();
            if (res.falseproducts.length == 0 && res.trueproducts.length != 0) {
                addmoddel = "add";
                finishedGoodsOutNote_col.clearfgonp();
                let index = finishedGoodsOutNote_col.allFGON().length;
                let customerordercode = finishedGoodsOutNoteClassesInstence.FGONSerial.genarateFGONCode(index);
                $("#finishedgoodsoutnote_id").val(customerordercode);
                enablefillin("#finishedgoodsoutnote_remark");
                $.each(res.trueproducts, function (i, item) {
                    finishedGoodsOutNote_col.addFGONPtoArray(undefined, undefined, undefined, item, item.totFinishedCount)
                })
            } else {
                addmoddel = undefined;
                var fmtstr = "";
                $.each(res.falseproducts, function (i, item) {
                    fmtstr += item.code + ", ";
                })
                fmtstr = fmtstr.replace(/,\s*$/, "")
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'Order number ' + fmtstr + ' has not fully compleated yet. Therefor, Finished Goods Out note can not process at the moment.',
                });
                refreshtable();
            }
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select the valid Customer Order ID!',
            });
        }
    })
    $(document).on("click", "#addPOM", function () {
        setMRMValues()
    })
    $(document).on("click", "#cancelFGON", function () {
        selectedcode = "";
        setValues();
    });
    $("#podiv").hide();
    jwtPayload = getJwtPayload();
    formctrl();
    refreshtable();

});

