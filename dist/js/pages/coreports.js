$(function () {
    //variables
    var customerorderClassesInstence = customerorderClasses.customerorderClassesInstence()
    let customerorder_col = customerorderClassesInstence.customerorder_service;
    let customerorderobjarr = [];
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
            url: "http://localhost:8080/api/customerorderctrl/getcustomerorders",
            dataType: "JSON",
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                $.each(data.content, function (i, item) {
                    customerorder_col.addCustomerOrdertoArray(item.id,item.code,item.jobID,item.jobNumber,item.customerid,item.totalAmount,item.grossAmount,item.remark,item.customerOrderProducts,item.printeddate,item.status);
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
        customerorderobjarr = customerorder_col.allCustomerOrder();
        console.log(customerorderobjarr);
        t18.clear().draw(false);
        var dataset = "";
        $.each(customerorderobjarr, function (i, item) {
            // if(item.materialid.status == "ACTIVE"){
            // t18.row.add([item.materialid.code, item.materialid.description, item.itemcount, item.materialid.uomid.scode, item.materialid.price, item.itemcount*item.materialid.price]).draw(false);
            var copdataset = "";
            // var totfinishedcoutset = ""; 
            var quantityset = ""; 
            var brset;
            $.each(item.customerOrderProducts,function(i,itemcop){
                if((i+1) < item.customerOrderProducts.length) brset = "<br>";
                else brset = ""; 
                copdataset += itemcop.product.code + brset;
                quantityset += commaSeparateNumber(String(itemcop.quantity))  + brset;
                // totfinishedcoutset += commaSeparateNumber(String(itemprm.totArrivedCount)) + itemprm.material.uomid.scode + brset;
            })
            dataset += "<tr><td>" + (i+1) + "</td><td>" + item.code + "</td><td>" + item.jobID + "</td><td>" + item.jobNumber + "</td><td>" + item.customerid.firstname + " " + item.customerid.lastname + "</td><td>" + copdataset + "</td><td><div style=\"text-align: right;\"> " + quantityset + "</div></td><td><div style=\"text-align: right;\"> Rs." + commaSeparateNumber(String(item.totalAmount)) + "</div></td><td>" + item.printeddate + "</td></td><td>" + item.status + "</td></tr>";
        })
        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        var day = new Date().getDate();
        var date = day + "/" + (parseInt(month) + 1) + "/" + year;
        $("#totamt").text(commaSeparateNumber(String(total)));
        $("#todate").text(date)
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

