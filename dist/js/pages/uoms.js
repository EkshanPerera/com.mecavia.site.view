$(function () {
    //variables
    var uomClassesInstence = uomClasses.uomClassesInstence()
    let uom_col = uomClassesInstence.uom_service;
    let uomobj = uomClassesInstence.uom;
    var addmoddel = undefined;
    var selectedcode = undefined;
    var jwtPayload = undefined;
    var t16 = $("#table16").DataTable({
        "order": [[0, "desc"]],
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    //end of variables
    //functions
    //defalt functions

    // $.validator.setDefaults({ 
    // });
    $('#quickForm6').validate({
        rules: {
            uomcode: {
                required: true
            },

            uomdescription: {
                required: true
            }

        },
        messages: {
            uomcode: {
                required: "Please fillout the code!"
            },
            description: {
                required: "Please fillout description!"
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
                            case "add":
                                var code = $("#uom_code").val();
                                var scode = $("#uom_scode").val();
                                var description = $("#uom_description").val();
                                var status = "ACTIVE";
                                selectedcode = code;
                                setNewValues(code, scode, description, status);
                                submit();
                                break;
                            case "mod":
                                var code = undefined;
                                var scode = $("#uom_scode").val();
                                var description = $("#uom_description").val();
                                var status = undefined;
                                setNewValues(code, scode, description, status);
                                submit();

                                break;
                            case "del":
                                var code = undefined;
                                var scode = undefined;
                                var description = undefined;
                                var status = "INACTIVE";
                                setNewValues(code, scode, description, status);
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
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05021") != undefined || jwtPayload.businessRole == "ADMIN") {
            uom_col.clear()
            addmoddel = undefined;
            t16.clear().draw(false);
            $.ajax({
                url: "http://localhost:8080/api/uomctrl/getuoms",
                dataType: "JSON",
                headers: {
                    "Authorization": jwt
                },
                success: function (data) {
                    $.each(data.content, function (i, item) {
                        uom_col.addUOMtoArray(item.id, item.code, item.scode, item.description, item.status);
                        if (item.status == "ACTIVE") t16.row.add([item.code, item.scode, item.description]).draw(false);
                    })
                    setValues();
                    var $tableRow = $("#table16 tr td:contains('" + selectedcode + "')").closest("tr");
                    $tableRow.trigger("click");
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
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI05021)',
            });
        }
    }
    function submit() {
        showpageloder();
        var url;
        var method;

        switch (addmoddel) {
            case "add":
                url = "http://localhost:8080/api/uomctrl/saveuom";
                method = "POST";
                break;
            case "mod":
                url = "http://localhost:8080/api/uomctrl/updateuom";
                method = "PUT";
                break;
            case "del":
                url = "http://localhost:8080/api/uomctrl/activeinactiveuom";
                method = "POST";
                break;
        }
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(uomobj),
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
            uomobj = uom_col.getUOM(code);
            $("#uom_code").val(uomobj.code);
            $("#uom_scode").val(uomobj.scode);
            $("#uom_description").val(uomobj.description);
            $("#uom_status").val(uomobj.status);
        } else {
            uomobj = undefined;
            $("#uom_code").val(undefined);
            $("#uom_scode").val(undefined);
            $("#uom_description").val(undefined);
            $("#uom_status").val(undefined);

        }
    }
    function setNewValues(code, scode, description, status) {
        if (uomobj) {
            if (code) uomobj.code = code;
            if (scode) uomobj.scode = scode;
            if (description) uomobj.description = description;
            if (status) uomobj.status = status;
        } else {
            uomobj = uomClassesInstence.uom;
            setNewValues(code, scode, description, status);
        }
    }
    function resetform(element) {
        $(element).find(".invalid-feedback").remove();
        $(element).find(".is-invalid").removeClass("is-invalid");
        $(element).find(".is-valid").removeClass("is-valid");
    }
    //end of functions
    //triggers
    $('#table16 tbody').on('click', 'tr', function () {
        resetform("#quickForm6");
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            setValues();
            selectedcode = "";
        } else {
            t16.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            selectedcode = $(this).children("td:nth-child(1)").text();
            setValues($(this).children("td:nth-child(1)").text());
        }
    });
    $(document).off("click", "#addUOMs");
    $(document).off("click", "#setUOMs");
    $(document).off("click", "#removaUOMs");
    $(document).off("click", "#cancelUOM");

    $(document).on("click", "#addUOMs", function () {
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05017") != undefined || jwtPayload.businessRole == "ADMIN") {
            selectedcode = "";
            setValues(undefined);
            addmoddel = "add";
            let uomlist = uom_col.allUOM()
            let uomcode = uomClassesInstence.UOMSerial.genarateUOMCode(uomlist.length);
            $("#uom_code").val(uomcode);
            $("#table16 tbody tr").removeClass('selected');
            enablefillin("#uom_scode");
            enablefillin("#uom_description");
            $("#uom_status").val("ACTIVE");
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI05017)',
            });
        }
    });
    $(document).on("click", "#setUOMs", function () {
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05018") != undefined || jwtPayload.businessRole == "ADMIN") {
            if (selectedcode) {
                setValues(selectedcode);
                addmoddel = "mod";
                enablefillin("#uom_scode");
                enablefillin("#uom_description");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please select a record!',
                })
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI05018)',
            });
        }
    });
    $(document).on("click", "#removaUOMs", function () {
        if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05019") != undefined || jwtPayload.businessRole == "ADMIN") {
            if (selectedcode) {
                if (uomobj.status != "INACTIVE") {
                    setValues(selectedcode);
                    addmoddel = "del";
                    $("#uom_status").val("INACTIVE");
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Warning!',
                        text: 'The record you are attempting to delete is currently inactive!',
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please select a record!',
                })
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI05019)',
            });
        }
    });
    $(document).on("click", "#cancelUOM", function () {
        selectedcode = "";
        setValues();
    });

    //end of triggers
    jwtPayload = getJwtPayload();
    formctrl();
    refreshtable();

});

