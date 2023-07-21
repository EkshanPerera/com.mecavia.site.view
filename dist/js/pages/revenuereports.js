$(function () {
    //variables
    var customerorderClassesInstence = customerorderClasses.customerorderClassesInstence()
    let customerorder_col = customerorderClassesInstence.customerorder_service;
    var purchaserequisitionClassesInstence = purchaserequisitionClasses.purchaserequisitionClassesInstence();
    let purchaserequisition_col = purchaserequisitionClassesInstence.purchaserequisition_service;
    let purchaserequisitioarr = [];
    let customerorderobjarr = [];
    var jwtPayload = undefined;
    var total = 0;
    var incomelist = new Array(12);
    var expencelist = new Array(12);
    var t18 = $("#table18").DataTable({
        pageLength: 12,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        "autoWidth": false,
        "ordering": false,
        columns: [
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
            },
            {
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        var num = $.fn.dataTable.render.number(',', '.', 2).display(data);
                        return '<div style="text-align: right;">' + num + ' % </div>';
                    } else {
                        return data;
                    }
                }
            },
        ]
    });
    const ctx = document.getElementById('myChart');
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
    $('#fromdt,#todt').datepicker({ dateFormat: 'yy-mm-dd' });

    //definded functions
    function getJwtPayload() {
        var parts = jwt.split('.');
        var encodedPayload = parts[1];
        var decodedPayload = atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'));
        var payload = JSON.parse(decodedPayload);
        return payload;
    }
    function refreshtable() {

        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI00602") != undefined || jwtPayload.businessRole == "ADMIN") {
            t18.clear().draw(false);
            $.ajax({
                url: "http://localhost:8080/api/customerorderctrl/getcustomerorders",
                dataType: "JSON",
                headers: {
                    "Authorization": jwt
                },
                success: function (data) {
                    $.each(data.content, function (i, item) {
                        if(item.status == "INVOICED"){
                            customerorder_col.addCustomerOrdertoArray(item.id, item.code, item.jobID, item.jobNumber, item.customerid, item.totalAmount, item.grossAmount, item.remark, item.customerOrderProducts, item.printeddate, item.status,item.enteredUser,item.enteredDate,item.acceptedUser,item.acceptedDate,item.invoices,item.inventoryItems);
                        }
                    });
                    $.ajax({
                        url: "http://localhost:8080/api/purchaserequisitionctrl/getpurchaserequisitions",
                        dataType: "JSON",
                        headers: {
                            "Authorization": jwt
                        },
                        success: function (data) {
                            $.each(data.content, function (i, item) {
                                if(item.status == "APPROVED" || item.status == "PRINTED"){
                                purchaserequisition_col.addPurchaseRequisitiontoArray(item.id, item.prcode, item.pocode, item.supplierid, item.status, item.remark, item.totalAmount, item.purchaseRequisitionMaterials,  item.printeddate, item.quotationno,item.enteredUser, item.printededUser, item.acceptedUser, item.poPrintededUser);
                                }
                            });
                            filter(new Date())
                            setValues();
                            fadepageloder();
                        }
                    })
                   
                }
            })
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI00602)',
            });
        }
    }

    //definded functions
   
    function filter(fromdate) {
        incomelist = new Array(12);
        expencelist = new Array(12);
        var fromDateObj = new Date(fromdate);
        customerorderobjarr = customerorder_col.allCustomerOrder();
        purchaserequisitioarr = purchaserequisition_col.allPurchaseEequisitions();
        console.log(purchaserequisitioarr)
        purchaserequisitioarr =  purchaserequisitioarr.filter(function (purchaserequisition) {
            var enterdDateObj = new Date(purchaserequisition.prprinteddate);
            return (
                fromDateObj.getUTCFullYear() == enterdDateObj.getUTCFullYear()
            );
        });
        customerorderobjarr = customerorderobjarr.filter(function (customerorder) {
            var enterdDateObj = new Date(customerorder.enteredDate);
            return (
                fromDateObj.getUTCFullYear() == enterdDateObj.getUTCFullYear()
            );
        });

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
    function setValues() {
        total = 0;
        t18.clear().draw(false);
        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        var day = new Date().getDate();
        var date = year + "-" + (parseInt(month) + 1) + "-" + day ;
        $("#fromdate").val(date)
        var dataset = "";
        var differenceprr = [];
        $.each(customerorderobjarr, function (i, item) {
            var enterdDateObj = new Date(item.enteredDate);
            if(incomelist[enterdDateObj.getMonth()] == undefined) incomelist[enterdDateObj.getMonth()] = 0;
            incomelist[enterdDateObj.getMonth()] += incomelist[enterdDateObj.getMonth()] + item.totalAmount;
        });
        $.each(purchaserequisitioarr, function (i, item) {
            var enterdDateObj = new Date(item.prprinteddate);
            if(expencelist[enterdDateObj.getMonth()] == undefined) expencelist[enterdDateObj.getMonth()] = 0;
            expencelist[enterdDateObj.getMonth()] += expencelist[enterdDateObj.getMonth()] + item.totalAmount;
        });
        $.each(months, function (ite, item) {
                var income = (incomelist[ite] !== undefined) ? incomelist[ite] : 0;
                var expense = (expencelist[ite] !== undefined) ? expencelist[ite] : 0;
                var absDifference = Math.abs(income - expense);
                var absDifferencepr = 0;
                if(income !== 0 )  absDifferencepr = (income - expense) / income;
                absDifferencepr = absDifferencepr.toFixed(2) 
                differenceprr.push(absDifferencepr);
                t18.row.add([item,income,expense,absDifference,absDifferencepr]).draw(false);
                dataset += "<tr><td>" + (ite + 1) + "</td><td>" + item + "</td><td><div style=\"text-align: right;\">Rs. " +commaSeparateNumber(String(income))+ "</div></td><td><div style=\"text-align: right;\">Rs. " + commaSeparateNumber(String(expense))+ "</div></td><td><div style=\"text-align: right;\">Rs. " +commaSeparateNumber(String(absDifference))+ "</div></td><td><div style=\"text-align: right;\">" +absDifferencepr+ " % </div></td></tr>";

        });
 
       

        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: months,
            datasets: [{
              label: '# of Votes',
              data: differenceprr,
              borderWidth: 1,
              backgroundColor: '#9BD0F5'
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });

        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        var day = new Date().getDate();
        var date = year + "-" + (parseInt(month) + 1) + "-" + day ;
        var customerordid = $("#customerordid").val();
        
        // $("#totamt").text(commaSeparateNumber(String(total)));
        $("#todate").text(fromdate);
        
        $("#potablebody").html(dataset);
        total = 0
    }
    //end of functions
    //triggers
    $(document).off("click", "#btnprmpo");
    $(document).off("click", "#cancelPRPrint");
    $(document).off("click", "#filter");

    $(document).on("click", "#btnprmpo", function () {
        selectedcode = $("#purchaserequisition_code").val();
        refreshtable();
    })
    $(document).on("click", "#cancelPRPrint", function () {
        selectedcode = "";
        $("#customerordid").val("");
        $("#jobno").val("");
        $("#status").val("");
        $("#fromdate").val("");
        $("#todt").val("");
        filter(new Date())
        setValues();
    })
    $(document).on("click", "#filter", function () {
        var fromdate = $("#fromdate").val();
        filter(fromdate);
        setValues();
        Swal.fire(
            'Added!',
            'Data Filter has been added',
            'success'
        )
    })

    //end of triggers
    jwtPayload = getJwtPayload();
    $("#podiv").hide();
    refreshtable();

});

