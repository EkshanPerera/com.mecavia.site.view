$(function () {
    //variables
    let uom_col = new uom_service();
    let uomobj = new uom();
    var addmoddel;
    var selectedcode;
    var t7 = $("#table7").DataTable({
        "order": [[ 0, "desc" ]],
        pageLength: 5,
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
                                setNewValues(code, scode, description, status);
                                submit();
                                Swal.fire(
                                    'Added!',
                                    'New record has been added.',
                                    'success'
                                )
                                break;
                            case "mod":
                                var code = undefined;
                                var scode = $("#uom_scode").val();
                                var description = $("#uom_description").val();
                                var status = undefined;
                                setNewValues(code, scode, description, status);
                                submit();
                                Swal.fire(
                                    'Modified!',
                                    'The record has been modified.',
                                    'success'
                                )
                                break;
                            case "del":
                                var code = undefined;
                                var scode = undefined;
                                var description = undefined;
                                var status = "INACTIVE";
                                setNewValues(code, scode, description, status);
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
    //definded functions
    function refreshtable() {
        uom_col.clear()
        addmoddel = undefined;
        selectedcode = undefined;
        t7.clear().draw(false);
        $.ajax({
            url: "http://localhost:8080/api/uomctrl/getuoms",
            dataType: "JSON",
            success: function (data) {
                $.each(data.content, function (i, item) {
                    uom_col.addUOMtoArray(item.id, item.code, item.scode, item.description, item.status);
                    t7.row.add([item.code, item.scode, item.description]).draw(false);
                    setValues();
                    var $tableRow = $("#table7 tr td:contains('" + selectedcode + "')").closest("tr");
                    $tableRow.trigger("click");
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
            uomobj = new uom();
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
    $('#table7 tbody').on('click', 'tr', function () {
        resetform("#quickForm6");
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            setValues();
            selectedcode = "";
        } else {
            t7.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            selectedcode = $(this).children("td:nth-child(1)").text();
            setValues($(this).children("td:nth-child(1)").text());
        }
    });
    $(document).on("click", "#addUOMs", function () {
        selectedcode = "";
        setValues(undefined);
        addmoddel = "add";
        let uomlist = uom_col.allUOM()
        let uomcode = new UOMSerial().genarateUOMCode(uomlist.length);
        console.log(uom_col.allUOM());
        $("#uom_code").val(uomcode);
        $("#table7 tbody tr").removeClass('selected');
        enablefillin("#uom_scode");
        enablefillin("#uom_description");
        $("#uom_status").val("ACTIVE");
    });
    $(document).on("click", "#setUOMs", function () {
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
    });
    $(document).on("click", "#removaUOMs", function () {
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
    });
    //end of triggers
    formctrl();
    refreshtable();
});
