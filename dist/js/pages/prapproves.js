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
    var jwtPayload = undefined;

    var t19 = $("#table19").DataTable({
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
                } else if (purchaserequisitionobj.status == "APPROVED" || purchaserequisitionobj.status == "PRINTED") {
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
    function getJwtPayload() {
        var parts = jwt.split('.');
        var encodedPayload = parts[1];
        var decodedPayload = atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'));
        var payload = JSON.parse(decodedPayload);
        return payload;
    }
    function refreshtable() {
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI00105") != undefined || jwtPayload.businessRole == "ADMIN") {
            purchaserequisition_col.clear();
            material_col.clear();
            cli_col.clear();
            addmoddel = undefined;
            t19.clear().draw(false);
            t13.clear().draw(false);
            $.ajax({
                url: "http://localhost:8080/api/purchaserequisitionctrl/getpurchaserequisitions",
                dataType: "JSON",
                headers: {
                    "Authorization": jwt
                },
                success: function (data) {
                    $.each(data.content, function (i, item) {
                        if (item.status == "SUBMIT" || item.status == "APPROVED" || item.status == "PRINTED") {
                            purchaserequisition_col.addPurchaseRequisitiontoArray(item.id, item.prcode, item.pocode, item.supplierid, item.status, item.remark, item.totalAmount, item.purchaseRequisitionMaterials, item.quotationno,item.enteredUser, item.printededUser, item.acceptedUser, item.poPrintededUser);
                            if(item.status == "SUBMIT") t13.row.add([item.prcode,item.quotationno]).draw("false");
                        }
                    });
                    var $tableRow = $("#table13 tr td:contains('" + selectedcode + "')").closest("tr");
                    $tableRow.addClass("selected");
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
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI00105)',
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
                var enteredUser = purchaserequisitionobj.enteredUser
                var enteredUserEmail = enteredUser.email;
                var enteredUserTpNo = enteredUser.contactNumbers.find(contactnoitem => contactnoitem.isdef == true).tpno
                sendEmail(enteredUserEmail,"Approval of Purchase Requisition (PR ID: "+purchaserequisitionobj.prcode+")","Hello "+ enteredUser.firstname +",\nPurchase Requisition ID of "+ purchaserequisitionobj.prcode +" which is entered by you, have been approved by "+jwtPayload.firstname +" " +jwtPayload.lastname +". Purchase Order code is "+ purchaserequisitionobj.pocode +".");
                sendSMS(enteredUserTpNo,"Hello%20"+ enteredUser.firstname +",%20Purchase%20Requisition%20ID%20of%20"+ purchaserequisitionobj.prcode +"%20which%20is%20entered%20by%20you,%20have%20been%20approved%20by%20"+jwtPayload.firstname +"%20" +jwtPayload.lastname +".%20Purchase%20Order%20code%20is%20"+ purchaserequisitionobj.pocode +".");
                refreshtable();
            }
        })
    }
    function sendEmail(recipent,subject,body){
        $.ajax({
            url: "http://localhost:8080/api/emailctrl/sendemail",
            method: "POST",
            data: JSON.stringify({"toEmail": recipent,"subject":subject,"body":body}),
            contentType: 'application/json',
            headers: {
                "Authorization": jwt
            }
        })
    }
    function sendSMS(receiver,massage){
        $.ajax({
            url: "http://localhost:8080/api/smsctrl/sendsms",
            method: "POST",
            data: JSON.stringify({"receiver":receiver,"massage":massage}),
            contentType: 'application/json',
            headers: {
                "Authorization": jwt
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
                $("#purchaserequisition_quotationno").val(purchaserequisitionobj.quotationno);
                $("#purchaserequisition_remark").val(purchaserequisitionobj.remark)
                $("#purchaserequisition_totalamount").val(commaSeparateNumber(String(purchaserequisitionobj.totalAmount)));
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
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please enter a valid PR number!',
                });
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
            $("#purchaserequisition_quotationno").val(undefined)
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
            if (!purchaserequisitionobj.acceptedUser) purchaserequisitionobj.acceptedUser = jwtPayload;
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
    //end of functions
    //triggers
    $('#table13 tbody').on('click', 'tr', function () {
        $("#modal-prlist").modal("hide");
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
    $(document).off("click", "#btnprm");
    $(document).off("click", "#cancelPRapprove");

    $(document).on("click", "#btnprm", function () {
        $("#modal-prlist").modal("show");
        // selectedcode = $("#purchaserequisition_code").val();
        // refreshtable();
    })
    $(document).on("click", "#cancelPRapprove", function () {
        selectedcode = "";
        setValues();
    })

    //end of triggers
    jwtPayload = getJwtPayload();
    formctrl();
    refreshtable();

});

