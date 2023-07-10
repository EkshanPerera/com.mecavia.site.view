$(function () {
    //variables
    var materialClassesInstence = materialClasses.materialClassesInstence();
    let material_col = materialClassesInstence.material_service;
    let materialobj = materialClassesInstence.material;
    var uomClassesInstence = uomClasses.uomClassesInstence()
    let uom_col = uomClassesInstence.uom_service;
    let uomobj = uomClassesInstence.uom;
    var addmoddel = undefined;
    var selectedcode = undefined;
    var jwtPayload = undefined;
    var t12 = $("#table12").DataTable({
        "order": [[0, "desc"]],
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t13 = $("#table13").DataTable({
        "autoWidth": false,
        "columns": [
            { "width": "30%" },
            null,
        ],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body popup"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
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
            if (uomobj) {
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
                                    selectedcode = code;
                                    if (uomobj) uomid = uomobj;
                                    else uomid = undefined;
                                    setNewValues(code, materialType, description, uomid, status);
                                    submit();

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

                                    break;
                                case "del":
                                    var code = undefined;
                                    var materialType = undefined;
                                    var description = undefined;
                                    var status = "INACTIVE";
                                    var uomid = undefined;
                                    setNewValues(code, materialType, description, uomid, status);
                                    submit();
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
    function getJwtPayload() {
        var parts = jwt.split('.');
        var encodedPayload = parts[1];
        var decodedPayload = atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'));
        var payload = JSON.parse(decodedPayload);
        return payload;
    }
    function refreshtable() {
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI00509") != undefined || jwtPayload.businessRole == "ADMIN") {
            material_col.clear();
            uom_col.clear();
            addmoddel = undefined;
            t12.clear().draw(false);
            $.ajax({
                url: "http://localhost:8080/api/materialctrl/getmaterials",
                dataType: "JSON",
                headers: {
                    "Authorization": jwt
                },
                success: function (data) {
                    $.each(data.content, function (i, item) {
                        material_col.addMaterialtoArray(item.id, item.code, item.description, item.materialType, item.uomid, item.status, item.price);
                        if (item.status == "ACTIVE") t12.row.add([item.code, item.description]).draw(false);
                    })
                    setValues();
                    fadepageloder();
                    var $tableRow = $("#table12 tr td:contains('" + selectedcode + "')").closest("tr");
                    $tableRow.trigger("click");
                    refreshuomtable();

                },
                error: function (xhr, status, error) {
                    fadepageloder();
                }
            })
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI00509)',
            });
        }
    }
    //definded functions
    function refreshuomtable() {
        uom_col.clear()
        addmoddel = undefined;
        t13.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/uomctrl/getuoms",
            dataType: "JSON",
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                $.each(data.content, function (i, item) {
                    uom_col.addUOMtoArray(item.id, item.code, item.scode, item.description, item.status);
                    if (item.status == "ACTIVE") {
                        t13.row.add([item.code, item.scode]).draw(false);
                    }
                })
            }
        })
    }
    function submit() {
        showpageloder();
        var url;
        var method;
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
            headers: {
                "Authorization": jwt
            },
            success: function (data) {
                switch (addmoddel) {
                    case "add":
                        Swal.fire(
                            'Added!',
                            'New record has been added.',
                            'success'
                        )
                        break;
                    case "mod":
                        Swal.fire(
                            'Modified!',
                            'The record has been modified.',
                            'success'
                        )
                        break;
                    case "del":
                        Swal.fire(
                            'Deleted!',
                            'The record has been deleted.',
                            'success'
                        )
                        break;
                }
                refreshtable();
            }, error: function (xhr, status, error) {
                Swal.fire(
                    'Error!',
                    'Please contact the Administator',
                    'error'
                )
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
            uomobj = undefined;
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
    function fillter(type) {
        if (type != "") {
            t12.clear().draw(false);
            var fillteredarry = material_col.allMaterial().filter(material => (material.materialType == type));
            $.each(fillteredarry, function (i, item) {
                if (item.status == "ACTIVE") {
                    t12.row.add([item.code, item.description]).draw(false);
                }
            })
        } else {
            t12.clear().draw(false);
            var fillteredarry = material_col.allMaterial()
            $.each(fillteredarry, function (i, item) {
                if (item.status == "ACTIVE") {
                    t12.row.add([item.code, item.description]).draw(false);
                }
            })
        }
    }
    //end of functions
    //triggers
    $('#table12 tbody').on('click', 'tr', function () {
        resetform("#quickForm6");
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            setValues();
            selectedcode = "";
        } else {
            t12.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            selectedcode = $(this).children("td:nth-child(1)").text();
            setValues($(this).children("td:nth-child(1)").text());
        }
    });
    $('#table13 tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            setUOMValues();
        } else {
            t13.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            setUOMValues($(this).children("td:nth-child(1)").text());
        }
    });

    $(document).off("click", "#addMaterials");
    $(document).off("click", "#setMaterials");
    $(document).off("click", "#removaMaterials");
    $(document).off("click", "#cancelMat");
    $(document).off("click", "#filter_material_type");

    $(document).on("click", "#addMaterials", function () {
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05010") != undefined || jwtPayload.businessRole == "ADMIN") {
            selectedcode = "";
            setValues(undefined);
            addmoddel = "add";
            let materiallist = material_col.allMaterial()
            let materialcode = materialClassesInstence.MaterialSerial.genarateMaterialCode(materiallist.length);
            $("#material_code").val(materialcode);
            $("#table12 tbody tr").removeClass('selected');
            enablefillin("#material_type");
            enablefillin("#uombtn");
            enablefillin("#material_description");
            $("#material_status").val("ACTIVE");
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI05010)',
            });
        }
    });
    $(document).on("click", "#setMaterials", function () {
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05011") != undefined || jwtPayload.businessRole == "ADMIN") {
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
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI05011)',
            });
        }
    });
    $(document).on("click", "#removaMaterials", function () {
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05012") != undefined || jwtPayload.businessRole == "ADMIN") {
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
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI05012)',
            });
        }
    });
    $(document).on("click", "#cancelMat", function () {
        selectedcode = "";
        setValues();
    });
    $(document).on("click", "#filter_material_type", function () {
        fillter($("#filter_material_type").val());
    });
    //end of triggers
    jwtPayload = getJwtPayload();
    formctrl();
    refreshtable();

});

