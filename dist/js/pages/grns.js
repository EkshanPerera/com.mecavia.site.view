$(function () {
    //variables
    let purchaserequisition_col = new purchaserequisition_service();
    let goodsreceivednote_col = new goodsReceivedNote_service();
    let purchaserequisitionobj = new purchaserequisition();
    let prmobj = new purchaseRequisitionMaterial()
    let goodsreceivednoteobj = new goodsreceivednote();
    let purchaseRequisitionMaterialsobjarr = [];
    let goodsReceivedNoteMaterialsobjarr = [];
    var outstangingcount = 0;
    var addmoddel;
    var selectedcode;
    var selectedpomcode;

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
                        var month =  new Date().getMonth();
                        var day = new Date().getDate();
                        var date = day + "/" + (parseInt(month) + 1) + "/" + year;
                        let index = goodsreceivednote_col.getGRNsByPOCode(selectedcode).length
                        let prcode = purchaserequisitionobj.prcode;
                        let grncode = new GoodsRecevedNoteSerial().genarateGRNCode(index,prcode);
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
                        setNewValues(invoicenumber,invocedate,code,mradate,mrano,enterddate,remark,status,purchaseRequisition,goodsReceivedNoteMaterials,);
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
        purchaserequisition_col.clear();
        goodsreceivednote_col.clear();
        addmoddel = undefined;
        t10.clear().draw(false);
        t11.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/purchaserequisitionctrl/getpurchaserequisitions",
            dataType: "JSON",
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
                    success: function (data) {
                        $.each(data.content, function (i, item) {
                            $.each(item.goodsReceivedNoteMaterials, function (i, item) {
                                goodsreceivednote_col.addGRNMaterialstoArray(item.id, item.code, item.ordercode, item.goodsReceivedNote, item.prmaterial, item.arrivedCount);
                            });
                            goodsreceivednote_col.addGRNtoArray(item.id, item.invoicenumber, item.invocedate, item.code, item.mradate, item.mrano, item.enterddate, item.remark, item.status, item.purchaseRequisition, item.goodsReceivedNoteMaterials, item.printeddate);
                        });
                        setValues(selectedcode);
                    }
                })

            }
        })

    }
    function refreshgrnmtable(){
        t12.clear().draw(false);
        let grnmlist = goodsreceivednote_col.allNewGRNNMaterials();
        $.each(grnmlist,function(i,item){
            t12.row.add([item.code,item.ordercode,item.arrivedCount,item.prmaterial.material.uomid.scode]).draw(false);
        })
    }
    //definded functions
    function submit() {
        var url;
        var method;
        var token = localStorage.getItem("jwt_token");
        url = "http://localhost:8080/api/goodsreceivednotectrl/savegoodsreceivednote";
        method = "POST";
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(goodsreceivednoteobj),
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
    function setPOMValues(ordercode) {
        if (ordercode) {
            t11.clear().draw(false);
            goodsReceivedNoteMaterialsobjarr = [];
            goodsReceivedNoteMaterialsobjarr = goodsreceivednote_col.allGRNsByOrderCode(ordercode).GRNMs;
            setOutstanding(ordercode);
            if(addmoddel=="add"){
                $("#grn_orderno").val(selectedpomcode);
            }
            if (goodsReceivedNoteMaterialsobjarr.length != 0) {
                $.each(goodsReceivedNoteMaterialsobjarr, function (i, item) {
                    if (item.id != undefined)
                        t11.row.add([item.goodsReceivedNote.code, item.code, item.arrivedCount, item.prmaterial.material.uomid.scode, item.goodsReceivedNote.enterddate,
                        item.goodsReceivedNote.invoicenumber, item.goodsReceivedNote.invocedate, item.goodsReceivedNote.mrano, item.goodsReceivedNote.mradate]).draw(false);
                })
            }
        } else {
            t11.clear().draw(false);
            goodsReceivedNoteMaterialsobjarr = [];
            $("#grn_outstanding").val(undefined);
            $("#grn_orderno").val(undefined);
            $("#grn_arrivedcount").val(undefined)
        }
    }
    function setOutstanding(ordercode){
        if(ordercode){
            var totarrived = goodsreceivednote_col.allGRNsByOrderCode(ordercode).totarrived;
            prmobj = purchaserequisition_col.getPRMsByOrderCode(ordercode);
            outstangingcount = prmobj.quantity - totarrived;
            $("#grn_outstanding").val(outstangingcount);
        }else{
            outstangingcount = 0;
            $("#grn_outstanding").val(undefined);
        }
    }

    function setGRMValues() {
        setOutstanding(selectedpomcode);
        var index = goodsreceivednote_col.getNewGRNNMaterialsByOrderCode(selectedpomcode).length;
        var grnmcode = new GoodsRecevedNoteSerial().genarateGRNMCode(index,selectedpomcode);
        var arrivedCount = $("#grn_arrivedcount").val();
        var res = goodsreceivednote_col.addNewGRNMaterialstoArray(undefined,grnmcode,selectedpomcode,goodsreceivednoteobj,prmobj,arrivedCount,outstangingcount);
        
        if(res){
            Swal.fire(
                'Added!',
                'The new record has been added.',
                'success'
            )
            refreshgrnmtable();
        }else{
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
                    t10.clear().draw(false);
                    $.each(purchaserequisitionobj.purchaseRequisitionMaterials, function (i, item) {
                        t10.row.add([item.code, item.material.description, item.quantity, item.material.uomid.scode]).draw(false);

                    })
                }
            } else {
                setValues();
            }

        } else {
            t10.clear().draw(false);
            t12.clear().draw(false);
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
            
        }
    }
    function setNewValues(invoicenumber,invocedate,code,mradate,mrano,enterddate,remark,status,purchaseRequisition,goodsReceivedNoteMaterials,printeddate) {
        goodsreceivednoteobj = new goodsreceivednote();
        if(invoicenumber)goodsreceivednoteobj.invoicenumber = invoicenumber;
        if(invocedate)goodsreceivednoteobj.invocedate = invocedate;
        if(code)goodsreceivednoteobj.code = code;
        if(mradate)goodsreceivednoteobj.mradate = mradate;
        if(mrano)goodsreceivednoteobj.mrano = mrano;
        if(enterddate)goodsreceivednoteobj.enterddate = enterddate;
        if(remark)goodsreceivednoteobj.remark = remark;
        if(status)goodsreceivednoteobj.status = status;
        if(purchaseRequisition)goodsreceivednoteobj.purchaseRequisition = purchaseRequisition;
        if(goodsReceivedNoteMaterials)goodsreceivednoteobj.goodsReceivedNoteMaterials = goodsReceivedNoteMaterials;
        
    }
    //end of functions
    //triggers
    $('#table10 tbody').on('click', 'tr', function () {
        if (purchaseRequisitionMaterialsobjarr.length != 0 &&  addmoddel == "add") {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                setPOMValues();
                selectedpomcode = undefined;
            } else {
                t10.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                selectedpomcode = $(this).children("td:nth-child(1)").text();
                setPOMValues($(this).children("td:nth-child(1)").text());
            }
        }

    });
    
    $(document).on("click", "#btnprmpo", function () {
        selectedcode = $("#purchaseorder_code").val();
        refreshtable();
    })
    $(document).on("click", "#addGRN", function () {
        if (purchaserequisitionobj) {
            addmoddel = "add";
            let index = goodsreceivednote_col.getGRNsByPOCode(selectedcode).length
            let prcode = purchaserequisitionobj.prcode;
            let grncode = new GoodsRecevedNoteSerial().genarateGRNCode(index,prcode);
            $("#grn_code").val(grncode);
            enablefillin("#grn_arrivedcount");
            enablefillin("#grn_invoiceno");
            enablefillin("#grn_invoicedate");
            enablefillin("#grn_mrano");
            enablefillin("#grn_mradate");
            enablefillin("#grn_remark");
        }

    })
    $(document).on("click", "#addPOM", function () {
        setGRMValues()
    })
    
    //end of triggers
    $("#podiv").hide();
    formctrl();
    refreshtable();
});

