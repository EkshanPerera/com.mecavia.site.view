$(function () {
    //variables
    let fginClassesInstence = fginClasses.fginClassesInstence();
    let customerorder_col = fginClassesInstence.customerorder_service;
    let customerorderobj = fginClassesInstence.customerorder;
    let finishedgoodsinnote_col = fginClassesInstence.finishedGoodsInNote_service;
    let copobj = fginClassesInstence.customerOrderProduct;
    let finishedgoodsinnoteobj = fginClassesInstence.finishedgoodsinnote;
    let customerOrderProductsobjarr = [];
    let finishedGoodsInNoteProductsobjarr = [];
    var outstangingcount = 0;
    var addmoddel = undefined;
    var selectedcode = undefined;
    var jwtPayload = undefined;
    var selectedcopcode = undefined;

    var t28 = $("#table28").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t29 = $("#table29").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t30 = $("#table30").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });

    var Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });
    $('#fgin_padate').datepicker({ dateFormat: 'dd/mm/yy' });
    //end of variables
    //functions
    //defalt functions

    // $.validator.setDefaults({ 
    // });
    // Get the input element

    $('#quickForm10').validate({
        rules: {
            fgin_pano: {
                required: true
            },
            fgin_padate: {
                required: true
            },
            fgin_remark: {
                required: true
            }
        },
        messages: {
            fgin_pano: {
                required: "Please fillout the pa number."
            },
            fgin_padate: {
                required: "Please fillout the pa date."
            },
            fgin_remark: {
                required: "Please fillout the pa remark."
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
                        let index = finishedgoodsinnote_col.getFGINsByJobId(selectedcode).length
                        let code = customerorderobj.code;
                        let fgincode = fginClassesInstence.FinishedGoodsInSerial.genarateFGINCode(index, code);
                        var panumber = $("#fgin_pano").val();
                        var padate = $("#fgin_padate").val();
                        var fgicode = fgincode;

                        var enterddate = date;
                        var remark = $("#fgin_remark").val();
                        var status = "SUBMIT";
                        var customerOrder = customerorderobj;
                        var finishedGoodsInNoteProducts = finishedgoodsinnote_col.allNewFGINNProducts();
                        setNewValues(panumber, padate, fgicode, enterddate, remark, status, customerOrder, finishedGoodsInNoteProducts,);
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
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI00403") != undefined || jwtPayload.businessRole == "ADMIN") {

            customerorder_col.clear();
            finishedgoodsinnote_col.clear();
            addmoddel = undefined;
            t28.clear().draw(false);
            t29.clear().draw(false);
            $.ajax({
                url: "http://localhost:8080/api/customerorderctrl/getcustomerorders",
                dataType: "JSON",
                headers: {
                    "Authorization": jwt
                },
                success: function (data) {
                    $.each(data.content, function (i, item) {
                        if (item.status == "ACCEPTED") {
                            $.each(item.customerOrderProducts, function (i, item) {
                                customerorder_col.addcustomerOrderProductstoArray(item.id, item.code, item.product, item.unitrate, item.quantity);
                            })
                            customerorder_col.addCustomerOrdertoArray(item.id, item.code, item.jobID, item.jobNumber, item.customerid, item.totalAmount, item.grossAmount, item.remark, item.customerOrderProducts, item.printeddate, item.status);
                        }
                    });
                    $.ajax({
                        url: "http://localhost:8080/api/finishedgoodsinnotectrl/getfinishedgoodsinnotes",
                        dataType: "JSON",
                        headers: {
                            "Authorization": jwt
                        },
                        success: function (data) {
                            $.each(data.content, function (i, item) {
                                $.each(item.finishedGoodsInNoteProducts, function (i, item) {
                                    finishedgoodsinnote_col.addFGINProductstoArray(item.id, item.code, item.cordercode, item.finishedGoodsInNoteDto, item.coproduct, item.finishedCount);
                                });
                                finishedgoodsinnote_col.addFGINtoArray(item.id, item.code, item.panumber, item.padate, item.enterddate, item.remark, item.status, item.customerOrder, item.finishedGoodsInNoteProducts, item.printeddate);
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
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI00403)',
            });
        }
    }
    function refreshfginmtable() {
        t30.clear().draw(false);
        let fginmlist = finishedgoodsinnote_col.allNewFGINNProducts();
        $.each(fginmlist, function (i, item) {
            t30.row.add([item.code, item.cordercode, item.finishedCount]).draw(false);
        })
    }
    //definded functions
    function submit() {
        showpageloder();
        var url;
        var method;

        url = "http://localhost:8080/api/finishedgoodsinnotectrl/savefinishedgoodsinnote";
        method = "POST";
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(finishedgoodsinnoteobj),
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
    function enablefillin(fillinid) {
        $(fillinid).prop("disabled", false)
    }
    function setCOPValues(cordercode) {
        if (cordercode) {
            t29.clear().draw(false);
            finishedGoodsInNoteProductsobjarr = [];
            finishedGoodsInNoteProductsobjarr = finishedgoodsinnote_col.allFGINsByOrderCode(cordercode).FGINMs;
            setOutstanding(cordercode);
            if (addmoddel == "add") {
                $("#fgin_orderno").val(selectedcopcode);
            }
            if (finishedGoodsInNoteProductsobjarr.length != 0) {
                $.each(finishedGoodsInNoteProductsobjarr, function (i, item) {
                    if (item.id != undefined)
                        t29.row.add([item.finishedGoodsInNote.code, item.code, item.finishedCount, item.prproduct.product.uomid.scode, item.finishedGoodsInNote.enterddate,
                        item.finishedGoodsInNote.panumber, item.finishedGoodsInNote.padate]).draw(false);
                })
            }
        } else {
            t29.clear().draw(false);
            finishedGoodsInNoteProductsobjarr = [];
            $("#fgin_outstanding").val(undefined);
            $("#fgin_orderno").val(undefined);
            $("#fgin_finishedcount").val(undefined)
        }
    }
    function setOutstanding(cordercode) {
        if (cordercode) {
            var totfinished = finishedgoodsinnote_col.allFGINsByOrderCode(cordercode).totfinished;
            copobj = customerorder_col.getFGINPsByOrderCode(cordercode);
            outstangingcount = copobj.quantity - totfinished;
            $("#fgin_outstanding").val(outstangingcount);
        } else {
            outstangingcount = 0;
            $("#fgin_outstanding").val(undefined);
        }
    }
    function setGRMValues() {
        setOutstanding(selectedcopcode);
        var index = finishedgoodsinnote_col.getFGINNProductsByOrderCode(selectedcopcode).length;
        var fginmcode = fginClassesInstence.FinishedGoodsInSerial.genarateFGINMCode(index, selectedcopcode);
        var finishedCount = $("#fgin_finishedcount").val();
        var res = finishedgoodsinnote_col.addNewFGINProductstoArray(undefined, fginmcode, selectedcopcode, finishedgoodsinnoteobj, copobj, finishedCount, outstangingcount);

        if (res) {
            Swal.fire(
                'Added!',
                'The new record has been added.',
                'success'
            )
            refreshfginmtable();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'FGIN product counts are not tallied with the outstanding amount',
            });
        }

    }
    function setValues(code) {
        formctrl();
        addmoddel = undefined;
        if (code) {
            customerorderobj = customerorder_col.getPurchaseOrder(code);
            if (customerorderobj) {
                customerOrderProductsobjarr = customerorderobj.customerOrderProducts;
                $("#customerorder_code").val(customerorderobj.code);
                $("#purchaseorder_code").val(customerorderobj.jobID);
                $("#fgin_lastfgin").val(finishedgoodsinnote_col.getlastFGINByJobId(code));
                if (customerorderobj.customerid) {
                    cli_obj = customerorderobj.customerid;
                    $("#customerorder_customerid").val(customerorderobj.customerid.code + " - " + customerorderobj.customerid.firstname + " " + customerorderobj.customerid.lastname);
                }
                if (customerorderobj.customerOrderProducts) {
                    t28.clear().draw(false);
                    $.each(customerorderobj.customerOrderProducts, function (i, item) {
                        t28.row.add([item.code, item.product.name, item.quantity]).draw(false);
                    })
                }
            } else {
                setValues();
            }

        } else {
            t28.clear().draw(false);
            t30.clear().draw(false);
            copobj = null;
            finishedgoodsinnoteobj = null;
            finishedGoodsInNoteProductsobjarr = [];
            outstangingcount = 0
            addmoddel = undefined;
            selectedcode = undefined;
            selectedcopcode = undefined;
            customerorderobj = null;
            customerorder_col.clearcop();
            finishedgoodsinnote_col.clearfginm();
            customerorder_col.clear();
            finishedgoodsinnote_col.clear();
            customerOrderProductsobjarr = [];
            $("#customerorder_code").val(undefined);
            $("#customerorder_customerid").val(undefined);
            $("#fgin_lastfgin").val(undefined);
            $("#customerorder_customerid").val(undefined);
            $("#fgin_finishedcount").val(undefined)
            $("#fgin_code").val(undefined);
            $("#fgin_pano").val(undefined);
            $("#fgin_padate").val(undefined);

            $("#fgin_remark").val(undefined);

        }
    }
    function setNewValues(panumber, padate, code, enterddate, remark, status, customerOrder, finishedGoodsInNoteProducts, printeddate) {
        finishedgoodsinnoteobj = fginClassesInstence.finishedgoodsinnote;
        if (panumber) finishedgoodsinnoteobj.panumber = panumber;
        if (padate) finishedgoodsinnoteobj.padate = padate;
        if (code) finishedgoodsinnoteobj.code = code;
        if (enterddate) finishedgoodsinnoteobj.enterddate = enterddate;
        if (remark) finishedgoodsinnoteobj.remark = remark;
        if (status) finishedgoodsinnoteobj.status = status;
        if (customerOrder) finishedgoodsinnoteobj.customerOrder = customerOrder;
        if (finishedGoodsInNoteProducts) finishedgoodsinnoteobj.finishedGoodsInNoteProducts = finishedGoodsInNoteProducts;

    }
    //end of functions
    //triggers
    $('#table28 tbody').on('click', 'tr', function () {
        if (customerOrderProductsobjarr.length != 0 && addmoddel == "add") {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                setCOPValues();
                selectedcopcode = undefined;
            } else {
                t28.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                selectedcopcode = $(this).children("td:nth-child(1)").text();
                setCOPValues($(this).children("td:nth-child(1)").text());
            }
        }

    });

    $(document).off("click", "#btncoppo");
    $(document).off("click", "#addFGIN");
    $(document).off("click", "#addCOP");

    $(document).on("click", "#btncoppo", function () {
        selectedcode = $("#purchaseorder_code").val();
        refreshtable();
    })
    $(document).on("click", "#addFGIN", function () {
        if (customerorderobj) {
            addmoddel = "add";
            let index = finishedgoodsinnote_col.getFGINsByJobId(selectedcode).length
            let code = customerorderobj.code;
            let fgincode = fginClassesInstence.FinishedGoodsInSerial.genarateFGINCode(index, code);
            $("#fgin_code").val(fgincode);
            enablefillin("#fgin_finishedcount");
            enablefillin("#fgin_pano");
            enablefillin("#fgin_remark");
        }

    })
    $(document).on("click", "#addCOP", function () {
        setGRMValues()
    })

    //end of triggers
    $("#podiv").hide();
    jwtPayload = getJwtPayload();
    formctrl();
    refreshtable();

});

