// global variable for storing index and data
let rowIndex, rowData;
// init notification instance
const notyf = new Notyf();
const nafisa_domain = 'https://nafisa.selopian.us'
const riyad_domain = 'https://riyadshop.selopian.us'
const shakila_domain = 'https://shakila.selopian.us'
const active_domain = riyad_domain

//init shop & branch  datatable and load data
let shop_table = $('#shop_dataTable').DataTable({
    order: [[0, 'desc']],
    "columnDefs": [
        {'visible': false, 'targets': 0},
        {"width": "30%", "targets": 1},
        {"width": "12%", "targets": 2},
        {"width": "12%", "targets": 3},

        {"width": "10%", "targets": 4}
    ],
    ajax: {
        url: 'https://riyadshop.selopian.us/shopBranch',
        dataSrc: 'data',
    },
    rowId: 'id',
    dom: 'Blfrtip',
    oLanguage: {
        sLengthMenu: "Show _MENU_",
    },
    language: {
        search: "",
        searchPlaceholder: "Search..."
    },
    buttons: [
        {
            extend: 'print',
            title: 'Shop Information',
            orientation: 'landscape',
            exportOptions: {
                columns: [1, 2, 3],
                modifier: {
                    page: 'current'
                }
            },
            pageSize: 'LEGAL',
            customize: function (win) {
                $(win.document.body)
                    .css('font-size', '15pt')
                $(win.document.body).find('th')
                    .css({
                        "font-size": 'inherit',
                        "text-align": 'center',
                    })
                    .addClass('compact')
                $(win.document.body).find('table')
                    .css('font-size', 'inherit')
                    .css('text-align', 'center')

            }
        },
        {
            extend: 'excelHtml5',
            title: 'Shop Information',
            exportOptions: {
                columns: [1, 2, 3]

            },

        },
        {
            extend: 'pdf',
            exportOptions: {
                columns: [1, 2, 3],
                modifier: {
                    page: 'current'
                }
            },
            pageSize: 'LEGAL',
            title: 'Shop Information',
            customize: function (doc) {
                doc.content[1].table.widths = [
                    '20%',
                    '35%',
                    '45%',
                ]
                let rowCount = doc.content[1].table.body.length;
                for (let i = 1; i < rowCount; i++) {
                    doc.content[1].table.body[i][0].alignment = 'center';
                    doc.content[1].table.body[i][1].alignment = 'center';
                    doc.content[1].table.body[i][2].alignment = 'center';
                }
            }
        },

        '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_shop_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'

    ],

    columns: [
        {data: 'id'},
        {data: 'name'},
        {data: 'branches[, ].name'},
        {data: 'branches[, ].location'},
        {data: 'branches[null].geolocation.x '},


        {
            data: 'id',
            render: function () {
                return '<button id="update_shopBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_shop_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  '
                    + '<button   id="delete_shopBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_shop_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
            }
        },
    ]
});


/* ### Add Data Start ### */
$("#add_shop").click(function () {

    $(this).text('Submitting..');
    let addShopModal = {
        name: $("#shopName").val(),

    };
    $.ajax({
        url: 'https://riyadshop.selopian.us/shop',
        type: 'POST',
        data: JSON.stringify(addShopModal),
        contentType: "application/json",
        success: function (data) {

            console.log(addShopModal.name)
            let newRowIndex = shop_table.row.add(addShopModal.name).draw();

            $("#add_shop").text('Submit');
            const modal = bootstrap.Modal.getInstance($("#add_shop_modal"));
            modal.hide();

            //reset input Field
            $('form :input').val('');
            $('.input').val('');

            // reset search
            shop_table.search('');

            // re-ordering to default
            shop_table.order([0, 'desc']).draw();

            // highlighting newly added row
            $(shop_table.row(newRowIndex.index()).nodes()).addClass('selected');
            setTimeout(function () {
                $(shop_table.row(newRowIndex.index()).nodes()).removeClass('selected');
            }, 2000);

            //Success Notification
            notyf.success({
                message: 'New Shop Added  <strong>Successfully !</strong>',
                duration: 7000,
                icon: false
            });
        },
        error: function () {
            //Set default button text again
            $("#add_shop").text('Submit');

            //Notification
            notyf.error({
                message: "<strong>Warning !</strong> Can't update shop.",
                duration: 7000,
                icon: false
            });
        }
    });

})

//init Shop Name
$.ajax({
    url: 'https://riyadshop.selopian.us/shop',
    type: 'GET',
    success: function (result) {
        let shopName = result?.data.map(item => item)
        shopName.forEach((element) => {
            $('<option/>').val(element['id']).html(element['shop_name']).appendTo('#items');
            $('<option/>').val(element['id']).html(element['shop_name']).appendTo('#item2');
        });
    }

});

//Add Branch
/* ### Add Data Start ### */
$("#add_Branch").click(function () {

    $(this).text('Submitting..');
    let addBranch = {
        name: $("#branch_name").val(),
        location: $("#branch_location").val(),
        shop_id: $("#items").val(),
        // name: $("#shopName").val(),

    };
    $.ajax({
        url: 'https://riyadshop.selopian.us/branch ',
        type: 'POST',
        data: JSON.stringify(addBranch),
        contentType: "application/json",
        success: function (data) {
            //add row from input fields
            // console.log(data.shop_name)
            //
            let newRowIndex = shop_table.row.add(data).draw();

            $("#add_shop").text('Submit');
            const modal = bootstrap.Modal.getInstance($("#add_shop_modal"));
            modal.hide();

            //reset input Field
            $('form :input').val('');
            $('.input').val('');

            // reset search
            shop_table.search('');

            // re-ordering to default
            shop_table.order([0, 'desc']).draw();

            // highlighting newly added row
            $(shop_table.row(newRowIndex.index()).nodes()).addClass('selected');
            setTimeout(function () {
                $(shop_table.row(newRowIndex.index()).nodes()).removeClass('selected');
            }, 2000);

            //Success Notification
            notyf.success({
                message: 'New Shop Added  <strong>Successfully !</strong>',
                duration: 7000,
                icon: false
            });
        },
        error: function () {
            //Set default button text again
            $("#add_shop").text('Submit');

            //Notification
            notyf.error({
                message: "<strong>Warning !</strong> Can't update shop.",
                duration: 7000,
                icon: false
            });
        }
    });

})

// DELETE button
$('#shop_dataTable tbody').on('click', '#delete_shopBtn', function () {
    rowData = shop_table.row($(this).parents('tr')).data();
    rowIndex = shop_table.row($(this).parents('tr')).index();
    // Set value on Modal
    $("#sName").text(`Are you sure you want to delete "${rowData.name}"?`);
});

// DELETE Confirmation button
    $("#delete_shop").click(function () {

        $(this).text('Deleting...');
        $.ajax({
            url: 'https://riyadshop.selopian.us/shop/' + rowData.id,
            type: 'DELETE',
            dataType: "json",
            success: function (data) {
                let currentPage = shop_table.page();
                shop_table.row(rowIndex).remove().draw();

                const modal = bootstrap.Modal.getInstance($("#delete_shop_modal"));
                modal.hide();

                $("#delete_shop").text('Delete');

                // redrawing to original page
                shop_table.page(currentPage).draw('page');

                notyf.success({
                    message: 'Shop  Deleted <strong>Successfully !</strong>',
                    duration: 7000,
                    icon: false
                });

                rowData = undefined;
                rowIndex = undefined;
            },
            error: function () {
                $("#delete_shop").text('Delete');
                notyf.error({
                    message: "<strong>Warning !</strong> Can't Delete shop",
                    duration: 7000,
                    icon: false
                });
            },
        });
    });
/* ### Delete Data End ### */

//Reset Input when close modal
$('#add_shop_modal').on('hidden.bs.modal', function () {
    $(this).find('#shop_form').trigger('reset');
});
$('#update_shop_modal').on('hidden.bs.modal', function () {
    $(this).find('#update_shop_form').trigger('reset');
});




    /* ### Update Shop Data Start ### */
    // EDIT button
    $('#shop_dataTable tbody').on('click', '#update_shopBtn', function () {
        // getting parent row index and data
        rowIndex = shop_table.row($(this).parents('tr')).index();
        rowData = shop_table.row($(this).parents('tr')).data();
        // console.log(rowData.shop_name)

        // setting row values to update modal input boxes
        $("#update_shopName").val(rowData.shop_name);
        $("#update_branch_name").val(rowData.branch);
        // $("#editAddress").val(rowData.address);
        console.log(rowData)

    })

    // Update Button
    $("#update_shop").click(function () {
        // setting modal input value
        rowData.shop_name = $("#update_shopName").val();
        // rowData.branch = $("#editBranch").val();
        // rowData.address = $("#editAddress").val();

        var objectA = {name: rowData.shop_name};

        // updating button text
        $(this).text('Updating...');

        // updating server row
        $.ajax({
            url: 'https://riyadshop.selopian.us/shop/' + rowData.id,
            type: 'PUT',
            data: JSON.stringify(objectA),
            contentType: "application/json; charset=utf-8",
            // dataType: "json",
            success: function (sres) {

                //Set default button text again
                $("#update_shop").text('Update Info');

                // hide modal
                const modal = bootstrap.Modal.getInstance($("#update_shop_modal"));
                modal.hide();

                // notification
                notyf.success({
                    message: "Shop updated <strong>successfully</strong>",
                    duration: 7000,
                    icon: false
                });

                let currentPage = shop_table.page();

                // update datatable
                shop_table.row(rowIndex).data(rowData).draw();

                // redrawing to original page
                shop_table.page(currentPage).draw('page');

                // highlighting newly added row
                $(shop_table.row(rowIndex).nodes()).addClass('selected');
                setTimeout(function () {
                    $(shop_table.row(rowIndex).nodes()).removeClass('selected');
                }, 2000);


            },
            error: function () {
                //Set default button text again
                $("#update_shop").text('Update Info');

                //Notification
                notyf.error({
                    message: "<strong>Warning !</strong> Can't update shop.",
                    duration: 7000,
                    icon: false
                });
            }
        });
    })

    // Update Branch Button
    $("#update_shop").click(function () {
        // setting modal input value
        rowData.name = $("#update_branch_name").val();
        rowData.branch = $("#editBranch").val();
        // rowData.address = $("#editAddress").val();

        var objectA = {name: rowData.shop_name};

        // updating button text
        $(this).text('Updating...');

        // updating server row
        $.ajax({
            url: 'https://riyadshop.selopian.us/shop/' + rowData.id,
            type: 'PUT',
            data: JSON.stringify(objectA),
            contentType: "application/json; charset=utf-8",
            // dataType: "json",
            success: function (sres) {

                //Set default button text again
                $("#update_shop").text('Update Info');

                // hide modal
                const modal = bootstrap.Modal.getInstance($("#update_shop_modal"));
                modal.hide();

                // notification
                notyf.success({
                    message: "Shop updated <strong>successfully</strong>",
                    duration: 7000,
                    icon: false
                });

                let currentPage = shop_table.page();

                // update datatable
                shop_table.row(rowIndex).data(rowData).draw();

                // redrawing to original page
                shop_table.page(currentPage).draw('page');

                // highlighting newly added row
                $(shop_table.row(rowIndex).nodes()).addClass('selected');
                setTimeout(function () {
                    $(shop_table.row(rowIndex).nodes()).removeClass('selected');
                }, 2000);


            },
            error: function () {
                //Set default button text again
                $("#update_shop").text('Update Info');

                //Notification
                notyf.error({
                    message: "<strong>Warning !</strong> Can't update shop.",
                    duration: 7000,
                    icon: false
                });
            }
        });

    });

    // const a = () =>{
    //     console.log(1)
    // }
    // const b = () =>{
    //     console.log(2)
    // }
    // const submitForm = () =>{
    //     a()
    //     b()
    // }
    //

    /* ### Update Data End ### */

    // /* ### Add Data Start ### */
    // $("#add_shop").click(function(){
    //
    //     if( $('#shop_form')[0].checkValidity() ) {
    //         $(this).text('Submitting..');
    //         let formPostModalData = {
    //             name: $("#name").val(),
    //             branch: $("#branch").val(),
    //             location: $("#address").val()
    //
    //         };
    //         $.ajax({
    //             url: 'http://103.205.71.148/shop',
    //             type: 'POST',
    //             data: JSON.stringify(formPostModalData),
    //             contentType: "application/json",
    //             success: function(data)
    //             {
    //                 //add row from input fields
    //
    //                 let newRowIndex = shop_table.row.add(data).draw();
    //
    //                 $("#add_shop").text('Submit');
    //                 const modal = bootstrap.Modal.getInstance($("#add_shop_modal"));
    //                 modal.hide();
    //
    //                 //reset input Field
    //                 $('form :input').val('');
    //                 $('.input').val('');
    //
    //                 // reset search
    //                 shop_table.search('');
    //
    //                 // re-ordering to default
    //                 shop_table.order( [ 0, 'desc' ] ).draw();
    //
    //                 // highlighting newly added row
    //                 $( shop_table.row(newRowIndex.index()).nodes()).addClass( 'selected' );
    //                 setTimeout(function () { $( shop_table.row(newRowIndex.index()).nodes() ).removeClass( 'selected' ); }, 2000);
    //
    //                 //Success Notification
    //                 notyf.success({
    //                     message: 'New Shop Added  <strong>Successfully !</strong>',
    //                     duration: 7000,
    //                     icon: false
    //                 });
    //             },
    //             error: function()
    //             {
    //                 //Set default button text again
    //                 $("#add_shop").text('Submit');
    //
    //                 //Notification
    //                 notyf.error({
    //                     message: "<strong>Warning !</strong> Can't update shop.",
    //                     duration: 7000,
    //                     icon: false
    //                 });
    //             }
    //         });
    //
    //     } else {
    //
    //         $('#shop_form')[0].reportValidity();
    //
    //     }
    // })
    /* ### Add Data End ### */


    /* ### Delete Data Start ### */

    //     // DELETE button
    //     $('#shop_dataTable tbody').on('click', '#delete_shopBtn', function () {
    //         rowData =  shop_table.row($(this).parents('tr')).data();
    //         rowIndex = shop_table.row($(this).parents('tr')).index();
    //         // Set value on Modal
    //         $("#sName").text(`Are you sure you want to delete "${rowData.name}"?`);
    //     });
    //
    //     // DELETE Confirmation button
    //     $("#delete_shop").click(function() {
    //
    //         $(this).text('Deleting...');
    //         $.ajax({
    //             url: 'http://103.205.71.148/shop/' + rowData.id + '/',
    //             type: 'DELETE',
    //             dataType: "json",
    //             success: function(data )
    //             {
    //                 let currentPage = shop_table.page();
    //                 shop_table.row(rowIndex).remove().draw();
    //
    //                 const modal = bootstrap.Modal.getInstance($("#delete_shop_modal"));
    //                 modal.hide();
    //
    //                 $("#delete_shop").text('Delete');
    //
    //                 // redrawing to original page
    //                 shop_table.page(currentPage).draw( 'page' );
    //
    //                 notyf.success({
    //                     message: 'Shop  Deleted <strong>Successfully !</strong>',
    //                     duration: 7000,
    //                     icon: false
    //                 });
    //
    //                 rowData = undefined;
    //                 rowIndex = undefined;
    //             },
    //             error: function()
    //             {
    //                 $("#delete_shop").text('Delete');
    //                 notyf.error({
    //                     message: "<strong>Warning !</strong> Can't Delete shop",
    //                     duration: 7000,
    //                     icon: false
    //                 });
    //             },
    //         });
    //     });
    //     /* ### Delete Data End ### */
    //
    //     //Reset Input when close modal
    //     $('#add_shop_modal').on('hidden.bs.modal', function () {
    //         $(this).find('#shop_form').trigger('reset');
    //     });
    //     $('#update_shop_modal').on('hidden.bs.modal', function () {
    //         $(this).find('#update_shop_form').trigger('reset');
    //     });
    //
    // });
    //


    //    USER====================================================================================================================


    //init User datatable and load data

    let user_table = $('#user_dataTable').DataTable({
        ajax: {
            url: shakila_domain + '/user',
            dataSrc: 'data',
        },
        rowId: 'id',
        dom: 'Blfrtip',
        oLanguage: {
            sLengthMenu: "Show _MENU_",
        },
        language: {
            search: "",
            searchPlaceholder: "Search..."
        },
        buttons: [
            {
                extend: 'print',
                title: 'Shop Information',
                orientation: 'landscape',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5],
                    modifier: {
                        page: 'current'
                    }
                },
                pageSize: 'LEGAL',
                customize: function (win) {
                    $(win.document.body)
                        .css('font-size', '15pt')
                    $(win.document.body).find('th')
                        .css({
                            "font-size": 'inherit',
                            "text-align": 'center',
                        })
                        .addClass('compact')
                    $(win.document.body).find('table')
                        .css('font-size', 'inherit')
                        .css('text-align', 'center')
                }
            },
            {
                extend: 'excelHtml5',
                title: 'Shop Information',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5]
                },
            },
            {
                extend: 'pdf',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5],
                    modifier: {
                        page: 'current'
                    }
                },
                pageSize: 'LEGAL',
                title: 'Shop Information',
                customize: function (doc) {
                    doc.content[1].table.widths = [
                        '15%',
                        '15%',
                        '15%',
                        '15%',
                        '15%',
                        '15%',
                    ]
                    let rowCount = doc.content[1].table.body.length;
                    for (let i = 1; i < rowCount; i++) {
                        doc.content[1].table.body[i][0].alignment = 'center';
                        doc.content[1].table.body[i][1].alignment = 'center';
                        doc.content[1].table.body[i][2].alignment = 'center';
                    }
                }
            },

            '<button id="addUser"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_user_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
        ],
        columns: [
            {data: 'phone_username'},
            {
                data: 'role',
                render: function (data) {
                    if (data === 1) {
                        return 'Admin';
                    } else {
                        return 'Salesman';
                    }
                }
            },
            {
                data: 'account_status',
                render: function (data) {
                    if (data === 1) {
                        return 'Active';
                    } else {
                        return 'Inactive';
                    }
                }
            },
            {data: 'last_login'},
            {data: 'last_ip'},

            {
                data: '',
                render: function () {
                    return '<button id="update_userBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_user_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  '
                        + '<button   id="delete_userBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_user_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
                }
            },
        ]
    });

    //POST USER-----------------------------------------------

    /* ### Add Data Start ### */
    $("#add_user").click(function () {
        $("#add_user").text('Adding');
        let addUser = {
            phone_username: $("#user_number").val(),
            role: $("#user_role").val(),
            password: $("#user_password").val(),
        };
        $.ajax({
            url: shakila_domain + '/user',
            type: 'POST',
            data: JSON.stringify(addUser),
            contentType: "application/json",
            success: function (data) {
                if (data.status.code === 1) {
                    notyf.success({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });
                    const modal = bootstrap.Modal.getInstance($("#add_user_modal"));
                    modal.hide();
                    let newRowIndex = user_table.row.add(addUser).draw();
                    $("#add_user").text('Add User');
                    //reset input Field
                    $('form :input').val('');
                    $('.input').val('');
                    user_table.search('');
                    // re-ordering to default
                    user_table.order([0, 'desc']).draw();
                    // highlighting newly added row
                    $(user_table.row(newRowIndex.index()).nodes()).addClass('selected');

                } else {
                    notyf.error({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });
                }
            },
        });
    })


    // Delete User button----------

    $('#user_dataTable tbody').on('click', '#delete_userBtn', function () {
        rowData = user_table.row($(this).parents('tr')).data();
        rowIndex = user_table.row($(this).parents('tr')).index();
    });


    // User DELETE Confirmation button
    $("#delete_user").click(function () {

        $(this).text('Deleting...');
        $.ajax({
            url: shakila_domain + '/user/' + rowData.id,
            type: 'DELETE',
            success: function (data) {

                if (data.status.code === 1) {
                    const modal = bootstrap.Modal.getInstance($("#delete_user_modal"));
                    modal.hide();
                    $("#delete_user").text('Delete');
                    notyf.success({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });

                    $("#delete_user").text('Delete');
                    user_table.row(rowIndex).remove().draw();
                    let currentPage = user_table.page();
                    user_table.page(currentPage).draw('page');

                    rowData = undefined;
                    rowIndex = undefined;
                } else {
                    console.log("else" + data.status.message)
                    $("#delete_user").text('Delete');
                    const modal = bootstrap.Modal.getInstance($("#delete_user_modal"));
                    modal.hide();
                    notyf.error({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });

                    rowData = undefined;
                    rowIndex = undefined;
                }


            },
            error: function (data) {
                $("#delete_user").text('Delete');
                const modal = bootstrap.Modal.getInstance($("#delete_user_modal"));
                modal.hide();
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });


            },
        });
    });


    /*--- Salesman Start ---*/

    //init Salesman datatable and load data
    let salesman_table = $('#salesman_dataTable').DataTable({
        order: [[0, 'desc']],
        "columnDefs": [
            {'visible': false, 'targets': 0},
            {"width": "25%", "targets": 1},
            {"width": "15%", "targets": 2},
            {'visible': false, 'targets': 3},
            {'visible': false, 'targets': 4},
            {'visible': false, 'targets': 5},
            {'visible': false, 'targets': 6},
            {'visible': false, 'targets': 7},
            {'visible': false, 'targets': 8},
            {"width": "10%", "targets": 9},
            {"width": "10%", "targets": 10},
            {'visible': false, 'targets': 11},
            {'visible': false, 'targets': 12},
            {'visible': false, 'targets': 13},
            {"width": "10%", "targets": 14},
            {"width": "10%", "targets": 15}
        ],

        ajax: {
            url: 'http://103.205.71.148/salesman',
            dataSrc: 'content',
        },
        rowId: 'id',
        dom: 'Blfrtip',
        oLanguage: {
            sLengthMenu: "Show _MENU_",
        },
        language: {
            search: "",
            searchPlaceholder: "Search..."
        },
        buttons: [
            {
                extend: 'print',
                title: 'Salesman Information',
                orientation: 'landscape',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13,],
                    modifier: {
                        page: 'current'
                    }
                },
                pageSize: 'LEGAL',
                customize: function (salesman) {
                    $(salesman.document.body)
                        .css('font-size', '10pt')
                }
            },
            {
                extend: 'excelHtml5',
                title: 'Shop Information',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13,]

                },

            },
            {
                extend: 'pdf',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13,],
                },
                pageSize: 'LEGAL',
                title: 'Shop Information',
                customize: function (doc) {
                    doc.content[1].table.widths = [
                        '11%',
                        '8%',
                        '5%',
                        '8%',
                        '10%',
                        '10%',
                        '15%',
                        '7%',
                        '7%',
                        '10%',
                        '8%',
                    ]
                    let salesmanRowCount = doc.content[1].table.body.length;
                    for (let i = 1; i < salesmanRowCount; i++) {
                        doc.content[1].table.body[i][0].alignment = 'center';
                        doc.content[1].table.body[i][1].alignment = 'center';
                        doc.content[1].table.body[i][2].alignment = 'center';
                        doc.content[1].table.body[i][3].alignment = 'center';
                        doc.content[1].table.body[i][4].alignment = 'center';
                        doc.content[1].table.body[i][5].alignment = 'center';
                        doc.content[1].table.body[i][6].alignment = 'center';
                        doc.content[1].table.body[i][7].alignment = 'center';
                        doc.content[1].table.body[i][8].alignment = 'center';
                        doc.content[1].table.body[i][9].alignment = 'center';
                        doc.content[1].table.body[i][10].alignment = 'center';
                    }
                }
            },

            '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_salesman_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
        ],
        columns: [
            {data: '_id'},
            {data: 'name'},
            {data: 'designation_id.designation'},
            {data: 'age'},
            {
                data: 'gender',
                render: function (data) {
                    if (data === 1) {
                        return 'Male';
                    } else {
                        return 'Female';
                    }
                }
            },
            {data: 'email'},
            {data: 'phone'},
            {data: 'address'},
            {data: 'nid'},
            {
                data: 'nid_photo',
                render: function () {
                    return '<button id="salesman_nid_photo"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#salesman_nidPhoto_modal">View</button>'
                }
            },
            {
                data: 'profile_img_url',
                render: function () {
                    return '<button id="salesman_profile_img_url"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#salesman_profilePhoto_modal">View</button>'
                }
            },
            {data: 'salary'},
            {data: 'joining_date'},
            {
                data: 'status',
                render: function (data) {
                    if (data === 1) {
                        return 'Active';
                    } else {
                        return 'Inactive';
                    }
                }
            },
            {
                data: 'details',
                render: function () {
                    return '<button id="salesman_details"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#details_salesman_modal">Details</button>'
                }
            },
            {
                data: 'action',
                render: function () {
                    return '<button id="update_salesmanBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_salesman_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  '
                        + '<button   id="delete_salesmanBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_salesman_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
                }
            },
        ]
    });


    // Details Button
    $('#salesman_dataTable tbody').on('click', '#salesman_details', function () {
        rowData = salesman_table.row($(this).parents('tr')).data();

        // Set value on Modal
        $("#sd_name").text(rowData.name);
        $("#sd_designation").text(rowData.designation_id.designation);
        $("#sd_age").text(rowData.age);

        if (rowData.gender === 1) {
            $("#sd_gender").text('Male');
        } else {
            $("#sd_gender").text('Female');
        }
        $("#sd_email").text(rowData.email);
        $("#sd_phone").text(rowData.phone);
        $("#sd_address").text(rowData.address);
        $("#sd_nid").text(rowData.nid);
        $("#sd_salary").text(rowData.salary);
        $("#sd_joinDate").text(rowData.joining_date);

        if (rowData.status === 1) {
            $("#sd_status").text('Active');
        } else {
            $("#sd_status").text('Inactive');
        }

    });

    //View  Nid Photo Button
    $('#salesman_dataTable tbody').on('click', '#salesman_nid_photo', function () {
        rowData = salesman_table.row($(this).parents('tr')).data();
        $("#nid_img").attr("src", rowData.nid_photo);
    });
    //View Profile Photo Button
    $('#salesman_dataTable tbody').on('click', '#salesman_profile_img_url', function () {
        rowData = salesman_table.row($(this).parents('tr')).data();
        $("#profile_img").attr("src", rowData.profile_img_url);
    });


    //Salesman CRUD Start

    //Reset salesman add Modal Input when it's Close
    $('#add_salesman_modal').on('hidden.bs.modal', function () {
        $('[data-cropzee="' + 'nid_photos' + '"]').replaceWith('<div class="modal-body align-items-center-center"  data-cropzee="nid_photos"><img  src=""></div>');
        $('[data-cropzee="' + 'profile_photos' + '"]').replaceWith('<div  class="modal-body align-items-center-center"  data-cropzee="profile_photos"><img  src=""></div>');
        $(this).find('#salesman_post_form').trigger('reset');
    });

    //Reset salesman update Modal Input when it's Close
    $('#update_salesman_modal').on('hidden.bs.modal', function () {
        $('[data-cropzee="' + 'salesman_edit_nid_photos' + '"]').replaceWith('<div class="modal-body align-items-center-center"  data-cropzee="salesman_edit_nid_photos"><img id="s_nid_img" src=""></div>');
        $('[data-cropzee="' + 'salesman_edit_profile_photos' + '"]').replaceWith('<div class="modal-body align-items-center-center"  data-cropzee="salesman_edit_profile_photos"><img id="s_profile_img" src=""></div>');
        $(this).find('#salesman_update_form').trigger('reset');
    });


    /* ### Post Data Start ### */
    $("#customer_post_form").on('submit', (function (e) {
        e.preventDefault();
        $.ajax({
            url: 'https://shakila.selopian.us/customer',
            type: "POST",
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,

            success: function (data) {
                alert("Success")
            },
            error: function (e) {
                alert("error")
            }
        });
    }));
    /* ### Post Data End ### */


    /* ### Delete Data Start ### */

    // Delete button
    $('#salesman_dataTable tbody').on('click', '#delete_salesmanBtn', function () {
        rowData = salesman_table.row($(this).parents('tr')).data();
        rowIndex = salesman_table.row($(this).parents('tr')).index();
        // Set name value on Modal
        $("#salesmanName").text(`Are you sure you want to delete "${rowData.name}"?`);
    });

    // DELETE Confirmation button
    $("#delete_salesman").click(function () {

        $(this).text('Deleting...');
        $.ajax({
            url: 'http://103.205.71.148/salesman/' + rowData._id,
            type: 'DELETE',
            success: function (data) {
                let currentPage = salesman_table.page();
                salesman_table.row(rowIndex).remove().draw();

                const modal = bootstrap.Modal.getInstance($("#delete_salesman_modal"));
                modal.hide();

                $("#delete_salesman").text('Delete');

                // redrawing to original page
                salesman_table.page(currentPage).draw('page');

                notyf.success({
                    message: 'Salesman  Deleted <strong>Successfully !</strong>',
                    duration: 7000,
                    icon: false
                });

                rowData = undefined;
                rowIndex = undefined;
            },
            error: function () {
                $("#delete_salesman").text('Delete');
                notyf.error({
                    message: "<strong>Warning !</strong> Can't Delete Salesman",
                    duration: 7000,
                    icon: false
                });
            },
        });
    });
    /* ### Delete Data End ### */


    /* ### Update Salesman Data Start ### */

    $('#salesman_dataTable tbody').on('click', '#update_salesmanBtn', function () {
        // getting parent row Data
        rowData = salesman_table.row($(this).parents('tr')).data();

        // setting row values to update modal input boxes
        $("#salesman_edit_name").val(rowData.name);
        $('#salesman_edit_designation').val(rowData.designation_id._id);
        $("#salesman_edit_age").val(rowData.age);
        $('#salesman_edit_gender').val(rowData.gender);
        $("#salesman_edit_email").val(rowData.email);
        $("#salesman_edit_phone_number").val(rowData.phone);
        $("#salesman_edit_address").val(rowData.address);
        $("#salesman_edit_nid").val(rowData.nid);
        $("#s_nid_img").attr("src", rowData.nid_photo);
        $("#s_profile_img").attr("src", rowData.profile_img_url);
        $("#salesman_edit_salary").val(rowData.salary);
        $("#salesman_edit_joining_date").val(rowData.joining_date);
        $("#salesman_edit_status").val(rowData.status);

        //Close "#" In url From cropzee modal
        closeModal();
    })

    //Chance nid photo preview when update
    function updateNidURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {

                $('#s_nid_img').attr('src', e.target.result);
                $('#s_nid_img').hide();
                $('#s_nid_img').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#salesman_edit_nid_photos").change(function () {
        updateNidURL(this);
    });

    //Chance Profile photo preview when update
    function updateProURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {

                $('#s_profile_img').attr('src', e.target.result);
                $('#s_profile_img').hide();
                $('#s_profile_img').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#salesman_edit_profile_photos").change(function () {
        updateProURL(this);
    });


    // Photo Crop Function From Cropzee
    $(document).ready(function () {
        $("#salesman_edit_profile_photos").cropzee();
        $("#salesman_edit_nid_photos").cropzee();
        $("#nid_photos").cropzee();
        $("#profile_photos").cropzee();
        $("#customer_image").cropzee();


    });


    //SUPPLIER==================================================================================================

    //init supplier datatable and load data

    let shop_supplier_table = $('#supplier_dataTable').DataTable({
        order: [[0, 'desc']],
        "columnDefs": [
            {'visible': false, 'targets': 0},

        ],
        ajax: {
            url: riyad_domain + '/supplier/all',
            dataSrc: 'data',
        },
        rowId: 'id',
        dom: 'Blfrtip',
        oLanguage: {
            sLengthMenu: "Show _MENU_",
        },
        language: {
            search: "",
            searchPlaceholder: "Search..."
        },
        buttons: [
            {
                extend: 'print',
                title: 'Shop Information',
                orientation: 'landscape',
                exportOptions: {
                    columns: [1, 2, 3],
                    modifier: {
                        page: 'current'
                    }
                },
                pageSize: 'LEGAL',
                customize: function (win) {
                    $(win.document.body)
                        .css('font-size', '15pt')
                    $(win.document.body).find('th')
                        .css({
                            "font-size": 'inherit',
                            "text-align": 'center',
                        })
                        .addClass('compact')
                    $(win.document.body).find('table')
                        .css('font-size', 'inherit')
                        .css('text-align', 'center')

                }
            },
            {
                extend: 'excelHtml5',
                title: 'Shop Information',
                exportOptions: {
                    columns: [1, 2, 3]

                },

            },
            {
                extend: 'pdf',
                exportOptions: {
                    columns: [1, 2, 3],
                    modifier: {
                        page: 'current'
                    }
                },
                pageSize: 'LEGAL',
                title: 'Shop Information',
                customize: function (doc) {
                    doc.content[1].table.widths = [
                        '20%',
                        '35%',
                        '45%',
                    ]
                    let rowCount = doc.content[1].table.body.length;
                    for (let i = 1; i < rowCount; i++) {
                        doc.content[1].table.body[i][0].alignment = 'center';
                        doc.content[1].table.body[i][1].alignment = 'center';
                        doc.content[1].table.body[i][2].alignment = 'center';
                    }
                }
            },

            '<button id="supplier_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_supplier_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'

        ],

        columns: [
            {data: 'id'},
            {data: 'name'},
            {data: 'email'},
            {data: 'phone_no'},
            {data: 'address'},
            {data: 'company_name'},
            {data: 'company_phone_no'},
            {data: 'company_address'},
            {data: 'bank_account_info'},
            {data: 'ref_comment'},
            {data: 'blacklist'},
            {
                data: 'image_url',
                render: function () {
                    return '<button id="update_supplierBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"  data-bs-target="#update_supplier_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>'
                        + '<button   id="delete_supplierBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_supplier_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
                }
            },
        ]
    });


    $('#add_supplier_modal').on('hidden.bs.modal', function () {
        $('[data-cropzee="' + 'image_url' + '"]').replaceWith('<div  class="modal-body align-items-center-center"  data-cropzee="image_url"><img  src=""></div>');
        // $(this).find('#Supplier_post_form').trigger('reset');
    });

    $(document).ready(function () {
        $("#image_url").cropzee();
    });


    /* ### Post Data Start ### */
    $("#Supplier_post_form").on('submit', (function (e) {
        e.preventDefault();
        $.ajax({
            url: riyad_domain + '/supplier',
            type: "POST",
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {
                if (data.status.code === 1) {
                    $("#add_supplier").text('Add');

                    const modal = bootstrap.Modal.getInstance($("#add_supplier_modal"));
                    modal.hide();

                    let newSRowIndex = shop_supplier_table.row.add(data).draw();
                    //Success Notification
                    notyf.success({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });
                    //reset input Field
                    $('form :input').val('');
                    $('.input').val('');
                    shop_supplier_table.search('');
                    // re-ordering to default

                    shop_supplier_table.order([0, 'desc']).draw();
                    // highlighting newly added row
                    $(shop_supplier_table.row(newSRowIndex.index()).nodes()).addClass('selected');
                } else {
                    //Set default button text again
                    $("#add_supplier").text('Add');
                    const modal = bootstrap.Modal.getInstance($("#add_supplier_modal"));
                    modal.hide();
                    //Notification
                    notyf.error({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });
                }
            },
            error: function (data) {
                $("#add_supplier").text('Add');
                const modal = bootstrap.Modal.getInstance($("#add_supplier_modal"));
                modal.hide();
                //Notification
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            }
        });
    }));

    //Delete supplier-------------------------------------

    $('#supplier_dataTable tbody').on('click', '#delete_supplierBtn', function () {
        rowData = shop_supplier_table.row($(this).parents('tr')).data();
        rowIndex = shop_supplier_table.row($(this).parents('tr')).index();
    });

    // DELETE Confirmation button
    $("#delete_supplier").click(function () {

        $(this).text('Deleting...');
        $.ajax({
            url: riyad_domain + '/supplier/' + rowData.id,
            type: 'DELETE',
            dataType: "json",
            success: function (data) {
                let currentPage = shop_supplier_table.page();
                shop_supplier_table.row(rowIndex).remove().draw();

                const modal = bootstrap.Modal.getInstance($("#delete_supplier_modal"));
                modal.hide();

                $("#delete_supplier").text('Delete');

                // redrawing to original page
                shop_supplier_table.page(currentPage).draw('page');

                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });

                rowData = undefined;
                rowIndex = undefined;
            },
            error: function (data) {
                $("#delete_supplier").text('Delete');
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            },
        });
    });


    // $(document).ready(function () {
    //
    //     /* ### Update Supplier Data Start ### */
    //     // EDIT button
    //     $('#supplier_dataTable tbody').on('click', '#update_supplierBtn', function () {
    //         // getting parent row index and data
    //         rowIndex = supplier_table.row($(this).parents('tr')).index();
    //         rowData = supplier_table.row($(this).parents('tr')).data();
    //
    //         // setting row values to update modal input boxes
    //         $("#update_supplier_name").val(rowData.name);
    //         $("#update_supplier_phone").val(rowData.phone);
    //         $("#update_supplier_address").val(rowData.address);
    //         $("#update_supplier_status").val(rowData.status);
    //     })
    //
    //     // Update Button
    //     $("#update_supplier").click(function () {
    //
    //         if ($('#update_shop_form')[0].checkValidity()) {
    //             // setting modal input value
    //             rowData.name = $("#update_supplier_name").val();
    //             rowData.phone = $("#update_supplier_phone").val();
    //             rowData.address = $("#update_supplier_address").val();
    //             rowData.status = $("#update_supplier_status").val();
    //
    //             // updating button text
    //             $(this).text('Updating...');
    //
    //             // updating server row
    //             $.ajax({
    //                 url: 'https://62b15c56196a9e987033e9c4.mockapi.io/supplier/' + rowData.id,
    //                 type: 'PUT',
    //                 data: JSON.stringify(rowData),
    //                 contentType: "application/json; charset=utf-8",
    //                 success: function () {
    //
    //                     // hide modal
    //                     const modal = bootstrap.Modal.getInstance($("#update_supplier_modal"));
    //                     modal.hide();
    //
    //                     //Set default button text again
    //                     $("#update_shop").text('Update Info');
    //
    //                     let currentPage = supplier_table.page();
    //
    //                     // update datatable
    //                     supplier_table.row(rowIndex).data(rowData).draw();
    //
    //                     // redrawing to original page
    //                     supplier_table.page(currentPage).draw('page');
    //
    //                     // highlighting newly added row
    //                     $(supplier_table.row(rowIndex).nodes()).addClass('selected');
    //                     setTimeout(function () {
    //                         $(supplier_table.row(rowIndex).nodes()).removeClass('selected');
    //                     }, 2000);
    //
    //                     // notification
    //                     notyf.success({
    //                         message: "Shop updated <strong>successfully</strong>",
    //                         duration: 7000,
    //                         icon: false
    //                     });
    //
    //                 },
    //
    //                 error: function () {
    //                     //Set default button text again
    //                     $("#update_shop").text('Update Info');
    //
    //                     //Notification
    //                     notyf.error({
    //                         message: "<strong>Warning !</strong> Can't update shop.",
    //                         duration: 7000,
    //                         icon: false
    //                     });
    //                 }
    //             });
    //         } else {
    //
    //             $('#update_shop_form')[0].reportValidity();
    //         }
    //     });
    //
    //     /* ### Update Data End ### */
    //
    //     /* ### Add Data Start ### */
    //     $("#add_supplier").click(function () {
    //
    //         if ($('#supplier_form')[0].checkValidity()) {
    //             $(this).text('Submitting..');
    //             let formPostModalData = {
    //                 name: $("#supplier_name").val(),
    //                 phone: $("#supplier_phone").val(),
    //                 address: $("#supplier_address").val(),
    //                 status: $("#supplier_status").val()
    //
    //             };
    //             $.ajax({
    //                 url: 'https://62b15c56196a9e987033e9c4.mockapi.io/supplier',
    //                 type: 'POST',
    //                 data: JSON.stringify(formPostModalData),
    //                 contentType: "application/json",
    //                 success: function (data) {
    //                     //add row from input fields
    //
    //                     let newRowIndex = supplier_table.row.add(data).draw();
    //
    //                     $("#add_supplier").text('Submit');
    //                     const modal = bootstrap.Modal.getInstance($("#add_supplier_modal"));
    //                     modal.hide();
    //
    //                     //reset input Field
    //                     $('form :input').val('');
    //                     $('.input').val('');
    //
    //                     // reset search
    //                     supplier_table.search('');
    //
    //                     // re-ordering to default
    //                     supplier_table.order([0, 'desc']).draw();
    //
    //                     // highlighting newly added row
    //                     $(supplier_table.row(newRowIndex.index()).nodes()).addClass('selected');
    //                     setTimeout(function () {
    //                         $(supplier_table.row(newRowIndex.index()).nodes()).removeClass('selected');
    //                     }, 2000);
    //
    //                     //Success Notification
    //                     notyf.success({
    //                         message: 'New Shop Added  <strong>Successfully !</strong>',
    //                         duration: 7000,
    //                         icon: false
    //                     });
    //                 },
    //                 error: function () {
    //                     //Set default button text again
    //                     $("#add_supplier").text('Submit');
    //
    //                     //Notification
    //                     notyf.error({
    //                         message: "<strong>Warning !</strong> Can't update shop.",
    //                         duration: 7000,
    //                         icon: false
    //                     });
    //                 }
    //             });
    //
    //         } else {
    //
    //             $('#supplier_form')[0].reportValidity();
    //
    //         }
    //     })
    //     /* ### Add Data End ### */
    //
    //
    //     /* ### Delete Data Start ### */
    //
    //     // DELETE button
    //     $('#supplier_dataTable tbody').on('click', '#delete_supplierBtn', function () {
    //         rowData = supplier_table.row($(this).parents('tr')).data();
    //         rowIndex = supplier_table.row($(this).parents('tr')).index();
    //         // Set value on Modal
    //         $("#supplier_Delete_name").text(`Are you sure you want to delete "${rowData.name}"?`);
    //     });
    //
    //     // DELETE Confirmation button
    //     $("#delete_supplier").click(function () {
    //
    //         $(this).text('Deleting...');
    //         $.ajax({
    //             url: 'https://62b15c56196a9e987033e9c4.mockapi.io/supplier/' + rowData.id,
    //             type: 'DELETE',
    //             dataType: "json",
    //             success: function (data) {
    //                 let currentPage = supplier_table.page();
    //                 supplier_table.row(rowIndex).remove().draw();
    //
    //                 const modal = bootstrap.Modal.getInstance($("#delete_supplier_modal"));
    //                 modal.hide();
    //
    //                 $("#delete_supplier").text('Delete');
    //
    //                 // redrawing to original page
    //                 supplier_table.page(currentPage).draw('page');
    //
    //                 notyf.success({
    //                     message: 'Supplier  Deleted <strong>Successfully !</strong>',
    //                     duration: 7000,
    //                     icon: false
    //                 });
    //
    //                 rowData = undefined;
    //                 rowIndex = undefined;
    //             },
    //             error: function () {
    //                 $("#delete_supplier").text('Delete');
    //                 notyf.error({
    //                     message: "<strong>Warning !</strong> Can't Delete shop",
    //                     duration: 7000,
    //                     icon: false
    //                 });
    //             },
    //         });
    //     });
    //     /* ### Delete Data End ### */
    //
    //     //Reset Input when close modal
    //     $('#add_supplier_modal').on('hidden.bs.modal', function () {
    //         $(this).find('#supplier_form').trigger('reset');
    //     });
    //     $('#update_supplier_modal').on('hidden.bs.modal', function () {
    //         $(this).find('#update_supplier_form').trigger('reset');
    //     });
    //
    // })


    //BRAND=================================================================================================================================================


    //init shop & branch  datatable and load data
    let brand_table = $('#Brand_dataTable').DataTable({

        ajax: {
            url: 'https://riyadshop.selopian.us/brand',
            dataSrc: 'data',
        },
        rowId: 'id',
        dom: 'Blfrtip',
        oLanguage: {
            sLengthMenu: "Show _MENU_",
        },
        language: {
            search: "",
            searchPlaceholder: "Search..."
        },
        buttons: [
            {
                extend: 'print',
                title: 'Shop Information',
                orientation: 'landscape',
                exportOptions: {
                    columns: [1, 2, 3],
                    modifier: {
                        page: 'current'
                    }
                },
                pageSize: 'LEGAL',
                customize: function (win) {
                    $(win.document.body)
                        .css('font-size', '15pt')
                    $(win.document.body).find('th')
                        .css({
                            "font-size": 'inherit',
                            "text-align": 'center',
                        })
                        .addClass('compact')
                    $(win.document.body).find('table')
                        .css('font-size', 'inherit')
                        .css('text-align', 'center')

                }
            },
            {
                extend: 'excelHtml5',
                title: 'Shop Information',
                exportOptions: {
                    columns: [1, 2, 3]

                },

            },
            {
                extend: 'pdf',
                exportOptions: {
                    columns: [1, 2, 3],
                    modifier: {
                        page: 'current'
                    }
                },
                pageSize: 'LEGAL',
                title: 'Shop Information',
                customize: function (doc) {
                    doc.content[1].table.widths = [
                        '20%',
                        '35%',
                        '45%',
                    ]
                    let rowCount = doc.content[1].table.body.length;
                    for (let i = 1; i < rowCount; i++) {
                        doc.content[1].table.body[i][0].alignment = 'center';
                        doc.content[1].table.body[i][1].alignment = 'center';
                        doc.content[1].table.body[i][2].alignment = 'center';
                    }
                }
            },

            '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_shop_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'

        ],

        columns: [

            {data: 'name'},
            {data: 'description'},
            {
                data: '',
                render: function () {
                    return '<button id="update_shopBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_shop_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  '
                        + '<button   id="delete_shopBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_shop_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
                }
            },
        ]
    });


    //Department=======================================================================================================================================

    //init Department datatable and load data
    let department_table = $('#department_dataTable').DataTable({

        ajax: {
            url: nafisa_domain + '/department',
            dataSrc: 'data',
        },

        rowId: 'id',
        dom: 'Blfrtip',
        oLanguage: {
            sLengthMenu: "Show _MENU_",
        },
        language: {
            search: "",
            searchPlaceholder: "Search..."
        },
        buttons: [
            {
                extend: 'print',
                title: 'Shop Information',
                orientation: 'landscape',
                exportOptions: {
                    columns: [1],
                    modifier: {
                        page: 'current'
                    }
                },
                pageSize: 'LEGAL',
                customize: function (win) {
                    $(win.document.body)
                        .css('font-size', '15pt')
                    $(win.document.body).find('th')
                        .css({
                            "font-size": 'inherit',
                            "text-align": 'center',
                        })
                        .addClass('compact')
                    $(win.document.body).find('table')
                        .css('font-size', 'inherit')
                        .css('text-align', 'center')

                }
            },
            {
                extend: 'excelHtml5',
                title: 'Shop Information',
                exportOptions: {
                    columns: [1, 2, 3]

                },

            },
            {
                extend: 'pdf',
                exportOptions: {
                    columns: [1, 2, 3],
                    modifier: {
                        page: 'current'
                    }
                },
                pageSize: 'LEGAL',
                title: 'Shop Information',
                customize: function (doc) {
                    doc.content[1].table.widths = [
                        '20%',
                        '35%',
                        '45%',
                    ]
                    let rowCount = doc.content[1].table.body.length;
                    for (let i = 1; i < rowCount; i++) {
                        doc.content[1].table.body[i][0].alignment = 'center';
                        doc.content[1].table.body[i][1].alignment = 'center';
                        doc.content[1].table.body[i][2].alignment = 'center';
                    }
                }
            },

            '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_department_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'

        ],

        columns: [

            {data: 'name'},
            {
                data: '',
                render: function () {
                    return '<button id="update_department_btn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_department_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  '
                        + '<button   id="delete_department_btn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_department_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
                }
            },
        ]

    });

    // Add Department

    $("#add_department").click(function () {

        $(this).text('Adding...');
        let addDepartment = {
            name: $("#department_name").val(),
        };
        $.ajax({
            url: nafisa_domain + '/department',
            type: 'POST',
            data: JSON.stringify(addDepartment),
            contentType: "application/json",
            success: function (data) {

                console.log(data)
                if (data.status.code === 1) {
                    $("#add_department").text('Add');

                    const modal = bootstrap.Modal.getInstance($("#add_department_modal"));
                    modal.hide();

                    let newRowIndex = department_table.row.add(addDepartment).draw();

                    //Success Notification
                    notyf.success({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });
                    //reset input Field
                    $('form :input').val('');
                    $('.input').val('');
                    department_table.search('');
                    // re-ordering to default

                    department_table.order([0, 'desc']).draw();
                    // highlighting newly added row
                    $(department_table.row(newRowIndex.index()).nodes()).addClass('selected');
                } else {
                    //Set default button text again
                    $("#add_department").text('Add');

                    //Notification
                    notyf.error({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });
                }
            },
        });
    })

    //Update Department-------------------------------


    // EDIT button
    $('#department_dataTable tbody').on('click', '#update_department_btn', function () {
        // getting parent row index and data
        rowIndex = department_table.row($(this).parents('tr')).index();
        rowData = department_table.row($(this).parents('tr')).data();

        console.log(rowData.name)
        // setting row values to update modal input boxes
        $("#update_department_name").val(rowData.name);

    })

    // Update Button
    $("#update_department").click(function () {


        let updateDepartment = {
            name: $("#update_department_name").val(),
        };
        $(this).text('Updating...');
        // updating server row
        $.ajax({
            url: nafisa_domain + '/department/' + rowData.id,
            type: 'PUT',
            data: JSON.stringify(updateDepartment),
            contentType: "application/json; charset=utf-8",
            success: function (data) {


                if (data.status.code === 1) {
                    // hide modal
                    const modal = bootstrap.Modal.getInstance($("#update_department_modal"));
                    modal.hide();

                    //Set default button text again
                    $("#update_department").text('Update');

                    let currentPage = department_table.page();

                    // update datatable
                    department_table.row(rowIndex).data(updateDepartment).draw();

                    // redrawing to original page
                    department_table.page(currentPage).draw('page');
                    // highlighting newly added row
                    $(department_table.row(rowIndex).nodes()).addClass('selected');
                    setTimeout(function () {
                        $(department_table.row(rowIndex).nodes()).removeClass('selected');
                    }, 2000);

                    // notification
                    notyf.success({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });

                } else {
                    $("#update_department").text('Update');
                    const modal = bootstrap.Modal.getInstance($("#update_department_modal"));
                    modal.hide();
                    notyf.error({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });

                }

            },

            error: function () {
                $("#update_department").text('Update');
                const modal = bootstrap.Modal.getInstance($("#update_department_modal"));
                modal.hide();
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            }
        });

    });


    //Delete Department----------------------------------------


    // Delete User button----------

    $('#department_dataTable tbody').on('click', '#delete_department_btn', function () {
        rowData = department_table.row($(this).parents('tr')).data();
        rowIndex = department_table.row($(this).parents('tr')).index();
    });


    // User DELETE Confirmation button
    $("#delete_department").click(function () {
        console.log(rowData.id)

        $(this).text('Deleting...');
        $.ajax({
            url: nafisa_domain + '/department/' + rowData.id,
            type: 'DELETE',
            success: function (data) {
                if (data.status.code === 1) {

                    const modal = bootstrap.Modal.getInstance($("#delete_department_modal"));
                    modal.hide();

                    notyf.success({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });

                    $("#delete_department").text('Delete');
                    department_table.row(rowIndex).remove().draw();
                    let currentPage = department_table.page();
                    department_table.page(currentPage).draw('page');

                    rowData = undefined;
                    rowIndex = undefined;
                } else {
                    $("#delete_department").text('Delete');
                    const modal = bootstrap.Modal.getInstance($("#delete_department_modal"));
                    modal.hide();
                    notyf.error({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });
                    rowData = undefined;
                    rowIndex = undefined;
                }

            },
            error: function (data) {
                $("#delete_department").text('Delete');
                const modal = bootstrap.Modal.getInstance($("#delete_department_modal"));
                modal.hide();
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
                rowData = undefined;
                rowIndex = undefined;
            },
        });
    });


    //Category=========================================================================================================================================

    //init category  datatable and load data
    let category_table = $('#category_dataTable').DataTable({

        ajax: {
            url: nafisa_domain + '/category',
            dataSrc: 'data',
        },
        rowId: 'id',
        dom: 'Blfrtip',
        oLanguage: {
            sLengthMenu: "Show _MENU_",
        },
        language: {
            search: "",
            searchPlaceholder: "Search..."
        },
        buttons: [
            {
                extend: 'print',
                title: 'Shop Information',
                orientation: 'landscape',
                exportOptions: {
                    columns: [1, 2, 3],
                    modifier: {
                        page: 'current'
                    }
                },
                pageSize: 'LEGAL',
                customize: function (win) {
                    $(win.document.body)
                        .css('font-size', '15pt')
                    $(win.document.body).find('th')
                        .css({
                            "font-size": 'inherit',
                            "text-align": 'center',
                        })
                        .addClass('compact')
                    $(win.document.body).find('table')
                        .css('font-size', 'inherit')
                        .css('text-align', 'center')

                }
            },
            {
                extend: 'excelHtml5',
                title: 'Shop Information',
                exportOptions: {
                    columns: [1, 2, 3]

                },

            },
            {
                extend: 'pdf',
                exportOptions: {
                    columns: [1, 2, 3],
                    modifier: {
                        page: 'current'
                    }
                },
                pageSize: 'LEGAL',
                title: 'Shop Information',
                customize: function (doc) {
                    doc.content[1].table.widths = [
                        '20%',
                        '35%',
                        '45%',
                    ]
                    let rowCount = doc.content[1].table.body.length;
                    for (let i = 1; i < rowCount; i++) {
                        doc.content[1].table.body[i][0].alignment = 'center';
                        doc.content[1].table.body[i][1].alignment = 'center';
                        doc.content[1].table.body[i][2].alignment = 'center';
                    }
                }
            },

            '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_category_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'

        ],

        columns: [
            {data: 'name'},
            {data: 'description'},
            {data: 'featured'},

            {
                data: 'id',
                render: function () {
                    return '<button id="update_categoryBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_category_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  '
                        + '<button   id="delete_categorybtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_category_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
                }
            },
        ]
    });

    //init Parent--------------------------------------------
    $.ajax({
        url: 'https://nafisa.selopian.us/category/byparent/0',
        type: 'GET',
        success: function (data) {
            let category_parents = data?.data.map(item => item)
            category_parents.forEach((element) => {
                $('<option/>').val(element['id']).html(element['name']).appendTo('#cParent', '#update_cParent');

            });
        }

    });

    //Post Category-------------------------------------------

    $("#add_category").click(function () {

        $(this).text('Submitting..');
        let addcategoryModal = {
            name: $("#category_name").val(),
            description: $("#category_description").val(),
            parent_id: $("#cParent").val(),
            featured: $("#category_featured").val(),

        };
        $.ajax({
            url: nafisa_domain + '/category',
            type: 'POST',
            data: JSON.stringify(addcategoryModal),
            contentType: "application/json",
            success: function (data) {

                if (data.status.code === 1) {

                    const modal = bootstrap.Modal.getInstance($("#add_category_modal"));
                    modal.hide();
                    notyf.success({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });
                    let newRowIndex = category_table.row.add(addcategoryModal).draw();

                    //Success Notification

                    $("#add_category").text('Submit');

                    //reset input Field
                    $('form :input').val('');
                    $('.input').val('');
                    category_table.search('');
                    // re-ordering to default

                    category_table.order([0, 'desc']).draw();
                    // highlighting newly added row
                    $(category_table.row(newRowIndex.index()).nodes()).addClass('selected');
                } else {
                    //Set default button text again
                    $("#add_category").text('Submit');
                    const modal = bootstrap.Modal.getInstance($("#add_category_modal"));
                    modal.hide();
                    //Notification
                    notyf.error({
                        message: "<strong>Warning !</strong> Can't Add Category.",
                        duration: 7000,
                        icon: false
                    });

                }

            },

        });

    })

    //Update Category-----------------------------------

    // EDIT button
    $('#category_dataTable tbody').on('click', '#update_categoryBtn', function () {
        // getting parent row index and data
        rowIndex = category_table.row($(this).parents('tr')).index();
        rowData = category_table.row($(this).parents('tr')).data();

        // setting row values to update modal input boxes
        $("#update_category_name").val(rowData.name);
        $("#update_category_description").val(rowData.description);
        $('<option/>').val(rowData['id']).html(rowData['name']).appendTo('#update_cParent');
        $("#update_category_featured").val(rowData.featured);
    })

    // Update Button
    $("#update_category").click(function () {


        let ddcategoryModal = {
            name: $("#update_category_name").val(),
            description: $("#update_category_description").val(),
            parent_id: $("#update_cParent").val(),
            featured: $("#update_category_featured").val(),

        };

        // updating button text
        $(this).text('Updating...');

        console.log(rowData)
        // updating server row
        $.ajax({
            url: nafisa_domain + '/category/' + rowData.id,
            type: 'PUT',
            data: JSON.stringify(ddcategoryModal),
            contentType: "application/json; charset=utf-8",
            success: function (data) {

                if (data.status.code === 1) {
                    // hide modal
                    const modal = bootstrap.Modal.getInstance($("#update_category_modal"));
                    modal.hide();

                    //Set default button text again
                    $("#update_category").text('Update');

                    let currentPage = category_table.page();

                    // update datatable
                    category_table.row(rowIndex).data(ddcategoryModal).draw();

                    // redrawing to original page
                    category_table.page(currentPage).draw('page');

                    // highlighting newly added row
                    $(category_table.row(rowIndex).nodes()).addClass('selected');
                    setTimeout(function () {
                        $(category_table.row(rowIndex).nodes()).removeClass('selected');
                    }, 2000);

                    // notification
                    notyf.success({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });
                } else {
                    const modal = bootstrap.Modal.getInstance($("#update_category_modal"));
                    modal.hide();

                    //Set default button text again
                    $("#update_category").text('Update');
                    // notification
                    notyf.error({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });
                }

            },

            error: function () {
                const modal = bootstrap.Modal.getInstance($("#update_category_modal"));
                modal.hide();
                //Set default button text again
                $("#update_category").text('Update');
                // notification
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            }
        });

    });

    /* ### Update Data End ### */


    //    DELETE button ------------------------------------------------
    $('#category_dataTable tbody').on('click', '#delete_categorybtn', function () {
        rowData = category_table.row($(this).parents('tr')).data();
        rowIndex = category_table.row($(this).parents('tr')).index();
    });

    // DELETE Confirmation button
    $("#delete_category").click(function () {
        $("#delete_category").text('Deleting....');
        $.ajax({
            url: nafisa_domain + '/category/' + rowData.id,
            type: 'DELETE',
            dataType: "json",
            success: function (data) {

                if (data.status.code === 1) {

                    $("#delete_category").text('Delete');
                    let currentPage = category_table.page();
                    category_table.row(rowIndex).remove().draw();
                    const modal = bootstrap.Modal.getInstance($("#delete_category_modal"));
                    modal.hide();
                    // redrawing to original page
                    category_table.page(currentPage).draw('page');
                    notyf.success({
                        message: 'Category  Deleted <strong>Successfully !</strong>',
                        duration: 7000,
                        icon: false
                    });

                    rowData = undefined;
                    rowIndex = undefined;
                } else {
                    const modal = bootstrap.Modal.getInstance($("#delete_category_modal"));
                    modal.hide();
                    $("#delete_category").text('Delete');
                    notyf.error({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });
                    rowData = undefined;
                    rowIndex = undefined;
                }

            },
            error: function (data) {

                notyf.error({
                    message: data.responseJSON.message,
                    duration: 7000,
                    icon: false
                });
                $("#delete_category").text('Delete');

                console.log(data.responseJSON.status)
            }


        });
    });
    /* ### Delete Data End ### */

    //CUSTOMER============================================================================================================


    //init shop & branch  datatable and load data
    $('#customer_dataTable').DataTable({

        ajax: {
            url: 'https://riyadshop.selopian.us/customer/all/1/100',
            dataSrc: 'data',
        },
        rowId: 'id',
        dom: 'Blfrtip',
        oLanguage: {
            sLengthMenu: "Show _MENU_",
        },
        language: {
            search: "",
            searchPlaceholder: "Search..."
        },
        buttons: [
            {
                extend: 'print',
                title: 'Shop Information',
                orientation: 'landscape',
                exportOptions: {
                    columns: [1, 2, 3],
                    modifier: {
                        page: 'current'
                    }
                },
                pageSize: 'LEGAL',
                customize: function (win) {
                    $(win.document.body)
                        .css('font-size', '15pt')
                    $(win.document.body).find('th')
                        .css({
                            "font-size": 'inherit',
                            "text-align": 'center',
                        })
                        .addClass('compact')
                    $(win.document.body).find('table')
                        .css('font-size', 'inherit')
                        .css('text-align', 'center')

                }
            },
            {
                extend: 'excelHtml5',
                title: 'Shop Information',
                exportOptions: {
                    columns: [1, 2, 3]

                },

            },
            {
                extend: 'pdf',
                exportOptions: {
                    columns: [1, 2, 3],
                    modifier: {
                        page: 'current'
                    }
                },
                pageSize: 'LEGAL',
                title: 'Shop Information',
                customize: function (doc) {
                    doc.content[1].table.widths = [
                        '20%',
                        '35%',
                        '45%',
                    ]
                    let rowCount = doc.content[1].table.body.length;
                    for (let i = 1; i < rowCount; i++) {
                        doc.content[1].table.body[i][0].alignment = 'center';
                        doc.content[1].table.body[i][1].alignment = 'center';
                        doc.content[1].table.body[i][2].alignment = 'center';
                    }
                }
            },

            '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_customer_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'

        ],

        columns: [
            {data: 'name'},
            {data: 'email'},
            {data: 'phone_no'},
            {data: 'address'},
            {data: 'company_name'},
            {data: 'image_url'},
            {data: '_id'},

            {
                data: 'id',
                render: function () {
                    return '<button id="update_shopBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_shop_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  '
                        + '<button   id="delete_shopBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_shop_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
                }
            },
        ]
    });
