// global variable for storing index and data
let rowIndex, rowData;

// init notification instance
const notyf = new Notyf();

//init shop datatable and load data
let t1= $('#shopTable').DataTable( {
    "columnDefs": [
        { "width": "30%", "targets": 0},
        { "width": "12%", "targets": 1},
        { "width": "7%", "targets": 3}
    ],
    ajax: {
        url: 'https://62b15c56196a9e987033e9c4.mockapi.io/api/1/supeshop',
        dataSrc: '',
    },
    rowId: 'id',
    dom: 'Blfrtip',
    buttons: [
        'excel', 'pdf', 'print',
        '<button id="edit_button_id"  class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#Submit_shop_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],
    columns: [
        { data: 'name' },
        { data: 'branch' },
        { data: 'address' },
        {data: 'id',
            render: function(){
                return '<button id="edit_button_id"  class="btn btn-primary  " type="button" data-bs-toggle="modal"   data-bs-target="#update_shop_modal1" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  '
                    +'<button   id="delete_button_id"  class="btn btn-danger " data-bs-toggle="modal"   data-bs-target="#delete_shop_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>'
            }
        },
    ]
});


$(document).ready(function () {

    /* ### Update Data Start ### */
    // EDIT button
    $('#shopTable tbody').on('click', '#edit_button_id', function () {
        // getting parent row index and data
        rowIndex = t1.row($(this).parents('tr')).index();
        rowData =  t1.row($(this).parents('tr')).data();

        // setting row values to update modal input boxes
        $("#editName").val(rowData.name);
        $("#editBranch").val(rowData.branch);
        $("#editAddress").val(rowData.address);
    })

    // Update Button
    $("#update_modal_id").click(function(){
        // setting modal input value
        rowData.name = $("#editName").val();
        rowData.branch = $("#editBranch").val();
        rowData.address = $("#editAddress").val();

        // updating button text
        $(this).text('Updating...');

        // updating server row
        $.ajax({
            url: 'https://62b15c56196a9e987033e9c4.mockapi.io/api/1/supeshop/' + rowData.id,
            type: 'PUT',
            data: rowData,
            dataType: "json",
            success: function()
            {
                // hide modal
                const modal = bootstrap.Modal.getInstance($("#update_shop_modal1"));
                modal.hide();

                //Set default button text again
                $("#update_modal_id").text('Update Info');

                // update datatable
                t1.row(rowIndex).data( rowData ).draw();

                // notification
                notyf.success({
                    message: "Shop updated <strong>successfully</strong>",
                    duration: 7000,
                    icon: false
                });

                // reset global variable value
                rowIndex = undefined;
                rowData = undefined;
            },
            error: function()
            {
                //Set default button text again
                $("#update_modal_id").text('Update Info');

                //Notification
                notyf.error({
                    message: "<strong>Warning !</strong> Can't update shop.",
                    duration: 7000,
                    icon: false
                });
            }
        });
    })
    /* ### Update Data End ### */

    /* ### Add Data Start ### */
    $("#post_modal_id").click(function(){

        if( $('#shop_form')[0].checkValidity() ) {

            //console.log("aaaa");

            $(this).text('Submitting..');
            let formPostModalData = {
                name: $("#name").val(),
                branch: $("#branch").val(),
                address: $("#address").val(),
            };

            $.ajax({
                url: 'https://62b15c56196a9e987033e9c4.mockapi.io/api/1/supeshop',
                type: 'POST',
                data: formPostModalData,
                dataType: "json",
                success: function()
                {
                    //add row from input fields
                    t1.row.add(formPostModalData).draw();
                    $("#post_modal_id").text('Submit');
                    const modal = bootstrap.Modal.getInstance($("#Submit_shop_modal"));
                    modal.hide();
                    //reset input Field
                    $('form :input').val('');
                    $('.input').val('');
                    //Success Notification
                    notyf.success({
                        message: 'New Shop Added  <strong>Successfully !</strong>',
                        duration: 7000,
                        icon: false
                    });
                },
            });
        } else {
            //console.log("aaa");

            $('#shop_form')[0].reportValidity();

        }
    })
    /* ### Add Data End ### */

    /* ### Delete Data Start ### */
    // DELETE button
    $('#shopTable tbody').on('click', '#delete_button_id', function () {
        rowData =  t1.row($(this).parents('tr')).data();
        rowIndex = t1.row($(this).parents('tr')).index();
    });

    // DELETE Confirmation button
    $("#delete_modal_id").click(function() {

        console.log('deleting something');

        $(this).text('Deleting...');
        $.ajax({
            url: 'https://62b15c56196a9e987033e9c4.mockapi.io/api/1/supeshop/' + rowData.id + '/',
            type: 'DELETE',
            dataType: "json",
            success: function(data)
            {
                t1.row(rowIndex).remove().draw();

                const modal = bootstrap.Modal.getInstance($("#delete_shop_modal"));
                modal.hide();

                $("#delete_modal_id").text('Delete');

                notyf.success({
                    message: 'Shop  Delete <strong>Successfully !</strong>',
                    duration: 7000,
                    icon: false
                });

                rowData = undefined;
                rowIndex = undefined;
            },
            error: function()
            {
                $("#delete_modal_id").text('Delete');
                notyf.error({
                    message: "<strong>Warning !</strong> Can't Delete shop",
                    duration: 7000,
                    icon: false
                });
            },
        });
    });
    /* ### Delete Data Start ### */

    //Reset Input when close modal
    $('#Submit_shop_modal').on('hidden.bs.modal', function () {
        $(this).find('#shop_form').trigger('reset');
    });
    $('#update_shop_modal1').on('hidden.bs.modal', function () {
        $(this).find('#update_shop_form').trigger('reset');
    });

});





