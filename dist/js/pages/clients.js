//variablespassworord
let cli_col = new cli_service();
let cli_obj = new client();
let cli_addressobj = new client_addresses();
let cli_contactobj = new client_contacts();
var addmoddel;
var selectedcode;
var selectedaddrcode;
var selectedcontcode;
var selectedgrpcode;
var selectedrolecode;
var t4 = $("#table4").DataTable({
    "order": [[ 0, "desc" ]],
    dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>><"row cli-card-body"<"col-sm-12 col-md-12"t>><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
});
var t5 = $("#table5").DataTable({
    "order": [[ 0, "desc" ]]
})
var t6 = $("#table6").DataTable({
    "order": [[ 0, "desc" ]]
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
                email: true
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
                email: "Please enter a valid email address."

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
    function refreshtable() {
        cli_col.clear()
        addmoddel = undefined;
        selectedaddrcode = undefined;
        selectedcontcode = undefined;
        t4.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/clientctrl/getclients",
            dataType: "JSON",
            success: function (data) {
                $.each(data.content, function (i, item) {
                    $.each(item.addresses, function (i, item) {
                        cli_col.addAddresstoArry(item.id, item.code, item.line01, item.line02, item.line03, item.line04, item.isdef, item.status);
                    });
                    $.each(item.contactNumbers, function (i, item) {
                        cli_col.addContactstoArry(item.id, item.code, item.description, item.tpno, item.isdef, item.status);
                    });
                    cli_col.addClitoArray(item.id, item.code, item.firstname, item.middlename, item.lastname, item.email, item.businessRole, item.status, item.clientGroupid, item.roleid);
                    t4.row.add([item.code, item.firstname, item.lastname, item.email]).draw(false);
                });
                setValues();
                var $tableRow = $("#table4 tr td:contains('" + selectedcode + "')").closest("tr");
                $tableRow.trigger("click");

            }
        });

    }

    function submit() {
        var url;
        var method;
        var token = localStorage.getItem("jwt_token");
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
        t5.clear().draw(false);
        t6.clear().draw(false);
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
                    t5.row.add([item.code, item.line01, item.line02, item.line03, item.line04]).draw(false);
            })
            $.each(cli_obj.contactNumbers, function (i, item) {
                if (item.status == "ACTIVE")
                    t6.row.add([item.code, item.description, item.tpno]).draw(false);
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
            cli_obj = new client();
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
            cli_addressobj = new client_addresses();
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
            cli_contactobj = new client_contacts();
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
        if (cli_obj.addresses.length != 0) {
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
        if (cli_obj.contactNumbers.length != 0) {
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
    $(document).on("click", "#addClientbtn", function () {
        selectedcode = "";
        setValues();
        addmoddel = "add";
        let clilist = cli_col.allClients()
        let clicode = new CliSerial().genarateClientCode(clilist.length);
        $("#client_code").val(clicode);
        $("#table4 tbody tr").removeClass('selected');
        enablefillin("#client_firstname");
        enablefillin("#client_lastname");
        enablefillin("#client_email");
        enablefillin("#client_brole");
        enablefillin("#client_addresses");
        enablefillin("#client_contactNumbers");


        $("#client_status").val("ACTIVE");
    });

    $(document).on("click", "#addClientAddrbtn", function () {
        if (selectedcode) {
            let addrcode = new CliSerial().genarateClientAddrCode(cli_obj.addresses.length, cli_obj.code);
            selectedaddrcode = "";
            setAddressValues();
            addmoddel = "modaddr";
            $("#table5 tbody tr").removeClass('selected');
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
    });
    $(document).on("click", "#addClientContbtn", function () {
        if (selectedcode) {
            let contcode = new CliSerial().genarateClientContCode(cli_obj.contactNumbers.length, cli_obj.code);
            selectedcontcode = "";
            setContactValues();
            addmoddel = "modcont";
            $("#table6 tbody tr").removeClass('selected');
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
    });
    $(document).on("click", "#setClientbtn", function () {
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
    });
    $(document).on("click", "#setClientAddrbtn", function () {
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
    });
    $(document).on("click", "#setClientContbtn", function () {
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
    });
    $(document).on("click", "#removeClientbtn", function () {
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
    });
    $(document).on("click", "#removeClientAddrbtn", function () {
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
    });
    $(document).on("click", "#removeClientContbtn", function () {
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
    });

    //end of triggers

    formctrl();
    refreshtable();

});