$(function () {
    //variables
    var appicongroupClassesInstence = appicongroupClasses.appicongroupClassesInstence();
    let appicongroup_col = appicongroupClassesInstence.appicongroup_service;
    let appicongroupobj = appicongroupClassesInstence.appicongroup;
    let appiconobj = appicongroupClassesInstence.appicon;
    var addmoddel = undefined;
    var selectedcode = undefined;
    var jwtPayload = undefined;
    var selectedappiconcode = undefined;
    var t = $("#table1").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t2 = $("#table2").DataTable({
        "order": [[0, "desc"]]
    });
    var t3 = $("#table3").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body appicon"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    //end of variables
    //functions
    //defalt functions

    // $.validator.setDefaults({

    // });
    $('#quickForm').validate({
        rules: {
            description: {
                required: true
            }

        },
        messages: {
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
            if (addmoddel && addmoddel != "modappicon") {

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
                                var code = $("#appicongroup_code").val();
                                var description = $("#appicongroup_description").val();
                                var status = "ACTIVE";
                                setNewValues(code, description, status);
                                submit();
                                Swal.fire(
                                    'Added!',
                                    'New record has been added.',
                                    'success'
                                )
                                break;
                            case "mod":
                                var code = undefined;
                                var description = $("#appicongroup_description").val();
                                var status = undefined;
                                setNewValues(code, description, status);
                                submit();
                                Swal.fire(
                                    'Modified!',
                                    'The record has been modified.',
                                    'success'
                                )
                                break;
                            case "del":
                                var code = undefined;
                                var description = undefined;
                                var status = "INACTIVE";
                                setNewValues(code, description, status);
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
    $('#quickForm2').validate({
        rules: {
            appicondescription: {
                required: true
            }
        },
        messages: {
            appicondescription: {
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
        },
        submitHandler: function () {
            if (addmoddel == "modappicon") {
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
                            case "modappicon":
                                var code = $("#appicon_code").val();
                                var description = $("#appicon_description").val();
                                var status = $("#appicon_status").val();
                                setNewAppIconValues(code, description, status);
                                submit();
                                Swal.fire(
                                    'Modified!',
                                    'The appicons list has been modified.',
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
    function getJwtPayload() {
        var parts = jwt.split('.');
        var encodedPayload = parts[1];
        var decodedPayload = atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'));
        var payload = JSON.parse(decodedPayload);
        return payload;
    }
    function refreshtable() {
        if (jwtPayload.businessRole == "ADMIN") {
            appicongroup_col.clear()
            addmoddel = undefined;
            // selectedappiconcode = undefined;
            t.clear().draw(false);
            $.ajax({
                url: "http://localhost:8080/api/appicongroupctrl/getappicongroups",
                dataType: "JSON",
                headers: {
                    "Authorization": jwt
                },
                crossDomain: true,
                success: function (data) {
                    $.each(data.content, function (i, item) {
                        $.each(item.appiconslist, function (i, item) {
                            appicongroup_col.addAppIcontoArry(item.id, item.description, item.code, item.status);
                        });
                        appicongroup_col.addAppIconGrouptoArray(item.id, item.code, item.description, item.status);
                        if (item.status == "ACTIVE")
                            t.row.add([item.code, item.description]).draw(false);
                    })
                    setValues();
                    fadepageloder();
                    var $tableRow = $("#table1 tr td:contains('" + selectedcode + "')").closest("tr");
                    $tableRow.trigger("click");

                },
                error: function (xhr, status, error) {
                    fadepageloder();
                }
            })
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'You don\'t have permission to perform this action.Please contact the Administrator.',
            });
        }

    }
    function submit() {
        showpageloder();
        var url;
        var method;

        switch (addmoddel) {
            case "add":
                url = "http://localhost:8080/api/appicongroupctrl/saveappicongroup";
                method = "POST";
                break;
            case "mod":
            case "modappicon":
                url = "http://localhost:8080/api/appicongroupctrl/updateappicongroup";
                method = "PUT";
                break;
            case "del":
                url = "http://localhost:8080/api/appicongroupctrl/activeinactiveappicongroup";
                method = "POST";
                break;
        }
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(appicongroupobj),
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
    function enablefillin(fillinid) {
        $(fillinid).prop("disabled", false)
    }
    function setValues(code) {
        t2.clear().draw(false);
        t3.clear().draw(false);
        formctrl();
        addmoddel = undefined;
        if (code) {
            appicongroupobj = appicongroup_col.getAppIconGroup(code);
            $("#appicongroup_code").val(appicongroupobj.code);
            $("#appicongroup_description").val(appicongroupobj.description);
            $("#appicongroup_status").val(appicongroupobj.status);

            $.each(appicongroupobj.appiconslist, function (i, item) {
                if (item.status == "ACTIVE")
                    t3.row.add([item.code, item.description]).draw(false);
            })
            setAppIconValues();
        } else {
            appicongroupobj = undefined;
            $("#appicongroup_code").val(undefined);
            $("#appicongroup_description").val(undefined);
            $("#appicongroup_status").val(undefined);
            setAppIconValues();
        }
    }
    function setAppIconValues(appicongroupcode, code) {
        formctrl();
        addmoddel = undefined;
        if (code) {
            appiconobj = appicongroup_col.getAppIcon(appicongroupcode, code);
            appiconobj.appIconGroup = undefined;
            $("#appicon_code").val(appiconobj.code);
            $("#appicon_description").val(appiconobj.description);
            $("#appicon_status").val(appiconobj.status);
        } else {
            appiconobj = undefined;
            $("#appicon_code").val(undefined);
            $("#appicon_description").val(undefined);
            $("#appicon_status").val(undefined);
        }
    }
    function setNewValues(code, description, status) {
        if (appicongroupobj) {
            if (code) appicongroupobj.code = code;
            if (description) appicongroupobj.description = description;
            if (status) appicongroupobj.status = status;
        } else {
            appicongroupobj = appicongroupClassesInstence.appicongroup;
            setNewValues(code, description, status);
        }
    }
    function setNewAppIconValues(code, description, status) {
        if (appiconobj) {
            if (code) appiconobj.code = code;
            if (description) appiconobj.description = description;
            if (status) appiconobj.status = status;
        } else {
            appiconobj = appicongroupClassesInstence.appicon;
            setNewAppIconValues(code, description, status);
            appicongroupobj.appiconslist.push(appiconobj);
        }

    }
    function resetform(element) {
        $(element).find(".invalid-feedback").remove();
        $(element).find(".is-invalid").removeClass("is-invalid");
        $(element).find(".is-valid").removeClass("is-valid");
    }
    //end of functions
    //triggers
    $('#table1 tbody').on('click', 'tr', function () {
        resetform("#quickForm");
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            setValues();
            selectedcode = "";
        } else {
            t.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            selectedcode = $(this).children("td:nth-child(1)").text();
            setValues($(this).children("td:nth-child(1)").text());

        }
    });
    $('#table3 tbody').on('click', 'tr', function () {
        resetform("#quickForm02");
        if (appicongroupobj.appiconslist.length != 0) {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                setAppIconValues();
                selectedappiconcode = "";
            } else {
                t3.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                selectedappiconcode = $(this).children("td:nth-child(1)").text();
                setAppIconValues(selectedcode, $(this).children("td:nth-child(1)").text());
            }
        }
    });

    $(document).off("click", "#addAppIconGroups");
    $(document).off("click", "#addAppIcons");
    $(document).off("click", "#setAppIconGroups");
    $(document).off("click", "#setAppIcons");
    $(document).off("click", "#removaAppIconGroups");
    $(document).off("click", "#removaAppIcons");

    $(document).on("click", "#addAppIconGroups", function () {
        selectedcode = "";
        setValues(undefined);
        addmoddel = "add";
        let grplist = appicongroup_col.allAppIconGroup()
        let grpcode = appicongroupClassesInstence.AppIconGroupSerial.genarateAppIconGroupCode(grplist.length);
        $("#appicongroup_code").val(grpcode);
        $("#table1 tbody tr").removeClass('selected');
        enablefillin("#appicongroup_description");
        $("#appicongroup_status").val("ACTIVE");
    });
    $(document).on("click", "#addAppIcons", function () {
        if (selectedcode) {
            let appiconcode = appicongroupClassesInstence.AppIconGroupSerial.genarateAppIconCode(appicongroupobj.appiconslist.length, appicongroupobj.code);
            selectedappiconcode = "";
            setAppIconValues();
            addmoddel = "modappicon";
            $("#table3 tbody tr").removeClass('selected');
            enablefillin("#appicon_description");
            $("#appicon_code").val(appiconcode);
            $("#appicon_status").val("ACTIVE");
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select an app icon group!',
            })
        }
    });
    $(document).on("click", "#setAppIconGroups", function () {
        if (selectedcode) {
            setValues(selectedcode);
            addmoddel = "mod";
            enablefillin("#appicongroup_description");
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select an app icon group!',
            })
        }
    });
    $(document).on("click", "#setAppIcons", function () {
        if (selectedappiconcode) {
            setAppIconValues(selectedcode, selectedappiconcode);
            addmoddel = "modappicon";
            enablefillin("#appicon_description");
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select a  appicon!',
            })
        }
    });
    $(document).on("click", "#removaAppIconGroups", function () {
        if (selectedcode) {
            if (appicongroupobj.status != "INACTIVE") {
                setValues(selectedcode);
                addmoddel = "del";
                $("#appicongroup_status").val("INACTIVE");
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'The app icon group you are attempting to delete is currently inactive!',
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select an app icon group!',
            })
        }
    });
    $(document).on("click", "#removaAppIcons", function () {
        if (selectedappiconcode) {
            if (appiconobj.status != "INACTIVE") {
                setAppIconValues(selectedcode, selectedappiconcode);
                addmoddel = "modappicon";
                $("#appicon_status").val("INACTIVE");
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'The appicon you are attempting to delete is currently inactive!',
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select an appicon!',
            })
        }
    });
    //end of triggers
    jwtPayload = getJwtPayload();
    formctrl();
    refreshtable();

});

