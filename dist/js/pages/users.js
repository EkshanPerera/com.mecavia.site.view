$(function () {
    //variables
    var usergroupClassesInstence = usergroupClasses.usergroupClassesInstence();
    var userClassesInstence = userClasses.userClassesInstence();
    let usr_col = userClassesInstence.usr_service;
    let usr_obj = userClassesInstence.user;
    let usr_addressobj = userClassesInstence.user_addresses;
    let usr_contactobj = userClassesInstence.user_contacts;
    let grp_col = usergroupClassesInstence.usr_grp_service;
    let usr_grpobj = usergroupClassesInstence.usr_grp;
    let usr_roleobj = usergroupClassesInstence.user_role;
    var addmoddel = undefined;
    var selectedcode = undefined;
    var jwtPayload = undefined;
    var selectedaddrcode = undefined;
    var selectedcontcode = undefined;
    var selectedgrpcode = undefined;
    var selectedrolecode = undefined;
    var t7 = $("#table7").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body popup"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t8 = $("#table8").DataTable({
        "order": [[0, "desc"]]
    });
    var t4 = $("#table4").DataTable({
        "order": [[0, "desc"]],
        pageLength: 5,
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row usr-card-body popup"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t5 = $("#table5").DataTable({
        "order": [[0, "desc"]]
    })
    var t6 = $("#table6").DataTable({
        "order": [[0, "desc"]]
    })
    //end of variables
    //functions
    //defalt functions
    $(function () {
        $.validator.addMethod("checkEmailExistence", function (value, element) {
            // User object list
            var userList = usr_col.allUsers();
            // Check if email exists in the user object list
            return userList.every(function (user) {
                return user.email !== value;
            });
        });
        $('#quickForm03').validate({
            rules: {
                firstname: {
                    required: true
                },
                lastname: {
                    required: true
                },
                email: {
                    required: true,
                    email: true,
                    checkEmailExistence: true
                },
                businessrole: {
                    required: true
                }
            },
            messages: {
                firstname: {
                    required: "Please fillout firstname!"
                },
                lastname: {
                    required: "Please fillout lastname!"
                },
                email: {
                    required: "Please fillout email!",
                    email: "Please enter a valid email address.",
                    checkEmailExistence: "Email is already exists"
                },
                businessrole: {
                    required: "Please fillout business role!"
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
                if (usr_grpobj && usr_roleobj) {
                    if (addmoddel && addmoddel != "modaddr" && addmoddel != "modcont") {
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
                                        var user_code = $("#user_code").val();
                                        var user_firstname = $("#user_firstname").val();
                                        var user_lastname = $("#user_lastname").val();
                                        var user_email = $("#user_email").val();
                                        var user_brole = $("#user_brole").val();
                                        var user_userGroupid;
                                        if (usr_grpobj)
                                            user_userGroupid = usr_grpobj;
                                        else
                                            user_userGroupid = undefined;
                                        var user_roleid;
                                        if (usr_roleobj)
                                            user_roleid = usr_roleobj;
                                        else
                                            user_roleid = undefined;
                                        var user_password = $("#user_password").val();
                                        var user_firstLogin;
                                        if ($("#user_firstLogin").attr("checked")) user_firstLogin = true;
                                        else user_firstLogin = false;
                                        var status = "ACTIVE";
                                        setNewValues(user_code, user_firstname, user_lastname, user_email, user_brole, user_userGroupid, user_roleid, user_password, user_firstLogin, status);
                                        submit();
                                        Swal.fire(
                                            'Added!',
                                            'New record has been added.',
                                            'success'
                                        )
                                        break;
                                    case "mod":
                                        var user_code = undefined;
                                        var user_firstname = $("#user_firstname").val();
                                        var user_lastname = $("#user_lastname").val();
                                        var user_email = $("#user_email").val();
                                        var user_brole = $("#user_brole").val();
                                        var user_userGroupid;
                                        if (usr_grpobj)
                                            user_userGroupid = usr_grpobj;
                                        else
                                            user_userGroupid = undefined;
                                        var user_roleid;
                                        if (usr_roleobj)
                                            user_roleid = usr_roleobj;
                                        else
                                            user_roleid = undefined;
                                        var user_password = $("#user_password").val();
                                        var user_firstLogin;
                                        if ($("#user_firstLogin").attr("checked")) user_firstLogin = true;
                                        else user_firstLogin = false;
                                        var status = undefined;
                                        setNewValues(user_code, user_firstname, user_lastname, user_email, user_brole, user_userGroupid, user_roleid, user_password, user_firstLogin, status);
                                        submit();
                                        Swal.fire(
                                            'Modified!',
                                            'The record has been modified.',
                                            'success'
                                        )
                                        break;
                                    case "del":
                                        var user_code = undefined;
                                        var user_firstname = undefined;
                                        var user_lastname = undefined;
                                        var user_email = undefined;
                                        var user_brole = undefined;
                                        var user_userGroupid = undefined;
                                        var user_roleid = undefined;
                                        var user_password = undefined;
                                        var user_firstLogin = undefined;
                                        var status = "INACTIVE";
                                        setNewValues(user_code, user_firstname, user_lastname, user_email, user_brole, user_userGroupid, user_roleid, user_password, user_firstLogin, status);
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
                        text: 'Please select a user group and a user role.',
                    });
                }
            }
        });
        $('#quickForm04').validate({
            setDefaults: {
                ignore: ":disabled"
            },
            rules: {
                addressline01: {
                    required: true
                },
                addressline02: {
                    required: true
                },
                addressline03: {
                    required: true
                },
                usergroup: {
                    required: true
                },
                userrole: {
                    required: true
                }
            },
            messages: {
                addressline01: {
                    required: "please fillout this section!"
                },
                addressline02: {
                    required: "please fillout this section!"
                },
                addressline03: {
                    required: "please fillout this section!"
                },
                usergroup: {
                    required: "please select a usergroup!"
                },
                userrole: {
                    required: "please select a role!"
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
                if (addmoddel == "modaddr") {
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
                                case "modaddr":
                                    var usr_addr_line01 = $("#usr_addr_line01").val();
                                    var usr_addr_line02 = $("#usr_addr_line02").val();
                                    var usr_addr_line03 = $("#usr_addr_line03").val();
                                    var usr_addr_line04 = $("#usr_addr_line04").val();
                                    var usr_addr_code = $("#usr_addr_code").val();
                                    var usr_addr_status = $("#usr_addr_status").val();
                                    var usr_addr_isdef;
                                    if ($("#usr_addr_isdef").attr("checked")) usr_addr_isdef = true;
                                    else usr_addr_isdef = false;
                                    setNewAddrValues(usr_addr_line01, usr_addr_line02, usr_addr_line03, usr_addr_line04, usr_addr_code, usr_addr_status, usr_addr_isdef);
                                    submit();
                                    Swal.fire(
                                        'Modified!',
                                        'The address list has been modified.',
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
        $('#quickForm05').validate({
            rules: {
                contactdescription: {
                    required: true,
                },
                contactno: {
                    required: true
                }

            },
            messages: {
                contactdescription: {
                    required: "Please fillout description!"
                },
                contactno: {
                    required: "Please fillout telephone number!"
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
                if (addmoddel == "modcont") {
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
                                case "modcont":
                                    var usr_cont_desc = $("#usr_cont_desc").val();
                                    var usr_cont_tpno = $("#usr_cont_tpno").val();
                                    var usr_cont_code = $("#usr_cont_code").val();
                                    var usr_cont_status = $("#usr_cont_status").val();
                                    var usr_cont_isdef;
                                    if ($("#usr_cont_isdef").attr("checked")) usr_cont_isdef = true;
                                    else usr_cont_isdef = false;
                                    setNewContValues(usr_cont_desc, usr_cont_tpno, usr_cont_code, usr_cont_status, usr_cont_isdef);
                                    submit();
                                    Swal.fire(
                                        'Modified!',
                                        'The contact list has been modified.',
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
            if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI00505") != undefined || jwtPayload.businessRole == "ADMIN") {
                fadepageloder();
                usr_col.clear()
                addmoddel = undefined;
                selectedaddrcode = undefined;
                selectedcontcode = undefined;
                t4.clear().draw(false);
                $.ajax({
                    url: "http://localhost:8080/api/userctrl/getusers",
                    dataType: "JSON",
                    headers: {
                        "Authorization": jwt
                    },
                    success: function (data) {
                        $.each(data.content, function (i, item) {
                            $.each(item.addresses, function (i, item) {
                                usr_col.addAddresstoArry(item.id, item.code, item.line01, item.line02, item.line03, item.line04, item.isdef, item.status);
                            });
                            $.each(item.contactNumbers, function (i, item) {
                                usr_col.addContactstoArry(item.id, item.code, item.description, item.tpno, item.isdef, item.status);
                            });
                            usr_col.addUsrtoArray(item.id, item.code, item.firstname, item.middlename, item.lastname, item.email,
                                item.password, item.businessRole, item.status, item.firstLogin, item.userGroupid, item.roleid);
                            t4.row.add([item.code, item.firstname, item.lastname, item.email]).draw(false);
                        });
                        setValues();
                        fadepageloder();
                        var $tableRow = $("#table4 tr td:contains('" + selectedcode + "')").closest("tr");
                        $tableRow.trigger("click");
                        refresheusrgrouptable();
                    },
                    error: function (xhr, status, error) {
                        fadepageloder();
                    }
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'You don\'t have permission to perform this action.Please contact the Administrator (a.c:AI00505)',
                });
            }

        }
        function refresheusrgrouptable() {
            t7.clear().draw(false);
            grp_col.clear();
            $.ajax({
                url: "http://localhost:8080/api/usergroupctrl/getusergroups",
                dataType: "JSON",
                headers: {
                    "Authorization": jwt
                },
                success: function (data) {
                    $.each(data.content, function (i, item) {
                        $.each(item.roleslist, function (i, item) {
                            grp_col.addRoletoArry(item.id, item.description, item.code, item.status, item.accIconList);
                        });
                        if (item.status == "ACTIVE") {
                            grp_col.addUsrGrptoArray(item.id, item.code, item.description, item.status);
                            t7.row.add([item.code, item.description]).draw(false);
                        }

                    })
                    var $tableRow = $("#table7 tr td:contains('" + selectedcode + "')").closest("tr");
                    $tableRow.trigger("click");
                }
            })
        }
        function submit() {
            showpageloder();
            var url;
            var method;

            switch (addmoddel) {
                case "add":
                    url = "http://localhost:8080/api/userctrl/saveuser";
                    method = "POST";
                    break;
                case "mod":
                case "modaddr":
                case "modcont":
                    url = "http://localhost:8080/api/userctrl/updateuser";
                    method = "PUT";
                    break;
                case "del":
                    url = "http://localhost:8080/api/userctrl/activeinactiveuser";
                    method = "POST";
                    break;
            }

            $.ajax({
                url: url,
                method: method,
                data: JSON.stringify(usr_obj),
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
            $("#user_firstLogin").prop("disabled", true);
        }
        function setPsw() {
            if ($("#user_firstLogin").attr("checked")) {
                $("#user_password").val("Abc@123");
            }
        }
        function enablefillin(fillinid) {
            $(fillinid).prop("disabled", false);
        }
        function setValues(code) {
            t5.clear().draw(false);
            t6.clear().draw(false);
            formctrl();
            addmoddel = undefined;
            if (code) {
                usr_obj = usr_col.getUser(code);
                $("#user_code").val(usr_obj.code);
                $("#user_firstname").val(usr_obj.firstname);
                $("#user_lastname").val(usr_obj.lastname);
                $("#user_email").val(usr_obj.email);
                $("#user_password").val(usr_obj.password);
                $("#user_brole").val(usr_obj.businessRole);
                $("#user_status").val(usr_obj.status);
                $("#user_addresses").val(usr_obj.addresses);
                $("#user_contactNumbers").val(usr_obj.contactNumbers);
                if (usr_obj.userGroupid) {
                    usr_grpobj = usr_obj.userGroupid;
                    $("#user_userGroupid").val(usr_obj.userGroupid.code + " - " + usr_obj.userGroupid.description);
                }
                if (usr_obj.roleid) {
                    usr_roleobj = usr_obj.roleid;
                    $("#user_roleid").val(usr_obj.roleid.code + " - " + usr_obj.roleid.description);
                }
                $("#user_firstLogin").attr("checked", usr_obj.firstLogin);
                $.each(usr_obj.addresses, function (i, item) {
                    if (item.status == "ACTIVE")
                        t5.row.add([item.code, item.line01, item.line02, item.line03, item.line04]).draw(false);
                })
                $.each(usr_obj.contactNumbers, function (i, item) {
                    if (item.status == "ACTIVE")
                        t6.row.add([item.code, item.description, item.tpno]).draw(false);
                })
                setAddressValues();
                setContactValues();
            } else {
                usr_obj = undefined;
                $("#user_code").val(undefined);
                $("#user_firstname").val(undefined);
                $("#user_lastname").val(undefined);
                $("#user_email").val(undefined);
                $("#user_password").val(undefined);
                $("#user_brole").val(undefined);
                $("#user_status").val(undefined);
                $("#user_addresses").val(undefined);
                $("#user_contactNumbers").val(undefined);
                $("#user_userGroupid").val(undefined);
                $("#user_roleid").val(undefined);
                $("#user_firstLogin").attr("checked", false);
                setAddressValues();
                setContactValues();
            }
        }
        function setAddressValues(usercode, code) {
            formctrl();
            addmoddel = undefined;
            if (code) {
                usr_addressobj = usr_col.getUserAddress(usercode, code);
                $("#usr_addr_code").val(usr_addressobj.code);
                $("#usr_addr_line01").val(usr_addressobj.line01);
                $("#usr_addr_line02").val(usr_addressobj.line02);
                $("#usr_addr_line03").val(usr_addressobj.line03);
                $("#usr_addr_line04").val(usr_addressobj.line04);
                $("#usr_addr_status").val(usr_addressobj.status);
                $("#usr_addr_isdef").attr("checked", usr_addressobj.isdef);
            } else {
                usr_addressobj = undefined;
                $("#usr_addr_code").val(undefined);
                $("#usr_addr_line01").val(undefined);
                $("#usr_addr_line02").val(undefined);
                $("#usr_addr_line03").val(undefined);
                $("#usr_addr_line04").val(undefined);
                $("#usr_addr_status").val(undefined);
                $("#usr_addr_isdef").attr("checked", false);
            }
        }
        function setContactValues(usercode, code) {
            formctrl();
            addmoddel = undefined;
            if (code) {
                usr_contactobj = usr_col.getUserContact(usercode, code);
                $("#usr_cont_code").val(usr_contactobj.code);
                $("#usr_cont_desc").val(usr_contactobj.description);
                $("#usr_cont_tpno").val(usr_contactobj.tpno);
                $("#usr_cont_status").val(usr_contactobj.status);
                $("#usr_cont_isdef").attr("checked", usr_contactobj.isdef);
            } else {
                usr_contactobj = undefined;
                $("#usr_cont_code").val(undefined);
                $("#usr_cont_desc").val(undefined);
                $("#usr_cont_tpno").val(undefined);
                $("#usr_cont_status").val(undefined);
                $("#usr_cont_isdef").attr("checked", false);
            }
        }
        function setNewValues(user_code, user_firstname, user_lastname, user_email, user_brole, user_userGroupid, user_roleid, password, firstLogin, status) {
            if (usr_obj) {
                if (user_code) usr_obj.code = user_code;
                if (user_firstname) usr_obj.firstname = user_firstname;
                if (user_lastname) usr_obj.lastname = user_lastname;
                if (user_email) usr_obj.email = user_email;
                if (user_brole) usr_obj.businessRole = user_brole;
                if (user_userGroupid) usr_obj.userGroupid = user_userGroupid;
                if (user_roleid) usr_obj.roleid = user_roleid;
                if (password) usr_obj.password = password;
                if (firstLogin) usr_obj.firstLogin = firstLogin;
                if (status) usr_obj.status = status;

            } else {
                usr_obj = userClassesInstence.user;
                setNewValues(user_code, user_firstname, user_lastname, user_email, user_brole, user_userGroupid, user_roleid, password, firstLogin, status);
            }
        }
        function setNewAddrValues(usr_addr_line01, usr_addr_line02, usr_addr_line03, usr_addr_line04, usr_addr_code, usr_addr_status, usr_addr_isdef) {
            if (usr_addressobj) {
                if (usr_addr_line01) usr_addressobj.line01 = usr_addr_line01;
                if (usr_addr_line02) usr_addressobj.line02 = usr_addr_line02;
                if (usr_addr_line03) usr_addressobj.line03 = usr_addr_line03;
                if (usr_addr_line04) usr_addressobj.line04 = usr_addr_line04;
                if (usr_addr_code) usr_addressobj.code = usr_addr_code;
                if (usr_addr_status) usr_addressobj.status = usr_addr_status;
                if (usr_addr_isdef) usr_addressobj.isdef = usr_addr_isdef;
            } else {
                usr_addressobj = userClassesInstence.user_addresses;
                setNewAddrValues(usr_addr_line01, usr_addr_line02, usr_addr_line03, usr_addr_line04, usr_addr_code, usr_addr_status, usr_addr_isdef);
                usr_obj.addresses.push(usr_addressobj);
            }
        }
        function setNewContValues(usr_cont_desc, usr_cont_tpno, usr_cont_code, usr_cont_status, usr_cont_isdef) {
            if (usr_contactobj) {
                if (usr_cont_desc) usr_contactobj.description = usr_cont_desc;
                if (usr_cont_tpno) usr_contactobj.tpno = usr_cont_tpno;
                if (usr_cont_code) usr_contactobj.code = usr_cont_code;
                if (usr_cont_status) usr_contactobj.status = usr_cont_status;
                if (usr_cont_isdef) usr_contactobj.isdef = usr_cont_isdef;
            } else {
                usr_contactobj = userClassesInstence.user_contacts;
                setNewContValues(usr_cont_desc, usr_cont_tpno, usr_cont_code, usr_cont_status, usr_cont_isdef);
                usr_obj.contactNumbers.push(usr_contactobj);
            }
        }
        function setUserGrpValues(code) {
            t8.clear().draw(false);
            $("#modal-grouplist").modal("hide");
            if (code) {
                usr_grpobj = grp_col.getUsrGrp(code);
                $.each(usr_grpobj.roleslist, function (i, item) {
                    if (item.status == "ACTIVE") t8.row.add([item.code, item.description]).draw(false);
                })
                $("#user_userGroupid").val(usr_grpobj.code + " - " + usr_grpobj.description);
                setRoleValues();
            } else {
                usr_grpobj = undefined;
                setRoleValues();
                $("#user_userGroupid").val(undefined);
            }
        }
        function setRoleValues(usergrpcode, code) {
            $("#modal-rolelist").modal("hide");
            if (code) {
                usr_roleobj = grp_col.getUserRole(usergrpcode, code);
                $("#user_roleid").val(usr_roleobj.code + " - " + usr_roleobj.description);
            } else {
                usr_roleobj = undefined;
                $("#user_roleid").val(undefined);
            }
        }
        function resetform(element) {
            $(element).find(".invalid-feedback").remove();
            $(element).find(".is-invalid").removeClass("is-invalid");
            $(element).find(".is-valid").removeClass("is-valid");
        }
        //end of functions
        //triggers
        $('#table7 tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                setUserGrpValues();
                selectedgrpcode = "";
            } else {
                t7.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                selectedgrpcode = $(this).children("td:nth-child(1)").text();
                setUserGrpValues($(this).children("td:nth-child(1)").text());

            }
        });
        $('#table8 tbody').on('click', 'tr', function () {
            if (usr_grpobj.roleslist.length != 0) {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                    setRoleValues();
                    selectedrolecode = "";
                } else {
                    t8.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                    selectedrolecode = $(this).children("td:nth-child(1)").text();
                    setRoleValues(selectedgrpcode, $(this).children("td:nth-child(1)").text());

                }
            }
        });
        $('#table4 tbody').on('click', 'tr', function () {
            resetform("#quickForm03");
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                setValues();
                selectedcode = "";
            } else {
                t4.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                selectedcode = $(this).children("td:nth-child(1)").text();
                setValues($(this).children("td:nth-child(1)").text());


            }
        });
        $('#table5 tbody').on('click', 'tr', function () {
            resetform("#quickForm04");
            if (usr_obj.addresses.length != 0) {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                    setAddressValues();
                    selectedaddrcode = "";
                } else {
                    t5.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                    selectedaddrcode = $(this).children("td:nth-child(1)").text();
                    setAddressValues(selectedcode, $(this).children("td:nth-child(1)").text());
                }
            }
        });
        $('#table6 tbody').on('click', 'tr', function () {
            resetform("#quickForm05");
            if (usr_obj.contactNumbers.length != 0) {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                    setContactValues();
                    selectedcontcode = "";
                } else {
                    t6.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                    selectedcontcode = $(this).children("td:nth-child(1)").text();
                    setContactValues(selectedcode, $(this).children("td:nth-child(1)").text());
                }
            }
        });
        $(document).off("click", "#addUserbtn");
        $(document).off("click", "#addUserAddrbtn");
        $(document).off("click", "#addUserContbtn");
        $(document).off("click", "#setUserbtn");
        $(document).off("click", "#setUserAddrbtn");
        $(document).off("click", "#setUserContbtn");
        $(document).off("click", "#removeUserbtn");
        $(document).off("click", "#removeUserAddrbtn");
        $(document).off("click", "#removeUserContbtn");

        $(document).on("click", "#addUserbtn", function () {
            if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI00506") != undefined || jwtPayload.businessRole == "ADMIN") {
                selectedcode = "";
                setValues();
                addmoddel = "add";
                let usrlist = usr_col.allUsers()
                let usrcode = userClassesInstence.UsrSerial.genarateUserCode(usrlist.length);
                $("#user_code").val(usrcode);
                $("#table4 tbody tr").removeClass('selected');
                enablefillin("#user_firstname");
                enablefillin("#user_lastname");
                enablefillin("#user_email");
                enablefillin("#user_brole");
                enablefillin("#user_addresses");
                enablefillin("#user_contactNumbers");
                enablefillin("#user_userGroupidbtn");
                enablefillin("#user_roleidbtn");
                $("#user_firstLogin").attr("checked", true);
                setPsw();
                $("#user_status").val("ACTIVE");
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'You don\'t have permission to perform this action.Please contact the Administrator (a.c:AI00506)',
                });
            }
        });
        $(document).on("click", "#addUserAddrbtn", function () {
            if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05023") != undefined || jwtPayload.businessRole == "ADMIN") {
                if (selectedcode) {
                    let addrcode = userClassesInstence.UsrSerial.genarateUserAddrCode(usr_obj.addresses.length, usr_obj.code);
                    selectedaddrcode = "";
                    setAddressValues();
                    addmoddel = "modaddr";
                    $("#table5 tbody tr").removeClass('selected');
                    enablefillin("#usr_addr_line01");
                    enablefillin("#usr_addr_line02");
                    enablefillin("#usr_addr_line03");
                    enablefillin("#usr_addr_line04");
                    $("#usr_addr_code").val(addrcode);
                    $("#usr_addr_status").val("ACTIVE");
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please select a user!',
                    })
                }
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'You don\'t have permission to perform this action.Please contact the Administrator (a.c:AI05023)',
                });
            }
        });
        $(document).on("click", "#addUserContbtn", function () {
            if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05022") != undefined || jwtPayload.businessRole == "ADMIN") {
                if (selectedcode) {
                    let contcode = userClassesInstence.UsrSerial.genarateUserContCode(usr_obj.contactNumbers.length, usr_obj.code);
                    selectedcontcode = "";
                    setContactValues();
                    addmoddel = "modcont";
                    $("#table6 tbody tr").removeClass('selected');
                    enablefillin("#usr_cont_desc");
                    enablefillin("#usr_cont_tpno");
                    $("#usr_cont_code").val(contcode);
                    $("#usr_cont_status").val("ACTIVE");
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please select a user!',
                    })
                }
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'You don\'t have permission to perform this action.Please contact the Administrator (a.c:AI05022)',
                });
            }
        });
        $(document).on("click", "#setUserbtn", function () {
            if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI00507") != undefined || jwtPayload.businessRole == "ADMIN") {
                if (selectedcode) {
                    setValues(selectedcode);
                    addmoddel = "mod";
                    enablefillin("#user_firstname");
                    enablefillin("#user_lastname");
                    enablefillin("#user_email");
                    enablefillin("#user_brole");
                    enablefillin("#user_addresses");
                    enablefillin("#user_contactNumbers");
                    enablefillin("#user_userGroupidbtn");
                    enablefillin("#user_roleidbtn");
                    $("#user_firstLogin").attr("checked", true);
                    setPsw();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please select a user!',
                    })
                }
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'You don\'t have permission to perform this action.Please contact the Administrator (a.c:AI00507)',
                });
            }
        });
        $(document).on("click", "#setUserAddrbtn", function () {
            if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05023") != undefined || jwtPayload.businessRole == "ADMIN") {
                if (selectedaddrcode) {
                    setAddressValues(selectedcode, selectedaddrcode);
                    addmoddel = "modaddr";
                    enablefillin("#usr_addr_line01");
                    enablefillin("#usr_addr_line02");
                    enablefillin("#usr_addr_line03");
                    enablefillin("#usr_addr_line04");
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please select an address!',
                    })
                }
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'You don\'t have permission to perform this action.Please contact the Administrator (a.c:AI05023)',
                });
            }
        });
        $(document).on("click", "#setUserContbtn", function () {
            if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05022") != undefined || jwtPayload.businessRole == "ADMIN") {
                if (selectedcontcode) {
                    setContactValues(selectedcode, selectedcontcode);
                    addmoddel = "modcont";
                    enablefillin("#usr_cont_desc");
                    enablefillin("#usr_cont_tpno");
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please select a contact number!',
                    })
                }
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'You don\'t have permission to perform this action.Please contact the Administrator (a.c:AI05022)',
                });
            }
        });
        $(document).on("click", "#removeUserbtn", function () {
            if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI00508") != undefined || jwtPayload.businessRole == "ADMIN") {
                if (selectedcode) {
                    if (usr_obj.status != "INACTIVE") {
                        setValues(selectedcode);
                        addmoddel = "del";
                        $("#user_status").val("INACTIVE");
                    } else {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Warning!',
                            text: 'The user you are attempting to delete is currently inactive!',
                        });
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please select a user!',
                    })
                }
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'You don\'t have permission to perform this action.Please contact the Administrator (a.c:AI00508)',
                });
            }
        });
        $(document).on("click", "#removeUserAddrbtn", function () {
            if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05023") != undefined || jwtPayload.businessRole == "ADMIN") {
                if (selectedaddrcode) {
                    if (usr_addressobj.status != "INACTIVE") {
                        setAddressValues(selectedcode, selectedaddrcode);
                        addmoddel = "modaddr";
                        $("#usr_addr_status").val("INACTIVE");
                    } else {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Warning!',
                            text: 'The address you are attempting to delete is currently inactive!',
                        });
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please select an address!',
                    })
                }
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'You don\'t have permission to perform this action.Please contact the Administrator (a.c:AI05023)',
                });
            }
        });
        $(document).on("click", "#removeUserContbtn", function () {
            if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05022") != undefined || jwtPayload.businessRole == "ADMIN") {
                if (selectedcontcode) {
                    if (usr_contactobj.status != "INACTIVE") {
                        setContactValues(selectedcode, selectedcontcode);
                        addmoddel = "modaddr";
                        $("#usr_cont_status").val("INACTIVE");
                    } else {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Warning!',
                            text: 'The contact number you are attempting to delete is currently inactive!',
                        });
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please select a contact number!',
                    })
                }
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'You don\'t have permission to perform this action.Please contact the Administrator (a.c:AI05022)',
                });
            }
        });
        $(document).on('input', '#usr_cont_tpno', function () {
            var value = $('#usr_cont_tpno').val();
            value = value.replace(/\D/g, '').substring(0, 10);
            $('#usr_cont_tpno').val(value);
        });
        //end of triggers
        jwtPayload = getJwtPayload();
        formctrl();
        refreshtable();

    });
});