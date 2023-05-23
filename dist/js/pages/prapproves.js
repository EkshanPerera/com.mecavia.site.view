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

    var addmoddel = undefined;
    var selectedcode = undefined;

    var t19 = $("#table19").DataTable({
        "order": [[ 0, "desc" ]],
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
                if (purchaserequisitionobj.status == "SUBMIT") {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, approve it!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            var code = genaratecode();
                            var status = "APPROVED";
                            setNewValues(code, status);
                            submit();
                            Swal.fire(
                                'Submitted!',
                                'The PR has been approved.',
                                'success'
                            )
                        }
                    })
                }else if(purchaserequisitionobj.status == "APPROVED" || purchaserequisitionobj.status == "PRINTED"){
                    Swal.fire({
                        icon: 'warning',
                        title: 'Warning!',
                        text: 'The PR you are attempting to approve is already approved!',
                    });
                }
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
        material_col.clear();
        cli_col.clear();
        addmoddel = undefined;
        t19.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/purchaserequisitionctrl/getpurchaserequisitions",
            dataType: "JSON",
            success: function (data) {
                $.each(data.content, function (i, item) {
                    if (item.status == "SUBMIT" || item.status == "APPROVED" || item.status == "PRINTED") {
                        purchaserequisition_col.addPurchaseRequisitiontoArray(item.id, item.prcode, item.pocode, item.supplierid, item.status, item.remark, item.totalAmount, item.purchaseRequisitionMaterials);
                    }
                });
                setValues(selectedcode);
                fadepageloder();
            },
            error:function(xhr, status, error){
                fadepageloder();
            }
        })
    }
    //definded functions
    function submit() {
        showpageloder();
        var url;
        var method;
        var token = localStorage.getItem("jwt_token");
        url = "http://localhost:8080/api/purchaserequisitionctrl/updatepurchaserequisition";
        method = "PUT";
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

    function setValues(code) {
        formctrl();
        addmoddel = undefined;
        if (code) {
            purchaserequisitionobj = purchaserequisition_col.getPurchaseRequisition(code);
            if (purchaserequisitionobj) {
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
                    t19.clear().draw(false);
                    $.each(purchaserequisitionobj.purchaseRequisitionMaterials, function (i, item) {
                        t19.row.add([i + 1, item.material.description, item.unitrate, item.quantity, item.material.uomid.scode]).draw(false);
                    })
                }
            } else {
                setValues();
            }

        } else {
            purchaserequisitionobj = undefined;
            t19.clear().draw(false);
            purchaserequisition_col.clearprm();
            purchaseRequisitionMaterialsobjarr = [];
            total = undefined;
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
    function setNewValues(code, status) {
        if (purchaserequisitionobj) {
            if (code) purchaserequisitionobj.pocode = code;
            if (status) purchaserequisitionobj.status = status;
        } else {
            purchaserequisitionobj = purchaserequisitionClassesInstence.purchaserequisition;
            setNewValues(code, status);
        }
    }
    function genaratecode() {
        let purchaseorderlist = purchaserequisition_col.allPurchaseOrders()
        let purchaseordercode = purchaserequisitionClassesInstence.PurchaseRequisitionSerial.genaratePurchaseOrderCode(purchaseorderlist.length, selectedcode);
        return purchaseordercode;
    }
    //end of functions
    //triggers
    $(document).on("click", "#btnprm", function () {
        selectedcode = $("#purchaserequisition_code").val();
        refreshtable();
    })

    //end of triggers
    formctrl();
    refreshtable();
});

