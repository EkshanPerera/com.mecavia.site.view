$(function () {
    //variables
    let product_col = new product_service();
    let productobj = new product();
    let productpriceobj = new productprice();
    var addmoddel;
    var selectedcode;
    var t13 = $("#table13").DataTable({
        "order": [[ 0, "desc" ]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t14 = $("#table14").DataTable({
        "order": [[ 0, "desc" ]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });

    //end of variables
    //functions
    //defalt functions

    // $.validator.setDefaults({ 
    // });
    $('#quickForm7').validate({
        rules: {
            productdescription: {
                required: true
            },
            productname: {
                required: true
            }

        },
        messages: {
            productdescription: {
                required: "Please fillout description!"
            },
            productname: {
                required: "Please select the type"
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
                if (addmoddel) {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, save it!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            switch (addmoddel) {
                                case "add":
                                    var code = $("#product_code").val();
                                    var name = $("#product_name").val();
                                    var description = $("#product_description").val();
                                    var status = "ACTIVE";
                                    setNewValues(code, name, description, status);
                                    submit();
                                    Swal.fire(
                                        'Added!',
                                        'New record has been added.',
                                        'success'
                                    )
                                    break;
                                case "mod":
                                    var code = undefined;
                                    var name = $("#product_name").val();
                                    var description = $("#product_description").val();
                                    var status = undefined;
                                    setNewValues(code, name, description, status);
                                    submit();
                                    Swal.fire(
                                        'Modified!',
                                        'The record has been modified.',
                                        'success'
                                    )
                                    break;
                                case "del":
                                    var code = undefined;
                                    var name = undefined;
                                    var description = undefined;
                                    var status = "INACTIVE";
                                    setNewValues(code, name, description, status);
                                    submit();
                                    Swal.fire(
                                        'Deleted!',
                                        'The record has been deleted.',
                                        'success'
                                    )
                                    break;
                                default:
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'In order to save, please complete the operation first.',
                                    });
                            }
                        }
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'In order to save, please complete the operation first.',
                    });
                }
        }
    });
    $('#quickForm8').validate({
        rules: {
            productpriceamt: {
                required: true
            }
          
        },
        messages: {
            productpriceamt: {
                required: "Please fillout the amount!"
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
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, save it!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            switch (addmoddel) {
                                case "addprice":
                                    var code = $("#product_price_code").val();
                                    var price = $("#product_price_amt").val();
                                    var effectiveDate = $("#product_price_eff").val();
                                    var status = "ACTIVE";
                                    setNewPriceValues(code,price,effectiveDate,status);
                                    submit();
                                    Swal.fire(
                                        'Addes!',
                                        'The price list of the product has been updated.',
                                        'success'
                                    )
                                    break;
                                default:
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'In order to save, please complete the operation first.',
                                    });
                            }
                        }
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'In order to save, please complete the operation first.',
                    });
                }
        }
    });
    //definded functions
    
    function refreshtable() {
        product_col.clear();
        addmoddel = undefined;
        t13.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/productctrl/getproducts",
            dataType: "JSON",
            success: function (data) {
                $.each(data.content, function (i, item) {
                    product_col.addProducttoArray(item.id,item.code,item.desc,item.name,item.status,item.pricelist);
                    t13.row.add([item.code, item.name]).draw(false);
                });
                setValues();
                var $tableRow = $("#table13 tr td:contains('" + selectedcode + "')").closest("tr");
                $tableRow.trigger("click");
            }
        })
    }
    //definded functions
 
    function submit() {
        var url;
        var method;
        var token = localStorage.getItem("jwt_token");
        switch (addmoddel) {
            case "add":
                url = "http://localhost:8080/api/productctrl/saveproduct";
                method = "POST";
                break;
            case "mod":
            case "addprice":
                url = "http://localhost:8080/api/productctrl/updateproduct";
                method = "PUT";
                break;
            case "del":
                url = "http://localhost:8080/api/productctrl/activeinactiveproduct";
                method = "POST";
                break;
        }
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(productobj),
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
    function setValues(code) {
        formctrl();
        t14.clear().draw(false);
        addmoddel = undefined;
        if (code) {
            productobj = product_col.getProduct(code);
            $("#product_code").val(productobj.code);
            $("#product_name").val(productobj.name);
            $("#product_description").val(productobj.desc);
            $("#product_status").val(productobj.status);
            $.each(productobj.pricelist,function(i,item){
                t14.row.add([item.code,item.price,item.effectiveDate,item.status]).draw(false);
            })
            setProductpricevalues();
        } else {
            productobj = undefined;
            t14.clear().draw(false);
            $("#product_code").val(undefined);
            $("#product_name").val(undefined);
            $("#product_uomid").val(undefined);
            $("#product_description").val(undefined);
            $("#product_status").val(undefined);
            setProductpricevalues();
        }
    }
    function setProductpricevalues() {
        formctrl();
        productpriceobj = undefined;
        $("#product_price_code").val(undefined);
        $("#product_price_amt").val(undefined);
        $("#product_price_eff").val(undefined);
        $("#product_price_status").val(undefined);
        
    }
    function setNewValues(code, name, description, status) {
        if (productobj) {
            if (code) productobj.code = code;
            if (name) productobj.name = name;
            if (description) productobj.desc = description;
            if (status) productobj.status = status;
        } else {
            productobj = new product();
            setNewValues(code, name, description, status);
        }
    }
    function setNewPriceValues(code,price,effectiveDate,status){
        productpriceobj = new productprice();
        if(productobj.pricelist.length!=0){
            productobj.pricelist = productobj.pricelist.map(priceobj => {
                if(priceobj.status === "ACTIVE"){
                    return{...priceobj,status:"INACTIVE"}
                }
                return priceobj;
            })
        }
        if(code)productpriceobj.code = code; 
        if(price)productpriceobj.price = price; 
        if(effectiveDate)productpriceobj.effectiveDate = effectiveDate; 
        if(status)productpriceobj.status = status; 
        productobj.pricelist.push(productpriceobj);

    }

    function resetform(element) {
        $(element).find(".invalid-feedback").remove();
        $(element).find(".is-invalid").removeClass("is-invalid");
        $(element).find(".is-valid").removeClass("is-valid");
    }
    //end of functions
    //triggers
    $('#table13 tbody').on('click', 'tr', function () {
        resetform("#quickForm7");
        resetform("#quickForm8");
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            setValues();
            selectedcode = "";
        } else {
            t13.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            selectedcode = $(this).children("td:nth-child(1)").text();
            setValues($(this).children("td:nth-child(1)").text());
        }
    });

    $(document).on("click", "#addProducts", function () {
        selectedcode = "";
        setValues(undefined);
        addmoddel = "add";
        let productlist = product_col.allProduct()
        let productcode = new ProductSerial().genarateProductCode(productlist.length);
        $("#product_code").val(productcode);
        $("#table13 tbody tr").removeClass('selected');
        enablefillin("#product_name");
        enablefillin("#product_description");
        $("#product_status").val("ACTIVE");
    });
    $(document).on("click", "#addProductPrice", function () {
        addmoddel = "addprice";
        setProductpricevalues();
        let productcode = new ProductSerial().genarateProductPriceCode(productobj.pricelist.length,productobj.code);
        enablefillin("#product_price_amt");
        var year = new Date().getFullYear();
        var month =  new Date().getMonth();
        var day = new Date().getDate();
        var date = day + "/" + (parseInt(month) + 1) + "/" + year;
        $("#product_price_eff").val(date);
        $("#product_price_code").val(productcode);
        $("#product_price_status").val("ACTIVE");
    });
    
    $(document).on("click", "#setProducts", function () {
        if (selectedcode) {
            setValues(selectedcode);
            addmoddel = "mod";
            enablefillin("#product_name");
            enablefillin("#product_description");
            enablefillin("#uombtn");
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select a product!',
            })
        }
    });
    $(document).on("click", "#removaProducts", function () {
        if (selectedcode) {
            if (productobj.status != "INACTIVE") {
                setValues(selectedcode);
                addmoddel = "del";
                $("#product_status").val("INACTIVE");
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'The product you are attempting to delete is currently inactive!',
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select a product!',
            })
        }
    });
    //end of triggers
    formctrl();
    refreshtable();
});

