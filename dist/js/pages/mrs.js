$(function () {
    //variables
    var mrClassesInstence = mrClasses.mrClassesInstence();
    let billofmaterial_col = mrClassesInstence.billofmaterial_service;
    let materialrequisition_col = mrClassesInstence.materialRequisition_service;
    let billofmaterialobj = mrClassesInstence.billofmaterial;
    let prmobj = mrClassesInstence.bommaterial;
    let materialrequisitionobj = mrClassesInstence.materialrequisition;
    let bommaterialsobjarr = [];
    let materialRequisitionMaterialsobjarr = [];
    var outstangingcount = 0;
    var addmoddel = undefined;
    var selectedcode = undefined;
    var selectedpomcode = undefined;

    var t22 = $("#table22").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t23 = $("#table23").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t24 = $("#table24").DataTable({
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
            mr_invoceno: {
                required: true
            },
            mr_invoicedate: {
                required: true
            },
            mr_mrano: {
                required: true
            },
            mr_mradate: {
                required: true
            },
            mr_remark: {
                required: true
            }
        },
        messages: {
            mr_invoceno: {
                required: "Please fillout the invoce number."
            },
            mr_invoicedate: {
                required: "Please fillout the invoce date."
            },
            mr_mrano: {
                required: "Please fillout the mra number."
            },
            mr_mradate: {
                required: "Please fillout the mra date."
            },
            mr_remark: {
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
                        let index = materialrequisition_col.getMRsByPOCode(selectedcode).length
                        let prcode = billofmaterialobj.prcode;
                        let mrcode = new GoodsRecevedNoteSerial().genarateMRCode(index,prcode);
                        var invoicenumber = $("#mr_invoiceno").val();
                        var invocedate = $("#mr_invoicedate").val();
                        var code = mrcode;
                        var mradate = $("#mr_mradate").val();
                        var mrano = $("#mr_mrano").val();
                        var enterddate = date;
                        var remark = $("#mr_remark").val();
                        var status = "SUBMIT";
                        var billofMaterial = billofmaterialobj;
                        var materialRequisitionMaterials = materialrequisition_col.allNewMRNMaterials();
                        setNewValues(invoicenumber,invocedate,code,mradate,mrano,enterddate,remark,status,billofMaterial,materialRequisitionMaterials,);
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
        billofmaterial_col.clear();
        materialrequisition_col.clear();
        addmoddel = undefined;
        t22.clear().draw(false);
        t23.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/billofmaterialctrl/getbillofmaterials",
            dataType: "JSON",
            success: function (data) {
                $.each(data.content, function (i, item) {
                    if (item.status == "PRINTED") {
                        $.each(item.bommaterials, function (i, item) {
                            billofmaterial_col.addbommaterialstoArray(item.id, item.code, item.material, item.unitrate, item.quantity);
                        })
                        billofmaterial_col.addPurchaseRequisitiontoArray(item.id, item.prcode, item.pocode, item.supplierid, item.status, item.remark, item.totalAmount, item.bommaterials, item.printeddate);
                    }
                });
                $.ajax({
                    url: "http://localhost:8080/api/materialrequisitionctrl/getmaterialrequisitions",
                    dataType: "JSON",
                    success: function (data) {
                        $.each(data.content, function (i, item) {
                            $.each(item.materialRequisitionMaterials, function (i, item) {
                                materialrequisition_col.addMRMaterialstoArray(item.id, item.code, item.ordercode, item.materialRequisition, item.prmaterial, item.arrivedCount);
                            });
                            materialrequisition_col.addMRtoArray(item.id, item.invoicenumber, item.invocedate, item.code, item.mradate, item.mrano, item.enterddate, item.remark, item.status, item.billofMaterial, item.materialRequisitionMaterials, item.printeddate);
                        });
                        setValues(selectedcode);
                        fadepageloder();
                    },
                    error:function(xhr, status, error){
                        fadepageloder();
                    }
                })

                fadepageloder();
            },
            error:function(xhr, status, error){
                fadepageloder();
            }
        })

    }
    function refreshmrmtable(){
        t24.clear().draw(false);
        let mrmlist = materialrequisition_col.allNewMRNMaterials();
        $.each(mrmlist,function(i,item){
            t24.row.add([item.code,item.ordercode,item.arrivedCount,item.prmaterial.material.uomid.scode]).draw(false);
        })
    }
    //definded functions
    function submit() {
        showpageloder();
        var url;
        var method;
        var token = localStorage.getItem("jwt_token");
        url = "http://localhost:8080/api/materialrequisitionctrl/savematerialrequisition";
        method = "POST";
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(materialrequisitionobj),
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
            t23.clear().draw(false);
            materialRequisitionMaterialsobjarr = [];
            materialRequisitionMaterialsobjarr = materialrequisition_col.allMRsByOrderCode(ordercode).MRMs;
            setOutstanding(ordercode);
            if(addmoddel=="add"){
                $("#mr_orderno").val(selectedpomcode);
            }
            if (materialRequisitionMaterialsobjarr.length != 0) {
                $.each(materialRequisitionMaterialsobjarr, function (i, item) {
                    if (item.id != undefined)
                        t23.row.add([item.materialRequisition.code, item.code, item.arrivedCount, item.prmaterial.material.uomid.scode, item.materialRequisition.enterddate,
                        item.materialRequisition.invoicenumber, item.materialRequisition.invocedate, item.materialRequisition.mrano, item.materialRequisition.mradate]).draw(false);
                })
            }
        } else {
            t23.clear().draw(false);
            materialRequisitionMaterialsobjarr = [];
            $("#mr_outstanding").val(undefined);
            $("#mr_orderno").val(undefined);
            $("#mr_arrivedcount").val(undefined)
        }
    }
    function setOutstanding(ordercode){
        if(ordercode){
            var totarrived = materialrequisition_col.allMRsByOrderCode(ordercode).totarrived;
            prmobj = billofmaterial_col.getPRMsByOrderCode(ordercode);
            outstangingcount = prmobj.quantity - totarrived;
            $("#mr_outstanding").val(outstangingcount);
        }else{
            outstangingcount = 0;
            $("#mr_outstanding").val(undefined);
        }
    }

    function setGRMValues() {
        setOutstanding(selectedpomcode);
        var index = materialrequisition_col.getNewMRNMaterialsByOrderCode(selectedpomcode).length;
        var mrmcode = mrClassesInstence.GoodsRecevedNoteSerial.genarateMRMCode(index,selectedpomcode);
        var arrivedCount = $("#mr_arrivedcount").val();
        var res = materialrequisition_col.addNewMRMaterialstoArray(undefined,mrmcode,selectedpomcode,materialrequisitionobj,prmobj,arrivedCount,outstangingcount);
        
        if(res){
            Swal.fire(
                'Added!',
                'The new record has been added.',
                'success'
            )
            refreshmrmtable();
        }else{
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
            billofmaterialobj = billofmaterial_col.getPurchaseOrder(code);
            if (billofmaterialobj) {
                bommaterialsobjarr = billofmaterialobj.bommaterials;
                $("#billofmaterial_code").val(billofmaterialobj.prcode);
                $("#purchaseorder_code").val(billofmaterialobj.pocode);
                $("#mr_lastmr").val(materialrequisition_col.getlastMRByPOCode(code));
                if (billofmaterialobj.supplierid) {
                    cli_obj = billofmaterialobj.supplierid;
                    $("#billofmaterial_supplierid").val(billofmaterialobj.supplierid.code + " - " + billofmaterialobj.supplierid.firstname + " " + billofmaterialobj.supplierid.lastname);
                }
                if (billofmaterialobj.bommaterials) {
                    t22.clear().draw(false);
                    $.each(billofmaterialobj.bommaterials, function (i, item) {
                        t22.row.add([item.code, item.material.description, item.quantity, item.material.uomid.scode]).draw(false);

                    })
                }
            } else {
                setValues();
            }

        } else {
            t22.clear().draw(false);
            t24.clear().draw(false);
            prmobj = null;
            materialrequisitionobj = null;
            materialRequisitionMaterialsobjarr = [];
            outstangingcount = 0
            addmoddel = undefined;
            selectedcode = undefined;
            selectedpomcode = undefined;
            billofmaterialobj = null;
            billofmaterial_col.clearprm();
            materialrequisition_col.clearmrm();
            billofmaterial_col.clear();
            materialrequisition_col.clear();
            bommaterialsobjarr = [];
            $("#billofmaterial_code").val(undefined);
            $("#billofmaterial_supplierid").val(undefined);
            $("#mr_lastmr").val(undefined);
            $("#billofmaterial_supplierid").val(undefined);
            $("#mr_arrivedcount").val(undefined)
            $("#mr_code").val(undefined);
            $("#mr_invoiceno").val(undefined);
            $("#mr_invoicedate").val(undefined);
            $("#mr_mrano").val(undefined);
            $("#mr_mradate").val(undefined);
            $("#mr_remark").val(undefined);
            
        }
    }
    function setNewValues(invoicenumber,invocedate,code,mradate,mrano,enterddate,remark,status,billofMaterial,materialRequisitionMaterials,printeddate) {
        materialrequisitionobj = new materialrequisition();
        if(invoicenumber)materialrequisitionobj.invoicenumber = invoicenumber;
        if(invocedate)materialrequisitionobj.invocedate = invocedate;
        if(code)materialrequisitionobj.code = code;
        if(mradate)materialrequisitionobj.mradate = mradate;
        if(mrano)materialrequisitionobj.mrano = mrano;
        if(enterddate)materialrequisitionobj.enterddate = enterddate;
        if(remark)materialrequisitionobj.remark = remark;
        if(status)materialrequisitionobj.status = status;
        if(billofMaterial)materialrequisitionobj.billofMaterial = billofMaterial;
        if(materialRequisitionMaterials)materialrequisitionobj.materialRequisitionMaterials = materialRequisitionMaterials;
        
    }
    //end of functions
    //triggers
    $('#table22 tbody').on('click', 'tr', function () {
        if (bommaterialsobjarr.length != 0 &&  addmoddel == "add") {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                setPOMValues();
                selectedpomcode = undefined;
            } else {
                t22.$('tr.selected').removeClass('selected');
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
    $(document).on("click", "#addMR", function () {
        if (billofmaterialobj) {
            addmoddel = "add";
            let index = materialrequisition_col.getMRsByPOCode(selectedcode).length
            let prcode = billofmaterialobj.prcode;
            let mrcode = mrClassesInstence.GoodsRecevedNoteSerial.genarateMRCode(index,prcode);
            $("#mr_code").val(mrcode);
            enablefillin("#mr_arrivedcount");
            enablefillin("#mr_invoiceno");
            enablefillin("#mr_invoicedate");
            enablefillin("#mr_mrano");
            enablefillin("#mr_mradate");
            enablefillin("#mr_remark");
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

