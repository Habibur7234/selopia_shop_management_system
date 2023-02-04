(() => {
  // src/js/main.js
  var rowIndex;
  var rowData;
  var notyf = new Notyf();
  var shop_table = $("#shop_dataTable").DataTable({
    order: [[0, "desc"]],
    "columnDefs": [
      { "visible": false, "targets": 0 },
      { "width": "30%", "targets": 1 },
      { "width": "12%", "targets": 2 },
      { "width": "10%", "targets": 4 }
    ],
    ajax: {
      url: "http://103.205.71.148/shop",
      dataSrc: "content"
    },
    rowId: "id",
    dom: "Blfrtip",
    oLanguage: {
      sLengthMenu: "Show _MENU_"
    },
    language: {
      search: "",
      searchPlaceholder: "Search..."
    },
    buttons: [
      {
        extend: "print",
        title: "Shop Information",
        orientation: "landscape",
        exportOptions: {
          columns: [1, 2, 3],
          modifier: {
            page: "current"
          }
        },
        pageSize: "LEGAL",
        customize: function(win) {
          $(win.document.body).css("font-size", "15pt");
          $(win.document.body).find("th").css({
            "font-size": "inherit",
            "text-align": "center"
          }).addClass("compact");
          $(win.document.body).find("table").css("font-size", "inherit").css("text-align", "center");
        }
      },
      {
        extend: "excelHtml5",
        title: "Shop Information",
        exportOptions: {
          columns: [1, 2, 3]
        }
      },
      {
        extend: "pdf",
        exportOptions: {
          columns: [1, 2, 3],
          modifier: {
            page: "current"
          }
        },
        pageSize: "LEGAL",
        title: "Shop Information",
        customize: function(doc) {
          doc.content[1].table.widths = [
            "20%",
            "35%",
            "45%"
          ];
          let rowCount = doc.content[1].table.body.length;
          for (let i = 1; i < rowCount; i++) {
            doc.content[1].table.body[i][0].alignment = "center";
            doc.content[1].table.body[i][1].alignment = "center";
            doc.content[1].table.body[i][2].alignment = "center";
          }
        }
      },
      '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_shop_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],
    columns: [
      { data: "id" },
      { data: "name" },
      { data: "branch" },
      { data: "address" },
      {
        data: "id",
        render: function() {
          return '<button id="update_shopBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_shop_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  <button   id="delete_shopBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_shop_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
        }
      }
    ]
  });
  $(document).ready(function() {
    $("#shop_dataTable tbody").on("click", "#update_shopBtn", function() {
      rowIndex = shop_table.row($(this).parents("tr")).index();
      rowData = shop_table.row($(this).parents("tr")).data();
      $("#editName").val(rowData.name);
      $("#editBranch").val(rowData.branch);
      $("#editAddress").val(rowData.address);
    });
    $("#update_shop").click(function() {
      if ($("#update_shop_form")[0].checkValidity()) {
        rowData.name = $("#editName").val();
        rowData.branch = $("#editBranch").val();
        rowData.address = $("#editAddress").val();
        $(this).text("Updating...");
        $.ajax({
          url: "http://103.205.71.148/shop/" + rowData.id,
          type: "PUT",
          data: JSON.stringify(rowData),
          contentType: "application/json; charset=utf-8",
          success: function(sres) {
            if (sres.error_status === 1) {
              $("#update_shop").text("Update Info");
              notyf.error({
                message: sres.message,
                duration: 7e3,
                icon: false
              });
            } else if (sres.error_status === 0) {
              const modal = bootstrap.Modal.getInstance($("#update_shop_modal"));
              modal.hide();
              $("#update_shop").text("Update Info");
              let currentPage = shop_table.page();
              shop_table.row(rowIndex).data(rowData).draw();
              shop_table.page(currentPage).draw("page");
              $(shop_table.row(rowIndex).nodes()).addClass("selected");
              setTimeout(function() {
                $(shop_table.row(rowIndex).nodes()).removeClass("selected");
              }, 2e3);
              notyf.success({
                message: "Shop updated <strong>successfully</strong>",
                duration: 7e3,
                icon: false
              });
            } else {
              const modal = bootstrap.Modal.getInstance($("#update_shop_modal"));
              modal.hide();
              notyf.error({
                message: "<strong>Server</strong> Down.",
                duration: 15e3,
                icon: false
              });
            }
          },
          error: function() {
            $("#update_shop").text("Update Info");
            notyf.error({
              message: "<strong>Warning !</strong> Can't update shop.",
              duration: 7e3,
              icon: false
            });
          }
        });
      } else {
        $("#update_shop_form")[0].reportValidity();
      }
    });
    $("#add_shop").click(function() {
      if ($("#shop_form")[0].checkValidity()) {
        $(this).text("Submitting..");
        let formPostModalData = {
          name: $("#name").val(),
          branch: $("#branch").val(),
          address: $("#address").val()
        };
        $.ajax({
          url: "http://103.205.71.148/shop",
          type: "POST",
          data: JSON.stringify(formPostModalData),
          contentType: "application/json",
          success: function(data) {
            let newRowIndex = shop_table.row.add(data).draw();
            $("#add_shop").text("Submit");
            const modal = bootstrap.Modal.getInstance($("#add_shop_modal"));
            modal.hide();
            $("form :input").val("");
            $(".input").val("");
            shop_table.search("");
            shop_table.order([0, "desc"]).draw();
            $(shop_table.row(newRowIndex.index()).nodes()).addClass("selected");
            setTimeout(function() {
              $(shop_table.row(newRowIndex.index()).nodes()).removeClass("selected");
            }, 2e3);
            notyf.success({
              message: "New Shop Added  <strong>Successfully !</strong>",
              duration: 7e3,
              icon: false
            });
          },
          error: function() {
            $("#add_shop").text("Submit");
            notyf.error({
              message: "<strong>Warning !</strong> Can't update shop.",
              duration: 7e3,
              icon: false
            });
          }
        });
      } else {
        $("#shop_form")[0].reportValidity();
      }
    });
    $("#shop_dataTable tbody").on("click", "#delete_shopBtn", function() {
      rowData = shop_table.row($(this).parents("tr")).data();
      rowIndex = shop_table.row($(this).parents("tr")).index();
      $("#sName").text(`Are you sure you want to delete "${rowData.name}"?`);
    });
    $("#delete_shop").click(function() {
      $(this).text("Deleting...");
      $.ajax({
        url: "http://103.205.71.148/shop/" + rowData.id + "/",
        type: "DELETE",
        dataType: "json",
        success: function(data) {
          let currentPage = shop_table.page();
          shop_table.row(rowIndex).remove().draw();
          const modal = bootstrap.Modal.getInstance($("#delete_shop_modal"));
          modal.hide();
          $("#delete_shop").text("Delete");
          shop_table.page(currentPage).draw("page");
          notyf.success({
            message: "Shop  Deleted <strong>Successfully !</strong>",
            duration: 7e3,
            icon: false
          });
          rowData = void 0;
          rowIndex = void 0;
        },
        error: function() {
          $("#delete_shop").text("Delete");
          notyf.error({
            message: "<strong>Warning !</strong> Can't Delete shop",
            duration: 7e3,
            icon: false
          });
        }
      });
    });
    $("#add_shop_modal").on("hidden.bs.modal", function() {
      $(this).find("#shop_form").trigger("reset");
    });
    $("#update_shop_modal").on("hidden.bs.modal", function() {
      $(this).find("#update_shop_form").trigger("reset");
    });
  });
  var salesman_table = $("#salesman_dataTable").DataTable({
    order: [[0, "desc"]],
    "columnDefs": [
      { "visible": false, "targets": 0 },
      { "width": "25%", "targets": 1 },
      { "width": "15%", "targets": 2 },
      { "visible": false, "targets": 3 },
      { "visible": false, "targets": 4 },
      { "visible": false, "targets": 5 },
      { "visible": false, "targets": 6 },
      { "visible": false, "targets": 7 },
      { "visible": false, "targets": 8 },
      { "width": "10%", "targets": 9 },
      { "width": "10%", "targets": 10 },
      { "visible": false, "targets": 11 },
      { "visible": false, "targets": 12 },
      { "visible": false, "targets": 13 },
      { "width": "10%", "targets": 14 },
      { "width": "10%", "targets": 15 }
    ],
    ajax: {
      url: "http://103.205.71.148/salesman",
      dataSrc: "content"
    },
    rowId: "id",
    dom: "Blfrtip",
    oLanguage: {
      sLengthMenu: "Show _MENU_"
    },
    language: {
      search: "",
      searchPlaceholder: "Search..."
    },
    buttons: [
      {
        extend: "print",
        title: "Salesman Information",
        orientation: "landscape",
        exportOptions: {
          columns: [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13],
          modifier: {
            page: "current"
          }
        },
        pageSize: "LEGAL",
        customize: function(salesman) {
          $(salesman.document.body).css("font-size", "10pt");
        }
      },
      {
        extend: "excelHtml5",
        title: "Shop Information",
        exportOptions: {
          columns: [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13]
        }
      },
      {
        extend: "pdf",
        exportOptions: {
          columns: [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13]
        },
        pageSize: "LEGAL",
        title: "Shop Information",
        customize: function(doc) {
          doc.content[1].table.widths = [
            "11%",
            "8%",
            "5%",
            "8%",
            "10%",
            "10%",
            "15%",
            "7%",
            "7%",
            "10%",
            "8%"
          ];
          let salesmanRowCount = doc.content[1].table.body.length;
          for (let i = 1; i < salesmanRowCount; i++) {
            doc.content[1].table.body[i][0].alignment = "center";
            doc.content[1].table.body[i][1].alignment = "center";
            doc.content[1].table.body[i][2].alignment = "center";
            doc.content[1].table.body[i][3].alignment = "center";
            doc.content[1].table.body[i][4].alignment = "center";
            doc.content[1].table.body[i][5].alignment = "center";
            doc.content[1].table.body[i][6].alignment = "center";
            doc.content[1].table.body[i][7].alignment = "center";
            doc.content[1].table.body[i][8].alignment = "center";
            doc.content[1].table.body[i][9].alignment = "center";
            doc.content[1].table.body[i][10].alignment = "center";
          }
        }
      },
      '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_salesman_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],
    columns: [
      { data: "_id" },
      { data: "name" },
      { data: "designation_id.designation" },
      { data: "age" },
      {
        data: "gender",
        render: function(data) {
          if (data === 1) {
            return "Male";
          } else {
            return "Female";
          }
        }
      },
      { data: "email" },
      { data: "phone" },
      { data: "address" },
      { data: "nid" },
      {
        data: "nid_photo",
        render: function() {
          return '<button id="salesman_nid_photo"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#salesman_nidPhoto_modal">View</button>';
        }
      },
      {
        data: "profile_img_url",
        render: function() {
          return '<button id="salesman_profile_img_url"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#salesman_profilePhoto_modal">View</button>';
        }
      },
      { data: "salary" },
      { data: "joining_date" },
      {
        data: "status",
        render: function(data) {
          if (data === 1) {
            return "Active";
          } else {
            return "Inactive";
          }
        }
      },
      {
        data: "details",
        render: function() {
          return '<button id="salesman_details"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#details_salesman_modal">Details</button>';
        }
      },
      {
        data: "action",
        render: function() {
          return '<button id="update_salesmanBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_salesman_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  <button   id="delete_salesmanBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_salesman_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
        }
      }
    ]
  });
  $("#salesman_dataTable tbody").on("click", "#salesman_details", function() {
    rowData = salesman_table.row($(this).parents("tr")).data();
    $("#sd_name").text(rowData.name);
    $("#sd_designation").text(rowData.designation_id.designation);
    $("#sd_age").text(rowData.age);
    if (rowData.gender === 1) {
      $("#sd_gender").text("Male");
    } else {
      $("#sd_gender").text("Female");
    }
    $("#sd_email").text(rowData.email);
    $("#sd_phone").text(rowData.phone);
    $("#sd_address").text(rowData.address);
    $("#sd_nid").text(rowData.nid);
    $("#sd_salary").text(rowData.salary);
    $("#sd_joinDate").text(rowData.joining_date);
    if (rowData.status === 1) {
      $("#sd_status").text("Active");
    } else {
      $("#sd_status").text("Inactive");
    }
  });
  $("#salesman_dataTable tbody").on("click", "#salesman_nid_photo", function() {
    rowData = salesman_table.row($(this).parents("tr")).data();
    $("#nid_img").attr("src", rowData.nid_photo);
  });
  $("#salesman_dataTable tbody").on("click", "#salesman_profile_img_url", function() {
    rowData = salesman_table.row($(this).parents("tr")).data();
    $("#profile_img").attr("src", rowData.profile_img_url);
  });
  $(document).ready(function() {
    $("#add_salesman_modal").on("hidden.bs.modal", function() {
      $('[data-cropzee="nid_photos"]').replaceWith('<div class="modal-body align-items-center-center"  data-cropzee="nid_photos"><img  src=""></div>');
      $('[data-cropzee="profile_photos"]').replaceWith('<div  class="modal-body align-items-center-center"  data-cropzee="profile_photos"><img  src=""></div>');
      $(this).find("#salesman_post_form").trigger("reset");
    });
    $("#update_salesman_modal").on("hidden.bs.modal", function() {
      $('[data-cropzee="salesman_edit_nid_photos"]').replaceWith('<div class="modal-body align-items-center-center"  data-cropzee="salesman_edit_nid_photos"><img id="s_nid_img" src=""></div>');
      $('[data-cropzee="salesman_edit_profile_photos"]').replaceWith('<div class="modal-body align-items-center-center"  data-cropzee="salesman_edit_profile_photos"><img id="s_profile_img" src=""></div>');
      $(this).find("#salesman_update_form").trigger("reset");
    });
    $("#salesman_form").on("submit", function(e) {
      e.preventDefault();
      $.ajax({
        url: "http://103.205.71.148/salesman",
        type: "POST",
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,
        success: function(data) {
          alert("Success");
        },
        error: function(e2) {
          alert("error");
        }
      });
    });
    $("#salesman_dataTable tbody").on("click", "#delete_salesmanBtn", function() {
      rowData = salesman_table.row($(this).parents("tr")).data();
      rowIndex = salesman_table.row($(this).parents("tr")).index();
      $("#salesmanName").text(`Are you sure you want to delete "${rowData.name}"?`);
    });
    $("#delete_salesman").click(function() {
      $(this).text("Deleting...");
      $.ajax({
        url: "http://103.205.71.148/salesman/" + rowData._id,
        type: "DELETE",
        success: function(data) {
          let currentPage = salesman_table.page();
          salesman_table.row(rowIndex).remove().draw();
          const modal = bootstrap.Modal.getInstance($("#delete_salesman_modal"));
          modal.hide();
          $("#delete_salesman").text("Delete");
          salesman_table.page(currentPage).draw("page");
          notyf.success({
            message: "Salesman  Deleted <strong>Successfully !</strong>",
            duration: 7e3,
            icon: false
          });
          rowData = void 0;
          rowIndex = void 0;
        },
        error: function() {
          $("#delete_salesman").text("Delete");
          notyf.error({
            message: "<strong>Warning !</strong> Can't Delete Salesman",
            duration: 7e3,
            icon: false
          });
        }
      });
    });
    $("#salesman_dataTable tbody").on("click", "#update_salesmanBtn", function() {
      rowData = salesman_table.row($(this).parents("tr")).data();
      $("#salesman_edit_name").val(rowData.name);
      $("#salesman_edit_designation").val(rowData.designation_id._id);
      $("#salesman_edit_age").val(rowData.age);
      $("#salesman_edit_gender").val(rowData.gender);
      $("#salesman_edit_email").val(rowData.email);
      $("#salesman_edit_phone_number").val(rowData.phone);
      $("#salesman_edit_address").val(rowData.address);
      $("#salesman_edit_nid").val(rowData.nid);
      $("#s_nid_img").attr("src", rowData.nid_photo);
      $("#s_profile_img").attr("src", rowData.profile_img_url);
      $("#salesman_edit_salary").val(rowData.salary);
      $("#salesman_edit_joining_date").val(rowData.joining_date);
      $("#salesman_edit_status").val(rowData.status);
      closeModal();
    });
    function updateNidURL(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          $("#s_nid_img").attr("src", e.target.result);
          $("#s_nid_img").hide();
          $("#s_nid_img").fadeIn(650);
        };
        reader.readAsDataURL(input.files[0]);
      }
    }
    $("#salesman_edit_nid_photos").change(function() {
      updateNidURL(this);
    });
    function updateProURL(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          $("#s_profile_img").attr("src", e.target.result);
          $("#s_profile_img").hide();
          $("#s_profile_img").fadeIn(650);
        };
        reader.readAsDataURL(input.files[0]);
      }
    }
    $("#salesman_edit_profile_photos").change(function() {
      updateProURL(this);
    });
  });
  $(document).ready(function() {
    $("#salesman_edit_profile_photos").cropzee();
    $("#salesman_edit_nid_photos").cropzee();
    $("#nid_photos").cropzee();
    $("#profile_photos").cropzee();
  });
  var supplier_table = $("#supplier_dataTable").DataTable({
    order: [[0, "desc"]],
    "columnDefs": [
      { "visible": false, "targets": 0 },
      { "width": "20%", "targets": 1 },
      { "width": "20%", "targets": 2 },
      { "width": "10%", "targets": 4 },
      { "width": "10%", "targets": 5 }
    ],
    ajax: {
      url: "https://62b15c56196a9e987033e9c4.mockapi.io/supplier",
      dataSrc: ""
    },
    rowId: "id",
    dom: "Blfrtip",
    oLanguage: {
      sLengthMenu: "Show _MENU_"
    },
    language: {
      search: "",
      searchPlaceholder: "Search..."
    },
    buttons: [
      {
        extend: "print",
        title: "Shop Information",
        orientation: "landscape",
        exportOptions: {
          columns: [1, 2, 3],
          modifier: {
            page: "current"
          }
        },
        pageSize: "LEGAL",
        customize: function(win) {
          $(win.document.body).css("font-size", "15pt");
          $(win.document.body).find("th").css({
            "font-size": "inherit",
            "text-align": "center"
          }).addClass("compact");
          $(win.document.body).find("table").css("font-size", "inherit").css("text-align", "center");
        }
      },
      {
        extend: "excelHtml5",
        title: "Shop Information",
        exportOptions: {
          columns: [1, 2, 3]
        }
      },
      {
        extend: "pdf",
        exportOptions: {
          columns: [1, 2, 3],
          modifier: {
            page: "current"
          }
        },
        pageSize: "LEGAL",
        title: "Shop Information",
        customize: function(doc) {
          doc.content[1].table.widths = [
            "20%",
            "35%",
            "45%"
          ];
          let rowCount = doc.content[1].table.body.length;
          for (let i = 1; i < rowCount; i++) {
            doc.content[1].table.body[i][0].alignment = "center";
            doc.content[1].table.body[i][1].alignment = "center";
            doc.content[1].table.body[i][2].alignment = "center";
          }
        }
      },
      '<button id="supplier_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_supplier_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],
    columns: [
      { data: "id" },
      { data: "name" },
      { data: "phone" },
      { data: "address" },
      {
        data: "status",
        render: function(data) {
          if (data == 1) {
            return "Active";
          } else {
            return "Inactive";
          }
        }
      },
      {
        data: "action",
        render: function() {
          return '<button id="update_supplierBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"  data-bs-target="#update_supplier_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  <button   id="delete_supplierBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_supplier_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
        }
      }
    ]
  });
  $(document).ready(function() {
    $("#supplier_dataTable tbody").on("click", "#update_supplierBtn", function() {
      rowIndex = supplier_table.row($(this).parents("tr")).index();
      rowData = supplier_table.row($(this).parents("tr")).data();
      $("#update_supplier_name").val(rowData.name);
      $("#update_supplier_phone").val(rowData.phone);
      $("#update_supplier_address").val(rowData.address);
      $("#update_supplier_status").val(rowData.status);
    });
    $("#update_supplier").click(function() {
      if ($("#update_shop_form")[0].checkValidity()) {
        rowData.name = $("#update_supplier_name").val();
        rowData.phone = $("#update_supplier_phone").val();
        rowData.address = $("#update_supplier_address").val();
        rowData.status = $("#update_supplier_status").val();
        $(this).text("Updating...");
        $.ajax({
          url: "https://62b15c56196a9e987033e9c4.mockapi.io/supplier/" + rowData.id,
          type: "PUT",
          data: JSON.stringify(rowData),
          contentType: "application/json; charset=utf-8",
          success: function() {
            const modal = bootstrap.Modal.getInstance($("#update_supplier_modal"));
            modal.hide();
            $("#update_shop").text("Update Info");
            let currentPage = supplier_table.page();
            supplier_table.row(rowIndex).data(rowData).draw();
            supplier_table.page(currentPage).draw("page");
            $(supplier_table.row(rowIndex).nodes()).addClass("selected");
            setTimeout(function() {
              $(supplier_table.row(rowIndex).nodes()).removeClass("selected");
            }, 2e3);
            notyf.success({
              message: "Shop updated <strong>successfully</strong>",
              duration: 7e3,
              icon: false
            });
          },
          error: function() {
            $("#update_shop").text("Update Info");
            notyf.error({
              message: "<strong>Warning !</strong> Can't update shop.",
              duration: 7e3,
              icon: false
            });
          }
        });
      } else {
        $("#update_shop_form")[0].reportValidity();
      }
    });
    $("#add_supplier").click(function() {
      if ($("#supplier_form")[0].checkValidity()) {
        $(this).text("Submitting..");
        let formPostModalData = {
          name: $("#supplier_name").val(),
          phone: $("#supplier_phone").val(),
          address: $("#supplier_address").val(),
          status: $("#supplier_status").val()
        };
        $.ajax({
          url: "https://62b15c56196a9e987033e9c4.mockapi.io/supplier",
          type: "POST",
          data: JSON.stringify(formPostModalData),
          contentType: "application/json",
          success: function(data) {
            let newRowIndex = supplier_table.row.add(data).draw();
            $("#add_supplier").text("Submit");
            const modal = bootstrap.Modal.getInstance($("#add_supplier_modal"));
            modal.hide();
            $("form :input").val("");
            $(".input").val("");
            supplier_table.search("");
            supplier_table.order([0, "desc"]).draw();
            $(supplier_table.row(newRowIndex.index()).nodes()).addClass("selected");
            setTimeout(function() {
              $(supplier_table.row(newRowIndex.index()).nodes()).removeClass("selected");
            }, 2e3);
            notyf.success({
              message: "New Shop Added  <strong>Successfully !</strong>",
              duration: 7e3,
              icon: false
            });
          },
          error: function() {
            $("#add_supplier").text("Submit");
            notyf.error({
              message: "<strong>Warning !</strong> Can't update shop.",
              duration: 7e3,
              icon: false
            });
          }
        });
      } else {
        $("#supplier_form")[0].reportValidity();
      }
    });
    $("#supplier_dataTable tbody").on("click", "#delete_supplierBtn", function() {
      rowData = supplier_table.row($(this).parents("tr")).data();
      rowIndex = supplier_table.row($(this).parents("tr")).index();
      $("#supplier_Delete_name").text(`Are you sure you want to delete "${rowData.name}"?`);
    });
    $("#delete_supplier").click(function() {
      $(this).text("Deleting...");
      $.ajax({
        url: "https://62b15c56196a9e987033e9c4.mockapi.io/supplier/" + rowData.id,
        type: "DELETE",
        dataType: "json",
        success: function(data) {
          let currentPage = supplier_table.page();
          supplier_table.row(rowIndex).remove().draw();
          const modal = bootstrap.Modal.getInstance($("#delete_supplier_modal"));
          modal.hide();
          $("#delete_supplier").text("Delete");
          supplier_table.page(currentPage).draw("page");
          notyf.success({
            message: "Supplier  Deleted <strong>Successfully !</strong>",
            duration: 7e3,
            icon: false
          });
          rowData = void 0;
          rowIndex = void 0;
        },
        error: function() {
          $("#delete_supplier").text("Delete");
          notyf.error({
            message: "<strong>Warning !</strong> Can't Delete shop",
            duration: 7e3,
            icon: false
          });
        }
      });
    });
    $("#add_supplier_modal").on("hidden.bs.modal", function() {
      $(this).find("#supplier_form").trigger("reset");
    });
    $("#update_supplier_modal").on("hidden.bs.modal", function() {
      $(this).find("#update_supplier_form").trigger("reset");
    });
  });
})();
