$(function () {
    //variables
    let customerorder_col = new customerorder_service();
    let finishedgoodsinnote_col = new finishedGoodsInNote_service();
    let customerorderobj = new customerorder();
    let copobj = new customerOrderProduct()
    let finishedgoodsinnoteobj = new finishedgoodsinnote();
    let customerOrderProductsobjarr = [];
    let finishedGoodsInNoteProductsobjarr = [];
    var outstangingcount = 0;
    var addmoddel;
    var selectedcode;
    var selectedcopcode;

    var t10 = $("#table10").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t11 = $("#table11").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t12 = $("#table12").DataTable({
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
                        var month =  new Date().getMonth();
                        var day = new Date().getDate();
                        var date = day + "/" + (parseInt(month) + 1) + "/" + year;
                        let index = finishedgoodsinnote_col.getFGINsByJobId(selectedcode).length
                        let code = customerorderobj.code;
                        let fgincode = new FinishedGoodsInSerial().genarateFGINCode(index,code);
                        var panumber = $("#fgin_pano").val();
                        var padate = $("#fgin_padate").val();
                        var fgicode = fgincode;
                        
                        var enterddate = date;
                        var remark = $("#fgin_remark").val();
                        var status = "SUBMIT";
                        var customerOrder = customerorderobj;
                        var finishedGoodsInNoteProducts = finishedgoodsinnote_col.allNewFGINNProducts();
                        setNewValues(panumber,padate,fgicode,enterddate,remark,status,customerOrder,finishedGoodsInNoteProducts,);
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
    function refreshtable() {
        customerorder_col.clear();
        finishedgoodsinnote_col.clear();
        addmoddel = undefined;
        t10.clear().draw(false);
        t11.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/customerorderctrl/getcustomerorders",
            dataType: "JSON",
            success: function (data) {
                $.each(data.content, function (i, item) {
                    if (item.status == "ACCEPTED") {
                        $.each(item.customerOrderProducts, function (i, item) {
                            customerorder_col.addcustomerOrderProductstoArray(item.id, item.code, item.product, item.unitrate, item.quantity);
                        })
                        customerorder_col.addCustomerOrdertoArray(item.id,item.code,item.jobID,item.jobNumber,item.customerid,item.totalAmount,item.grossAmount,item.remark,item.customerOrderProducts,item.printeddate,item.status);
                    }
                });
                $.ajax({
                    url: "http://localhost:8080/api/finishedgoodsinnotectrl/getfinishedgoodsinnotes",
                    dataType: "JSON",
                    success: function (data) {
                        $.each(data.content, function (i, item) {
                            $.each(item.finishedGoodsInNoteProducts, function (i, item) {
                                finishedgoodsinnote_col.addFGINProductstoArray(item.id,item.code,item.cordercode,item.finishedGoodsInNoteDto,item.coproduct,item.finishedCount);
                            });
                            finishedgoodsinnote_col.addFGINtoArray(item.id,item.code,item.panumber,item.padate,item.enterddate,item.remark,item.status,item.customerOrder,item.finishedGoodsInNoteProducts,item.printeddate);
                        });
                        setValues(selectedcode);
                    }
                })

            }
        })

    }
    function refreshfginmtable(){
        t12.clear().draw(false);
        let fginmlist = finishedgoodsinnote_col.allNewFGINNProducts();
        $.each(fginmlist,function(i,item){
            t12.row.add([item.code,item.cordercode,item.finishedCount]).draw(false);
        })
    }
    //definded functions
    function submit() {
        var url;
        var method;
        var token = localStorage.getItem("jwt_token");
        url = "http://localhost:8080/api/finishedgoodsinnotectrl/savefinishedgoodsinnote";
        method = "POST";
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(finishedgoodsinnoteobj),
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
    function setCOPValues(cordercode) {
        if (cordercode) {
            t11.clear().draw(false);
            finishedGoodsInNoteProductsobjarr = [];
            finishedGoodsInNoteProductsobjarr = finishedgoodsinnote_col.allFGINsByOrderCode(cordercode).FGINMs;
            setOutstanding(cordercode);
            if(addmoddel=="add"){
                $("#fgin_orderno").val(selectedcopcode);
            }
            if (finishedGoodsInNoteProductsobjarr.length != 0) {
                $.each(finishedGoodsInNoteProductsobjarr, function (i, item) {
                    if (item.id != undefined)
                        t11.row.add([item.finishedGoodsInNote.code, item.code, item.finishedCount, item.prproduct.product.uomid.scode, item.finishedGoodsInNote.enterddate,
                        item.finishedGoodsInNote.panumber, item.finishedGoodsInNote.padate]).draw(false);
                })
            }
        } else {
            t11.clear().draw(false);
            finishedGoodsInNoteProductsobjarr = [];
            $("#fgin_outstanding").val(undefined);
            $("#fgin_orderno").val(undefined);
            $("#fgin_finishedcount").val(undefined)
        }
    }
    function setOutstanding(cordercode){
        if(cordercode){
            var totfinished = finishedgoodsinnote_col.allFGINsByOrderCode(cordercode).totfinished;
            copobj = customerorder_col.getPRMsByOrderCode(cordercode);
            outstangingcount = copobj.quantity - totfinished;
            $("#fgin_outstanding").val(outstangingcount);
        }else{
            outstangingcount = 0;
            $("#fgin_outstanding").val(undefined);
        }
    }

    function setGRMValues() {
        setOutstanding(selectedcopcode);
        var index = finishedgoodsinnote_col.getFGINNProductsByOrderCode(selectedcopcode).length;
        var fginmcode = new FinishedGoodsInSerial().genarateFGINMCode(index,selectedcopcode);
        var finishedCount = $("#fgin_finishedcount").val();
        var res = finishedgoodsinnote_col.addNewFGINProductstoArray(undefined,fginmcode,selectedcopcode,finishedgoodsinnoteobj,copobj,finishedCount,outstangingcount);
        
        if(res){
            Swal.fire(
                'Added!',
                'The new record has been added.',
                'success'
            )
            refreshfginmtable();
        }else{
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
                    t10.clear().draw(false);
                    $.each(customerorderobj.customerOrderProducts, function (i, item) {
                        t10.row.add([item.code, item.product.name, item.quantity]).draw(false);
                    })
                }
            } else {
                setValues();
            }

        } else {
            t10.clear().draw(false);
            t12.clear().draw(false);
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
    function setNewValues(panumber,padate,code,enterddate,remark,status,customerOrder,finishedGoodsInNoteProducts,printeddate) {
        finishedgoodsinnoteobj = new finishedgoodsinnote();
        if(panumber)finishedgoodsinnoteobj.panumber = panumber;
        if(padate)finishedgoodsinnoteobj.padate = padate;
        if(code)finishedgoodsinnoteobj.code = code;
       
        if(enterddate)finishedgoodsinnoteobj.enterddate = enterddate;
        if(remark)finishedgoodsinnoteobj.remark = remark;
        if(status)finishedgoodsinnoteobj.status = status;
        if(customerOrder)finishedgoodsinnoteobj.customerOrder = customerOrder;
        if(finishedGoodsInNoteProducts)finishedgoodsinnoteobj.finishedGoodsInNoteProducts = finishedGoodsInNoteProducts;
        
    }
    //end of functions
    //triggers
    $('#table10 tbody').on('click', 'tr', function () {
        if (customerOrderProductsobjarr.length != 0 &&  addmoddel == "add") {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                setCOPValues();
                selectedcopcode = undefined;
            } else {
                t10.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                selectedcopcode = $(this).children("td:nth-child(1)").text();
                setCOPValues($(this).children("td:nth-child(1)").text());
            }
        }

    });
    
    $(document).on("click", "#btncoppo", function () {
        selectedcode = $("#purchaseorder_code").val();
        refreshtable();
    })
    $(document).on("click", "#addFGIN", function () {
        if (customerorderobj) {
            addmoddel = "add";
            let index = finishedgoodsinnote_col.getFGINsByJobId(selectedcode).length
            let code = customerorderobj.code;
            let fgincode = new FinishedGoodsInSerial().genarateFGINCode(index,code);
            $("#fgin_code").val(fgincode);
            enablefillin("#fgin_finishedcount");
            enablefillin("#fgin_pano");
            enablefillin("#fgin_padate");
            enablefillin("#fgin_remark");
        }

    })
    $(document).on("click", "#addCOP", function () {
        setGRMValues()
    })
    
    //end of triggers
    $("#podiv").hide();
    formctrl();
    refreshtable();
});

