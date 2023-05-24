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
    var selectedcode =undefined;

    var t18 = $("#table18").DataTable({
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
                        var month =  new Date().getMonth();
                        var day = new Date().getDate();
                        var date = day + "/" + (parseInt(month) + 1) + "/" + year;
                        var status = "PRINTED";
                        setNewValues(status,date);
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
    function refreshtable() {
        purchaserequisition_col.clear();
        material_col.clear();
        cli_col.clear();
        addmoddel = undefined;
        t18.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/purchaserequisitionctrl/getpurchaserequisitions",
            dataType: "JSON",
            success: function (data) {
                $.each(data.content, function (i, item) {
                    if (item.status == "SUBMIT" || item.status == "APPROVED" || item.status == "PRINTED") {
                        purchaserequisition_col.addPurchaseRequisitiontoArray(item.id, item.prcode, item.pocode, item.supplierid, item.status, item.remark, item.totalAmount, item.purchaseRequisitionMaterials, item.printeddate);
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
            purchaserequisitionobj = purchaserequisition_col.getPurchaseOrder(code);
            if (purchaserequisitionobj) {
                purchaseRequisitionMaterialsobjarr = purchaserequisitionobj.purchaseRequisitionMaterials;
                $("#purchaserequisition_code").val(purchaserequisitionobj.prcode);
                $("#purchaseorder_code").val(purchaserequisitionobj.pocode);
                $("#purchaserequisition_unitrate").val(purchaserequisitionobj.unitrate)
                $("#purchaserequisition_quntity").val(purchaserequisitionobj.quntity)
                $("#purchaserequisition_remark").val(purchaserequisitionobj.remark)
                $("#purchaserequisition_totalamount").val(purchaserequisitionobj.totalAmount);
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
                $.each(purchaserequisitionobj.purchaseRequisitionMaterials, function (i, item) {
                    t18.row.add([i + 1, item.material.description, item.unitrate, item.quantity, item.material.uomid.scode]).draw(false);
                    dataset+="<tr><td>"+i + 1+"</td><td>"+item.material.description+"</td><td>"+item.unitrate+"</td><td>"+item.quantity + item.material.uomid.scode +"</td><td>"+item.unitrate*item.quantity+"</td></tr>";

                })
                $("#potablebody").html(dataset);
            }
            $("#printeddate").text(date);
            $("#pono").text(purchaserequisitionobj.pocode);
            if (purchaserequisitionobj.status =="PRINTED") {
                $("#coppyornot").text("TRUE COPY");
                $("#printeddate").text(purchaserequisitionobj.printeddate);
                $("#reprintdate").text(date);
            }
            $("#nettotal").text(purchaserequisitionobj.totalAmount);
            $(".tax").text(14.5)
            $("#grosstotal").text((purchaserequisitionobj.totalAmount) * (100 + 14.5) / 100);
        } else {
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
        $("#purchaserequisition_totalamount").val(undefined);
        $("#purchaserequisition_status").val(undefined);
        $("#purchaserequisition_supplierid").val(undefined);
        $("#purchaserequisition_materialid").val(undefined);

    }
}
    function setNewValues(status, printeddate) {
        if (purchaserequisitionobj) {
            if (status) purchaserequisitionobj.status = status;
            if (!purchaserequisitionobj.printeddate ) purchaserequisitionobj.printeddate = printeddate;
        } else {
            purchaserequisitionobj = purchaseorderClassesInstence.purchaserequisition;
            setNewValues(status);
        }
    }
    //end of functions
    //triggers
    $(document).off("click", "#btnprmpo");
    $(document).on("click", "#btnprmpo", function () {
        selectedcode = $("#purchaseorder_code").val();
        refreshtable();
    })

    //end of triggers
    $("#podiv").hide();
    formctrl();
    refreshtable();
});

