$(function () {
    //variables
    var materialClassesInstence = materialClasses.materialClassesInstence();
    let material_col = materialClassesInstence.material_service;
    let materialobj = materialClassesInstence.material;
    var uomClassesInstence = uomClasses.uomClassesInstence()
    let uom_col = uomClassesInstence.uom_service;
    let uomobj = uomClassesInstence.uom;
    var addmoddel;
    var selectedcode;
    var t8 = $("#table8").DataTable({
        "order": [[ 0, "desc" ]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t7 = $("#table7").DataTable({
        "order": [[ 0, "desc" ]]
    });
    //end of variables
    //functions
    //defalt functions

    // $.validator.setDefaults({ 
    // });
    $('#quickForm7').validate({
        rules: {
            materialdescription: {
                required: true
            },
            materialtype: {
                required: true
            }

        },
        messages: {
            materialdescription: {
                required: "Please fillout description!"
            },
            materialtype: {
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
            if (uomobj.id) {
                console.log(uomobj);
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
                                    var code = $("#material_code").val();
                                    var materialType = $("#material_type").val();
                                    var description = $("#material_description").val();
                                    var status = "ACTIVE";
                                    var uomid;
                                    if (uomobj) uomid = uomobj;
                                    else uomid = undefined;
                                    setNewValues(code, materialType, description, uomid, status);
                                    submit();
                                    Swal.fire(
                                        'Added!',
                                        'New record has been added.',
                                        'success'
                                    )
                                    break;
                                case "mod":
                                    var code = undefined;
                                    var materialType = $("#material_type").val();
                                    var description = $("#material_description").val();
                                    var status = undefined;
                                    var uomid;
                                    if (uomobj) uomid = uomobj;
                                    else uomid = undefined;
                                    setNewValues(code, materialType, description, uomid, status);
                                    submit();
                                    Swal.fire(
                                        'Modified!',
                                        'The record has been modified.',
                                        'success'
                                    )
                                    break;
                                case "del":
                                    var code = undefined;
                                    var materialType = undefined;
                                    var description = undefined;
                                    var status = "INACTIVE";
                                    var uomid = undefined;
                                    setNewValues(code, materialType, description, uomid, status);
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
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'In order to save, please select unit of measurement.',
                });
            }
        }
    });
    //definded functions
    
    function refreshtable() {
        material_col.clear();
        uom_col.clear();
        addmoddel = undefined;
        t8.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/materialctrl/getmaterials",
            dataType: "JSON",
            success: function (data) {
                $.each(data.content, function (i, item) {
                    material_col.addMaterialtoArray(item.id, item.code, item.description, item.materialType, item.uomid, item.status,item.price);
                    t8.row.add([item.code, item.description]).draw(false);
                })
                setValues();
                var $tableRow = $("#table8 tr td:contains('" + selectedcode + "')").closest("tr");
                $tableRow.trigger("click");
                refreshuomtable();
            }
        })
    }
    //definded functions
    function refreshuomtable() {
        uom_col.clear()
        addmoddel = undefined;
        t7.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/uomctrl/getuoms",
            dataType: "JSON",
            success: function (data) {
                $.each(data.content, function (i, item) {
                    uom_col.addUOMtoArray(item.id, item.code, item.scode, item.description, item.status);
                    t7.row.add([item.code, item.scode]).draw(false);
                })
            }
        })
    }
    function submit() {
        var url;
        var method;
        var token = localStorage.getItem("jwt_token");
        switch (addmoddel) {
            case "add":
                url = "http://localhost:8080/api/materialctrl/savematerial";
                method = "POST";
                break;
            case "mod":
                url = "http://localhost:8080/api/materialctrl/updatematerial";
                method = "PUT";
                break;
            case "del":
                url = "http://localhost:8080/api/materialctrl/activeinactivematerial";
                method = "POST";
                break;
        }
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(materialobj),
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
        addmoddel = undefined;
        if (code) {
            materialobj = material_col.getMaterial(code);
            $("#material_code").val(materialobj.code);
            $("#material_type").val(materialobj.materialType);
            $("#material_description").val(materialobj.description);
            $("#material_status").val(materialobj.status);
            if (materialobj.uomid) {
                uomobj = materialobj.uomid;
                $("#material_uomid").val(materialobj.uomid.scode + " - " + materialobj.uomid.description);
            }
        } else {
            materialobj = undefined;
            $("#material_code").val(undefined);
            $("#material_type").val(undefined);
            $("#material_uomid").val(undefined);
            $("#material_description").val(undefined);
            $("#material_status").val(undefined);

        }
    }
    function setUOMValues(code) {
        $("#modal-uomlist").modal("hide");
        if (code) {
            uomobj = uom_col.getUOM(code);
            $("#material_uomid").val(uomobj.scode + " - " + uomobj.description);
        } else {
            uomobj = undefined;
            $("#material_uomid").val(undefined);

        }
    }
    function setNewValues(code, materialType, description, uomid, status) {
        if (materialobj) {
            if (code) materialobj.code = code;
            if (materialType) materialobj.materialType = materialType;
            if (description) materialobj.description = description;
            if (description) materialobj.uomid = uomid;
            if (status) materialobj.status = status;
        } else {
            materialobj = materialClassesInstence.material;
            setNewValues(code, materialType, description, uomid, status);
        }
    }
    function resetform(element) {
        $(element).find(".invalid-feedback").remove();
        $(element).find(".is-invalid").removeClass("is-invalid");
        $(element).find(".is-valid").removeClass("is-valid");
    }
    //end of functions
    //triggers
    $('#table8 tbody').on('click', 'tr', function () {
        resetform("#quickForm6");
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            setValues();
            selectedcode = "";
        } else {
            t8.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            selectedcode = $(this).children("td:nth-child(1)").text();
            setValues($(this).children("td:nth-child(1)").text());
        }
    });
    $('#table7 tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            setUOMValues();
        } else {
            t7.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            setUOMValues($(this).children("td:nth-child(1)").text());
        }
    });
    $(document).on("click", "#addMaterials", function () {
        selectedcode = "";
        setValues(undefined);
        addmoddel = "add";
        let materiallist = material_col.allMaterial()
        let materialcode = materialClassesInstence.MaterialSerial.genarateMaterialCode(materiallist.length);
        console.log(material_col.allMaterial());
        $("#material_code").val(materialcode);
        $("#table8 tbody tr").removeClass('selected');
        enablefillin("#material_type");
        enablefillin("#uombtn");
        enablefillin("#material_description");
        $("#material_status").val("ACTIVE");
    });
    $(document).on("click", "#setMaterials", function () {
        if (selectedcode) {
            setValues(selectedcode);
            addmoddel = "mod";
            enablefillin("#material_type");
            enablefillin("#material_description");
            enablefillin("#uombtn");
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select a material!',
            })
        }
    });
    $(document).on("click", "#removaMaterials", function () {
        if (selectedcode) {
            if (materialobj.status != "INACTIVE") {
                setValues(selectedcode);
                addmoddel = "del";
                $("#material_status").val("INACTIVE");
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'The material you are attempting to delete is currently inactive!',
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select a material!',
            })
        }
    });
    //end of triggers
    formctrl();
    refreshtable();
});

