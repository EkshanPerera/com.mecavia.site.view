$(function () {
    //variablespassworord
    var clientClassesInstence = clientClasses.clientClassesInstence();
    let cli_col = clientClassesInstence.cli_service;
    let cli_obj = clientClassesInstence.client;
    let cli_addressobj = clientClassesInstence.client_addresses;
    let cli_contactobj = clientClassesInstence.client_contacts;
    var addmoddel = undefined;
    var selectedcode = undefined;
    var jwtPayload = undefined;
    var selectedaddrcode = undefined;
    var selectedcontcode = undefined;
    var t9 = $("#table9").DataTable({
        "order": [[0, "desc"]],
        dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row cli-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
    });
    var t10 = $("#table10").DataTable({
        "order": [[0, "desc"]]
    })
    var t11 = $("#table11").DataTable({
        "order": [[0, "desc"]]
    })
    //end of variables
    //functions
    //defalt functions
    $(function () {
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
                                    var client_code = $("#client_code").val();
                                    var client_firstname = $("#client_firstname").val();
                                    var client_lastname = $("#client_lastname").val();
                                    var client_email = $("#client_email").val();
                                    var client_brole = $("#client_brole").val();
                                    var status = "ACTIVE";
                                    setNewValues(client_code, client_firstname, client_lastname, client_email, client_brole, status);
                                    submit();
                                    Swal.fire(
                                        'Added!',
                                        'New record has been added.',
                                        'success'
                                    )
                                    break;
                                case "mod":
                                    var code = undefined;
                                    var client_firstname = $("#client_firstname").val();
                                    var client_lastname = $("#client_lastname").val();
                                    var client_email = $("#client_email").val();
                                    var client_brole = $("#client_brole").val();
                                    var status = undefined;
                                    setNewValues(client_code, client_firstname, client_lastname, client_email, client_brole, status);
                                    submit();
                                    Swal.fire(
                                        'Modified!',
                                        'The record has been modified.',
                                        'success'
                                    )
                                    break;
                                case "del":
                                    var code = undefined;
                                    var client_firstname = undefined;
                                    var client_lastname = undefined;
                                    var client_email = undefined;
                                    var client_brole = undefined;

                                    var status = "INACTIVE";
                                    setNewValues(client_code, client_firstname, client_lastname, client_email, client_brole, status);
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
                clientgroup: {
                    required: true
                },
                clientrole: {
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
                clientgroup: {
                    required: "please select a clientgroup!"
                },
                clientrole: {
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
                                    var cli_addr_line01 = $("#cli_addr_line01").val();
                                    var cli_addr_line02 = $("#cli_addr_line02").val();
                                    var cli_addr_line03 = $("#cli_addr_line03").val();
                                    var cli_addr_line04 = $("#cli_addr_line04").val();
                                    var cli_addr_code = $("#cli_addr_code").val();
                                    var cli_addr_status = $("#cli_addr_status").val();
                                    var cli_addr_isdef;
                                    if ($("#cli_addr_isdef").val() == "on") cli_addr_isdef = true;
                                    else cli_addr_isdef = false;

                                    setNewAddrValues(cli_addr_line01, cli_addr_line02, cli_addr_line03, cli_addr_line04, cli_addr_code, cli_addr_status, cli_addr_isdef);
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
                contactstatus: {
                    required: true
                }

            },
            messages: {
                contactdescription: {
                    required: "Please fillout description!"
                },
                contactstatus: {
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
                                    var cli_cont_desc = $("#cli_cont_desc").val();
                                    var cli_cont_tpno = $("#cli_cont_tpno").val();
                                    var cli_cont_code = $("#cli_cont_code").val();
                                    var cli_cont_status = $("#cli_cont_status").val();
                                    var cli_cont_isdef;
                                    if ($("#cli_cont_isdef").val() == "on") cli_cont_isdef = true;
                                    if ($("#cli_cont_isdef").val() == "off") cli_cont_isdef = false;

                                    setNewContValues(cli_cont_desc, cli_cont_tpno, cli_cont_code, cli_cont_status, cli_cont_isdef);
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
            if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05029") != undefined || jwtPayload.businessRole == "ADMIN") {
            cli_col.clear()
            addmoddel = undefined;
            selectedaddrcode = undefined;
            selectedcontcode = undefined;
            t9.clear().draw(false);
            $.ajax({
                url: "http://localhost:8080/api/clientctrl/getclients",
                dataType: "JSON",
                headers: {
                    "Authorization": jwt
                },
                success: function (data) {
                    $.each(data.content, function (i, item) {
                        $.each(item.addresses, function (i, item) {
                            cli_col.addAddresstoArry(item.id, item.code, item.line01, item.line02, item.line03, item.line04, item.isdef, item.status);
                        });
                        $.each(item.contactNumbers, function (i, item) {
                            cli_col.addContactstoArry(item.id, item.code, item.description, item.tpno, item.isdef, item.status);
                        });
                        cli_col.addClitoArray(item.id, item.code, item.firstname, item.middlename, item.lastname, item.email, item.businessRole, item.status, item.clientGroupid, item.roleid);
                        t9.row.add([item.code, item.firstname, item.lastname, item.email, item.businessRole]).draw(false);
                    });
                    setValues();
                    fadepageloder();
                    var $tableRow = $("#table9 tr td:contains('" + selectedcode + "')").closest("tr");
                    $tableRow.trigger("click");
                },
                error: function (xhr, status, error) {
                    fadepageloder();
                }
            });
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning!',
                text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI05029)',
            });
        }
        }
        function submit() {
            showpageloder();
            var url;
            var method;

            switch (addmoddel) {
                case "add":
                    url = "http://localhost:8080/api/clientctrl/saveclient";
                    method = "POST";
                    break;
                case "mod":
                case "modaddr":
                case "modcont":
                    url = "http://localhost:8080/api/clientctrl/updateclient";
                    method = "PUT";

                    break;
                case "del":
                    url = "http://localhost:8080/api/clientctrl/activeinactiveclient";
                    method = "POST";
                    break;
            }

            $.ajax({
                url: url,
                method: method,
                data: JSON.stringify(cli_obj),
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
            $(fillinid).prop("disabled", false);
        }
        function setValues(code) {
            t10.clear().draw(false);
            t11.clear().draw(false);
            formctrl();
            addmoddel = undefined;
            if (code) {
                cli_obj = cli_col.getClient(code);
                $("#client_code").val(cli_obj.code);
                $("#client_firstname").val(cli_obj.firstname);
                $("#client_lastname").val(cli_obj.lastname);
                $("#client_email").val(cli_obj.email);
                $("#client_brole").val(cli_obj.businessRole);
                $("#client_status").val(cli_obj.status);
                $("#client_addresses").val(cli_obj.addresses);
                $("#client_contactNumbers").val(cli_obj.contactNumbers);
                $.each(cli_obj.addresses, function (i, item) {
                    if (item.status == "ACTIVE")
                        t10.row.add([item.code, item.line01, item.line02, item.line03, item.line04]).draw(false);
                })
                $.each(cli_obj.contactNumbers, function (i, item) {
                    if (item.status == "ACTIVE")
                        t11.row.add([item.code, item.description, item.tpno]).draw(false);
                })
                setAddressValues();
                setContactValues();
            } else {
                cli_obj = undefined;
                $("#client_code").val(undefined);
                $("#client_firstname").val(undefined);
                $("#client_lastname").val(undefined);
                $("#client_email").val(undefined);
                $("#client_brole").val(undefined);
                $("#client_status").val(undefined);
                $("#client_addresses").val(undefined);
                $("#client_contactNumbers").val(undefined);
                $("#client_clientGroupid").val(undefined);
                $("#client_roleid").val(undefined);
                setAddressValues();
                setContactValues();
            }
        }
        function setAddressValues(clientcode, code) {
            formctrl();
            addmoddel = undefined;
            if (code) {
                cli_addressobj = cli_col.getClientAddress(clientcode, code);
                $("#cli_addr_code").val(cli_addressobj.code);
                $("#cli_addr_line01").val(cli_addressobj.line01);
                $("#cli_addr_line02").val(cli_addressobj.line02);
                $("#cli_addr_line03").val(cli_addressobj.line03);
                $("#cli_addr_line04").val(cli_addressobj.line04);
                $("#cli_addr_status").val(cli_addressobj.status);
                $("#cli_addr_isdef").attr("checked", cli_addressobj.isdef);
            } else {
                cli_addressobj = undefined;
                $("#cli_addr_code").val(undefined);
                $("#cli_addr_line01").val(undefined);
                $("#cli_addr_line02").val(undefined);
                $("#cli_addr_line03").val(undefined);
                $("#cli_addr_line04").val(undefined);
                $("#cli_addr_status").val(undefined);
                $("#cli_cont_isdef").attr("checked", false);
            }
        }
        function setContactValues(clientcode, code) {
            formctrl();
            addmoddel = undefined;
            if (code) {
                cli_contactobj = cli_col.getClientContact(clientcode, code);
                $("#cli_cont_code").val(cli_contactobj.code);
                $("#cli_cont_desc").val(cli_contactobj.description);
                $("#cli_cont_tpno").val(cli_contactobj.tpno);
                $("#cli_cont_status").val(cli_contactobj.status);
                $("#cli_cont_isdef").attr("checked", cli_contactobj.isdef);
            } else {
                cli_contactobj = undefined;
                $("#cli_cont_code").val(undefined);
                $("#cli_cont_desc").val(undefined);
                $("#cli_cont_tpno").val(undefined);
                $("#cli_cont_status").val(undefined);
                $("#cli_cont_isdef").attr("checked", false);
            }
        }
        function setNewValues(client_code, client_firstname, client_lastname, client_email, client_brole, status) {
            if (cli_obj) {
                if (client_code) cli_obj.code = client_code;
                if (client_firstname) cli_obj.firstname = client_firstname;
                if (client_lastname) cli_obj.lastname = client_lastname;
                if (client_email) cli_obj.email = client_email;
                if (client_brole) cli_obj.businessRole = client_brole;
                if (status) cli_obj.status = status;
            } else {
                cli_obj = clientClassesInstence.client;
                setNewValues(client_code, client_firstname, client_lastname, client_email, client_brole, status);
            }
        }
        function setNewAddrValues(cli_addr_line01, cli_addr_line02, cli_addr_line03, cli_addr_line04, cli_addr_code, cli_addr_status, cli_addr_isdef) {
            if (cli_addressobj) {
                if (cli_addr_line01) cli_addressobj.line01 = cli_addr_line01;
                if (cli_addr_line02) cli_addressobj.line02 = cli_addr_line02;
                if (cli_addr_line03) cli_addressobj.line03 = cli_addr_line03;
                if (cli_addr_line04) cli_addressobj.line04 = cli_addr_line04;
                if (cli_addr_code) cli_addressobj.code = cli_addr_code;
                if (cli_addr_status) cli_addressobj.status = cli_addr_status;
                cli_addressobj.isdef = cli_addr_isdef;

            } else {
                cli_addressobj = clientClassesInstence.client_addresses;
                setNewAddrValues(cli_addr_line01, cli_addr_line02, cli_addr_line03, cli_addr_line04, cli_addr_code, cli_addr_status, cli_addr_isdef);
                cli_obj.addresses.push(cli_addressobj);
            }
        }
        function setNewContValues(cli_cont_desc, cli_cont_tpno, cli_cont_code, cli_cont_status, cli_cont_isdef) {
            if (cli_contactobj) {
                if (cli_cont_desc) cli_contactobj.description = cli_cont_desc;
                if (cli_cont_tpno) cli_contactobj.tpno = cli_cont_tpno;
                if (cli_cont_code) cli_contactobj.code = cli_cont_code;
                if (cli_cont_status) cli_contactobj.status = cli_cont_status;
                cli_contactobj.isdef = cli_cont_isdef;
            } else {
                cli_contactobj = clientClassesInstence.client_contacts;
                setNewContValues(cli_cont_desc, cli_cont_tpno, cli_cont_code, cli_cont_status, cli_cont_isdef);
                cli_obj.contactNumbers.push(cli_contactobj);
            }
        }
        function resetform(element) {
            $(element).find(".invalid-feedback").remove();
            $(element).find(".is-invalid").removeClass("is-invalid");
            $(element).find(".is-valid").removeClass("is-valid");
        }
        //end of functions
        //triggers
        $('#table9 tbody').on('click', 'tr', function () {
            resetform("#quickForm03");
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                setValues();
                selectedcode = "";
            } else {
                t9.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                selectedcode = $(this).children("td:nth-child(1)").text();
                setValues($(this).children("td:nth-child(1)").text());


            }
        });
        $('#table10 tbody').on('click', 'tr', function () {
            resetform("#quickForm04");
            if (cli_obj.addresses.length != 0) {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                    setAddressValues();
                    selectedaddrcode = "";
                } else {
                    t10.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                    selectedaddrcode = $(this).children("td:nth-child(1)").text();
                    setAddressValues(selectedcode, $(this).children("td:nth-child(1)").text());
                }
            }
        });
        $('#table11 tbody').on('click', 'tr', function () {
            resetform("#quickForm05");
            if (cli_obj.contactNumbers.length != 0) {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                    setContactValues();
                    selectedcontcode = "";
                } else {
                    t11.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                    selectedcontcode = $(this).children("td:nth-child(1)").text();
                    setContactValues(selectedcode, $(this).children("td:nth-child(1)").text());
                }
            }
        });
        $(document).off("click", "#addClientbtn");
        $(document).off("click", "#addClientAddrbtn");
        $(document).off("click", "#addClientContbtn");
        $(document).off("click", "#setClientbtn");
        $(document).off("click", "#setClientAddrbtn");
        $(document).off("click", "#setClientContbtn");
        $(document).off("click", "#removeClientbtn");
        $(document).off("click", "#removeClientAddrbtn");
        $(document).off("click", "#removeClientContbtn");

        $(document).on("click", "#addClientbtn", function () {
            if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05024") != undefined || jwtPayload.businessRole == "ADMIN") {
                selectedcode = "";
                setValues();
                addmoddel = "add";
                let clilist = cli_col.allClients()
                let clicode = clientClassesInstence.CliSerial.genarateClientCode(clilist.length);
                $("#client_code").val(clicode);
                $("#table9 tbody tr").removeClass('selected');
                enablefillin("#client_firstname");
                enablefillin("#client_lastname");
                enablefillin("#client_email");
                enablefillin("#client_brole");
                enablefillin("#client_addresses");
                enablefillin("#client_contactNumbers");
                $("#client_status").val("ACTIVE");
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI05024)',
                });
            }
        });
        $(document).on("click", "#addClientAddrbtn", function () {
            if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05028") != undefined || jwtPayload.businessRole == "ADMIN") {
                if (selectedcode) {
                    let addrcode = clientClassesInstence.CliSerial.genarateClientAddrCode(cli_obj.addresses.length, cli_obj.code);
                    selectedaddrcode = "";
                    setAddressValues();
                    addmoddel = "modaddr";
                    $("#table10 tbody tr").removeClass('selected');
                    enablefillin("#cli_addr_line01");
                    enablefillin("#cli_addr_line02");
                    enablefillin("#cli_addr_line03");
                    enablefillin("#cli_addr_line04");
                    $("#cli_addr_code").val(addrcode);
                    $("#cli_addr_status").val("ACTIVE");
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please select a client!',
                    })
                }
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI05028)',
                });
            }
        });
        $(document).on("click", "#addClientContbtn", function () {
            if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05027") != undefined || jwtPayload.businessRole == "ADMIN") {
                if (selectedcode) {
                    let contcode = clientClassesInstence.CliSerial.genarateClientContCode(cli_obj.contactNumbers.length, cli_obj.code);
                    selectedcontcode = "";
                    setContactValues();
                    addmoddel = "modcont";
                    $("#table11 tbody tr").removeClass('selected');
                    enablefillin("#cli_cont_desc");
                    enablefillin("#cli_cont_tpno");
                    $("#cli_cont_code").val(contcode);
                    $("#cli_cont_status").val("ACTIVE");
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please select a client!',
                    })
                }
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI05027)',
                });
            }
        });
        $(document).on("click", "#setClientbtn", function () {
            if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05025") != undefined || jwtPayload.businessRole == "ADMIN") {
                if (selectedcode) {
                    setValues(selectedcode);
                    addmoddel = "mod";
                    enablefillin("#client_firstname");
                    enablefillin("#client_lastname");
                    enablefillin("#client_email");
                    enablefillin("#client_brole");
                    enablefillin("#client_addresses");
                    enablefillin("#client_contactNumbers");

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please select a client!',
                    })
                }
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI05025)',
                });
            }

        });
        $(document).on("click", "#setClientAddrbtn", function () {
            if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05028") != undefined || jwtPayload.businessRole == "ADMIN") {
                if (selectedaddrcode) {
                    setAddressValues(selectedcode, selectedaddrcode);
                    addmoddel = "modaddr";
                    enablefillin("#cli_addr_line01");
                    enablefillin("#cli_addr_line02");
                    enablefillin("#cli_addr_line03");
                    enablefillin("#cli_addr_line04");
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
                    text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI05028)',
                });
            }
        });
        $(document).on("click", "#setClientContbtn", function () {
            if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05027") != undefined || jwtPayload.businessRole == "ADMIN") {
                if (selectedcontcode) {
                    setContactValues(selectedcode, selectedcontcode);
                    addmoddel = "modcont";
                    enablefillin("#cli_cont_desc");
                    enablefillin("#cli_cont_tpno");
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
                    text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI05027)',
                });
            }
        });
        $(document).on("click", "#removeClientbtn", function () {
            if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05026") != undefined || jwtPayload.businessRole == "ADMIN") {
                if (selectedcode) {
                    if (cli_obj.status != "INACTIVE") {
                        setValues(selectedcode);
                        addmoddel = "del";
                        $("#client_status").val("INACTIVE");
                    } else {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Warning!',
                            text: 'The client you are attempting to delete is currently inactive!',
                        });
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please select a client!',
                    })
                }
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Warning!',
                    text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI05026)',
                });
            }
        });
        $(document).on("click", "#removeClientAddrbtn", function () {
            if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05028") != undefined || jwtPayload.businessRole == "ADMIN") {
                if (selectedaddrcode) {
                    if (cli_addressobj.status != "INACTIVE") {
                        setAddressValues(selectedcode, selectedaddrcode);
                        addmoddel = "modaddr";
                        $("#cli_addr_status").val("INACTIVE");
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
                    text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI05028)',
                });
            }
        });
        $(document).on("click", "#removeClientContbtn", function () {
            if (jwtPayload.roleid.accIconList.find(accicon => accicon.status == "ACTIVE" && accicon.code == "AI05027") != undefined || jwtPayload.businessRole == "ADMIN") {
                if (selectedcontcode) {
                    if (cli_contactobj.status != "INACTIVE") {
                        setContactValues(selectedcode, selectedcontcode);
                        addmoddel = "modaddr";
                        $("#cli_cont_status").val("INACTIVE");
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
                    text: 'You don\'t have permission to perform this action.Please contact the Administrator(a.c:AI05027)',
                });
            }
        });
        $(document).on('input', '#cli_cont_tpno', function () {
            var value = $('#cli_cont_tpno').val();
            value = value.replace(/\D/g, '').substring(0, 10);
            $('#cli_cont_tpno').val(value);
        });

        //end of triggers
        jwtPayload = getJwtPayload();
        formctrl();
        refreshtable();


    });
});