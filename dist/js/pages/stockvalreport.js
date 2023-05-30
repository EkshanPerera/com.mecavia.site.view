$(function () {
    //variables
    var GeneralStoreDtosInstence = genaralStoreClasses.genaralStoreClassesInstence();
    let GeneralStoreDtos_col = GeneralStoreDtosInstence.GeneralStoreDto_service;
    let GeneralStoreDtosarr = [];
    var total = 0;
    var t18 = $("#table18").DataTable({
        "order": [[0, "desc"]],
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
                        var symbol = "Rs. ";
                        var num = $.fn.dataTable.render.number(',', '.', 2, symbol).display(data);
                        return '<div style="text-align: right;">' + num + '</div>';
                    } else {
                        return data;
                    }
                    
                },
                
            }
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
                   
                    // setNewValues(date);
                    // submit();
                    $("#podiv").show();
                    $("#podiv").print();
                    $("#podiv").hide();

                }
            })
        }
    });
    //definded functions
    function refreshtable() {
        t18.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/generalstorectrl/getgeneralstorelist",
            dataType: "JSON",
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                $.each(data.content, function (i, item) {
                    GeneralStoreDtos_col.addGeneralStoreDtostoArray(item.id,item.materialid,item.itemcount,item.status);
                });
                setValues();
                fadepageloder();
            }
        })
    }
    //definded functions
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
    function setValues() {
        total = 0;
        GeneralStoreDtosarr = GeneralStoreDtos_col.allGeneralStoreDtos();
        console.log(GeneralStoreDtosarr);
        t18.clear().draw(false);
        var dataset = "";
        $.each(GeneralStoreDtosarr, function (i, item) {
            if(item.materialid.status == "ACTIVE"){
            t18.row.add([item.materialid.code, item.materialid.description, item.itemcount, item.materialid.uomid.scode, item.materialid.price, item.itemcount*item.materialid.price]).draw(false);
            dataset += "<tr><td>" + (i+1) + "</td><td>" + item.materialid.code + "</td><td>" + item.materialid.description + "</td><td> <div style=\"text-align: right;\"> " + commaSeparateNumber(String(item.itemcount)) + "</div></td><td>" +  item.materialid.uomid.scode+ "</td><td><div style=\"text-align: right;\">Rs. " + commaSeparateNumber(String(item.materialid.price)) + "</div></td><td><div style=\"text-align: right;\">Rs. " + commaSeparateNumber(String(item.itemcount * item.materialid.price)) + "</div></td></tr>";
            }
            total+=(item.itemcount * item.materialid.price);
        })
        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        var day = new Date().getDate();
        var date = day + "/" + (parseInt(month) + 1) + "/" + year;
        $("#totamt").text(commaSeparateNumber(total));
        $("#reportdate").text(date)
        $("#potablebody").html(dataset);
        total = 0
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
    refreshtable();
});

