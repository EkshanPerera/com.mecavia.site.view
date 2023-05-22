$(function () {
    //variables
    var usergroupClassesInstence = usergroupClasses.usergroupClassesInstence();
    let grp_col = usergroupClassesInstence.usr_grp_service;
    let usr_grpobj = usergroupClassesInstence.usr_grp;
    let usr_roleobj = usergroupClassesInstence.user_role;
    var addmoddel;
    var selectedcode;
    var selectedrolecode;
    var t = $("#table1").DataTable({
        "order": [[ 0, "desc" ]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t2 = $("#table2").DataTable({
        "order": [[ 0, "desc" ]]
    });
    var t3 = $("#table3").DataTable({
        "order": [[ 0, "desc" ]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body role"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
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
        },submitHandler: function () {
            if (addmoddel && addmoddel!="modrole" ) {

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
                                var code = $("#usr_grp_code").val();
                                var description = $("#usr_grp_description").val();
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
                                var description = $("#usr_grp_description").val();
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
            roledescription: {
                required: true
            }
        },
        messages: {
            roledescription: {
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
            if (addmoddel == "modrole") {
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
                            case "modrole":
                                var code = $("#usr_role_code").val();
                                var description = $("#usr_role_description").val();
                                var status = $("#usr_role_status").val();
                                setNewRoleValues(code, description, status);
                                submit();
                                Swal.fire(
                                    'Modified!',
                                    'The user roles list has been modified.',
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
        grp_col.clear()
        addmoddel = undefined;
        selectedrolecode = undefined;
        t.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/usergroupctrl/getusergroups",
            dataType: "JSON",
            success: function (data) {
                $.each(data.content, function (i, item) {
                    $.each(item.userslist, function (i, item) {
                        if (item.status = "ACTIVE") grp_col.addUsertoArry(item.code, item.firstname, item.lastname, item.email, item.businessRole, item.status);
                    });
                    $.each(item.roleslist, function (i, item) {
                        grp_col.addRoletoArry(item.id, item.description, item.code, item.status);
                    });
                    grp_col.addUsrGrptoArray(item.id, item.code, item.description, item.status);
                    if(item.status == "ACTIVE")
                    t.row.add([item.code, item.description]).draw(false);
                })
                setValues();
                var $tableRow = $("#table1 tr td:contains('" + selectedcode + "')").closest("tr");
                $tableRow.trigger("click");
            }
        })
    }
    function submit() {
        var url;
        var method;
        var token = localStorage.getItem("jwt_token");
        switch (addmoddel) {
            case "add":
                url = "http://localhost:8080/api/usergroupctrl/saveusergroup";
                method = "POST";
                break;
            case "mod":
            case "modrole":
                url = "http://localhost:8080/api/usergroupctrl/updateusergroup";
                method = "PUT";
                break;
            case "del":
                url = "http://localhost:8080/api/usergroupctrl/activeinactiveusergroup";
                method = "POST";
                break;
        }
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(usr_grpobj),
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
        t2.clear().draw(false);
        t3.clear().draw(false);
        formctrl();
        addmoddel = undefined;
        if (code) {
            usr_grpobj = grp_col.getUsrGrp(code);
            $("#usr_grp_code").val(usr_grpobj.code);
            $("#usr_grp_description").val(usr_grpobj.description);
            $("#usr_grp_status").val(usr_grpobj.status);
            $.each(usr_grpobj.userslist, function (i, item) {
                t2.row.add([item.code, item.firstname, item.lastname, item.email, item.role]).draw(false);
            })
            $.each(usr_grpobj.roleslist, function (i, item) {
                if(item.status == "ACTIVE")
                t3.row.add([item.code, item.description]).draw(false);
            })
            setRoleValues();
        } else {
            usr_grpobj = undefined;
            selectedcode = undefined;
            $("#usr_grp_code").val(undefined);
            $("#usr_grp_description").val(undefined);
            $("#usr_grp_status").val(undefined);
            setRoleValues();
        }
    }
    function setRoleValues(usergrpcode, code) {
        formctrl();
        addmoddel = undefined;
        if (code) {
            usr_roleobj = grp_col.getUserRole(usergrpcode, code);
            $("#usr_role_code").val(usr_roleobj.code);
            $("#usr_role_description").val(usr_roleobj.description);
            $("#usr_role_status").val(usr_roleobj.status);
        } else {
            usr_roleobj = undefined;
            $("#usr_role_code").val(undefined);
            $("#usr_role_description").val(undefined);
            $("#usr_role_status").val(undefined);
        }
    }
    function setNewValues(code, description, status) {
        if (usr_grpobj) {
            if (code) usr_grpobj.code = code;
            if (description) usr_grpobj.description = description;
            if (status) usr_grpobj.status = status;
        } else {
            usr_grpobj = usergroupClassesInstence.usr_grp;
            setNewValues(code, description, status);
        }
    }
    function setNewRoleValues(code, description, status) {
        if (usr_roleobj) {
            if (code) usr_roleobj.code = code;
            if (description) usr_roleobj.description = description;
            if (status) usr_roleobj.status = status;
        } else {
            usr_roleobj = usergroupClassesInstence.user_role;
            setNewRoleValues(code, description, status);
            usr_grpobj.roleslist.push(usr_roleobj);
        }

    }
    function resetform(element){
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
        if (usr_grpobj.roleslist.length != 0) {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                setRoleValues();
                selectedrolecode = "";
            } else {
                t3.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                selectedrolecode = $(this).children("td:nth-child(1)").text();
                setRoleValues(selectedcode, $(this).children("td:nth-child(1)").text());
            }
        }
    });
    $(document).on("click", "#addUserGroups", function () {
        selectedcode = "";
        setValues(undefined);
        addmoddel = "add";
        let grplist = grp_col.allUsrGrp()
        let grpcode = usergroupClassesInstence.UsrGrpSerial.genarateUserGroupCode(grplist.length);
        console.log(grp_col.allUsrGrp());
        $("#usr_grp_code").val(grpcode);
        $("#table1 tbody tr").removeClass('selected');
        enablefillin("#usr_grp_description");
        $("#usr_grp_status").val("ACTIVE");
    });
    $(document).on("click", "#addUserRoles", function () {
        if (selectedcode) {
            let rolecode = usergroupClassesInstence.UsrGrpSerial.genarateUserRoleCode(usr_grpobj.roleslist.length, usr_grpobj.code);
            selectedrolecode = "";
            setRoleValues();
            addmoddel = "modrole";
            $("#table3 tbody tr").removeClass('selected');
            enablefillin("#usr_role_description");
            $("#usr_role_code").val(rolecode);
            $("#usr_role_status").val("ACTIVE");
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select a user group!',
            })
        }
    });
    $(document).on("click", "#setUserGroups", function () {
        if (selectedcode) {
            setValues(selectedcode);
            addmoddel = "mod";
            enablefillin("#usr_grp_description");
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select a user group!',
            })
        }
    });
    $(document).on("click", "#setUserRoles", function () {
        if (selectedrolecode) {
            setRoleValues(selectedcode, selectedrolecode);
            addmoddel = "modrole";
            enablefillin("#usr_role_description");
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select a user role!',
            })
        }
    });
    $(document).on("click", "#removaUserGroups", function () {
        if (selectedcode) {
            if (usr_grpobj.status != "INACTIVE") {
                setValues(selectedcode);
                addmoddel = "del";
                $("#usr_grp_status").val("INACTIVE");
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'The user group you are attempting to delete is currently inactive!',
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select a user group!',
            })
        }
    });
    $(document).on("click", "#removaUserRoles", function () {
        if (selectedrolecode) {
            if (usr_roleobj.status != "INACTIVE") {
                setRoleValues(selectedcode, selectedrolecode);
                addmoddel = "modrole";
                $("#usr_role_status").val("INACTIVE");
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'The user role you are attempting to delete is currently inactive!',
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select a user role!',
            })
        }
    });
    //end of triggers
    formctrl();
    refreshtable();
});

