let rowIndex, rowData;
const notyf = new Notyf();

const nafisa_domain = 'https://riyadshop.selopian.us'

$.fn.dataTable.ext.errMode = 'throw';


const closeModalValue = (id) => {
    $(id).on('hidden.bs.modal', function (e) {
        $(this)
            .find("input,textarea,select")
            .val('')
            .end()
            .find("input[type=checkbox], input[type=radio]")
            .prop("checked", "")
            .end();
    })
}


//SHOP================================================================================================
//init shop & branch  datatable and load data
let shop_table = $('#shop_dataTable').DataTable({

    order: [[1, 'desc']],
    "columnDefs": [

        {"width": "80%", "targets": 0},
        {"width": "20%", "targets": 1},

    ],
    ajax: {
        url: nafisa_domain + '/shop',
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
                columns: [0],
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
                columns: [0]

            },

        },
        {
            extend: 'pdf',
        },

        '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_shop_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'

    ],

    columns: [
        {data: 'name'},

        {
            data: '',
            render: function () {
                return '<button id="update_shopBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_shop_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  '
                    + '<button   id="delete_shopBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_shop_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
            }
        },
    ]
});


/* ### Add Data Start ### */
$("#add_shop").click(function () {

    let addShopModal = {
        name: $("#shopName").val(),

    };
    $.ajax({
        url: nafisa_domain + '/shop',
        type: 'POST',
        data: JSON.stringify(addShopModal),
        contentType: "application/json",
        success: function (data) {


            if (data.status.code === 1) {

                const modal = bootstrap.Modal.getInstance($("#add_shop_modal"));
                modal.hide();

                shop_table.ajax.reload()

                //Success Notification
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });

            } else {

                const modal = bootstrap.Modal.getInstance($("#add_shop_modal"));
                modal.hide();
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            }
        },
    });

})


// EDIT button
$('#shop_dataTable tbody').on('click', '#update_shopBtn', function () {
    rowData = shop_table.row($(this).parents('tr')).data();
    $("#update_shopName").val(rowData.name);
})

$("#update_shop").click(function () {

    let updateShopModal = {
        name: $("#update_shopName").val(),
    };

    $.ajax({
        url: nafisa_domain + '/shop/' + rowData.id,
        type: 'PUT',
        data: JSON.stringify(updateShopModal),
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            if (data.status.code === 1) {
                const modal = bootstrap.Modal.getInstance($("#update_shop_modal"));
                modal.hide();
                shop_table.ajax.reload()
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });

            } else {
                shop_table.ajax.reload()
                //Notification
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            }
        },
    });
})

// DELETE
$('#shop_dataTable tbody').on('click', '#delete_shopBtn', function () {
    // getting parent row index and data
    rowData = shop_table.row($(this).parents('tr')).data();
    rowIndex = shop_table.row($(this).parents('tr')).index();
})

$("#delete_shop").click(function () {

    $.ajax({
        url: nafisa_domain + '/shop/' + rowData.id,
        type: 'DELETE',
        dataType: "json",
        success: function (data) {
            shop_table.ajax.reload()
            const modal = bootstrap.Modal.getInstance($("#delete_shop_modal"));
            modal.hide();
            notyf.success({
                message: 'Shop  Deleted <strong>Successfully !</strong>',
                duration: 7000,
                icon: false
            });

            rowData = undefined;
            rowIndex = undefined;
        },
        error: function () {
            shop_table.ajax.reload()

            notyf.error({
                message: "<strong>Warning !</strong> Can't Delete shop",
                duration: 7000,
                icon: false
            });
        },
    });
});
/* ### Delete Data End ### */


//BRANCH=======================================================================================================

//init shop & branch  datatable and load data
let branch_table = $('#branch_dataTable').DataTable({
    order: [[1, 'desc']],

    ajax: {
        url: nafisa_domain + '/branch',
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

        '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_branch_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'

    ],

    columns: [
        {data: 'name'},
        {data: 'location'},
        {data: 'shop_id.name'},
        {
            data: '',
            render: function () {
                return '<button id="update_branch_Btn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_branch_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  '
                    + '<button   id="delete_branch_Btn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_branch_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
            }
        },
    ]
});


//init Shop Name
$.ajax({
    url: nafisa_domain + '/shop',
    type: 'GET',
    success: function (result) {
        let shopName = result?.data.map(item => item)
        shopName.forEach((element) => {
            $('<option/>').val(element['id']).html(element['name']).appendTo('#selectShop');
            $('<option/>').val(element['id']).html(element['name']).appendTo('#update_selectShop');

        });
    }

});


$("#add_Branch").click(function () {

    let addBranch = {
        name: $("#branch_name").val(),
        location: $("#add_location").val(),
        shop_id: $("#selectShop").val(),
    };
    $.ajax({
        url: nafisa_domain + '/branch ',
        type: 'POST',
        data: JSON.stringify(addBranch),
        contentType: "application/json",
        success: function (data) {


            if (data.status.code === 0) {

                const modal = bootstrap.Modal.getInstance($("#add_branch_modal"));
                modal.hide();
                //Success Notification
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });

                $('form :input').val('');

                $('.input').val('');

                branch_table.ajax.reload()

            } else {
                const modal = bootstrap.Modal.getInstance($("#add_branch_modal"));
                modal.hide();
                branch_table.ajax.reload()

                //Success Notification
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            }
        },
        error: function (data) {
            if (data.status.code === 0) {
                branch_table.ajax.reload()

                //Set default button text again
                const modal = bootstrap.Modal.getInstance($("#add_branch_modal"));
                modal.hide();
                //Notification
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            } else {
                branch_table.ajax.reload()

                //Set default button text again
                const modal = bootstrap.Modal.getInstance($("#add_branch_modal"));
                modal.hide();
                //Notification
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            }
        }
    });
})


// EDIT button
$('#branch_dataTable tbody').on('click', '#update_branch_Btn', function () {
    rowData = branch_table.row($(this).parents('tr')).data();

    $("#update_branch_name").val(rowData.name);
    $("#update_add_location").val(rowData.location);
    var select_user = rowData.shop_id.name;
    $("#update_selectShop option").filter(function () {
        return $(this).text() == select_user;
    }).prop('selected', true);

})

$("#update_add_Branch").click(function () {


    let updateShopModal = {
        name: $("#update_branch_name").val(),
        location: $("#update_add_location").val(),
        shop_id: $("#update_selectShop").val(),
    };

    $.ajax({
        url: nafisa_domain + '/branch/' + rowData.id,
        type: 'PUT',
        data: JSON.stringify(updateShopModal),
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            if (data.status.code === 1) {
                const modal = bootstrap.Modal.getInstance($("#update_branch_modal"));
                modal.hide();
                branch_table.ajax.reload()
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });

            } else {
                const modal = bootstrap.Modal.getInstance($("#update_branch_modal"));
                modal.hide();
                branch_table.ajax.reload()
                //Notification
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            }
        },
    });
})


// DELETE
$('#branch_dataTable tbody').on('click', '#delete_branch_Btn', function () {
    // getting parent row index and data
    rowData = branch_table.row($(this).parents('tr')).data();
    rowIndex = branch_table.row($(this).parents('tr')).index();
})

$("#delete_branch").click(function () {

    $.ajax({
        url: nafisa_domain + '/branch/' + rowData.id,
        type: 'DELETE',
        dataType: "json",
        success: function (data) {
            branch_table.ajax.reload()
            const modal = bootstrap.Modal.getInstance($("#delete_branch_modal"));
            modal.hide();
            notyf.success({
                message: 'Branch  Deleted <strong>Successfully !</strong>',
                duration: 7000,
                icon: false
            });
        },
        error: function () {
            branch_table.ajax.reload()

            notyf.error({
                message: "<strong>Warning !</strong> Can't Delete Branch",
                duration: 7000,
                icon: false
            });
        },
    });
});


//Reset Input when close modal
$('#add_shop_modal').on('hidden.bs.modal', function () {
    $(this).find('#shop_form').trigger('reset');
});
$('#update_shop_modal').on('hidden.bs.modal', function () {
    $(this).find('#update_shop_form').trigger('reset');
});


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
//         $('#shop_form')[0].reportValidity();
//     }
// })
/* ### Add Data End ### */


/* ### Delete Data Start ### */

// DELETE button
$('#branch_dataTable tbody').on('click', '#delete_shopBtn', function () {
    rowData = branch_table.row($(this).parents('tr')).data();
    rowIndex = branch_table.row($(this).parents('tr')).index();
    // Set value on Modal
    $("#sName").text(`Are you sure you want to delete "${rowData.name}"?`);
});

// DELETE Confirmation button
$("#delete_branch").click(function () {
    $.ajax({
        url: nafisa_domain + '/branch/' + rowData.id,
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


//USER====================================================================================================================


//init User datatable and load data

let user_table = $('#user_dataTable').DataTable({

    order: [[1, 'desc']],
    ajax: {
        url: nafisa_domain + '/user',
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
                columns: [0, 1, 2, 3, 4],
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
                columns: [0, 1, 2, 3, 4]
            },
        },
        {
            extend: 'pdf',
            exportOptions: {
                columns: [0, 1, 2, 3, 4],
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
        {data: 'last_login_at'},
        {data: 'last_login_ip'},
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


    let addUser = {
        phone_username: $("#user_number").val(),
        role: $("#user_role").val(),
        password: $("#user_password").val(),
    };

    $.ajax({
        url: nafisa_domain + '/user',
        type: 'POST',
        data: JSON.stringify(addUser),
        contentType: "application/json",
        success: function (data) {

            notyf.success({
                message: data.status.message,
                duration: 7000,
                icon: false
            });
            const modal = bootstrap.Modal.getInstance($("#add_user_modal"));
            modal.hide();
            user_table.ajax.reload();
            closeModalValue('#add_user_modal');


        },
        error: function (data) {

            notyf.error({
                message: data.responseJSON.status.message,
                duration: 7000,
                icon: false
            });
            user_table.ajax.reload();

        }

    });
})


//Update User---------------------------------------------
// EDIT button
$('#user_dataTable tbody').on('click', '#update_userBtn', function () {
    rowIndex = user_table.row($(this).parents('tr')).index();
    rowData = user_table.row($(this).parents('tr')).data();

    $("#update_user_number").val(rowData.phone_username);
    var select_user3 = rowData.role;
    $("#update_user_role option").filter(function () {
        return $(this).val() == select_user3;
    }).prop('selected', true);

    $("#update_user_password").val(rowData.password);

})

// Update Button
$("#update_user").click(function () {

    let updateUserModal = {

        phone_username: $("#update_user_number").val(),
        role: $("#update_user_role").val(),
        password: $("#update_user_password").val(),

    };

    $.ajax({
        url: nafisa_domain + '/user/' + rowData.id,
        type: 'PUT',
        data: JSON.stringify(updateUserModal),
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            const modal = bootstrap.Modal.getInstance($("#update_user_modal"));
            modal.hide();

            user_table.ajax.reload()

            notyf.success({
                message: data.status.message,
                duration: 7000,
                icon: false
            });

        },

        error: function (data) {
            user_table.ajax.reload()

            const modal = bootstrap.Modal.getInstance($("#update_user_modal"));
            modal.hide();

            notyf.error({
                message: data.responseJSON.data,
                duration: 7000,
                icon: false
            });
        }
    });

    closeModalValue('#update_user_modal');

});


// Delete User button----------

$('#user_dataTable tbody').on('click', '#delete_userBtn', function () {
    rowData = user_table.row($(this).parents('tr')).data();
    rowIndex = user_table.row($(this).parents('tr')).index();
});


// User DELETE Confirmation button
$("#delete_user").click(function () {

    $.ajax({
        url: nafisa_domain + '/user/' + rowData.id,
        type: 'DELETE',
        success: function (data) {

            if (data.status.code === 1) {
                const modal = bootstrap.Modal.getInstance($("#delete_user_modal"));
                modal.hide();
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


//CUSTOMER=====================================================================================================================

//init Salesman datatable and load data
let customer_table = $('#customer_dataTable').DataTable({
    // order: [[0, 'desc']],
    // "columnDefs": [
    //     {'visible': false, 'targets': 0},
    //     {"width": "25%", "targets": 1},
    //     {"width": "15%", "targets": 2},
    //     {'visible': false, 'targets': 3},
    //     {'visible': false, 'targets': 4},
    //     {'visible': false, 'targets': 5},
    //     {'visible': false, 'targets': 6},
    //     {'visible': false, 'targets': 7},
    //     {'visible': false, 'targets': 8},
    //     {"width": "10%", "targets": 9},
    //     {"width": "10%", "targets": 10},
    //     {'visible': false, 'targets': 11},
    //     {'visible': false, 'targets': 12},
    //     {'visible': false, 'targets': 13},
    //     {"width": "10%", "targets": 14},
    //     {"width": "10%", "targets": 15}
    // ],
    order: [[1, 'desc']],
    ajax: {
        url: nafisa_domain + '/customer/all',
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
            // customize: function (doc) {
            //     doc.content[1].table.widths = [
            //         '11%',
            //         '8%',
            //         '5%',
            //         '8%',
            //         '10%',
            //         '10%',
            //         '15%',
            //         '7%',
            //         '7%',
            //         '10%',
            //         '8%',
            //     ]
            //     let salesmanRowCount = doc.content[1].table.body.length;
            //     for (let i = 1; i < salesmanRowCount; i++) {
            //         doc.content[1].table.body[i][0].alignment = 'center';
            //         doc.content[1].table.body[i][1].alignment = 'center';
            //         doc.content[1].table.body[i][2].alignment = 'center';
            //         doc.content[1].table.body[i][3].alignment = 'center';
            //         doc.content[1].table.body[i][4].alignment = 'center';
            //         doc.content[1].table.body[i][5].alignment = 'center';
            //         doc.content[1].table.body[i][6].alignment = 'center';
            //         doc.content[1].table.body[i][7].alignment = 'center';
            //         doc.content[1].table.body[i][8].alignment = 'center';
            //         doc.content[1].table.body[i][9].alignment = 'center';
            //         doc.content[1].table.body[i][10].alignment = 'center';
            //     }
            // }
        },

        '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_customer_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],

    columns: [
        {data: 'name'},
        {data: 'email'},
        {data: 'phone_no'},
        {data: 'address'},
        {data: 'company_name'},
        {
            data: 'image_url',

            render: function () {
                return '<button id="customer_profile_img_url"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#customer_image_modal">View</button>'
            }
        },

        // {
        //     data: '',
        //     render: function () {
        //         return '<button id="salesman_details"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#details_salesman_modal">Details</button>'
        //     }
        // },
        {
            data: '',
            render: function () {
                return '<button id="update_customerBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_customer_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  '
                    + '<button   id="delete_customerBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_customerr_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
            }
        },
    ]
});


//cropzee-----------------
$(document).ready(function () {
    $("#customer_image_url").cropzee();
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


//View Customer Photo Button
$('#customer_dataTable tbody').on('click', '#customer_profile_img_url', function () {

    rowData = customer_table.row($(this).parents('tr')).data();

    $("#customer_image").attr("src", nafisa_domain + rowData.profile_photo_url);
});


//Salesman CRUD Start

//Reset salesman add Modal Input when it's Close
$('#add_customer_modal').on('hidden.bs.modal', function () {
    $('[data-cropzee="' + 'customer_image_url' + '"]').replaceWith('<div class="modal-body align-items-center-center"  data-cropzee="customer_image_url"><img  src=""></div>');
    $(this).find('#salesman_post_form').trigger('reset');
});
//
// //Reset salesman update Modal Input when it's Close
// $('#update_salesman_modal').on('hidden.bs.modal', function () {
//     $('[data-cropzee="' + 'salesman_edit_nid_photos' + '"]').replaceWith('<div class="modal-body align-items-center-center"  data-cropzee="salesman_edit_nid_photos"><img id="s_nid_img" src=""></div>');
//     $('[data-cropzee="' + 'salesman_edit_profile_photos' + '"]').replaceWith('<div class="modal-body align-items-center-center"  data-cropzee="salesman_edit_profile_photos"><img id="s_profile_img" src=""></div>');
//     $(this).find('#salesman_update_form').trigger('reset');
// });


/* ### Post Data Start ### */
$("#customer_post_form").on('submit', (function (e) {
    e.preventDefault();
    $.ajax({
        url: nafisa_domain + '/customer',
        type: "POST",
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,

        success: function (data) {
            if (data.status.code === 1) {
                $("#add_supplier").text('Add');

                const modal = bootstrap.Modal.getInstance($("#add_customer_modal"));
                modal.hide();

                //Success Notification
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });

                customer_table.ajax.reload()

            } else {
                //Set default button text again
                const modal = bootstrap.Modal.getInstance($("#add_customer_modal"));
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
            const modal = bootstrap.Modal.getInstance($("#add_customer_modal"));
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
/* ### Post Data End ### */


$('#customer_dataTable tbody').on('click', '#update_customerBtn', function () {
    // getting parent row Data
    rowData = customer_table.row($(this).parents('tr')).data();

    // setting row values to update modal input boxes
    $("#update_customer_name").val(rowData.name);
    $('#update_customer_email').val(rowData.email);
    $('#update_customer_phone_no').val(rowData.phone_no);
    $("#update_customer_address").val(rowData.address);
    $('#update_customer_company_name').val(rowData.company_name);
    $("#update_customer_image_url").val(rowData.image_url);

    //Close "#" In url From cropzee modal
    closeModal();
})


// Update Button
$("#update_customer_post_form").on('submit', (function (e) {
    e.preventDefault();
    $.ajax({
        url: nafisa_domain + '/customer/' + rowData.id,
        type: "PUT",
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,

        success: function (data) {
            if (data.status.code === 1) {

                customer_table.ajax.reload();

                const modal = bootstrap.Modal.getInstance($("#update_customer_modal"));
                modal.hide();

                //Success Notification
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });


            }
        },
        error: function (data) {


            console.log(data)
            const modal = bootstrap.Modal.getInstance($("#update_customer_modal"));
            modal.hide();
            //Notification

            notyf.error({
                message: data.responseJSON.status.message,
                duration: 7000,
                icon: false
            });
        }
    });
}));


// Delete button
$('#customer_dataTable tbody').on('click', '#delete_customerBtn', function () {
    rowData = customer_table.row($(this).parents('tr')).data();
    rowIndex = customer_table.row($(this).parents('tr')).index();
});

// DELETE Confirmation button
$("#delete_customer").click(function () {

    $(this).text('Deleting...');
    $.ajax({
        url: nafisa_domain + '/customer/' + rowData.id,
        type: 'DELETE',
        success: function (data) {

            if (data.status.code === 1) {
                let currentPage = customer_table.page();
                customer_table.row(rowIndex).remove().draw();

                const modal = bootstrap.Modal.getInstance($("#delete_customerr_modal"));
                modal.hide();

                $("#delete_customer").text('Delete');
                // redrawing to original page
                customer_table.page(currentPage).draw('page');

                notyf.success({
                    message: 'Customer  Deleted <strong>Successfully !</strong>',
                    duration: 7000,
                    icon: false
                });
                rowData = undefined;
                rowIndex = undefined;
            } else {
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
                const modal = bootstrap.Modal.getInstance($("#delete_customerr_modal"));
                modal.hide();
                $("#delete_customer").text('Delete');
            }
        },
        error: function () {
            $("#delete_customer").text('Delete');
            notyf.success({
                message: data.status.message,
                duration: 7000,
                icon: false
            });

        },
    });
});
/* ### Delete Data End ### */


//SUPPLIER==================================================================================================

//init supplier datatable and load data

let shop_supplier_table = $('#supplier_dataTable').DataTable({
    order: [[1, 'desc']],
    "columnDefs": [
        {'visible': false, 'targets': 0},
        {"width": "15%", "targets": 1},
        {"width": "20%", "targets": 2},
        {'visible': "20%", 'targets': 3},
        {'visible': false, 'targets': 4},
        {'visible': false, 'targets': 5},
        {'visible': false, 'targets': 6},
        {'visible': false, 'targets': 7},
        {'visible': false, 'targets': 8},
        {"visible": false, "targets": 9},
        {"visible": false, "targets": 10},
        {"width": "15%", "targets": 11},
        {"width": "7%", "targets": 12},
        {"width": "10%", "targets": 13},
    ],
    ajax: {
        url: nafisa_domain + '/supplier/all',
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
        {
            data: 'company_name',
            render: function (data) {
                if (data === null) {
                    return 'N/A';
                } else {
                    return data;
                }
            }
        },
        {
            data: 'company_phone_no',
            render: function (data) {
                if (data === null) {
                    return 'N/A';
                } else {
                    return data;
                }
            }
        },
        {
            data: 'company_address',
            render: function (data) {
                if (data === null) {
                    return 'N/A';
                } else {
                    return data;
                }
            }
        },
        {
            data: 'bank_account_info',
            render: function (data) {
                if (data === null) {
                    return 'N/A';
                } else {
                    return data;
                }
            }
        },
        {
            data: 'ref_comment',
            render: function (data) {
                if (data === null) {
                    return 'N/A';
                } else {
                    return data;
                }
            }
        },
        {
            data: 'blacklist',
            render: function (data) {
                if (data === null) {
                    return 'N/A';
                } else {
                    return data;
                }
            }
        },
        {
            data: 'profile_photo_url',
            render: function () {
                return '<button id="supplier_photo"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#supplier_image_modal">View</button>'
            }

        },

        {
            data: 'details',
            render: function () {
                return '<button id="supplier_details"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#details_supplier_modal">Details</button>'
            }
        },

        {
            data: '',
            render: function () {
                return '<button id="update_supplierBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"  data-bs-target="#Update_supplier_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>'
                    + ' <button   id="delete_supplierBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_supplier_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
            }
        },
    ]
});


//Details Button-----------------------------------------------------

$('#supplier_dataTable tbody').on('click', '#supplier_details', function () {
    // getting parent row index and data
    rowIndex = shop_supplier_table.row($(this).parents('tr')).index();
    rowData = shop_supplier_table.row($(this).parents('tr')).data();

    // setting row values to update modal input boxes
    $("#sup_name").text(rowData.name);
    $("#sup_email").text(rowData.email);
    $("#sup_pn").text(rowData.phone_no);
    $("#sup_address").text(rowData.address);
    $("#sup_companyN").text(rowData.company_name);
    $("#sup_phone").text(rowData.company_phone_no);
    $("#sup_com_address").text(rowData.company_address);
    $("#sup_bank_info").text(rowData.bank_account_info);
    $("#sup_ref_comm").text(rowData.ref_comment);
    $("#sup_blacklist").text(rowData.blacklist);

})


//View  Supplier Photo Button----------------

$('#supplier_dataTable tbody').on('click', '#supplier_photo', function () {
    rowData = shop_supplier_table.row($(this).parents('tr')).data();
    console.log(rowData)

    $("#supplier_image").attr("src", rowData.profile_photo_url);
});

//cropzee-----------------
$(document).ready(function () {
    $("#image_url").cropzee();
});


/* ### Post Data Start ### */
$("#Supplier_post_form").on('submit', (function (e) {
    e.preventDefault();
    $.ajax({
        url: nafisa_domain + '/supplier',
        type: "POST",
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,
        success: function (data) {
            if (data.status.code === 1) {

                const modal = bootstrap.Modal.getInstance($("#add_supplier_modal"));
                modal.hide();

                let newSRowIndex = shop_supplier_table.row.add(data.data).draw();
                //Success Notification
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
                shop_supplier_table.ajax.reload()
                //reset input Field
                $('form :input').val('');
                $('.input').val('');
                shop_supplier_table.search('');
                // re-ordering to default

                shop_supplier_table.order([0, 'desc']).draw();
                // highlighting newly added row
                $(shop_supplier_table.row(newSRowIndex.index()).nodes()).addClass('selected');
            } else {

                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            }
        },
        error: function (data) {

            const modal = bootstrap.Modal.getInstance($("#add_supplier_modal"));
            modal.hide();
            //Notification
            notyf.error({
                message: data.responseJSON.status.message,
                duration: 7000,
                icon: false
            });
        }
    });
}));


$('#supplier_dataTable tbody').on('click', '#update_supplierBtn', function () {
    // getting parent row Data
    rowData = shop_supplier_table.row($(this).parents('tr')).data();

    // setting row values to update modal input boxes
    $("#Uname").val(rowData.name);
    $('#Uemail').val(rowData.email);
    $("#Uphone_no").val(rowData.phone_no);
    $('#Uaddress').val(rowData.address);
    $("#Ucompany_name").val(rowData.company_name);
    $("#Uimage_url").val(rowData.image_url);

})


$("#Supplier_update_post_form").on('submit', (function (e) {
    e.preventDefault();
    $.ajax({
        url: nafisa_domain + '/supplier/' + rowData.id,
        type: "PUT",
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,

        success: function (data) {

            if (data.status.code === 1) {

                const modal = bootstrap.Modal.getInstance($("#Update_supplier_modal"));
                modal.hide();

                shop_supplier_table.ajax.reload();

                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });

            } else {
                //Set default button text again
                const modal = bootstrap.Modal.getInstance($("#update_supplier_modal"));
                modal.hide();
                shop_supplier_table.ajax.reload();
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            }
        },
        error: function (data) {
            const modal = bootstrap.Modal.getInstance($("#Update_supplier_modal"));
            modal.hide();
            shop_supplier_table.ajax.reload();
            notyf.error({
                message: data.responseJSON.status.message,
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
        url: nafisa_domain + '/supplier/' + rowData.id,
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
                message: "Cannot Delete This Supplier",
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

let brand_table = $('#Brand_dataTable').DataTable({
    order: [[1, 'desc']],
    ajax: {
        url: nafisa_domain + '/brand',
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
            title: 'Brand Information',
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
            title: 'Brand Information',
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
            title: 'Brand Information',
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

        '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_brand_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],
    columns: [
        {data: 'name'},
        {data: 'description'},
        {
            data: 'image_url',
            render: function () {
                return '<button id="brand_photo"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#brand_image_modal">View</button>'
            }
        },
        {
            data: '',
            render: function () {
                return '<button id="update_brandBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_brand_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  '
                    + '<button   id="delete_brandBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_brand_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
            }
        },
    ]
});


//cropzee-----------------
$(document).ready(function () {
    $("#brand_image_url").cropzee();
});


/* ### Post Data Start ### */
$("#Brand_post_form").on('submit', (function (e) {
    e.preventDefault();
    $.ajax({
        url: nafisa_domain + '/brand',
        type: "POST",
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,
        success: function (data) {
            if (data.status.code === 1) {

                const modal = bootstrap.Modal.getInstance($("#add_brand_modal"));
                modal.hide();

                let newSRowIndex = brand_table.row.add(data.data).draw();
                //Success Notification
                branch_table.ajax.reload()
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
                //reset input Field
                $('form :input').val('');
                $('.input').val('');
                brand_table.search('');
                // re-ordering to default

                brand_table.order([0, 'desc']).draw();
                // highlighting newly added row
                $(brand_table.row(newSRowIndex.index()).nodes()).addClass('selected');
            } else {
                //Set default button text again
                $("#add_supplier").text('Add');
                const modal = bootstrap.Modal.getInstance($("#add_brand_modal"));
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
            const modal = bootstrap.Modal.getInstance($("#add_brand_modal"));
            modal.hide();
            //Notification
            notyf.error({
                message: data.responseJSON.status.message,
                duration: 7000,
                icon: false
            });
        }
    });
}));

//brand photo View
$('#Brand_dataTable tbody').on('click', '#brand_photo', function () {

    rowData = brand_table.row($(this).parents('tr')).data();
    $("#brand_image").attr("src",nafisa_domain+ rowData.logo_url);

});


$('#Brand_dataTable tbody').on('click', '#update_brandBtn', function () {
    rowIndex = brand_table.row($(this).parents('tr')).index();
    rowData = brand_table.row($(this).parents('tr')).data();

    // setting row values to update modal input boxes
    $("#update_brand_name").val(rowData.name);
    $('#update_brand_description').val(rowData.description);
    $("#s_profile_img").attr("src", rowData.logo_url);
})

//Cropzee-----------------
$(document).ready(function () {
    $("#update_brand_image_url").cropzee();
});


//Reset product add Modal Input when it's Close
$('#add_brand_modal').on('hidden.bs.modal', function () {
    $('[data-cropzee="' + 'brand_image_url' + '"]').replaceWith('<div class="modal-body align-items-center-center"  data-cropzee="brand_image_url"><img id="brand_img"  src=""></div>');
    $(this).find('#Brand_post_form').trigger('reset');
});


//Reset salesman update Modal Input when it's Close
$('#update_brand_modal').on('hidden.bs.modal', function () {
    $('[data-cropzee="' + 'update_brand_image_url' + '"]').replaceWith('<div class="modal-body align-items-center-center"  data-cropzee="update_brand_image_url"><img id="s_profile_img" src=""></div>');
    $(this).find('#update_brand_post_form').trigger('reset');
});


$("#update_brand_post_form").on('submit', (function (e) {
    e.preventDefault();
    $.ajax({
        url: nafisa_domain + '/brand/' + rowData.id,
        type: "PUT",
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,

        success: function (data) {
            if (data.status.code === 1) {
                // hide modal
                const modal = bootstrap.Modal.getInstance($("#update_brand_modal"));
                modal.hide();
                //Set default button text again
                brand_table.ajax.reload()
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });

            } else {
                //Set default button text again
                const modal = bootstrap.Modal.getInstance($("#update_brand_modal"));
                modal.hide();
                //Notification
                notyf.error({
                    message: data.responseJSON.status.message,
                    duration: 7000,
                    icon: false
                });


            }
        },
        error: function (data) {
            const modal = bootstrap.Modal.getInstance($("#update_brand_modal"));
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


$('#Brand_dataTable tbody').on('click', '#delete_brandBtn', function () {
    rowData = brand_table.row($(this).parents('tr')).data();
    rowIndex = brand_table.row($(this).parents('tr')).index();
});

$("#delete_brand").click(function () {

    $(this).text('Deleting...');
    $.ajax({
        url: nafisa_domain + '/brand/' + rowData.id,
        type: 'DELETE',
        dataType: "json",
        success: function (data) {

            let currentPage = brand_table.page();
            brand_table.row(rowIndex).remove().draw();
            const modal = bootstrap.Modal.getInstance($("#delete_brand_modal"));
            modal.hide();
            $("#delete_brand").text('Delete');
            brand_table.page(currentPage).draw('page');
            notyf.success({
                message: data.status.message,
                duration: 7000,
                icon: false
            });

            rowData = undefined;
            rowIndex = undefined;
        },
        error: function (data) {
            const modal = bootstrap.Modal.getInstance($("#delete_brand_modal"));
            modal.hide();
            $("#delete_brand").text('Delete');
            notyf.success({
                message: data.status.message,
                duration: 7000,
                icon: false
            });

        },
    });
});


//Department=======================================================================================================================================

//init Department datatable and load data
let department_table = $('#department_dataTable').DataTable({
    order: [[1, 'desc']],
    "columnDefs": [
        {"width": "70%", "targets": 0},
        {"width": "20%", "targets": 1},
    ],


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
            title: 'Department Information',
            orientation: 'landscape',
            exportOptions: {
                columns: [0],
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
            title: 'Department Information',
            exportOptions: {
                columns: [0]

            },

        },
        {
            extend: 'pdf',
            exportOptions: {
                columns: [0],
                modifier: {
                    page: 'current'
                }
            },
            pageSize: 'LEGAL',
            title: 'Department Information',
            customize: function (doc) {
                doc.content[1].table.widths = [
                    '20%',
                    '35%',
                    '45%',
                ]
                let rowCount = doc.content[1].table.body.length;
                for (let i = 1; i < rowCount; i++) {
                    doc.content[1].table.body[i][0].alignment = 'center';

                }
            }
        },

        '<button  toggle="tooltip" title="Add New Department" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_department_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'

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

            if (data.status.code === 1) {

                const modal = bootstrap.Modal.getInstance($("#add_department_modal"));
                modal.hide();


                //Success Notification
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
                //reset input Field
                $('form :input').val('');
                $('.input').val('');

                department_table.ajax.reload()
            } else {
                //Set default button text again

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
                    department_table.ajax.reload()

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


$('#department_dataTable tbody').on('click', '#delete_department_btn', function () {
    rowData = department_table.row($(this).parents('tr')).data();
    rowIndex = department_table.row($(this).parents('tr')).index();
});


// User DELETE Confirmation button
$("#delete_department").click(function () {

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
    order: [[1, 'desc']],
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
    url: nafisa_domain + '/category/byparent/7',
    type: 'GET',
    success: function (data) {
        let category_parents = data?.data.map(item => item)
        category_parents.forEach((element) => {
            $('<option/>').val(element['id']).html(element['name']).appendTo('#cParent');
            $('<option/>').val(element['id']).html(element['name']).appendTo('#update_cParent');

        });
    }

});

//Post Category-------------------------------------------

$("#add_category").click(function () {
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

                category_table.ajax.reload()
            }
        },

        error: function (data) {
            category_table.ajax.reload()

            const modal = bootstrap.Modal.getInstance($("#add_category_modal"));
            modal.hide();
            // notification
            notyf.error({
                message: data.responseJSON.status.message,
                duration: 7000,
                icon: false
            });
        }

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

        }


    });
});


//Designation+==================================================================================================================


//init category  datatable and load data
let designation_table = $('#Designation_dataTable').DataTable({
    order: [[1, 'desc']],
    ajax: {
        url: nafisa_domain + '/user_designation',
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
            title: 'Designation Information',
            orientation: 'landscape',
            exportOptions: {
                columns: [0],
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
            title: 'Designation Information',
            exportOptions: {
                columns: [0]

            },

        },
        {
            extend: 'pdf',
            exportOptions: {
                columns: [0],
                modifier: {
                    page: 'current'
                }
            },
            pageSize: 'LEGAL',
            title: 'Designation Information',
            customize: function (doc) {
                doc.content[1].table.widths = [
                    '100%',

                ]
                let rowCount = doc.content[1].table.body.length;
                for (let i = 1; i < rowCount; i++) {
                    doc.content[1].table.body[i][0].alignment = 'center';

                }
            }
        },

        '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_designation_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],

    columns: [
        {data: 'name'},

        {
            data: '',
            render: function () {
                return '<button   id="del_des"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_designation_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
            }
        },
    ]
});


$("#Add_designation").click(function () {
    let addKpiModal = {
        name: $("#des_name").val(),

    };

    $.ajax({
        url: nafisa_domain + '/user_designation',
        type: 'POST',
        data: JSON.stringify(addKpiModal),
        contentType: "application/json",
        success: function (data) {

            if (data.status.code === 1) {

                const modal = bootstrap.Modal.getInstance($("#add_designation_modal"));
                modal.hide();
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
                designation_table.ajax.reload()
                //Success Notification

            } else {
                //Set default button text again
                designation_table.ajax.reload()
                const modal = bootstrap.Modal.getInstance($("#add_designation_modal"));
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
            const modal = bootstrap.Modal.getInstance($("#add_kpi_modal"));
            modal.hide();
            designation_table.ajax.reload()
            notyf.error({
                message: data.status.message,
                duration: 7000,
                icon: false
            });
        }
    });

})


//    DELETE button ------------------------------------------------
$('#Designation_dataTable tbody').on('click', '#del_des', function () {
    rowData = designation_table.row($(this).parents('tr')).data();
    rowIndex = designation_table.row($(this).parents('tr')).index();
});

// DELETE Confirmation button
$("#delete_designation").click(function () {

    $.ajax({
        url: nafisa_domain + '/user_designation/' + rowData.id,
        type: 'DELETE',
        dataType: "json",
        success: function (data) {

            if (data.status.code === 1) {


                const modal = bootstrap.Modal.getInstance($("#delete_designation_modal"));
                modal.hide();
                designation_table.ajax.reload()
                notyf.success({
                    message: 'Designation  Deleted <strong>Successfully !</strong>',
                    duration: 7000,
                    icon: false
                });


            } else {
                const modal = bootstrap.Modal.getInstance($("#delete_designation_modal"));
                modal.hide();
                designation_table.ajax.reload()
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
            const modal = bootstrap.Modal.getInstance($("#delete_designation_modal"));
            modal.hide();
            designation_table.ajax.reload();
            notyf.error({
                message: data.status.message,
                duration: 7000,
                icon: false
            });
        }


    });
});


//User Profile================================================================================================================


//init Salesman datatable and load data
let userProfile_table = $('#userProfile_datatable').DataTable({
    order: [[1, 'desc']],
    "columnDefs": [
        {"width": "15%", "targets": 0},
        {"width": "15%", "targets": 1},
        {'visible': false, 'targets': 2},
        {'visible': false, 'targets': 3},
        {'visible': false, 'targets': 4},
        {'visible': false, 'targets': 5},
        {"width": "15%", "targets": 6},
        {'visible': false, 'targets': 7},
        {"width": "10%", "targets": 8},
        {"width": "10%", "targets": 9},
        {"width": "10%", "targets": 10},
        {"width": "10%", "targets": 11}
    ],

    ajax: {
        url: nafisa_domain + '/user_profile',
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
            title: 'User Information',
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
            // customize: function (doc) {
            //     doc.content[1].table.widths = [
            //         '11%',
            //         '8%',
            //         '5%',
            //         '8%',
            //         '10%',
            //         '10%',
            //         '15%',
            //         '7%',
            //         '7%',
            //         '10%',
            //         '8%',
            //     ]
            //     let salesmanRowCount = doc.content[1].table.body.length;
            //     for (let i = 1; i < salesmanRowCount; i++) {
            //         doc.content[1].table.body[i][0].alignment = 'center';
            //         doc.content[1].table.body[i][1].alignment = 'center';
            //         doc.content[1].table.body[i][2].alignment = 'center';
            //         doc.content[1].table.body[i][3].alignment = 'center';
            //         doc.content[1].table.body[i][4].alignment = 'center';
            //         doc.content[1].table.body[i][5].alignment = 'center';
            //         doc.content[1].table.body[i][6].alignment = 'center';
            //         doc.content[1].table.body[i][7].alignment = 'center';
            //         doc.content[1].table.body[i][8].alignment = 'center';
            //         doc.content[1].table.body[i][9].alignment = 'center';
            //         doc.content[1].table.body[i][10].alignment = 'center';
            //     }
            // }
        },

        '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_user_profile_photo" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],

    columns: [
        {data: 'name'},
        {data: 'user_id.phone_username'},
        {data: 'nid_no'},
        {data: 'designation_id.name'},
        {data: 'salary'},
        {data: 'department_id.name'},
        {data: 'branch_id.name'},
        {data: 'ref_comment'},


        {
            data: 'nid_photo_url',

            render: function () {
                return '<button id="nidPhoto_view"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#nidPhoto_modal">View</button>'
            }
        },
        {
            data: 'profile_photo_url',

            render: function () {
                return '<button id="profilePhoto_view"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#profilePhoto_modal">View</button>'
            }
        },

        {
            render: function () {
                return '<button id="user_details"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#details_userProfile_modal">Details</button>'
            }
        },

        {
            data: '',
            render: function () {
                return '<button id="update_userProfile_btn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_userProfile_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  '
                    + '<button   id="delete_userProfile_btn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_user_profile_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
            }
        },
    ]
});


// Details Button
$('#userProfile_datatable tbody').on('click', '#user_details', function () {
    rowData = userProfile_table.row($(this).parents('tr')).data();
    $("#up_nid").text(rowData.nid_no);
    $("#up_designation").text(rowData.designation_id.name);
    $("#up_department").text(rowData.department_id.name);
    $("#up_salary").text(rowData.salary);
    $("#up_comment").text(rowData.ref_comment);
});


$('#userProfile_datatable tbody').on('click', '#nidPhoto_view', function () {
    rowData = userProfile_table.row($(this).parents('tr')).data();
    $("#nid_img_link").attr("src", nafisa_domain + rowData.nid_photo_url);
});

$('#userProfile_datatable tbody').on('click', '#profilePhoto_view', function () {
    rowData = userProfile_table.row($(this).parents('tr')).data();
    $("#profile_img_link").attr("src", nafisa_domain + rowData.profile_photo_url);
});


$.ajax({
    url: nafisa_domain + '/user/byPhone',
    type: 'GET',
    success: function (data) {
        let category_parents = data?.data.map(item => item)
        category_parents.forEach((element) => {
            $('<option/>').val(element['id']).html(element['phone_username']).appendTo('#user_profile_phone_number');
            $('<option/>').val(element['id']).html(element['phone_username']).appendTo('#update_user_profile_phone_number');
        });
    }
});

$.ajax({
    url: nafisa_domain + '/branch',
    type: 'GET',
    success: function (data) {
        let purchase_branch = data?.data.map(item => item)
        purchase_branch.forEach((element) => {
            $('<option/>').val(element['id']).html(element['name']).appendTo('#user_profile_branch');
            $('<option/>').val(element['id']).html(element['name']).appendTo('#update_user_profile_branch');

        });
    }
});
$.ajax({
    url: nafisa_domain + '/department',
    type: 'GET',
    success: function (data) {
        let category_parents = data?.data.map(item => item)
        category_parents.forEach((element) => {
            $('<option/>').val(element['id']).html(element['name']).appendTo('#user_profile_department');
            $('<option/>').val(element['id']).html(element['name']).appendTo('#update_user_profile_department');


        });
    }
});


$.ajax({
    url: nafisa_domain + '/user_designation',
    type: 'GET',
    success: function (data) {
        let category_parents = data?.data.map(item => item)
        category_parents.forEach((element) => {
            $('<option/>').val(element['id']).html(element['name']).appendTo('#user_profile_designation');
            $('<option/>').val(element['id']).html(element['name']).appendTo('#update_user_profile_designation');
        });
    }
});


// //cropzee-------------------------------
// $(document).ready(function () {
//     $("#nid_photos").cropzee();
//     $("#profile_photos").cropzee();
// });


/* ### Post Data Start ### */
$("#user_profile_post_form").on('submit', (function (e) {
    e.preventDefault();
    $.ajax({
        url: nafisa_domain + '/user_profile',
        type: "POST",
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,
        success: function (data) {

            if (data.status.code === 1) {

                const modal = bootstrap.Modal.getInstance($("#add_user_profile_photo"));
                modal.hide();
                userProfile_table.ajax.reload()


                //Success Notification
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });

                $('form :input').val('');
                $('.input').val('');

                userProfile_table.ajax.reload()

            } else {

                userProfile_table.ajax.reload()

                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });


            }
        },
        error: function (data) {
            userProfile_table.ajax.reload()

            //Notification
            notyf.error({
                message: data.responseJSON.status.message,
                duration: 7000,
                icon: false
            });
        }
    });
}));
/* ### Post Data End ### */


$('#userProfile_datatable tbody').on('click', '#update_userProfile_btn', function () {
    rowIndex = userProfile_table.row($(this).parents('tr')).index();
    rowData = userProfile_table.row($(this).parents('tr')).data();

    var select_user = rowData.user_id.phone_username;
    $("#update_user_profile_phone_number option").filter(function () {
        return $(this).text() == select_user;
    }).prop('selected', true);


    var select_user1 = rowData.branch_id.name;
    $("#update_user_profile_branch option").filter(function () {
        return $(this).text() == select_user1;
    }).prop('selected', true);


    var select_user2 = rowData.designation_id.name;
    $("#update_user_profile_designation option").filter(function () {
        return $(this).text() == select_user2;
    }).prop('selected', true);


    var select_user3 = rowData.department_id.name;
    $("#update_user_profile_department option").filter(function () {
        return $(this).text() == select_user3;
    }).prop('selected', true);
    $("#update_user_profile_name").val(rowData.name);
    $("#update_user_profile_nid").val(rowData.nid_no);

    $("#update_user_profile_salary").val(rowData.salary);
    $("#update_refComment").val(rowData.ref_comment);

    // $("#update_image_url").val(rowData.);
    // $("#update_profile_photos").val(rowData.);

});


/* ### Post Data Start ### */
$("#update_user_profile_post_form").on('submit', (function (e) {
    e.preventDefault();
    $.ajax({
        url: nafisa_domain + '/user_profile/' + rowData.id,
        type: "PUT",
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,
        success: function (data) {

            if (data.status.code === 1) {

                const modal = bootstrap.Modal.getInstance($("#update_userProfile_modal"));
                modal.hide();


                //Success Notification
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });

                $('form :input').val('');
                $('.input').val('');

                userProfile_table.ajax.reload()

            } else {
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });


            }
        },
        error: function (data) {
            const modal = bootstrap.Modal.getInstance($("#update_userProfile_modal"));
            modal.hide();
            //Notification
            notyf.error({
                message: data.responseJSON.status.message,
                duration: 7000,
                icon: false
            });
        }
    });
}));
/* ### Post Data End ### */


// Delete button
$('#userProfile_datatable tbody').on('click', '#delete_userProfile_btn', function () {
    rowIndex = userProfile_table.row($(this).parents('tr')).index();
    rowData = userProfile_table.row($(this).parents('tr')).data();

});

// DELETE Confirmation button
$("#delete_user_profile").click(function () {

    $.ajax({
        url: nafisa_domain + '/user_profile/' + rowData.id,
        type: 'DELETE',
        success: function (data) {

            if (data.status.code === 1) {
                let currentPage = userProfile_table.page();
                userProfile_table.row(rowIndex).remove().draw();

                const modal = bootstrap.Modal.getInstance($("#delete_user_profile_modal"));
                modal.hide();

                $("#delete_customer").text('Delete');
                // redrawing to original page
                userProfile_table.page(currentPage).draw('page');

                notyf.success({
                    message: 'User Profile  Deleted <strong>Successfully</strong>',
                    duration: 7000,
                    icon: false
                });
                rowData = undefined;
                rowIndex = undefined;
            } else {
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
                const modal = bootstrap.Modal.getInstance($("#delete_user_profile_modal"));
                modal.hide();
            }
        },
        error: function () {
            notyf.error({
                message: 'User Profile  Deleted <strong>Successfully !</strong>',
                duration: 7000,
                icon: false
            });
            const modal = bootstrap.Modal.getInstance($("#delete_user_profile_modal"));
            modal.hide();

        },
    });
});
/* ### Delete Data End ### */


// Update Customer Data Start --------------------------------------------

//Chance nid photo preview when update
function updateNidURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {

            $('#update_customer_image_url').attr('src', e.target.result);
            $('#update_customer_image_url').hide();
            $('#update_customer_image_url').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$("#salesman_edit_nid_photos").change(function () {
    updateNidURL(this);
});


//Sales KPI=======================================================================================


//init category  datatable and load data
let kpi_table = $('#salesKpi_dataTable').DataTable({
    order: [[1, 'desc']],
    ajax: {
        url: nafisa_domain + '/sales_kpi',
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

        '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_kpi_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'

    ],

    columns: [
        {data: 'user_id.profile_user_id.name'},
        {data: 'target_sales_volume'},
        {data: 'last_modified_at'},

        {
            data: '',
            render: function () {
                return '<button id="update_kpiBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_kpi_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  '
                    + '<button   id="delete_kpibtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_kpi_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
            }
        },
    ]
});

//init Parent--------------------------------------------
$.ajax({
    url: nafisa_domain + '/salesman',
    type: 'GET',
    success: function (data) {
        let category_parents = data?.data.map(item => item)
        category_parents.forEach((element) => {
            $('<option/>').val(element['user_id']).html(element['name']).appendTo('#kpi_user');

        });
    }

});

//Post Category-------------------------------------------

$("#add_kpi").click(function () {

    $(this).text('Submitting..');
    let addKpiModal = {
        user_id: $("#kpi_user").val(),
        target_sales_volume: $("#sales_kpi_volume").val(),
    };
    let d = {
        user_id: {
            id: 3,
            profile_user_id: {
                id: 3,
                user_id: 3,
                name: $("#kpi_user :selected").text(),
                branch_id: 1
            }

        },
        target_sales_volume: $("#sales_kpi_volume").val(),
    }

    $.ajax({
        url: nafisa_domain + '/sales_kpi',
        type: 'POST',
        data: JSON.stringify(addKpiModal),
        contentType: "application/json",
        success: function (data) {

            if (data.status.code === 1) {

                const modal = bootstrap.Modal.getInstance($("#add_kpi_modal"));
                modal.hide();
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
                let newRowIndex = kpi_table.row.add(d).draw();

                //Success Notification

                $("#add_kpi").text('Submit');

                //reset input Field
                $('form :input').val('');
                $('.input').val('');
                kpi_table.search('');
                // re-ordering to default
                kpi_table.order([0, 'desc']).draw();
                // highlighting newly added row
                $(kpi_table.row(newRowIndex.index()).nodes()).addClass('selected');
            } else {
                //Set default button text again
                $("#add_kpi").text('Submit');
                const modal = bootstrap.Modal.getInstance($("#add_kpi_modal"));
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
            const modal = bootstrap.Modal.getInstance($("#add_kpi_modal"));
            modal.hide();
            //Set default button text again
            $("#add_kpi").text('Submit');
            // notification
            notyf.error({
                message: data.status.message,
                duration: 7000,
                icon: false
            });
        }
    });

})

//Update Category-----------------------------------

$.ajax({
    url: nafisa_domain + '/salesman',
    type: 'GET',
    success: function (data) {
        let category_parents = data?.data.map(item => item)
        category_parents.forEach((element) => {
            $('<option/>').val(element['user_id']).html(element['name']).appendTo('#update_kpi_user');
        });
    }

});


// EDIT button
$('#salesKpi_dataTable tbody').on('click', '#update_kpiBtn', function () {
    // getting parent row index and data
    rowIndex = kpi_table.row($(this).parents('tr')).index();
    rowData = kpi_table.row($(this).parents('tr')).data();

    // setting row values to update modal input boxes

    $("#update_kpi_user option:selected").text();
    $("#update_kpi_volume ").val(rowData.target_sales_volume);

})

// Update Button
$("#update_kpi").click(function () {

    let addKpiModal = {
        user_id: $("#update_kpi_user").val(),
        target_sales_volume: $("#update_kpi_volume").val(),
    };

    // updating button text
    $(this).text('Updating...');

    // updating server row
    $.ajax({
        url: nafisa_domain + '/sales_kpi/' + rowData.id,
        type: 'PUT',
        data: JSON.stringify(addKpiModal),
        contentType: "application/json; charset=utf-8",
        success: function (data) {

            if (data.status.code === 1) {
                // hide modal
                const modal = bootstrap.Modal.getInstance($("#update_kpi_modal"));
                modal.hide();

                //Set default button text again
                $("#update_kpi").text('Update');
                // notification
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
                let currentPage = kpi_table.page();

                // update datatable
                kpi_table.row(rowIndex).data(data.data).draw();

                // redrawing to original page
                kpi_table.page(currentPage).draw('page');

                // highlighting newly added row
                $(kpi_table.row(rowIndex).nodes()).addClass('selected');
                setTimeout(function () {
                    $(kpi_table.row(rowIndex).nodes()).removeClass('selected');
                }, 2000);


            } else {
                const modal = bootstrap.Modal.getInstance($("#update_kpi_modal"));
                modal.hide();
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            }
            //Set default button text again
            $("#update_kpi").text('Update');
            // notification

        },
        error: function (data) {
            const modal = bootstrap.Modal.getInstance($("#update_kpi_modal"));
            modal.hide();
            //Set default button text again
            $("#update_kpi").text('Update');
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
$('#salesKpi_dataTable tbody').on('click', '#delete_kpibtn', function () {
    rowData = kpi_table.row($(this).parents('tr')).data();
    rowIndex = kpi_table.row($(this).parents('tr')).index();
});

// DELETE Confirmation button
$("#delete_kpi").click(function () {
    $("#delete_kpi").text('Deleting....');
    $.ajax({
        url: nafisa_domain + '/sales_kpi/' + rowData.id,
        type: 'DELETE',
        dataType: "json",
        success: function (data) {

            if (data.status.code === 1) {
                $("#delete_kpi").text('Delete');
                let currentPage = kpi_table.page();
                kpi_table.row(rowIndex).remove().draw();
                const modal = bootstrap.Modal.getInstance($("#delete_kpi_modal"));
                modal.hide();
                // redrawing to original page
                kpi_table.page(currentPage).draw('page');
                notyf.success({
                    message: 'Kpi  Deleted <strong>Successfully !</strong>',
                    duration: 7000,
                    icon: false
                });

                rowData = undefined;
                rowIndex = undefined;
            } else {
                const modal = bootstrap.Modal.getInstance($("#delete_kpi_modal"));
                modal.hide();
                $("#delete_kpi").text('Delete');
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
            const modal = bootstrap.Modal.getInstance($("#delete_kpi_modal"));
            modal.hide();
            $("#delete_kpi").text('Delete');
            notyf.error({
                message: data.status.message,
                duration: 7000,
                icon: false
            });
        }


    });
});

//Attendance=============================================================================

//init category  datatable and load data
let attendance_table = $('#attendance_datatable').DataTable({
    order: [[1, 'desc']],
    ajax: {
        url: nafisa_domain + '/attendance/all/1000/1',
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


    ],

    columns: [
        {data: 'user_id.name'},
        {data: 'date'},
        {data: 'check_in'},
        {data: 'check_out'},

    ]
});


//PRODUCT=====================================================================================================================================

//init supplier datatable and load data

let product_table = $('#product_dataTable').DataTable({
    order: [[1, 'desc']],
    ajax: {
        url: nafisa_domain + '/products/',
        dataSrc: 'data',
    },
    order: [[0, 'desc']],
    "columnDefs": [
        {"width": "15%", "targets": 0},
        {"visible": false, "targets": 1},
        {"visible": false, "targets": 2},
        {"visible": false, "targets": 3},
        {"width": "15%", "targets": 4},
        {"width": "15%", "targets": 5},
        {"visible": false, "targets": 6},
        {"visible": false, "targets": 7},
        {"visible": false, "targets": 8},
        {"visible": false, "targets": 9},
        {"visible": false, "targets": 10},
        {"width": "15%", "targets": 11},
        {"width": "7%", "targets": 12},
        {"width": "10%", "targets": 13}
    ],

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

        '<button id="supplier_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_product_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'

    ],
    columns: [
        {data: 'name'},
        {data: 'description'},
        {data: 'unit_id.name'},
        {data: 'unit_size'},
        {data: 'brand_id.name'},
        {data: 'category_id.name'},
        {data: 'cost_price'},
        {data: 'mrp'},
        {data: 'wholesale_price'},
        {data: 'retail_price'},
        {data: 'discount_amount'},
        {
            data: 'product_image_url',
            render: function () {
                return '<button id="product_photo"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#product_image_modal">View</button>'
            }
        },
        {
            data: 'details',
            render: function () {
                return '<button id="product_details"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#details_product_modal">Details</button>'
            }
        },
        {
            data: '',
            render: function () {
                return '<button id="update_productBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"  data-bs-target="#update_product_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button> '
                    + ' <button   id="delete_productBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_product_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
            }
        },
    ]
});

//View  Supplier Photo Button----------------

$('#product_dataTable tbody').on('click', '#product_photo', function () {
    product_table.ajax.reload()
    rowData = product_table.row($(this).parents('tr')).data();
    $("#product_image").attr("src", rowData.product_image_url);
});

//cropzee-----------------

$(document).ready(function () {
    $("#product_image_url").cropzee();
    $("#update_product_image_url").cropzee();

});


//Reset product add Modal Input when it's Close
$('#add_product_modal').on('hidden.bs.modal', function () {
    $('[data-cropzee="' + 'product_image_url' + '"]').replaceWith('<div class="modal-body align-items-center-center"  data-cropzee="product_image_url"><img  src=""></div>');
    $(this).find('#product_post_form').trigger('reset');
});

//Reset Product update Modal Input when it's Close
$('#update_product_modal').on('hidden.bs.modal', function () {
    $('[data-cropzee="' + 'update_product_image_url' + '"]').replaceWith('<div class="modal-body align-items-center-center"  data-cropzee="update_product_image_url"><img id="s_nid_img" src=""></div>');
});


//init brand--------------------------------------------
$.ajax({
    url: nafisa_domain + '/brand',
    type: 'GET',
    success: function (data) {
        let category_parents = data?.data.map(item => item)
        category_parents.forEach((element) => {
            $('<option/>').val(element['id']).html(element['name']).appendTo('#product_brand_id');
            $('<option/>').val(element['id']).html(element['name']).appendTo('#update_product_brand_id');
        });
    }
});
//init Category-------------------------------------------
$.ajax({
    url: nafisa_domain + '/category',
    type: 'GET',
    success: function (data) {
        let category_parents = data?.data.map(item => item)
        category_parents.forEach((element) => {
            $('<option/>').val(element['id']).html(element['name']).appendTo('#product_category_id');
            $('<option/>').val(element['id']).html(element['name']).appendTo('#update_product_category_id');
        });
    }
});
//init product unit------------------------------------------
$.ajax({
    url: nafisa_domain + '/product_unit',
    type: 'GET',
    success: function (data) {
        let category_parents = data?.data.map(item => item)
        category_parents.forEach((element) => {
            $('<option/>').val(element['id']).html(element['name']).appendTo('#product_unit_type');
            $('<option/>').val(element['id']).html(element['name']).appendTo('#update_product_unit_type');
        });
    }
});


$('#product_dataTable tbody').on('click', '#product_details', function () {
    rowData = product_table.row($(this).parents('tr')).data()

    // setting row values to details modal
    $('#d_description').text(rowData.description);
    $("#d_unit").text(rowData.unit_id.name);
    $("#d_unit_size").text(rowData.unit_size);
    $("#d_cost_price").text(rowData.cost_price);
    $("#d_mrp").text(rowData.mrp);
    $("#d_wholesale").text(rowData.wholesale_price);
    $("#d_retails").text(rowData.retail_price);
    $("#d_discount").text(rowData.discount_amount);
})


/* ### Post Data Start ### */
$("#product_post_form").on('submit', (function (e) {


    let addPd = {
        name: $("#name").val(),
        description: $('#product_description').val(),
        unit_size: $("#product_unit_size").val(),
        cost_price: $("#product_cost_price").val(),
        mrp: $("#product_mrp").val(),
        wholesale_price: $("#product_wholesale_price").val(),
        retail_price: $("#product_retail_price").val(),
        discount_amount: $("#product_discount_amount").val(),
        product_image_url: $("#update_product_image").attr("src", ''),
        brand_id: {
            id: 1,
            name: $("#product_brand_id :selected").text(),
        },
        unit_id: {
            id: 1,
            name: $("#product_unit_type :selected").text(),
        },
        category_id: {
            id: 1,
            name: $("#product_category_id :selected").text(),
        },
    };

    e.preventDefault();
    $.ajax({
        url: nafisa_domain + '/products/',
        type: "POST",
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,
        success: function (data) {
            if (data.status.code === 1) {

                const modal = bootstrap.Modal.getInstance($("#add_product_modal"));
                modal.hide();
                let newSRowIndex = product_table.row.add(addPd).draw();
                //Success Notification
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });

                product_table.order([0, 'desc']).draw();
                // highlighting newly added row
                $(product_table.row(newSRowIndex.index()).nodes()).addClass('selected');
            } else {

                //Notification
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            }
        },
        error: function (data) {

            //Notification
            notyf.error({
                message: data.status.message,
                duration: 7000,
                icon: false
            });
        }
    });
    product_table.ajax.reload();

}));


$('#product_dataTable tbody').on('click', '#update_productBtn', function () {
    // getting parent row Data

    rowData = product_table.row($(this).parents('tr')).data();
    rowIndex = product_table.row($(this).parents('tr')).index();


    // setting row values to update modal input boxes
    $("#update_name").val(rowData.name);
    $('#update_product_description').val(rowData.description);
    $("#update_product_brand_id :selected").text(rowData.brand_id.name);
    $("#update_product_category_id :selected").text(rowData.category_id.name);
    $("#update_product_unit_type :selected").text(rowData.unit_id.name);
    $("#update_product_unit_size").val(rowData.unit_size);
    $("#update_product_cost_price").val(rowData.cost_price);
    $("#update_product_mrp").val(rowData.mrp);
    $("#update_product_wholesale_price").val(rowData.wholesale_price);
    $("#update_product_retail_price").val(rowData.retail_price);
    $("#update_product_discount_amount").val(rowData.discount_amount);

    $("#update_product_image").attr("src", rowData.product_image_url);
})


$("#update_product_post_form").on('submit', (function (e) {


    let addKp = {
        name: $("#update_name").val(),
        description: $('#update_product_description').val(),
        unit_size: $("#update_product_unit_size").val(),
        cost_price: $("#update_product_cost_price").val(),
        mrp: $("#update_product_mrp").val(),
        wholesale_price: $("#update_product_wholesale_price").val(),
        retail_price: $("#update_product_retail_price").val(),
        discount_amount: $("#update_product_discount_amount").val(),
        product_image_url: $("#update_product_image").attr("src", rowData.product_image_url),
        brand_id: {
            id: 1,
            name: $("#update_product_brand_id :selected").text(),
        },
        unit_id: {
            id: 1,
            name: $("#update_product_unit_type :selected").text(),
        },
        category_id: {
            id: 1,
            name: $("#update_product_category_id :selected").text(),
        },
    };


    e.preventDefault();
    $.ajax({
        url: nafisa_domain + '/products/' + rowData.id,
        type: "POST",
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,

        success: function (data) {
            if (data.status.code === 1) {
                // hide modal
                const modal = bootstrap.Modal.getInstance($("#update_product_modal"));
                modal.hide();
                //Set default button text again
                let currentPage = product_table.page();
                // update datatable
                product_table.row(rowIndex).data(addKp).draw();

                // redrawing to original page
                product_table.page(currentPage).draw('page');

                // highlighting newly added row
                $(product_table.row(rowIndex).nodes()).addClass('selected');
                setTimeout(function () {
                    $(product_table.row(rowIndex).nodes()).removeClass('selected');
                }, 2000);

                // notification
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            } else {
                //Set default button text again
                const modal = bootstrap.Modal.getInstance($("#update_product_modal"));
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
            const modal = bootstrap.Modal.getInstance($("#update_product_modal"));
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

$('#product_dataTable tbody').on('click', '#delete_productBtn', function () {
    rowData = product_table.row($(this).parents('tr')).data();
    rowIndex = product_table.row($(this).parents('tr')).index();

});

// DELETE Confirmation button
$("#delete_product").click(function () {

    $.ajax({
        url: nafisa_domain + '/products/' + rowData.id,
        type: 'DELETE',
        dataType: "json",
        success: function (data) {
            let currentPage = product_table.page();
            product_table.row(rowIndex).remove().draw();

            const modal = bootstrap.Modal.getInstance($("#delete_product_modal"));
            modal.hide();

            $("#delete_product").text('Delete');
            // redrawing to original page
            product_table.page(currentPage).draw('page');
            product_table.ajax.reload()
            notyf.success({
                message: data.status.message,
                duration: 7000,
                icon: false
            });

        },
        error: function (data) {
            notyf.error({
                message: "Cannot Delete This Product",
                duration: 7000,
                icon: false
            });
        },
    });
});

//PRODUCT UNIT========================================================================================================================================================

//init category  datatable and load data
let unit_table = $('#product_unit_datatable').DataTable({
    order: [[1, 'desc']],
    ajax: {
        url: nafisa_domain + '/product_unit',
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
            title: 'Unit Information',
            orientation: 'landscape',
            exportOptions: {
                columns: [0],
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
            title: 'Unit Information',
            exportOptions: {
                columns: [0]

            },

        },
        {
            extend: 'pdf',
            exportOptions: {
                columns: [0],
                modifier: {
                    page: 'current'
                }
            },
            pageSize: 'LEGAL',
            title: 'Shop Information',
            customize: function (doc) {
                doc.content[1].table.widths = [
                    '100%',

                ]
                let rowCount = doc.content[1].table.body.length;
                for (let i = 1; i < rowCount; i++) {
                    doc.content[1].table.body[i][0].alignment = 'center';
                }
            }
        },

        '<button id="productUnit_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#product_unit_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'

    ],

    columns: [
        {data: 'name'},
        {
            data: '',
            render: function () {
                return '<button   id="delete_UnitBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_product_unit_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
            }
        },
    ]
});


$("#add_product_unit").click(function () {
    let addProduct = {
        name: $("#product_unit_name").val(),
    };
    $("#add_product_unit").text('Submiting....');
    $.ajax({
        url: nafisa_domain + '/product_unit',
        type: 'POST',
        data: JSON.stringify(addProduct),
        contentType: "application/json",
        success: function (data) {
            if (data.status.code === 1) {
                const modal = bootstrap.Modal.getInstance($("#product_unit_modal"));
                modal.hide();
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
                let newRowIndex = unit_table.row.add(addProduct).draw();

                //reset input Field
                $('form :input').val('');
                $('.input').val('');
                unit_table.search('');
                // re-ordering to default
                unit_table.order([0, 'desc']).draw();
                // highlighting newly added row
                $(unit_table.row(newRowIndex.index()).nodes()).addClass('selected');
                $("#add_product_unit").text('Submit');
            } else {

                const modal = bootstrap.Modal.getInstance($("#product_unit_modal"));
                modal.hide();
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            }
        },
        error: function (data) {
            const modal = bootstrap.Modal.getInstance($("#product_unit_modal"));
            modal.hide();
            //Set default button text again
            $("#add_product_unit").text('Submit');
            // notification
            notyf.error({
                message: data.status.message,
                duration: 7000,
                icon: false
            });

        }
    });

})


//    DELETE button ------------------------------------------------
$('#product_unit_datatable tbody').on('click', '#delete_UnitBtn', function () {
    rowData = unit_table.row($(this).parents('tr')).data();
    rowIndex = unit_table.row($(this).parents('tr')).index();
});

// DELETE Confirmation button
$("#delete_product_unit").click(function () {
    $("#delete_product_unit").text('Deleting....');
    $.ajax({
        url: nafisa_domain + '/product_unit/' + rowData.id,
        type: 'DELETE',
        dataType: "json",
        success: function (data) {

            if (data.status.code === 1) {
                $("#delete_raw_product").text('Delete');
                let currentPage = unit_table.page();
                unit_table.row(rowIndex).remove().draw();
                const modal = bootstrap.Modal.getInstance($("#delete_product_unit_modal"));
                modal.hide();
                // redrawing to original page
                unit_table.page(currentPage).draw('page');
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
                $("#delete_product_unit").text('Delete');

                rowData = undefined;
                rowIndex = undefined;
            } else {
                const modal = bootstrap.Modal.getInstance($("#delete_product_unit_modal"));
                modal.hide();
                $("#delete_raw_product").text('Delete');
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
                $("#delete_product_unit").text('Delete');

                rowData = undefined;
                rowIndex = undefined;
            }

        },
        error: function (data) {
            const modal = bootstrap.Modal.getInstance($("#delete_product_unit_modal"));
            modal.hide();
            $("#delete_product_unit").text('Delete');
            notyf.error({
                message: data.status.message,
                duration: 7000,
                icon: false
            });


        }


    });
});


//    PRODUCT RAW MATERIAL ================================================================================================================================

//init category  datatable and load data
let raw_material_table = $('#product_raw_material_dataTable').DataTable({
    order: [[1, 'desc']],
    ajax: {
        url: nafisa_domain + '/product_raw_material',
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

        '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#product_raw_material_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'

    ],

    columns: [
        {data: 'name'},
        {data: 'unit_id.name'},
        {data: 'unit_size'},
        {data: 'cost_price'},
        {
            data: '',
            render: function () {
                return '<button id="update_rawBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_product_raw_material_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  '
                    + '<button   id="delete_rawBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_product_raw_material_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
            }
        },
    ]
});

//init Unit--------------------------------------------
$.ajax({
    url: nafisa_domain + '/product_unit',
    type: 'GET',
    success: function (data) {
        let category_parents = data?.data.map(item => item)
        category_parents.forEach((element) => {
            $('<option/>').val(element['id']).html(element['name']).appendTo('#product_raw_material_unit_name');
            $('<option/>').val(element['id']).html(element['name']).appendTo('#update_product_raw_material_unit_name');

        });
    }

});


$("#add_product_raw_material").click(function () {
    let addRawModal = {
        name: $("#product_raw_material_name").val(),
        unit_id: $("#product_raw_material_unit_name").val(),
        unit_size: $("#product_raw_material_unit_size").val(),
        cost_price: $("#product_raw_material_cost_price").val(),
    };
    let addRawModal2 = {
        name: $("#product_raw_material_name").val(),
        unit_id: {
            id: 10,
            name: $('#product_raw_material_unit_name option:selected').text()
        },
        unit_size: $("#product_raw_material_unit_size").val(),
        cost_price: $("#product_raw_material_cost_price").val(),
    };

    $.ajax({
        url: nafisa_domain + '/product_raw_material',
        type: 'POST',
        data: JSON.stringify(addRawModal),
        contentType: "application/json",
        success: function (data) {
            if (data.status.code === 1) {
                const modal = bootstrap.Modal.getInstance($("#product_raw_material_modal"));
                modal.hide();
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
                let newRowIndex = raw_material_table.row.add(addRawModal2).draw();

                //reset input Field
                $('form :input').val('');
                $('.input').val('');
                raw_material_table.search('');
                // re-ordering to default
                raw_material_table.order([0, 'desc']).draw();
                // highlighting newly added row
                $(raw_material_table.row(newRowIndex.index()).nodes()).addClass('selected');

            } else {

                const modal = bootstrap.Modal.getInstance($("#product_raw_material_modal"));
                modal.hide();
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            }
        },
        error: function (data) {
            if (data.status.code === 0) {

                const modal = bootstrap.Modal.getInstance($("#product_raw_material_modal"));
                modal.hide();
                //Set default button text again
                $("#add_kpi").text('Submit');
                // notification
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });

            } else {

                const modal = bootstrap.Modal.getInstance($("#product_raw_material_modal"));
                modal.hide();
                //Set default button text again
                $("#add_kpi").text('Submit');
                // notification
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });


            }


        }
    });

})

//Update raw-----------------------------------

// EDIT button
$('#product_raw_material_dataTable tbody').on('click', '#update_rawBtn', function () {
    // getting parent row index and data
    rowData = raw_material_table.row($(this).parents('tr')).data();
    rowIndex = raw_material_table.row($(this).parents('tr')).index();

    $("#update_product_raw_material_name").val(rowData.name);
    $("#update_product_raw_material_unit_name :selected").text(rowData.unit_id.name);
    $("#update_product_raw_material_unit_size").val(rowData.unit_size);
    $("#update_product_raw_material_cost_price").val(rowData.cost_price);
})

// Update Button
$("#update_product_raw_material").click(function () {

    let updateRawModal = {
        name: $("#update_product_raw_material_name").val(),
        product_unit_id: $("#update_product_raw_material_unit_name").val(),
        unit_size: $("#update_product_raw_material_unit_size").val(),
        cost_price: $("#update_product_raw_material_cost_price").val(),
    };


    let updateRawModal2 = {
        name: $("#update_product_raw_material_name").val(),
        unit_id: {
            id: 10,
            name: $('#update_product_raw_material_unit_name option:selected').text()
        },
        unit_size: $("#update_product_raw_material_unit_size").val(),
        cost_price: $("#update_product_raw_material_cost_price").val(),
    };


    $(this).text('Updating...');

    // updating server row
    $.ajax({
        url: nafisa_domain + '/product_raw_material/' + rowData.id,
        type: 'PUT',
        data: JSON.stringify(updateRawModal),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.status.code === 1) {
                // hide modal
                const modal = bootstrap.Modal.getInstance($("#update_product_raw_material_modal"));
                modal.hide();

                //Set default button text again
                $("#update_product_raw_material").text('Update');
                // notification
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
                let currentPage = raw_material_table.page();

                // update datatable
                raw_material_table.row(rowIndex).data(updateRawModal2).draw();

                // redrawing to original page
                raw_material_table.page(currentPage).draw('page');
                // highlighting newly added row
                $(raw_material_table.row(rowIndex).nodes()).addClass('selected');
                setTimeout(function () {
                    $(raw_material_table.row(rowIndex).nodes()).removeClass('selected');
                }, 2000);

            } else {
                const modal = bootstrap.Modal.getInstance($("#update_product_raw_material_modal"));
                modal.hide();
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            }
            $("#update_product_raw_material").text('Update');
        },
        error: function (data) {
            const modal = bootstrap.Modal.getInstance($("#update_product_raw_material_modal"));
            modal.hide();
            //Set default button text again
            $("#update_product_raw_material").text('Update');
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
$('#product_raw_material_dataTable tbody').on('click', '#delete_rawBtn', function () {
    rowData = raw_material_table.row($(this).parents('tr')).data();
    rowIndex = raw_material_table.row($(this).parents('tr')).index();
});

// DELETE Confirmation button
$("#delete_raw_product").click(function () {
    $("#delete_raw_product").text('Deleting....');
    $.ajax({
        url: nafisa_domain + '/product_raw_material/' + rowData.id,
        type: 'DELETE',
        dataType: "json",
        success: function (data) {

            if (data.status.code === 1) {
                $("#delete_raw_product").text('Delete');
                let currentPage = raw_material_table.page();
                raw_material_table.row(rowIndex).remove().draw();
                const modal = bootstrap.Modal.getInstance($("#delete_product_raw_material_modal"));
                modal.hide();
                // redrawing to original page
                category_table.page(currentPage).draw('page');
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });

                rowData = undefined;
                rowIndex = undefined;
            } else {
                const modal = bootstrap.Modal.getInstance($("#delete_product_raw_material_modal"));
                modal.hide();
                $("#delete_raw_product").text('Delete');
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
            const modal = bootstrap.Modal.getInstance($("#delete_product_raw_material_modal"));
            modal.hide();
            $("#delete_raw_product").text('Delete');
            notyf.error({
                message: data.status.message,
                duration: 7000,
                icon: false
            });
        }


    });
});


//SALES PRODUCT============================================================================================================================

let sales_product_table = $('#sales_product_dataTable').DataTable({
    order: [[1, 'desc']],
    ajax: {
        url: nafisa_domain + '/sales_product',
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
            title: 'Sales Product Information',
            orientation: 'landscape',
            exportOptions: {
                columns: [0, 1, 2, 3, 4],
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
            title: 'Sales Product Information',
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
            title: 'Sales Product Information',
            customize: function (doc) {
                doc.content[1].table.widths = [
                    '20%',
                    '20%',
                    '20%',
                    '20%',
                ]
                let rowCount = doc.content[1].table.body.length;
                for (let i = 1; i < rowCount; i++) {
                    doc.content[1].table.body[i][0].alignment = 'center';
                    doc.content[1].table.body[i][1].alignment = 'center';
                    doc.content[1].table.body[i][2].alignment = 'center';
                    doc.content[1].table.body[i][3].alignment = 'center';
                    doc.content[1].table.body[i][4].alignment = 'center';
                }
            }
        },

    ],

    columns: [
        {data: 'product_id.name'},
        {data: 'buying_price'},
        {data: 'discount_amount'},
        {data: 'selling_price'},
        {data: 'amount_unit'},
        {
            data: '',
            render: function () {
                return '<button   id="delete_sales_Product_Btn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_sales_product_raw_material_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
            }
        },
    ]
});


$('#sales_product_dataTable tbody').on('click', '#delete_sales_Product_Btn', function () {
    rowData = sales_product_table.row($(this).parents('tr')).data();
    rowIndex = sales_product_table.row($(this).parents('tr')).index();
});

// DELETE Confirmation button
$("#delete_sales_product").click(function () {
    $.ajax({
        url: nafisa_domain + '/sales_product/' + rowData.id,
        type: 'DELETE',
        dataType: "json",
        success: function (data) {

            if (data.status.code === 1) {
                $("#delete_raw_product").text('Delete');
                let currentPage = sales_product_table.page();
                sales_product_table.row(rowIndex).remove().draw();
                const modal = bootstrap.Modal.getInstance($("#delete_sales_product_raw_material_modal"));
                modal.hide();
                // redrawing to original page
                sales_product_table.page(currentPage).draw('page');
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });

                rowData = undefined;
                rowIndex = undefined;
            } else {
                const modal = bootstrap.Modal.getInstance($("#delete_sales_product_raw_material_modal"));
                modal.hide();
                $("#delete_raw_product").text('Delete');
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
            const modal = bootstrap.Modal.getInstance($("#delete_sales_product_raw_material_modal"));
            modal.hide();
            $("#delete_raw_product").text('Delete');
            notyf.error({
                message: data.status.message,
                duration: 7000,
                icon: false
            });
        }


    });
});


//PURCHASE ORDER FROM ==========================================================================================================


$(document).ready(function () {
    var i = 1;
    $("#add_row").click(function () {
        b = i - 1;
        $('#addr' + i).html($('#addr' + b).html()).find('td:first-child').html(i + 1);
        $('.tab_logic').append('<tr id="addr' + (i + 1) + '"></tr>');
        i++;
    });
    $("#delete_row").click(function () {
        if (i > 1) {
            $("#addr" + (i - 1)).html('');
            i--;
        }
        calc();
    });
    $('.tab_logic tbody').on('keyup change', function () {
        calc();
    });
});


function calc() {
    $('.tab_logic tbody tr').each(function (i, element) {
        var html = $(this).html();
        if (html != '') {
            var qty = $(this).find('.qty').val();
            var price = $(this).find('.price').val();
            var dis = $(this).find('.discount').val();
            $(this).find('.total').val(qty * price - dis);


            var arr = $('.total').map((i, e) => e.value).get();
            var sum = arr.reduce(function (a, b) {
                if (isNaN(a) || a == "")
                    a = 0;
                if (isNaN(b) || b == "")
                    b = 0;
                return parseInt(a) + parseInt(b);
            }, 0);
            $('#allTotal').text(sum + " BDT");

        }
    });
}


$(document).ready(function () {
    $(document).on("change", ".price", function () {
        var arr = $('.price').map((i, e) => e.value).get();
        var sum = arr.reduce(function (a, b) {
            if (isNaN(a) || a == "")
                a = 0;
            if (isNaN(b) || b == "")
                b = 0;
            return parseInt(a) + parseInt(b);
        }, 0);
        $('#totalPrice').text(sum + " BDT");

    });
});

$(document).ready(function () {
    $(document).on("change", ".discount", function () {
        var arr = $('.discount').map((i, e) => e.value).get();
        var sum = arr.reduce(function (a, b) {
            if (isNaN(a) || a == "")
                a = 0;
            if (isNaN(b) || b == "")
                b = 0;
            return parseInt(a) + parseInt(b);
        }, 0);
        $('#totalDiscount').text(sum + " BDT");

    });
});

$(document).ready(function () {
    $(document).on("change", ".qty", function () {
        var arr = $('.qty').map((i, e) => e.value).get();
        var sum = arr.reduce(function (a, b) {
            if (isNaN(a) || a == "")
                a = 0;
            if (isNaN(b) || b == "")
                b = 0;
            return parseInt(a) + parseInt(b);
        }, 0);
        $('#totalUnit').text(sum);

    });
});


//init Unit--------------------------------------------
$.ajax({
    url: nafisa_domain + '/products/',
    type: 'GET',
    success: function (data) {
        let product_parents = data?.data.map(item => item)
        product_parents.forEach((element) => {
            $('<option/>').val(element['id']).html(element['name']).attr("data-price", element['cost_price']).attr("data-unit", element['unit_id']['name']).appendTo('.product_list');
        });
    }
});

$.ajax({
    url: nafisa_domain + '/branch',
    type: 'GET',
    success: function (data) {
        let purchase_branch = data?.data.map(item => item)
        purchase_branch.forEach((element) => {
            $('<option/>').val(element['id']).html(element['name']).appendTo('#select_branch_purchase');
        });
    }
});

$.ajax({
    url: nafisa_domain + '/purchase_status',
    type: 'GET',
    success: function (data) {
        let purchase_branch = data?.data.map(item => item)
        purchase_branch.forEach((element) => {
            $('<option/>').val(element['id']).html(element['status']).appendTo('#select_purchase_transaction_payment_status');
        });
    }
});

$.ajax({
    url: nafisa_domain + '/supplier/all',
    type: 'GET',
    success: function (data) {
        let purchase_branch = data?.data.map(item => item)
        purchase_branch.forEach((element) => {
            $('<option/>').val(element['id']).html(element['name']).appendTo('#select_supplier_purchase');
        });
    }
});


$('.tab_logic').on('change', 'select', function () {
    let price_purchase = $(this).find(':selected').data('price');
    $(this).closest('tr').find('.price').val(price_purchase);
    $(this).closest('tr').find('.Unit_size').text($(this).find(':selected').data('unit'));
});

let purchase_order_id = "";

$("#Submit_btn").click(function () {
    var values = [];
    var value = {};
    var i = 0;
    var field_name, field_value;

    $('.tab_logic tr').find(':input').each(function () {

        field_name = $(this).attr('name');
        field_value = this.value;

        if (field_name === "product_id" || field_name === "discount_amount" || field_name === "amount_unit") {
            value[$(this).attr('name')] = this.value;
        }
        i++;
        if (i % 5 === 0) {
            values.push(value)
            value = {}
        }
    });
    var addpurchaseorder = {
        default_branch_id: $("#select_branch_purchase").val(),
        supplier_id: $("#select_supplier_purchase").val(),
        supply_schedule: $("#date_purchase").val(),
        product_name_list: values,
    };

    $.ajax({
        url: nafisa_domain + '/purchase_order',
        type: 'POST',
        data: JSON.stringify(addpurchaseorder),
        contentType: "application/json",
        success: function (data) {
            if (data.status.code === 1) {
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
                console.log(data)

                purchase_order_id = data.data.purchase_order_id;

            } else if (data.status.code === 0) {

                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            }
        },
        error: function (data) {

            notyf.error({
                message: data.status.message,
                duration: 7000,
                icon: false
            });
        }
    });
})


$.ajax({
    url: nafisa_domain + '/transaction_type',
    type: 'GET',
    success: function (data) {
        let purchase_branch = data?.data.map(item => item)
        purchase_branch.forEach((element) => {
            $('<option/>').val(element['id']).html(element['name']).appendTo('#select_purchase_transaction_type');
        });
    }
});


$("#purchase_transaction_form").on('submit', (function (e) {

    var FormDataX = new FormData(this);
    FormDataX.append("purchase_id", purchase_order_id)

    e.preventDefault();
    $.ajax({
        url: nafisa_domain + '/purchase_transaction',
        type: "POST",
        data: FormDataX,
        contentType: false,
        cache: false,
        processData: false,

        success: function (data) {

            if (data.status.code === 1) {
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
                const modal = bootstrap.Modal.getInstance($("#update_product_raw_material_modal"));
                modal.hide();
            } else {
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
                const modal = bootstrap.Modal.getInstance($("#update_product_raw_material_modal"));
                modal.hide();
            }
        },
        error: function (data) {
            if (data.status.code === 0) {
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });

            } else {

                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            }
        },

    })
}));


//PURCHASE TRANSACTION=============================================================================================================


//init shop & branch  datatable and load data
$('#purchase_transaction_dataTable').DataTable({
    order: [[1, 'desc']],
    ajax: {
        url: nafisa_domain + '/purchase_transaction',
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
            title: 'Purchase Transaction',
            orientation: 'landscape',
            exportOptions: {
                columns: [0, 1, 2, 3, 5],
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
            title: 'Purchase Transaction',
            exportOptions: {
                columns: [0, 1, 2, 3, 5],

            },

        },
        {
            extend: 'pdf',
            exportOptions: {
                columns: [0, 1, 2, 3, 5],
                modifier: {
                    page: 'current'
                }
            },
            pageSize: 'LEGAL',
            title: 'Purchase Transaction',
            customize: function (doc) {
                doc.content[1].table.widths = [
                    '20%',
                    '20%',
                    '20%',
                    '20%',
                    '20%',
                ]
                let rowCount = doc.content[1].table.body.length;
                for (let i = 1; i < rowCount; i++) {
                    doc.content[1].table.body[i][0].alignment = 'center';
                    doc.content[1].table.body[i][1].alignment = 'center';
                    doc.content[1].table.body[i][2].alignment = 'center';
                    doc.content[1].table.body[i][3].alignment = 'center';
                    doc.content[1].table.body[i][5].alignment = 'center';

                }
            }
        },
    ],
    columns: [
        {data: 'transaction_type_id.name'},
        {data: 'payment_status_id.status'},
        {data: 'transaction_at'},
        {data: 'amount_paid'},
        {
            data: 'transaction_document_url',
            render: function () {
                return '<button id="brand_photo"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#brand_image_modal">View</button>'
            }
        },
        {data: 'ref_comment'},

    ]
});


//SALES ORDER FROM ==========================================================================================================


$(document).ready(function () {
    var i = 1;
    $("#add_sales_row").click(function () {
        c = i - 1;
        $('#addr' + i).html($('#addr' + c).html()).find('td:first-child').html(i + 1);
        $('.tab_logic_sales').append('<tr id="addr' + (i + 1) + '"></tr>');
        i++;
    });
    $("#delete_rows").click(function () {
        if (i > 1) {
            $("#addr" + (i - 1)).html('');
            i--;
        }
        sales();
    });
    $('.tab_logic_sales tbody').on('keyup change', function () {
        sales();
    });
});


function sales() {
    $('.tab_logic_sales tbody tr').each(function (i, element) {
        var html = $(this).html();
        if (html != '') {
            var qty = $(this).find('.sales_qty').val();
            var price = $(this).find('.sales_price').val();
            var dis = $(this).find('.sales_discount').val();
            $(this).find('.salesTotal').val(qty * price - dis);

            var arry = $('.salesTotal').map((i, e) => e.value).get();
            var sums = arry.reduce(function (a, b) {
                if (isNaN(a) || a == "")
                    a = 0;
                if (isNaN(b) || b == "")
                    b = 0;
                return parseInt(a) + parseInt(b);
            }, 0);
            $('#sales_allTotal').text(sums + " BDT");


        }
    });
}


$(document).ready(function () {
    $(document).on("change", ".sales_price", function () {
        var arry = $('.sales_price').map((i, e) => e.value).get();
        var sums = arry.reduce(function (a, b) {
            if (isNaN(a) || a == "")
                a = 0;
            if (isNaN(b) || b == "")
                b = 0;
            return parseInt(a) + parseInt(b);
        }, 0);
        $('#total_sales_Price').text(sums + " BDT");

    });
});

$(document).ready(function () {
    $(document).on("change", ".sales_discount", function () {
        var arry = $('.sales_discount').map((i, e) => e.value).get();
        var sums = arry.reduce(function (a, b) {
            if (isNaN(a) || a == "")
                a = 0;
            if (isNaN(b) || b == "")
                b = 0;
            return parseInt(a) + parseInt(b);
        }, 0);
        $('#sales_Discount').text(sums + " BDT");

    });
});

$(document).ready(function () {
    $(document).on("change", ".sales_qty", function () {
        var arry = $('.sales_qty').map((i, e) => e.value).get();
        var sums = arry.reduce(function (a, b) {
            if (isNaN(a) || a == "")
                a = 0;
            if (isNaN(b) || b == "")
                b = 0;
            return parseInt(a) + parseInt(b);
        }, 0);
        $('#sales_totalUnit').text(sums + "Units");

    });
});


//init Unit--------------------------------------------
$.ajax({
    url: nafisa_domain + '/products/',
    type: 'GET',
    success: function (data) {
        let product_parents = data?.data.map(item => item)
        product_parents.forEach((element) => {
            $('<option/>').val(element['id']).html(element['name']).attr("data-price", element['cost_price']).attr("data-unit", element['unit_id']['name']).appendTo('.sales_order_list');
        });
    }
});

$('.tab_logic_sales').on('change', 'select', function () {
    let sales_purchase = $(this).find(':selected').data('price');
    $(this).closest('tr').find('.sales_price').val(sales_purchase);
    $(this).closest('tr').find('.sales_unit_type').text($(this).find(':selected').data('unit'));
});


$.ajax({
    url: nafisa_domain + '/sales_type',
    type: 'GET',
    success: function (data) {
        let purchase_branch = data?.data.map(item => item)
        purchase_branch.forEach((element) => {
            $('<option/>').val(element['id']).html(element['name']).appendTo('#select_sales_type');
        });
    }
});

$.ajax({
    url: nafisa_domain + '/customer/all',
    type: 'GET',
    success: function (data) {

        let purchase_branch = data?.data.map(item => item)
        purchase_branch.forEach((element) => {
            $('<option/>').val(element['id']).html(element['name']).appendTo('#select_sales_customer');
        });
    }
});

let sales_order_id = '';

$("#sales_submit_btn").click(function () {
    var values = [];
    var value = {};
    var i = 0;
    var field_name, field_value;

    $('.tab_logic_sales tr').find(':input').each(function () {


        field_name = $(this).attr('name');
        field_value = this.value;


        if (field_name === "product_id" || field_name === "discount_amount" || field_name === "amount_unit") {
            value[$(this).attr('name')] = this.value;
        }
        i++;
        if (i % 5 === 0) {
            values.push(value)
            value = {}
        }
    });

    var addsalesorder = {
        sales_type_id: $("#select_sales_type").val(),
        customer_id: $("#select_sales_customer").val(),
        product_name_list: values,
    };

    $.ajax({
        url: nafisa_domain + '/sales_order',
        type: 'POST',
        data: JSON.stringify(addsalesorder),
        contentType: "application/json",
        success: function (data) {
            if (data.status.code === 1) {
                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });

                sales_order_id = data.data.sales_order_id;

            } else if (data.status.code === 0) {

                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            }
        },
        error: function (data) {

            notyf.error({
                message: data.status.message,
                duration: 7000,
                icon: false
            });
        }
    });
})


$.ajax({
    url: nafisa_domain + '/sales_status',
    type: 'GET',
    success: function (data) {
        let purchase_branch = data?.data.map(item => item)
        purchase_branch.forEach((element) => {
            $('<option/>').val(element['id']).html(element['status']).appendTo('#select_sales_transaction_payment_status');
        });
    }
});


$("#sales_transaction_form").on('submit', (function (e) {

    var FormDataX = new FormData(this);
    FormDataX.append("sales_order_id", sales_order_id)

    e.preventDefault();
    $.ajax({
        url: nafisa_domain + '/sales_transaction',
        type: "POST",
        data: FormDataX,
        contentType: false,
        cache: false,
        processData: false,

        success: function (data) {

            if (data.status.code === 1) {

                const modal = bootstrap.Modal.getInstance($("#sales_payment_modal"));
                modal.hide();

                notyf.success({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            } else {
                const modal = bootstrap.Modal.getInstance($("#sales_payment_modal"));
                modal.hide();
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            }
        },
        error: function (data) {
            const modal = bootstrap.Modal.getInstance($("#sales_payment_modal"));
            modal.hide();

            notyf.error({
                message: data.status.message,
                duration: 7000,
                icon: false
            });
        },

    })
}));

//SALES TRANSACTION====================================================================================================================================================


//init shop & branch  datatable and load data
$('#sales_transaction_dataTable').DataTable({
    order: [[1, 'desc']],
    ajax: {
        url: nafisa_domain + '/sales_transaction',
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
            title: 'Sales Transaction',
            orientation: 'landscape',
            exportOptions: {
                columns: [0, 1, 2, 3, 5],
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
            title: 'Sales Transaction',
            exportOptions: {
                columns: [0, 1, 2, 3, 5],

            },

        },
        {
            extend: 'pdf',
            exportOptions: {
                columns: [0, 1, 2, 3, 5],
                modifier: {
                    page: 'current'
                }
            },
            pageSize: 'LEGAL',
            title: 'Sales Transaction',
            customize: function (doc) {
                doc.content[1].table.widths = [
                    '20%',
                    '20%',
                    '20%',
                    '20%',
                    '20%',
                ]
                let rowCount = doc.content[1].table.body.length;
                for (let i = 1; i < rowCount; i++) {
                    doc.content[1].table.body[i][0].alignment = 'center';
                    doc.content[1].table.body[i][1].alignment = 'center';
                    doc.content[1].table.body[i][2].alignment = 'center';
                    doc.content[1].table.body[i][3].alignment = 'center';
                    doc.content[1].table.body[i][5].alignment = 'center';

                }
            }
        },
    ],
    columns: [
        {data: 'transaction_type_id.name'},
        {data: 'sales_status_id.status'},
        {data: 'transaction_at'},
        {data: 'amount_paid'},
        {
            data: 'transaction_document_url',
            render: function () {
                return '<button id="brand_photo"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#brand_image_modal">View</button>'
            }
        },
        {data: 'ref_comment'},

    ]
});


//FORMULA=========================================================================================================


$(document).ready(function () {
    var i = 1;
    $("#add_formula_row").click(function () {
        c = i - 1;
        $('#addr' + i).html($('#addr' + c).html()).find('td:first-child').html(i + 1);
        $('.tab_logic_formula').append('<tr id="addr' + (i + 1) + '"></tr>');
        i++;
    });
    $("#delete_rowss").click(function () {
        if (i > 1) {
            $("#addr" + (i - 1)).html('');
            i--;
        }
        calcs();
    });
    $('.tab_logic_formula tbody').on('keyup change', function () {
        calcs();
    });
});


function calcs() {
    $('.tab_logic_formula tbody tr').each(function (i, element) {
        var html = $(this).html();
        if (html != '') {
            var qty = $(this).find('.sales_qty').val();
            var price = $(this).find('.sales_price').val();
            var dis = $(this).find('.sales_discount').val();
            $(this).find('.sales_totalcal').val(qty * price - dis);


            var arry = $('.sales_totalcal').map((i, e) => e.value).get();
            var sums = arry.reduce(function (a, b) {
                if (isNaN(a) || a == "")
                    a = 0;
                if (isNaN(b) || b == "")
                    b = 0;
                return parseInt(a) + parseInt(b);
            }, 0);
            $('#sales_allTotal').text(sums + " BDT");

        }
    });
}


$(document).ready(function () {
    $(document).on("change", ".sales_price", function () {
        var arry = $('.sales_price').map((i, e) => e.value).get();
        var sums = arry.reduce(function (a, b) {
            if (isNaN(a) || a == "")
                a = 0;
            if (isNaN(b) || b == "")
                b = 0;
            return parseInt(a) + parseInt(b);
        }, 0);
        $('#total_sales_Price').text(sums + " BDT");

    });
});

$(document).ready(function () {
    $(document).on("change", ".sales_discount", function () {
        var arry = $('.sales_discount').map((i, e) => e.value).get();
        var sums = arry.reduce(function (a, b) {
            if (isNaN(a) || a == "")
                a = 0;
            if (isNaN(b) || b == "")
                b = 0;
            return parseInt(a) + parseInt(b);
        }, 0);
        $('#sales_Discount').text(sums + " BDT");

    });
});

$(document).ready(function () {
    $(document).on("change", ".sales_qty", function () {
        var arry = $('.sales_qty').map((i, e) => e.value).get();
        var sums = arry.reduce(function (a, b) {
            if (isNaN(a) || a == "")
                a = 0;
            if (isNaN(b) || b == "")
                b = 0;
            return parseInt(a) + parseInt(b);
        }, 0);
        $('#sales_totalUnit').text(sums + "Units");

    });
});


$.ajax({
    url: nafisa_domain + '/category',
    type: 'GET',
    success: function (data) {
        let purchase_branch = data?.data.map(item => item)
        purchase_branch.forEach((element) => {
            $('<option/>').val(element ['id']).html(element['name']).appendTo('#select_formula_category');
        });
    }
});


//init Unit--------------------------------------------
$.ajax({
    url: nafisa_domain + '/product_raw_material',
    type: 'GET',
    success: function (data) {
        let product_parents = data?.data.map(item => item)
        product_parents.forEach((element) => {
            $('<option/>').val(element['id']).html(element['name']).attr("data-unit", element['unit_id']['name']).appendTo('.select_product_raw');

        });
    }
})

$('.tab_logic_formula').on('change', 'select', function () {
    $(this).closest('tr').find('.unit_level').val($(this).find(':selected').data('unit'));
});


$("#formula_submit_btn").click(function () {
    var values = [];
    var value = {};
    var i = 0;
    var field_name, field_value;

    $('.tab_logic_formula tr').find(':input').each(function () {

        field_name = $(this).attr('name');
        field_value = this.value;


        if (field_name === "raw_mat_id" || field_name === "percentage" || field_name === "no_of_unit") {
            value[$(this).attr('name')] = this.value;
        }
        i++;
        if (i % 4 === 0) {
            values.push(value)
            value = {}
        }
    });

    var addformula = {
        name: $("#add_formula").val(),
        category_id: $("#select_formula_category").val(),
        formula_ingredients_list: values,
    };

    $.ajax({
        url: nafisa_domain + '/product_formula',
        type: 'POST',
        data: JSON.stringify(addformula),
        contentType: "application/json",
        success: function (data) {

            if (data.status.code === 1) {
                notyf.success({
                    message: 'Formula Added Successfully',
                    duration: 7000,
                    icon: false
                });
            } else {
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            }
        },
        error: function (data) {

            if (data.status.code === 0) {
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            } else {
                notyf.error({
                    message: data.status.message,
                    duration: 7000,
                    icon: false
                });
            }

        }
    });
})


//INVENTORY================================================================================================================================

$.ajax({
    url: nafisa_domain + '/branch',
    type: 'GET',
    success: function (data) {
        let purchase_branch = data?.data.map(item => item)
        purchase_branch.forEach((element) => {
            $('<option/>').val(element['id']).html(element ['name']).appendTo('#select_inventory_category');

        });
    }
});


var inventory_table = $('#inventory_dataTable').DataTable({
    order: [[1, 'desc']],
    "columnDefs": [
        {"width": "15%", "targets": 0},
        {"width": "15%", "targets": 1},
        {'visible': false, 'targets': 2},
        {"width": "10%", "targets": 3},
        {"width": "10%", "targets": 4},
        {"width": "10%", "targets": 5},


    ],

    oLanguage: {
        sLengthMenu: "Show _MENU_",
    },
    language: {
        search: "",
        searchPlaceholder: "Search...",
        emptyTable: "You Need To Selected A Branch"
    },

    columns: [
        {data: 'product_id.name'},
        {data: 'product_id.category_id.name'},
        {data: 'branch_id.name'},
        {data: 'stock_amount'},
        {data: 'min_stock_alert'},

        {
            data: '',
            render: function () {
                return '<button id="update_stockBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#Update_Stock_Alert_Modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button> '
                    + ' <button id="transferStockBtn"  class="btn btn-primary" toggle="tooltip" title="Transfrt Product" type="button" data-bs-toggle="modal"   data-bs-target="#transfer_inventory_modal" >Transfer</button> '
            }
        },

    ],
    "createdRow": function (row, data,) {
        if (data['min_stock_alert'] >= data['stock_amount']) {
            $(row).css("background-color", "rgb(245,222,179)");
        }
    }
});


$("#sub_bra_id").click(function () {
    var abc = $("#select_inventory_category").val();
    inventory_table.ajax.url(nafisa_domain + '/inventory/' + abc).load();
    $.fn.dataTable.ext.errMode = 'throw';

});


$('#inventory_dataTable tbody').on('click', '#update_stockBtn', function () {
    rowIndex = inventory_table.row($(this).parents('tr')).index();
    rowData = inventory_table.row($(this).parents('tr')).data();

    $("#update_stock_alert").val(rowData.min_stock_alert)

    $("#update_stock").click(function () {

        let updateUserModal = {
            product_id: rowData.product_id.id,
            branch_id: rowData.branch_id.id,
            min_stock_alert: $("#update_stock_alert").val(),

        };

        var upData = {
            product_id: rowData.product_id,
            category_id: rowData.category_id,
            branch_id: rowData.branch_id,
            stock_amount: rowData.stock_amount,
            min_stock_alert: updateUserModal.min_stock_alert,
        }


        $.ajax({
            url: nafisa_domain + '/inventory',
            type: 'PUT',
            data: JSON.stringify(updateUserModal),
            contentType: "application/json; charset=utf-8",
            success: function (data) {

                if (data.status.code === 1) {
                    const modal = bootstrap.Modal.getInstance($("#Update_Stock_Alert_Modal"));
                    modal.hide();
                    let currentPage = inventory_table.page();


                    inventory_table.row(rowIndex).data(upData).draw();
                    inventory_table.page(currentPage).draw('page');

                    // highlighting newly added row
                    $(inventory_table.row(rowIndex).nodes()).addClass('selected');


                    setTimeout(function () {
                        $(inventory_table.row(rowIndex).nodes()).removeClass('selected');
                    }, 2000);

                    // notification
                    notyf.success({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });
                } else {
                    const modal = bootstrap.Modal.getInstance($("#Update_Stock_Alert_Modal"));
                    modal.hide();
                    notyf.error({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });
                }

            },

            error: function () {

                if (data.status.code === 0) {
                    const modal = bootstrap.Modal.getInstance($("#Update_Stock_Alert_Modal"));
                    modal.hide();
                    notyf.error({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });

                } else {
                    const modal = bootstrap.Modal.getInstance($("#Update_Stock_Alert_Modal"));
                    modal.hide();
                    notyf.error({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });
                }
            }
        });

    });
})

$.ajax({
    url: nafisa_domain + '/branch',
    type: 'GET',
    success: function (data) {
        let purchase_branch = data?.data.map(item => item)
        purchase_branch.forEach((element) => {
            $('<option/>').val(element['id']).html(element ['name']).appendTo('#transfer_to_branch');

        });
    }
});


$('#inventory_dataTable tbody').on('click', '#transferStockBtn', function () {
    rowIndex = inventory_table.row($(this).parents('tr')).index();
    rowData = inventory_table.row($(this).parents('tr')).data();


    $("#transfer_product_name").val(rowData.product_id.name)
    $("#from_branch").val(rowData.branch_id.name)
    $("#transfer_quantity").val(rowData.stock_amount)


    $("#post_transfer").click(function () {

        let transferModal = {
            product_id: `${rowData.product_id.id}`,
            from_branch: `${rowData.branch_id.id}`,
            to_branch: $("#transfer_to_branch").val(),
            purchase_id: "0",
            product_quantity: $("#transfer_quantity").val(),

        };
        var upData = {
            product_id: rowData.product_id,
            category_id: rowData.category_id,
            branch_id: rowData.branch_id,
            stock_amount: rowData.stock_amount - $("#transfer_quantity").val(),
            min_stock_alert: rowData.min_stock_alert,
        }


        $.ajax({
            url: nafisa_domain + '/inventory/transfer',
            type: 'POST',
            data: JSON.stringify(transferModal),
            contentType: "application/json; charset=utf-8",
            success: function (data) {

                if (data.status.code === 1) {
                    const modal = bootstrap.Modal.getInstance($("#transfer_inventory_modal"));
                    modal.hide();
                    let currentPage = inventory_table.page();


                    inventory_table.row(rowIndex).data(upData).draw();
                    inventory_table.page(currentPage).draw('page');

                    // highlighting newly added row
                    $(inventory_table.row(rowIndex).nodes()).addClass('selected');


                    setTimeout(function () {
                        $(inventory_table.row(rowIndex).nodes()).removeClass('selected');
                    }, 2000);

                    // notification
                    notyf.success({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });
                } else {
                    const modal = bootstrap.Modal.getInstance($("#transfer_inventory_modal"));
                    modal.hide();
                    notyf.error({
                        message: data.status.message,
                        duration: 7000,
                        icon: false
                    });
                }

            },
            error: function () {

                const modal = bootstrap.Modal.getInstance($("#transfer_inventory_modal"));
                modal.hide();

            }
        });

    });

});


//INVENTORY TRACE===========================================================================================================================================

$('#inventory_trace_dataTable').DataTable({
    order: [[1, 'desc']],
    ajax: {
        url: nafisa_domain + '/inventory_trace',
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
            title: 'Inventory Trace',
            orientation: 'landscape',
            pageSize: 'LEGAL',
        },
        {extend: 'excelHtml5'},
        {
            extend: 'pdf',
            pageSize: 'LEGAL',
            title: 'Inventory Trace',
        },
    ],
    columns: [
        {data: 'transfer_type_id.name'},
        {data: 'product_id.name'},
        {data: 'product_quantity'},
        {
            data: 'from_branch_id.name',
            render: function (data) {
                if (!data) {
                    return 'N/A';
                } else {
                    return data;
                }
            }
        },
        {
            data: 'to_branch_id.name',
            render: function (data) {
                if (!data) {
                    return 'N/A';
                } else {
                    return data;
                }
            }
        },
        {
            data: 'from_supplier_id.name',
            render: function (data) {
                if (!data) {
                    return 'N/A';
                } else {
                    return data;
                }
            }
        },
        {
            data: 'to_supplier_id.name',
            render: function (data) {
                if (!data) {
                    return 'N/A';
                } else {
                    return data;
                }
            }
        },
        {data: 'event_time'},
    ]
});


// Formula Ingredients=================================================================================================================================

function format(d) {
    let str = '';
    d.formula_ingredients.forEach(item => {
        str += '<table class="table mb-0" style="background: #ead4c136">' +
            '<tr>' +
            "<td class='ps-6'>Raw Material:</td>" +
            "<td class='pe-12'>" +
            item.raw_mat_id.name +
            "</td>" +
            "</tr>" +

            "<td class='ps-6'>Percentage:</td>" +
            "<td>" +
            item.percentage +
            "</td>" +
            "</tr>" +

            "<td class='ps-6'>Unit:</td>" +
            "<td>" +
            item.no_of_unit +
            "</td>" +
            "</tr>" +
            "<td>" +
            "<hr/>" +
            "</td>" +
            "</table>"
    })
    return str
}


$(document).ready(function () {


    var table = $("#formula_ingredients_datatable").DataTable({
        ajax: {
            url: nafisa_domain + '/product_formula',
            dataSrc: 'data',
        },
        "columnDefs": [
            {"width": "15%", "targets": 0},
            {"width": "15%", "targets": 1},
        ],

        columns: [
            {data: "name"},
            {
                className: "details-control",
                orderable: false,
                data: null,
                defaultContent: '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>\n'
            },
            {data: "formula_ingredients[].raw_mat_id.name", visible: false},
            {data: "formula_ingredients[].percentage", visible: false},
            {data: "formula_ingredients[].no_of_unit", visible: false},
        ],
        "columnDefs": [
            {className: "my_class", "targets": [0]}
        ],

        order: [[1, "asc"]]
    });

    $("#formula_ingredients_datatable tbody").on("click", "td.details-control", function () {
        var tr = $(this).closest("tr");
        var row = table.row(tr);
        rowData = table.row($(this).parents('tr')).data();

        var rowArray = rowData.formula_ingredients;
        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass("shown");
        } else if (!rowArray.length) {
            notyf.error({
                message: 'Sorry There are no Products',
                duration: 7000,
                icon: false
            })
        } else {
            row.child(format(row.data()), "p-0").show();
            tr.addClass("shown");
        }
    });
});


//REPORT================================================================================================================================================================================
// =====================================================================================================================================================================================


//CUSTOMER DUE REPORT-----------------------------------------------------------------------------------


$.ajax({
    url: nafisa_domain + '/customer/all',
    type: 'GET',
    success: function (data) {
        let purchase_branch = data?.data.map(item => item)
        purchase_branch.forEach((element) => {
            $('<option/>').val(element['id']).html(element ['name']).appendTo('#select_customer_due');

        });
    }
});

var due_data_table = $('#customer_due_datatable').DataTable({

    dom: 'Blfrtip',
    buttons: [
        {
            extend: 'print',
            title: 'Customer Due Report',
            orientation: 'landscape',

            pageSize: 'LEGAL',

        },
        {
            extend: 'excelHtml5',
            title: 'Customer Due Report',
        },
        {
            extend: 'pdf',
            pageSize: 'LEGAL',
            title: 'Customer Due Report',
        },

    ],


    columns: [
        {data: 'name'},
        {data: 'total_ordered'},
        {data: 'total_paid'},
        {data: 'total_due'},
        {data: 'total_number_of_orders'},
        // {data: 'total_completed_orders'},
        // {data: 'total_pending_orders'},
        {data: 'start'},
        {data: 'finish'},

    ],
});

$("#due_customer_submit_button").click(function () {
    var id = $("#select_customer_due").val();

    let fromData = $("#from_date").val();
    let toData = $("#to_date").val();


    if (!fromData && !toData) {
        notyf.error({
            message: 'Please Select All Field',
            duration: 3000,
            icon: false
        });
    }

    due_data_table.ajax.url(nafisa_domain + `/customer_due_report/${id}/${$("#from_date").val()}/${$("#to_date").val()}`).load();
    $.fn.dataTable.ext.errMode = 'throw';


});


//CUSTOMER PURCHASE REPORT-----------------------------------------------------------------------------------------


$.ajax({
    url: nafisa_domain + '/customer/all',
    type: 'GET',
    success: function (data) {
        let purchase_branch = data?.data.map(item => item)
        purchase_branch.forEach((element) => {
            $('<option/>').val(element['id']).html(element ['name']).appendTo('#select_customer_due_report');

        });
    }
});


var purchase_data_table = $('#customer_purchase_datatable').DataTable({


    dom: 'Blfrtip',
    buttons: [
        {
            extend: 'print',
            title: 'Customer Purchase Report',
            orientation: 'landscape',

            pageSize: 'LEGAL',

        },
        {
            extend: 'excelHtml5',
            title: 'Customer Purchase Report',
        },
        {
            extend: 'pdf',
            pageSize: 'LEGAL',
            title: 'Customer Purchase Report',
        },

    ],


    columns: [
        {data: 'customer_name'},
        {data: 'total_order_cost'},
        {data: 'total_discount'},

        {
            data: 'product_list[]',
            render: function (data) {
                if (!data.length) {
                    return 'N/A';
                } else {
                    return '<button id="product_list"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#details_product_modal">Details</button>'

                }
            }
        },

        {data: 'from'},
        {data: 'to'},

    ],

});

$("#customer_purchase_report").click(function () {

    var id = $("#select_customer_due_report").val();

    purchase_data_table.ajax.url(nafisa_domain + `/customer_purchase_report/${id}/${$("#customer_from_date1").val()}/${$("#customer_to_date2").val()}`).load();
    $.fn.dataTable.ext.errMode = 'throw';

});


$('#customer_purchase_datatable tbody').on('click', '#product_list', function () {
    rowData = purchase_data_table.row($(this).parents('tr')).data();
    let i = 1
    rowData.product_list.forEach(item => {

        $(".customer_product_list").append("<p>" + i + ". " + item.name + "</p>");
        i++;
    })
    $('#details_product_modal').on('hide.bs.modal', function () {
        $('.customer_product_list').empty()
    })

});


//SALESMAN PERFORMANCE--------------------------------------------------------------------------------------


$.ajax({
    url: nafisa_domain + '/salesman',
    type: 'GET',
    success: function (data) {
        let purchase_branch = data?.data.map(item => item)
        purchase_branch.forEach((element) => {
            $('<option/>').val(element['user_id']).html(element ['name']).appendTo('#select_salesman_performance');

        });
    }
});

var salesman_performance_table = $('#salesman_performance_datatable').DataTable({

    dom: 'Blfrtip',
    buttons: [
        {
            extend: 'print',
            title: 'Salesman Performance',
            orientation: 'landscape',

            pageSize: 'LEGAL',

        },
        {
            extend: 'excelHtml5',
            title: 'Salesman Performance',
        },
        {
            extend: 'pdf',
            pageSize: 'LEGAL',
            title: 'Salesman Performance',
        },

    ],

    columns: [
        {data: 'name'},
        {data: 'target_sales_kpi'},
        {data: 'total_completed_kpi'},
        {data: 'kpi_status'},

    ],
});

$("#salesman_performance").click(function () {
    var id = $("#select_salesman_performance").val();

    salesman_performance_table.ajax.url(nafisa_domain + `/salesman_performance_report/${id}/${$("#salesman_performance_from_date").val()}/${$("#salesman_performance_to_date").val()}`).load();
    $.fn.dataTable.ext.errMode = 'throw';


});

//SUPPLIER SALES REPORT-------------------------------------------------------------------------------------------------

$.ajax({
    url: nafisa_domain + '/supplier/all',
    type: 'GET',
    success: function (data) {
        let purchase_branch = data?.data.map(item => item)
        purchase_branch.forEach((element) => {
            $('<option/>').val(element['id']).html(element ['name']).appendTo('#select_supplier_sales');

        });
    }
});


var supplier_sales_table = $('#supplier_sales_datatable').DataTable({

    dom: 'Blfrtip',
    buttons: [
        {
            extend: 'print',
            title: 'Supplier Sales Information',
            orientation: 'landscape',

            pageSize: 'LEGAL',

        },
        {
            extend: 'excelHtml5',
            title: 'Supplier Sales Information',
        },
        {
            extend: 'pdf',
            pageSize: 'LEGAL',
            title: 'Supplier Sales Information',
        },

    ],

    columns: [
        {data: 'name'},
        {data: 'total_purchase_cost'},

        {
            data: 'product_list[]',
            render: function (data) {
                if (!data.length) {
                    return 'N/A';
                } else {
                    return '<button id="details_supplier_modal_btn"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#details_supplier_modal_report">Details</button>'

                }
            }
        },

        {data: 'from'},
        {data: 'to'},

    ],
});

$("#supplier_sales_submit_button").click(function () {
    var id = $("#select_supplier_sales").val();

    supplier_sales_table.ajax.url(nafisa_domain + `/supplier_sales_report/${id}/${$("#supplier_from_date").val()}/${$("#supplier_to_date").val()}`).load();
    $.fn.dataTable.ext.errMode = 'throw';


});


$('#supplier_sales_datatable tbody').on('click', '#details_supplier_modal_btn', function () {
    rowData = supplier_sales_table.row($(this).parents('tr')).data();

    let i = 1
    rowData.product_list.forEach(item => {
        $(".details_supplier_modal_list").append("<p>" + i + ". " + item.name + "</p>");
        i++;
    })
});


$('#details_supplier_modal_report').on('hide.bs.modal', function () {
    $('.details_supplier_modal_list').empty()
    //do your stuff
})

//SUPPLIER DUE REPORT------------------------------------------------------------------------------


var supplier_due_table = $('#supplier_due_datatable').DataTable({

    dom: 'Blfrtip',
    buttons: [
        {
            extend: 'print',
            title: 'Supplier Due Information',
            orientation: 'landscape',

            pageSize: 'LEGAL',

        },
        {
            extend: 'excelHtml5',
            title: 'Supplier Due Information',
        },
        {
            extend: 'pdf',
            pageSize: 'LEGAL',
            title: 'Supplier Due Information',
        },

    ],

    columns: [
        {data: 'name'},
        {data: 'total_orders'},
        {data: 'total_paid_amount'},
        {data: 'total_due'},
        {data: 'total_order_amount'},
        // {data: 'total_completed_orders'},
        // {data: 'total_pending_orders'},
        {data: 'start'},
        {data: 'finish'},
    ],
});

$("#supplier_due_submit_button").click(function () {
    var id = $("#select_supplier_sales").val();

    supplier_due_table.ajax.url(nafisa_domain + `/supplier_due_report/${id}/${$("#supplier_due_from_date").val()}/${$("#supplier_due_date").val()}`).load();
    $.fn.dataTable.ext.errMode = 'throw';

});

//PRODUCT SALES REPORT---------------------------------------------------------------


$.ajax({
    url: nafisa_domain + '/branch',
    type: 'GET',
    success: function (data) {
        let purchase_branch = data?.data.map(item => item)
        purchase_branch.forEach((element) => {
            $('<option/>').val(element['id']).html(element ['name']).appendTo('#select_branch_report_product_sales');

        });
    }
});


function formatData(d) {
    let str = '';
    d.products.forEach(item => {

        str += '<table class="table mb-0" style="background: #ead4c136; transition: .5s" >' +
            '<tr>' +
            "<td class='ps-6'>Product Name:</td>" +
            "<td class='pe-12'>" +
            item.name +
            "</td>" +
            "</tr>" +

            "<td class='ps-6'>Buying Price:</td>" +
            "<td>" +
            item.buying_price +
            "</td>" +
            "</tr>" +

            "<td class='ps-6'>Total Units:</td>" +
            "<td>" +
            item.total_units_sold +
            "</td>" +
            "</tr>" +

            "<td class='ps-6'>Selling Price:</td>" +
            "<td>" +
            item.total_selling_price +
            "</td>" +
            "</tr>" +

            "<td class='ps-6'>Total Profit:</td>" +
            "<td>" +
            item.total_profit +
            "</td>" +
            "</tr>" +
            "<td>" +
            "<hr/>" +
            "</td>" +
            "</table>"
    })
    return str
}


var sales_report_table = $("#product_sales_report_customer_datatable").DataTable({

    dom: 'Blfrtip',
    buttons: [
        {
            extend: 'print',
            title: 'Branch Sales Information',
            orientation: 'landscape',
            pageSize: 'LEGAL',

        },
        {
            extend: 'excelHtml5',
            title: 'Branch Sales Information',
        },
        {
            extend: 'pdf',
            pageSize: 'LEGAL',
            title: 'Branch Sales Information',
        },

    ],

    "columnDefs": [
        {"width": "15%", "targets": 0},
        {"width": "15%", "targets": 1},
        {"width": "15%", "targets": 3},
    ],
    columns: [
        {data: "branch_name"},
        {data: "from"},
        {data: "to"},

        {
            className: "details-control",
            orderable: false,
            data: null,
            defaultContent: '<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>\n'
        },
        {data: "products[].name", visible: false},
        {data: "products[].buying_price", visible: false},
        {data: "products[].total_units_sold", visible: false},
        {data: "products[].total_selling_price", visible: false},
        {data: "products[].total_profit", visible: false},
    ],
    "columnDefs": [
        {className: "my_class", "targets": [0]}
    ],
    order: [[1, "asc"]]
});

$("#product_sales_report_customer_datatable tbody").on("click", "td.details-control", function () {
    var tr = $(this).closest("tr");
    var row = sales_report_table.row(tr);
    rowData = sales_report_table.row($(this).parents('tr')).data();
    var rowArray = rowData.products;

    if (row.child.isShown()) {
        row.child.hide();
        tr.removeClass("shown");
    } else if (!rowArray.length) {
        notyf.error({
            message: 'Sorry There have no Products',
            duration: 7000,
            icon: false
        })
    } else {
        row.child(formatData(row.data()), "p-0").show();
        tr.addClass("shown");
    }
});

$("#submit_product_sales_report").click(function () {
    var id = $("#select_branch_report_product_sales").val();
    sales_report_table.ajax.url(nafisa_domain + `/product_sales_report/${id}/${$("#product_sales_report_from_date").val()}/${$("#product_sales_report_customer_to_date").val()}`).load();
    $.fn.dataTable.ext.errMode = 'throw';
});


//category wise_product_sales_report-------------------------------------------------------


var category_wise_product_sales_report_table = $('#category_wise_product_sales_report_datatable').DataTable({

    dom: 'Blfrtip',
    buttons: [
        {
            extend: 'print',
            title: 'Sales Information',
            orientation: 'landscape',

            pageSize: 'LEGAL',

        },
        {
            extend: 'excelHtml5',
            title: 'Sales Information',
        },
        {
            extend: 'pdf',
            pageSize: 'LEGAL',
            title: 'Sales Information',
        },

    ],

    columns: [
        {data: 'name'},
        {data: 'total_products'},
        {data: 'sold_count'},
        {data: 'sold_amount'},
    ],
});

$("#submit_category_wise_product_sales_report").click(function () {
    category_wise_product_sales_report_table.ajax.url(nafisa_domain + `/categorywise_product_sales_report/${$("#category_wise_product_sales_report_from_date").val()}/${$("#category_wise_product_sales_report_to_date").val()}`).load();
    $.fn.dataTable.ext.errMode = 'throw';

});


//REVENUE============================================================================================================================


$.ajax({
    url: nafisa_domain + '/shop',
    type: 'GET',
    success: function (data) {
        let category_parents = data?.data.map(item => item)
        category_parents.forEach((element) => {
            $('<option/>').val(element['id']).html(element['name']).appendTo('#shop_select_value');
        });
    }

});


var revenue_table = $('#revenue_datatable').DataTable({

    dom: 'Blfrtip',
    buttons: [
        {
            extend: 'print',
            title: 'Revenue',
            orientation: 'landscape',

            pageSize: 'LEGAL',

        },
        {
            extend: 'excelHtml5',
            title: 'Revenue',
        },
        {
            extend: 'pdf',
            pageSize: 'LEGAL',
            title: 'Revenue',
        },

    ],

    columns: [
        {data: 'year'},
        {data: 'time'},
        {data: 'total_number_of_products_sold'},
        {data: 'total_cost'},
        {data: 'net_revenue'},
        {data: 'net_profit'},

    ],
});

var revenue_table_by_branch = $('#revenue_By_branch_datatable').DataTable({

    dom: 'Blfrtip',
    buttons: [
        {
            extend: 'print',
            title: 'Revenue By Branch',
            orientation: 'landscape',
            pageSize: 'LEGAL',
        },
        {
            extend: 'excelHtml5',
            title: 'Revenue By Branch',
        },
        {
            extend: 'pdf',
            pageSize: 'LEGAL',
            title: 'Revenue By Branch',
        },

    ],

    columns: [
        {data: 'branch_name'},
        {data: 'from'},
        {data: 'to'},
        {data: 'revenue.total_number_of_products_sold'},
        {data: 'revenue.total_cost'},
        {data: 'revenue.net_revenue'},
        {data: 'revenue.net_profit'},

    ],
});

var revenue_table_by_shop = $('#revenue_By_shop_datatable').DataTable({

    dom: 'Blfrtip',
    buttons: [
        {
            extend: 'print',
            title: 'Revenue By Shop',
            orientation: 'landscape',
            pageSize: 'LEGAL',
        },
        {
            extend: 'excelHtml5',
            title: 'Revenue By Shop',
        },
        {
            extend: 'pdf',
            pageSize: 'LEGAL',
            title: 'Revenue By Shop',
        },

    ],

    columns: [
        {data: 'shop_name'},
        {data: 'from'},
        {data: 'to'},
        {data: 'revenue.total_number_of_products_sold'},
        {data: 'revenue.total_cost'},
        {data: 'revenue.net_revenue'},
        {data: 'revenue.net_profit'},

    ],
});


$("#company_revenue_submit_button").click(function () {

    if (!$("#company_select_length").val()) {
        notyf.error({
            message: "Select The Length",
            duration: 7000,
            icon: false
        });

    } else {
        $('.revenue_datatable').css('display', 'block');
        revenue_table.ajax.url(nafisa_domain + `/revenue/${$("#company_select_length").val()}`).load();
        $.fn.dataTable.ext.errMode = 'throw';

    }
});


$("#branch_revenue_submit_button").click(function () {
    var id = $("#select_branch_report_product_sales").val();


    if (!$("#branch_select_length").val() || id == null) {
        notyf.error({
            message: "Select The Length & Branch",
            duration: 7000,
            icon: false
        });
    } else {
        $('.revenue_datatable_by_branch').css('display', 'block');
        revenue_table_by_branch.ajax.url(nafisa_domain + `/revenue/byBranch/${id}/${$("#branch_select_length").val()}`).load();
        $.fn.dataTable.ext.errMode = 'throw';
    }

});


$("#shop_revenue_submit_button").click(function () {
    var id = $("#shop_select_value").val();

    if (!$("#shop_select_length").val() || id == null) {
        notyf.error({
            message: "Select The Length & Shop",
            duration: 7000,
            icon: false
        });
    } else {
        $('.revenue_By_shop_datatable').css('display', 'block');
        revenue_table_by_shop.ajax.url(nafisa_domain + `/revenue/byShop/${id}/${$("#shop_select_length").val()}`).load();
        $.fn.dataTable.ext.errMode = 'throw';
    }
});


$("#login_button").click(function () {

    let email_val = $("#login_email").val();
    let password_val = $("#login_password").val();

    let email = 'admin@admin.com'
    let password = 'test123'

    if (email_val === email && password_val === password) {
        window.location = "dashboard.html";
        document.cookie = "token" + "=" + email + "; path=/; secure; sameSite=Lax";

        notyf.success({
            message: "You Are Successfully Login",
            duration: 7000,
            icon: false
        });

    } else {
        notyf.error({
            message: "Email or password incorrect",
            duration: 7000,
            icon: false
        });
    }

});


function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            //return c.substring(name.length, c.length);
            return true;
        }
    }
    return false;
}


if (!getCookie("token") && location.href.replace(/.*\/\/[^\/]*/, '') != "/index.html") {
    window.location.replace("/index.html");
}


$("#log_out").click(function () {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    location.reload(true);
});


$.ajax({
    url: nafisa_domain + '/revenue/3',
    type: 'GET',
    success: function (data) {
        let purchase_branch = data?.data.map(item => item)
        purchase_branch.forEach((element) => {
            $("#daily_revenue").text("BDT " + element.net_revenue);
            $("#Today").text(element.time);

        });
    }
});


$.ajax({
    url: nafisa_domain + '/revenue/2',
    type: 'GET',
    success: function (data) {
        let purchase_branch = data?.data.map(item => item)
        purchase_branch.forEach((element) => {
            $("#monthly_revenue").text("BDT " + element.net_revenue);
            $("#Monthly").text(element.time);

        });
    }
});
