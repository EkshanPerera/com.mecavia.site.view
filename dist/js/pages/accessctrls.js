$(function () {
    //variables
    var usergroupClassesInstence = usergroupClasses.usergroupClassesInstence();
    let grp_col = usergroupClassesInstence.usr_grp_service;
    let usr_grpobj = usergroupClassesInstence.usr_grp;
    let usr_roleobj = usergroupClassesInstence.user_role;
    var appicongroupClassesInstence = appicongroupClasses.appicongroupClassesInstence();
    let appicongroup_col = appicongroupClassesInstence.appicongroup_service;
    let appicongroupobj = appicongroupClassesInstence.appicongroup;
    let appiconobj = appicongroupClassesInstence.appicon;
    var addmoddel = undefined;
    var selectedcode = undefined;
    var jwtPayload = undefined;
    var selectedrolecode = undefined;
    var selectedappicongroupcode = undefined;
    var selectedappiconcode = undefined;
    var acciconlist = [];
    var newacciconlist = [];
    var selectedremovingappiconcode = undefined;

    var t = $("#table1").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body popup"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t2 = $("#table2").DataTable({
        "order": [[0, "desc"]]
    });
    var t3 = $("#table3").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body popup"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t4 = $("#table4").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body popup"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t5 = $("#table5").DataTable({
        pageLength: 5,
        "autoWidth": false,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body popup"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t6 = $("#table6").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        "autoWidth": false,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body popup"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    //end of variables
    //functions
    //defalt functions

    // $.validator.setDefaults({

    // });
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
            if (selectedrolecode != undefined) {
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
                        setNewRoleValues();
                        submit();
                        Swal.fire(
                            'Modified!',
                            'The user roles list has been modified.',
                            'success'
                        )
                    }
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please select a user role!',
                })
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

            grp_col.clear()
            addmoddel = undefined;
            selectedrolecode = undefined;
            t.clear().draw(false);
            $.ajax({
                url: "http://localhost:8080/api/usergroupctrl/getusergroups",
                dataType: "JSON",
                headers: {
                    "Authorization": jwt
                },
                crossDomain: true,
                success: function (data) {
                    $.each(data.content, function (i, item) {
                        $.each(item.userslist, function (i, item) {
                            if (item.status = "ACTIVE") grp_col.addUsertoArry(item.id, item.code, item.firstname, item.lastname, item.email, item.businessRole, item.status);
                        });
                        $.each(item.roleslist, function (i, item) {
                            grp_col.addRoletoArry(item.id, item.description, item.code, item.status, item.accIconList);
                        });
                        grp_col.addUsrGrptoArray(item.id, item.code, item.description, item.status);
                        if (item.status == "ACTIVE")
                            t.row.add([item.code, item.description]).draw(false);
                    })
                    setValues();
                    fadepageloder();
                    refreshappicongrouptable();

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
    function refreshappicongrouptable() {
        appicongroup_col.clear()
        addmoddel = undefined;
        selectedappicongroupcode = undefined;
        t4.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/appicongroupctrl/getappicongroups",
            dataType: "JSON",
            headers: {
                "Authorization": jwt
            },
            crossDomain: true,
            success: function (data) {
                $.each(data.content, function (i, itemaig) {
                    $.each(itemaig.appiconslist, function (i, item) {
                        appicongroup_col.addAppIcontoArry(item.id, item.description, item.code, item.status, itemaig);
                    });
                    appicongroup_col.addAppIconGrouptoArray(itemaig.id, itemaig.code, itemaig.description, itemaig.status);
                    if (itemaig.status == "ACTIVE")
                        t4.row.add([itemaig.code, itemaig.description]).draw(false);
                })
                setAppiconGroupValues();
                fadepageloder();

            },
            error: function (xhr, status, error) {
                fadepageloder();
            }
        })

    }
    function submit() {
        showpageloder();
        url = "http://localhost:8080/api/usergroupctrl/updateusergroup";
        method = "PUT";
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(usr_grpobj),
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
    function setAppiconGroupValues(code) {
        t5.clear().draw(false);
        $("#modal-appicongrouplist").modal("hide");
        addmoddel = undefined;
        if (code) {
            appicongroupobj = appicongroup_col.getAppIconGroup(code);
            $("#appicongroup_id").val(appicongroupobj.code + " - " + appicongroupobj.description)
            $.each(appicongroupobj.appiconslist, function (i, item) {
                if (item.status == "ACTIVE")
                    t5.row.add([item.code, item.description]).draw(false);
            })
            setAppIconValues();
        } else {
            appicongroupobj = undefined;
            selectedappicongroupcode = undefined;
            $("#appicongroup_id").val(undefined)

            setAppIconValues();
        }
    }
    function setAppIconValues(appicongroupcode, code) {
        addmoddel = undefined;
        if (code) {
            appiconobj = appicongroup_col.getAppIcon(appicongroupcode, code);
        } else {
            appiconobj = undefined;
            selectedappiconcode = undefined;
        }
    }
    function removeAppIconValues(code) {
        if (code) {
            acciconlist = acciconlist.filter(accicon => accicon.code != code);
            setResiconList();
            Swal.fire(
                'Removed!',
                'Selected Icon have been removed from the Accessible Icons List ',
                'success'
            );
            selectedremovingappiconcode = undefined;
        } else {
            selectedremovingappiconcode = undefined;
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select an App Icon!',
            })
        }
    }
    function setValues(code) {
        t2.clear().draw(false);
        t3.clear().draw(false);
        formctrl();
        $("#modal-grouplist").modal("hide");
        addmoddel = undefined;
        if (code) {
            usr_grpobj = grp_col.getUsrGrp(code);
            $.each(usr_grpobj.userslist, function (i, item) {
                t2.row.add([item.code, item.firstname, item.lastname, item.email, item.businessRole]).draw(false);
            })
            $("#user_userGroupid").val(usr_grpobj.code + " - " + usr_grpobj.description);
            $.each(usr_grpobj.roleslist, function (i, item) {
                if (item.status == "ACTIVE")
                    t3.row.add([item.code, item.description]).draw(false);
            })
            setRoleValues();
        } else {
            usr_grpobj = undefined;
            selectedcode = undefined;
            $("#user_userGroupid").val(undefined);
            setRoleValues();
        }
    }
    function setResiconList() {
        t6.clear().draw(false);
        if (acciconlist != []) {
            $.each(acciconlist, function (i, item) {
                t6.row.add([item.code, item.description, item.appIconGroup.code, item.appIconGroup.description]).draw(false);
            })
        }
    }
    function setRoleValues(usergrpcode, code) {
        $("#modal-rolelist").modal("hide");
        formctrl();
        addmoddel = undefined;
        if (code) {
            usr_roleobj = grp_col.getUserRole(usergrpcode, code);
            $("#user_roleid").val(usr_roleobj.code + " - " + usr_roleobj.description);
            if (usr_roleobj.accIconList) {
                acciconlist = [];
                $.each(usr_roleobj.accIconList, function (i, item) {
                    acciconlist.push(appicongroup_col.getAppIconByCode(item.code))
                })
            } else {
                acciconlist = [];
            }
            setResiconList();
        } else {
            acciconlist = [];
            usr_roleobj = undefined;
            $("#user_roleid").val(undefined);
            setResiconList();
        }
    }
    function setNewRoleValues() {
        $.each(acciconlist, function (i, item) {
            item.appIconGroup = [];
        })
        if (acciconlist != []) usr_roleobj.accIconList = acciconlist;
    }
    function resetform(element) {
        $(element).find(".invalid-feedback").remove();
        $(element).find(".is-invalid").removeClass("is-invalid");
        $(element).find(".is-valid").removeClass("is-valid");
    }
    //end of functions
    //triggers
    $('#table1 tbody').on('click', 'tr', function () {
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
    $('#table4 tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            setAppiconGroupValues();
            selectedappicongroupcode = "";
        } else {
            t4.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            selectedappicongroupcode = $(this).children("td:nth-child(1)").text();
            setAppiconGroupValues($(this).children("td:nth-child(1)").text());
        }
    });
    $('#table5 tbody').on('click', 'tr', function () {
        if (selectedappicongroupcode != undefined) {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                setAppIconValues();
                selectedappiconcode = "";
            } else {
                t5.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                selectedappiconcode = $(this).children("td:nth-child(1)").text();
                setAppIconValues(selectedappicongroupcode, $(this).children("td:nth-child(1)").text());
            }
        }
    });
    $('#table6 tbody').on('click', 'tr', function () {
        if (usr_roleobj != undefined) {
            if (acciconlist.length != 0) {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                    selectedremovingappiconcode = "";
                } else {
                    t6.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                    selectedremovingappiconcode = $(this).children("td:nth-child(1)").text();
                }
            }
        }
    });
    $(document).off("click", "#addAccIcon");
    $(document).off("click", "#removeAccIcon");
    $(document).on("click", "#addAccIcon", function () {
        if (selectedappiconcode && selectedrolecode) {
            var selectedappicon = appicongroup_col.getAppIcon(selectedappicongroupcode, selectedappiconcode)
            if (acciconlist) {
                if (!(acciconlist.find(accicon => accicon.code == selectedappicon.code))) {
                    acciconlist.push(selectedappicon);
                    setResiconList();
                    Swal.fire(
                        'Added!',
                        'Selected Icon have been added to the Accessible Icons List ',
                        'success'
                    )
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Warning!',
                        text: 'Selected Application Icon is already in the Accessible Icons list',
                    });
                }
            } else {
                acciconlist.push(selectedappicon);
                setResiconList();
                Swal.fire(
                    'Added!',
                    'Selected Icon have been added to the Accessible Icons List ',
                    'success'
                )
            }

        } else {
            if (selectedrolecode == undefined) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please select a user role!',
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please select an application Icon !',
                })
            }
        }
    });
    $(document).on("click", "#removeAccIcon", function () {
        removeAppIconValues(selectedremovingappiconcode);
    });

    //end of triggers
    jwtPayload = getJwtPayload();
    formctrl();
    refreshtable();

});

