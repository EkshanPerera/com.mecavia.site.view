$(function () {
    //variables
    var grnClassesInstence = grnClasses.grnClassesInstence();
    let goodsreceivednote_col = grnClassesInstence.goodsReceivedNote_service;
    let goodsreceivednoteobjarr = [];
    var goodsreceivednoteobj = undefined;
    var selectedcode = undefined;

    var t18 = $("#table18").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        "autoWidth": false,
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
            if (goodsreceivednoteobj != undefined ) {
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
                        // setNewValues(date);
                        // submit();
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
        goodsreceivednote_col.clear();
        t18.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/goodsreceivednotectrl/getgoodsreceivednotes",
            dataType: "JSON",
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                $.each(data.content, function (i, item) {
                    goodsreceivednote_col.addGRNtoArray(item.id, item.invoicenumber, item.invocedate, item.code, item.mradate, item.mrano, item.enterddate, item.remark, item.status, item.purchaseRequisition, item.goodsReceivedNoteMaterials, item.printeddate);
                });
                setValues(selectedcode);
                fadepageloder();
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
            goodsreceivednoteobj = goodsreceivednote_col.getGRN(code);
            if (goodsreceivednoteobj != undefined) {
                goodsreceivednoteobjarr = goodsreceivednoteobj.purchaseRequisitionMaterials;
                $("#goodsreceivednote_code").val(goodsreceivednoteobj.code);
                $("#goodsreceivednote_invoiceno").val(goodsreceivednoteobj.invoicenumber)
                $("#goodsreceivednote_invoicedate").val(goodsreceivednoteobj.invocedate)
                $("#goodsreceivednote_remark").val(goodsreceivednoteobj.remark)
                $("#goodsreceivednote_mrano").val(goodsreceivednoteobj.mrano)
                $("#goodsreceivednote_mradate").val(goodsreceivednoteobj.mradate);
                if (goodsreceivednoteobj.goodsReceivedNoteMaterials) {
                    t18.clear().draw(false);
                    var dataset = "";
                    var icont = 1;
                    $.each(goodsreceivednoteobj.goodsReceivedNoteMaterials, function (i, item) {
                        icont += 1; 
                        t18.row.add([i + 1, item.prmaterial.material.description, item.code, item.ordercode, item.arrivedCount, item.prmaterial.material.uomid.scode]).draw(false);
                        dataset += "<tr><td>" + (i + 1) + "</td><td>" + item.prmaterial.material.description + "</td><td>"+ item.code +"</td><td>"+ item.ordercode +"</td><td><div style=\"text-align: right;\">" + commaSeparateNumber(String(item.arrivedCount)) + item.prmaterial.material.uomid.scode + "</div></td></tr>";
                    })
                    do {
                        dataset+="<tr><td>"+ icont + "</td><td> </td><td> </td><td> </td><td> </td></tr>"
                        icont ++;
                      }
                      while (icont < 21);
              
                    $("#potablebody").html(dataset);
                }
                $("#grnid").text(goodsreceivednoteobj.code);
                $("#invoiceno").text(goodsreceivednoteobj.invoicenumber)
                $("#invoicedate").text(goodsreceivednoteobj.invocedate)
                $("#mrano").text(goodsreceivednoteobj.mrano)
                $("#mradate").text(goodsreceivednoteobj.mradate);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please enter the valid PR number!',
                });
                setValues();
            }

        } else {
            goodsreceivednoteobj = undefined;
            t18.clear().draw(false);
            goodsreceivednote_col.clear();
            goodsreceivednoteobjarr = [];
            $("#goodsreceivednote_invoiceno").val(undefined);
            $("#goodsreceivednote_invoicedate").val(undefined);
            $("#goodsreceivednote_remark").val(undefined);
            $("#goodsreceivednote_mrano").val(undefined);
            $("#goodsreceivednote_mradate").val(undefined);

        }
    }
    //end of functions
    //triggers
    $(document).off("click", "#btngrnno");
    $(document).off("click", "#cancelGRNPrint");
    $(document).on("click", "#btngrnno", function () {
        selectedcode = $("#goodsreceivednote_code").val();
        refreshtable();
    })
    $(document).on("click", "#cancelGRNPrint", function () {
        selectedcode = "";
        setValues();
    })

    //end of triggers
    $("#podiv").hide();
    formctrl();
    refreshtable();
});

