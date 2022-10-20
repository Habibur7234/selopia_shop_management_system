// global variable for storing index and data
let rowIndex, rowData;
// init notification instance
const notyf = new Notyf();

//init shop datatable and load data
let shop_table= $('#shop_dataTable').DataTable( {
    order: [[0, 'desc']],
    "columnDefs": [
        { 'visible': true, 'targets': 0 },
        { "width": "30%", "targets": 1},
        { "width": "12%", "targets": 2},
        { "width": "10%", "targets": 4}
    ],
    ajax: {
        url: 'http://103.205.71.148/shop',
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
            title: 'Shop Information',
            orientation: 'landscape',
            exportOptions: {
                columns: [  1, 2, 3 ],
                modifier: {
                    page: 'current'
                }
            },
            pageSize: 'LEGAL',
            customize: function ( win ) {
                $(win.document.body)
                    .css( 'font-size', '15pt' )
                $(win.document.body).find( 'th' )
                    .css( {
                        "font-size": 'inherit',
                        "text-align":'center',
                    })
                    .addClass( 'compact' )
                $(win.document.body).find( 'table' )
                    .css( 'font-size', 'inherit' )
                    .css('text-align','center')

            }
        },
    {
        extend: 'excelHtml5',
        title: 'Shop Information',
        exportOptions: {
            columns: [  1, 2, 3 ]

        },

    },
    {
        extend: 'pdf',
        exportOptions: {
            columns: [ 1, 2, 3 ],
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
        { data: 'id' },
        { data: 'name' },
        { data: 'branch' },
        { data: 'address' },
        {data: 'id',
            render: function(){
                return '<button id="update_shopBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_shop_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  '
                    +'<button   id="delete_shopBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_shop_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
            }
        },
    ]
});


$(document).ready(function () {

    /* ### Update Shop Data Start ### */
    // EDIT button
    $('#shop_dataTable tbody').on('click', '#update_shopBtn', function () {
        // getting parent row index and data
        rowIndex = shop_table.row($(this).parents('tr')).index();
        rowData =  shop_table.row($(this).parents('tr')).data();

        // setting row values to update modal input boxes
        $("#editName").val(rowData.name);
        $("#editBranch").val(rowData.branch);
        $("#editAddress").val(rowData.address);
    })

    // Update Button
    $("#update_shop").click(function(){


        if( $('#update_shop_form')[0].checkValidity() ) {
            // setting modal input value
            rowData.name = $("#editName").val();
            rowData.branch = $("#editBranch").val();
            rowData.address = $("#editAddress").val();

            // updating button text
            $(this).text('Updating...');

            // updating server row
            $.ajax({
                url: 'http://103.205.71.148/shop/' + rowData.id,
                type: 'PUT',
                data: JSON.stringify(rowData),
                contentType: "application/json; charset=utf-8",
                // dataType: "json",
                success: function( sres)
                {
                    if (sres.error_status === 1) {
                        //Set default button text again
                        $("#update_shop").text('Update Info');
                        notyf.error({
                            message: sres.message,
                            duration: 7000,
                            icon: false
                        });

                    } else if (sres.error_status === 0){

                        // hide modal
                        const modal = bootstrap.Modal.getInstance($("#update_shop_modal"));
                        modal.hide();

                        //Set default button text again
                        $("#update_shop").text('Update Info');

                        let currentPage = shop_table.page();

                        // update datatable
                        shop_table.row(rowIndex).data( rowData ).draw();

                        // redrawing to original page
                        shop_table.page(currentPage).draw( 'page' );

                        // highlighting newly added row
                        $( shop_table.row(rowIndex).nodes() ).addClass( 'selected' );
                        setTimeout(function () { $( shop_table.row(rowIndex).nodes() ).removeClass( 'selected' ); }, 2000);

                        // notification
                        notyf.success({
                            message: "Shop updated <strong>successfully</strong>",
                            duration: 7000,
                            icon: false
                        });
                    }
                    else {
                        const modal = bootstrap.Modal.getInstance($("#update_shop_modal"));
                        modal.hide();
                        notyf.error({
                            message: "<strong>Server</strong> Down.",
                            duration: 15000,
                            icon: false
                        });
                    }


                },
                error: function()
                {
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
        }
        else {

            $('#update_shop_form')[0].reportValidity();
        }
    });

    /* ### Update Data End ### */

    /* ### Add Data Start ### */
    $("#add_shop").click(function(){

        if( $('#shop_form')[0].checkValidity() ) {
            $(this).text('Submitting..');
            let formPostModalData = {
                name: $("#name").val(),
                branch: $("#branch").val(),
                address: $("#address").val()

            };
            $.ajax({
                url: 'http://103.205.71.148/shop',
                type: 'POST',
                data: JSON.stringify(formPostModalData),
                contentType: "application/json",
                success: function(data)
                {
                    //add row from input fields

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
                    shop_table.order( [ 0, 'desc' ] ).draw();

                    // highlighting newly added row
                    $( shop_table.row(newRowIndex.index()).nodes()).addClass( 'selected' );
                    setTimeout(function () { $( shop_table.row(newRowIndex.index()).nodes() ).removeClass( 'selected' ); }, 2000);

                    //Success Notification
                    notyf.success({
                        message: 'New Shop Added  <strong>Successfully !</strong>',
                        duration: 7000,
                        icon: false
                    });
                },
                error: function()
                {
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

        } else {

            $('#shop_form')[0].reportValidity();

        }
    })
    /* ### Add Data End ### */


    /* ### Delete Data Start ### */

    // DELETE button
    $('#shop_dataTable tbody').on('click', '#delete_shopBtn', function () {
        rowData =  shop_table.row($(this).parents('tr')).data();
        rowIndex = shop_table.row($(this).parents('tr')).index();
        // Set value on Modal
        $("#sName").text(`Are you sure you want to delete "${rowData.name}"?`);
    });

    // DELETE Confirmation button
    $("#delete_shop").click(function() {

        $(this).text('Deleting...');
        $.ajax({
            url: 'http://103.205.71.148/shop/' + rowData.id + '/',
            type: 'DELETE',
            dataType: "json",
            success: function(data )
            {
                let currentPage = shop_table.page();
                shop_table.row(rowIndex).remove().draw();

                const modal = bootstrap.Modal.getInstance($("#delete_shop_modal"));
                modal.hide();

                $("#delete_shop").text('Delete');

                // redrawing to original page
                shop_table.page(currentPage).draw( 'page' );

                notyf.success({
                    message: 'Shop  Deleted <strong>Successfully !</strong>',
                    duration: 7000,
                    icon: false
                });

                rowData = undefined;
                rowIndex = undefined;
            },
            error: function()
            {
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

});


// proper commenting and intending all codes-------------------------

// after apu, handle server level errors



/*--- Salesman Start ---*/

//init Salesman datatable and load data
let salesman_table= $('#salesman_dataTable').DataTable( {
    order: [[0, 'desc']],
    "columnDefs": [
        { 'visible': false, 'targets': 0 },
        { "width": "25%", "targets": 1},
        { "width": "15%", "targets": 2},
        { 'visible': false, 'targets': 3},
        { 'visible': false, 'targets': 4},
        { 'visible': false, 'targets': 5},
        { 'visible': false, 'targets': 6},
        { 'visible': false, 'targets': 7},
        { 'visible': false, 'targets': 8},
        { "width": "10%", "targets": 9},
        { "width": "10%", "targets": 10},
        { 'visible': false, 'targets': 11},
        { 'visible': false, 'targets': 12},
        { 'visible': false, 'targets': 13},
        { "width": "10%", "targets": 14},
        { "width": "10%", "targets": 15}
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
                columns: [ 1, 2, 3,4,5,6,7,8,11,12,13, ],
                modifier: {
                    page: 'current'
                }
            },
            pageSize: 'LEGAL',
            customize: function (salesman ) {
                $(salesman.document.body)
                    .css( 'font-size', '10pt' )
            }
        },
        {
            extend: 'excelHtml5',
            title: 'Shop Information',
            exportOptions: {
                columns: [  1, 2, 3,4,5,6,7,8,11,12,13, ]

            },

        },
        {
            extend: 'pdf',
            exportOptions: {
                columns: [ 1, 2, 3,4,5,6,7,8,11,12,13,],
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
        { data: '_id' },
        { data: 'name' },
        { data: 'designation_id.designation' },
        { data: 'age' },
        { data: 'gender',
            render: function ( data ) {
                    if ( data === 1 ) {
                        return 'Male';
                    } else {
                        return 'Female';
                    }
        }},
        { data: 'email' },
        { data: 'phone' },
        { data: 'address' },
        { data: 'nid' },
        { data: 'nid_photo',
            render: function(){
                return '<button id="salesman_nid_photo"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#salesman_nidPhoto_modal">View</button>'
            }
        },
        { data: 'profile_img_url',
            render: function(){
                return '<button id="salesman_profile_img_url"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#salesman_profilePhoto_modal">View</button>'
        }
            },
        { data: 'salary' },
        { data: 'joining_date'},
        { data:  'status',
            render: function ( data ) {
                if ( data === 1 ) {
                    return 'Active';
                } else {
                    return 'Inactive';
                }
            }
        },
        {data: 'details',
            render: function(){
                return '<button id="salesman_details"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#details_salesman_modal">Details</button>'
            }
        },
        {data: 'action',
            render: function(){
                return '<button id="update_salesmanBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_salesman_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  '
                    +'<button   id="delete_salesmanBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_salesman_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
            }
        },
    ]
});



// Details Button
$('#salesman_dataTable tbody').on('click', '#salesman_details', function () {
    rowData =  salesman_table.row($(this).parents('tr')).data();

    // Set value on Modal
    $("#sd_name").text(rowData.name);
    $("#sd_designation").text(rowData.designation_id.designation);
    $("#sd_age").text(rowData.age);

    if ( rowData.gender === 1 ) {
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

    if ( rowData.status === 1 ){
        $("#sd_status").text('Active');
    }
    else {
        $("#sd_status").text('Inactive');
    }

});

//View  Nid Photo Button
$('#salesman_dataTable tbody').on('click', '#salesman_nid_photo', function () {
    rowData =  salesman_table.row($(this).parents('tr')).data();
    $("#nid_img").attr("src",rowData.nid_photo);
});
//View Profile Photo Button
$('#salesman_dataTable tbody').on('click', '#salesman_profile_img_url', function () {
    rowData =  salesman_table.row($(this).parents('tr')).data();
    $("#profile_img").attr("src",rowData.profile_img_url);
});


//Salesman CRUD Start
$(document).ready(function () {

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
    $("#salesman_form").on('submit',(function(e) {
        e.preventDefault();
        $.ajax({
            url: 'http://103.205.71.148/salesman',
            type: "POST",
            data:  new FormData(this),
            contentType: false,
            cache: false,
            processData:false,

            success: function(data)
            {
                alert("Success")
            },
            error: function(e)
            {
                alert("error")
            }
        });
    }));
    /* ### Post Data End ### */


    /* ### Delete Data Start ### */

    // Delete button
    $('#salesman_dataTable tbody').on('click', '#delete_salesmanBtn', function () {
        rowData =  salesman_table.row($(this).parents('tr')).data();
        rowIndex = salesman_table.row($(this).parents('tr')).index();
        // Set name value on Modal
        $("#salesmanName").text(`Are you sure you want to delete "${rowData.name}"?`);
    });

    // DELETE Confirmation button
    $("#delete_salesman").click(function() {

        $(this).text('Deleting...');
        $.ajax({
            url: 'http://103.205.71.148/salesman/' + rowData._id,
            type: 'DELETE',
            success: function(data)
            {
                let currentPage = salesman_table.page();
                salesman_table.row(rowIndex).remove().draw();

                const modal = bootstrap.Modal.getInstance($("#delete_salesman_modal"));
                modal.hide();

                $("#delete_salesman").text('Delete');

                // redrawing to original page
                salesman_table.page(currentPage).draw( 'page' );

                notyf.success({
                    message: 'Salesman  Deleted <strong>Successfully !</strong>',
                    duration: 7000,
                    icon: false
                });

                rowData = undefined;
                rowIndex = undefined;
            },
            error: function()
            {
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
        rowData =  salesman_table.row($(this).parents('tr')).data();

        // setting row values to update modal input boxes
        $("#salesman_edit_name").val(rowData.name);
        $('#salesman_edit_designation').val(rowData.designation_id._id);
        $("#salesman_edit_age").val(rowData.age);
        $('#salesman_edit_gender').val(rowData.gender);
        $("#salesman_edit_email").val(rowData.email);
        $("#salesman_edit_phone_number").val(rowData.phone);
        $("#salesman_edit_address").val(rowData.address);
        $("#salesman_edit_nid").val(rowData.nid);
        $("#s_nid_img").attr("src",rowData.nid_photo);
        $("#s_profile_img").attr("src",rowData.profile_img_url);
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
            reader.onload = function(e) {

                $('#s_nid_img').attr('src', e.target.result);
                $('#s_nid_img').hide();
                $('#s_nid_img').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#salesman_edit_nid_photos").change(function() {
        updateNidURL(this);
    });

    //Chance Profile photo preview when update
    function updateProURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {

                $('#s_profile_img').attr('src', e.target.result);
                $('#s_profile_img').hide();
                $('#s_profile_img').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#salesman_edit_profile_photos").change(function() {
        updateProURL(this);
    });





});





//Crop Function From Cropzee
$(document).ready(function(){
    $("#salesman_edit_profile_photos").cropzee();
    $("#salesman_edit_nid_photos").cropzee();
    $("#nid_photos").cropzee();
    $("#profile_photos").cropzee();

});





