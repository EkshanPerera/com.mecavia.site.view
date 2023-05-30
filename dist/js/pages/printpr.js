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
    var selectedcode = undefined;

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
            if (cli_obj.id && purchaseRequisitionMaterialsobjarr.length != 0 && purchaserequisitionobj.status == "PENDING" ) {
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
                        setNewValues(date);
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
        t18.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/purchaserequisitionctrl/getpurchaserequisitions",
            dataType: "JSON",
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                $.each(data.content, function (i, item) {
                    if (item.status == "PENDING") {
                        purchaserequisition_col.addPurchaseRequisitiontoArray(item.id, item.prcode, item.pocode, item.supplierid, item.status, item.remark, item.totalAmount, item.purchaseRequisitionMaterials,item.quotationno,item.prprinteddate);
                    }
                });
                setValues(selectedcode);
                fadepageloder();
            }
        })
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
    function commaSeparateNumber(val){
        while (/(\d+)(\d{3})/.test(val.toString())){
          val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        if (val != "") {
            if (val.indexOf('.') == -1) {
                val = val + ".00";
            }else{
                val = val;
            }
        }else{
            val = val;
        }
        return val;

    }
    function setValues(code) {
        formctrl();
        if (code) {
            purchaserequisitionobj = purchaserequisition_col.getPurchaseRequisition(code);
            if (purchaserequisitionobj != undefined) {
                purchaseRequisitionMaterialsobjarr = purchaserequisitionobj.purchaseRequisitionMaterials;
                $("#purchaserequisition_code").val(purchaserequisitionobj.prcode);
                $("#purchaseorder_code").val(purchaserequisitionobj.pocode);
                $("#purchaserequisition_unitrate").val(purchaserequisitionobj.unitrate)
                $("#purchaserequisition_quntity").val(purchaserequisitionobj.quntity)
                $("#purchaserequisition_remark").val(purchaserequisitionobj.remark)
                $("#purchaserequisition_quotationno").val(purchaserequisitionobj.quotationno)
                $("#purchaserequisition_totalamount").val(commaSeparateNumber(purchaserequisitionobj.totalAmount));
                $("#purchaserequisition_status").val(purchaserequisitionobj.status);
                var year = new Date().getFullYear();
                var month = new Date().getMonth();
                var day = new Date().getDate();
                var date = day + "/" + (parseInt(month) + 1) + "/" + year;

                if (purchaserequisitionobj.prprinteddate) {
                    $("#podate").text(purchaserequisitionobj.prprinteddate)
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
                        dataset += "<tr><td>" + (i + 1) + "</td><td>" + item.material.description + "</td><td> <div style=\"text-align: right;\"> Rs. " + commaSeparateNumber(item.unitrate) + "</div></td><td><div style=\"text-align: right;\">" + commaSeparateNumber(item.quantity) + item.material.uomid.scode + "</div></td><td><div style=\"text-align: right;\">Rs. " + commaSeparateNumber(item.unitrate * item.quantity) + "</div></td></tr>";
                    })
                    do {
                        dataset+="<tr><td>"+ icont + "</td><td> </td><td> </td><td> </td><td> </td></tr>"
                        icont ++;
                      }
                      while (icont < 17);
              
                    $("#potablebody").html(dataset);
                }
                $("#prprinteddate").text(date);
                $("#pono").text(purchaserequisitionobj.prcode);
                $("#qoano").text(purchaserequisitionobj.quotationno);
                if (purchaserequisitionobj.prprinteddate != undefined || purchaserequisitionobj.prprinteddate != null) {
                    $("#coppyornot").text("TRUE COPY");
                    $("#prprinteddate").text(purchaserequisitionobj.prprinteddate);
                    $("#reprintdate").text(date);
                }
                $("#nettotal").text(commaSeparateNumber(purchaserequisitionobj.totalAmount));
                $(".tax").text("0.0%")
                $("#grosstotal").text(commaSeparateNumber((purchaserequisitionobj.totalAmount) * (100 + 0.0) / 100));
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
            $("#purchaserequisition_unitrate").val(undefined);
            $("#purchaserequisition_quntity").val(undefined);
            $("#purchaserequisition_remark").val(undefined);
            $("#purchaserequisition_quotationno").val(undefined);
            $("#purchaserequisition_totalamount").val(undefined);
            $("#purchaserequisition_status").val(undefined);
            $("#purchaserequisition_supplierid").val(undefined);
            $("#purchaserequisition_materialid").val(undefined);

        }
    }
    function setNewValues(prprinteddate) {
        if (purchaserequisitionobj) {
            if (!purchaserequisitionobj.prprinteddate) purchaserequisitionobj.prprinteddate = prprinteddate;
        } else {
            purchaserequisitionobj = purchaserequisitionClassesInstenceInstence.purchaserequisition;
            setNewValues(status);
        }
    }
    //end of functions
    //triggers
    $(document).off("click", "#btnprmpo");
    $(document).off("click", "#cancelPRPrint");
    $(document).on("click", "#btnprmpo", function () {
        selectedcode = $("#purchaserequisition_code").val();
        refreshtable();
    })
    $(document).on("click", "#cancelPRPrint", function () {
        selectedcode = "";
        setValues();
    })

    //end of triggers
    $("#podiv").hide();
    formctrl();
    refreshtable();
});

