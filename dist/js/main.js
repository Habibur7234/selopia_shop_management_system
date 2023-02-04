(() => {
  // src/js/main.js
  var rowIndex;
  var rowData;
  var notyf = new Notyf();
  var nafisa_domain = "https://nafisa.selopian.us";
  var riyad_domain = "https://riyadshop.selopian.us";
  var shakila_domain = "https://shakila.selopian.us";
  var shop_table = $("#shop_dataTable").DataTable({
    order: [[0, "desc"]],
    "columnDefs": [
      { "width": "80%", "targets": 0 },
      { "width": "20%", "targets": 1 }
    ],
    ajax: {
      url: "https://riyadshop.selopian.us/shop",
      dataSrc: "data"
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
        extend: "pdf"
      },
      '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_shop_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],
    columns: [
      { data: "name" },
      {
        data: "id",
        render: function() {
          return '<button id="update_shopBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_shop_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  <button   id="delete_shopBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_shop_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
        }
      }
    ]
  });
  $("#add_shop").click(function() {
    $(this).text("Submitting..");
    let addShopModal = {
      name: $("#shopName").val()
    };
    $.ajax({
      url: "https://riyadshop.selopian.us/shop",
      type: "POST",
      data: JSON.stringify(addShopModal),
      contentType: "application/json",
      success: function(data2) {
        const modal = bootstrap.Modal.getInstance($("#add_shop_modal"));
        modal.hide();
        let newRowIndex = shop_table.row.add(addShopModal).draw();
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
        notyf.error({
          message: "<strong>Warning !</strong> Can't Added shop.",
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  $("#shop_dataTable tbody").on("click", "#update_shopBtn", function() {
    rowData = shop_table.row($(this).parents("tr")).data();
    rowIndex = shop_table.row($(this).parents("tr")).index();
    $("#update_shopName").val(rowData.name);
  });
  $("#update_shop").click(function() {
    let updateShopModal = {
      name: $("#update_shopName").val()
    };
    $.ajax({
      url: "https://riyadshop.selopian.us/shop/" + rowData.id,
      type: "PUT",
      data: JSON.stringify(updateShopModal),
      contentType: "application/json; charset=utf-8",
      success: function(data2) {
        if (data2.status.code === 1) {
          $("#update_shop").text("Update Info");
          const modal = bootstrap.Modal.getInstance($("#update_shop_modal"));
          modal.hide();
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          let currentPage = shop_table.page();
          shop_table.row(rowIndex).data(updateShopModal).draw();
          shop_table.page(currentPage).draw("page");
          $(shop_table.row(rowIndex).nodes()).addClass("selected");
          setTimeout(function() {
            $(shop_table.row(rowIndex).nodes()).removeClass("selected");
          }, 2e3);
        }
      },
      error: function() {
        $("#update_shop").text("Update Info");
        notyf.success({
          message: data.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  $("#shop_dataTable tbody").on("click", "#delete_shopBtn", function() {
    rowData = shop_table.row($(this).parents("tr")).data();
    rowIndex = shop_table.row($(this).parents("tr")).index();
    $("#update_shopName").val(rowData.name);
  });
  $("#delete_shop").click(function() {
    $(this).text("Deleting...");
    $.ajax({
      url: "https://riyadshop.selopian.us/shop/" + rowData.id,
      type: "DELETE",
      dataType: "json",
      success: function(data2) {
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
  var branch_table = $("#branch_dataTable").DataTable({
    ajax: {
      url: "https://riyadshop.selopian.us/branch",
      dataSrc: "data"
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
      '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_branch_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],
    columns: [
      { data: "name" },
      { data: "location" },
      { data: "shop_id.name" },
      { data: "geolocation" },
      {
        data: "id",
        render: function() {
          return '<button id="update_shopBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_shop_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  <button   id="delete_shopBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_shop_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
        }
      }
    ]
  });
  $.ajax({
    url: "https://riyadshop.selopian.us/shop",
    type: "GET",
    success: function(result) {
      let shopName = result?.data.map((item) => item);
      shopName.forEach((element) => {
        $("<option/>").val(element["id"]).html(element["name"]).appendTo("#selectShop");
      });
    }
  });
  $("#add_Branch").click(function() {
    $(this).text("Submitting..");
    let addBranch = {
      name: $("#branch_name").val(),
      location: $("#add_location").val(),
      shop_id: $("#selectShop").val()
    };
    $.ajax({
      url: "https://riyadshop.selopian.us/branch ",
      type: "POST",
      data: JSON.stringify(addBranch),
      contentType: "application/json",
      success: function(data2) {
        let newRowIndex = branch_table.row.add(addBranch).draw();
        const modal = bootstrap.Modal.getInstance($("#add_branch_modal"));
        modal.hide();
        $("form :input").val("");
        $(".input").val("");
        branch_table.search("");
        branch_table.order([0, "desc"]).draw();
        $(branch_table.row(newRowIndex.index()).nodes()).addClass("selected");
        setTimeout(function() {
          $(branch_table.row(newRowIndex.index()).nodes()).removeClass("selected");
        }, 2e3);
        notyf.success({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
      },
      error: function(data2) {
        const modal = bootstrap.Modal.getInstance($("#add_branch_modal"));
        modal.hide();
        notyf.error({
          message: data2.status.message,
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
  var user_table = $("#user_dataTable").DataTable({
    ajax: {
      url: nafisa_domain + "/user",
      dataSrc: "data"
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
          columns: [0, 1, 2, 3, 4, 5],
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
          columns: [0, 1, 2, 3, 4, 5]
        }
      },
      {
        extend: "pdf",
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5],
          modifier: {
            page: "current"
          }
        },
        pageSize: "LEGAL",
        title: "Shop Information",
        customize: function(doc) {
          doc.content[1].table.widths = [
            "15%",
            "15%",
            "15%",
            "15%",
            "15%",
            "15%"
          ];
          let rowCount = doc.content[1].table.body.length;
          for (let i = 1; i < rowCount; i++) {
            doc.content[1].table.body[i][0].alignment = "center";
            doc.content[1].table.body[i][1].alignment = "center";
            doc.content[1].table.body[i][2].alignment = "center";
          }
        }
      },
      '<button id="addUser"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_user_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],
    columns: [
      { data: "phone_username" },
      {
        data: "role",
        render: function(data2) {
          if (data2 === 1) {
            return "Admin";
          } else {
            return "Salesman";
          }
        }
      },
      {
        data: "account_status",
        render: function(data2) {
          if (data2 === 1) {
            return "Active";
          } else {
            return "Inactive";
          }
        }
      },
      { data: "last_login_at" },
      { data: "last_login_ip" },
      { data: "password_changed_at" },
      {
        data: "",
        render: function() {
          return '<button id="update_userBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_user_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  <button   id="delete_userBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_user_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
        }
      }
    ]
  });
  $("#add_user").click(function() {
    $("#add_user").text("Adding");
    let addUser = {
      phone_username: $("#user_number").val(),
      role: $("#user_role").val(),
      password: $("#user_password").val()
    };
    $.ajax({
      url: nafisa_domain + "/user",
      type: "POST",
      data: JSON.stringify(addUser),
      contentType: "application/json",
      success: function(data2) {
        if (data2.status.code === 1) {
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          const modal = bootstrap.Modal.getInstance($("#add_user_modal"));
          modal.hide();
          let newRowIndex = user_table.row.add(addUser).draw();
          $("#add_user").text("Add User");
          $("form :input").val("");
          $(".input").val("");
          user_table.search("");
          user_table.order([0, "desc"]).draw();
          $(user_table.row(newRowIndex.index()).nodes()).addClass("selected");
        } else {
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        }
      }
    });
  });
  $("#user_dataTable tbody").on("click", "#update_userBtn", function() {
    rowIndex = user_table.row($(this).parents("tr")).index();
    rowData = user_table.row($(this).parents("tr")).data();
    $("#update_user_number").val(rowData.phone_username);
    $("#update_user_role").val(rowData.role);
    $("#update_user_password").val(rowData.password);
  });
  $("#update_user").click(function() {
    let updateUserModal = {
      phone_username: $("#update_user_number").val(),
      role: $("#update_user_role").val(),
      password: $("#update_user_password").val()
    };
    $(this).text("Updating...");
    $.ajax({
      url: nafisa_domain + "/user/" + rowData.id,
      type: "PUT",
      data: JSON.stringify(updateUserModal),
      contentType: "application/json; charset=utf-8",
      success: function(data2) {
        if (data2.status.code === 1) {
          const modal = bootstrap.Modal.getInstance($("#update_user_modal"));
          modal.hide();
          $("#update_user").text("Update");
          let currentPage = user_table.page();
          user_table.row(rowIndex).data(updateUserModal).draw();
          user_table.page(currentPage).draw("page");
          $(user_table.row(rowIndex).nodes()).addClass("selected");
          setTimeout(function() {
            $(user_table.row(rowIndex).nodes()).removeClass("selected");
          }, 2e3);
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        } else {
          const modal = bootstrap.Modal.getInstance($("#update_user_modal"));
          modal.hide();
          $("#update_user").text("Update");
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        }
      },
      error: function() {
        const modal = bootstrap.Modal.getInstance($("#update_category_modal"));
        modal.hide();
        $("#update_category").text("Update");
        notyf.error({
          message: data.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  $("#user_dataTable tbody").on("click", "#delete_userBtn", function() {
    rowData = user_table.row($(this).parents("tr")).data();
    rowIndex = user_table.row($(this).parents("tr")).index();
  });
  $("#delete_user").click(function() {
    $(this).text("Deleting...");
    $.ajax({
      url: shakila_domain + "/user/" + rowData.id,
      type: "DELETE",
      success: function(data2) {
        if (data2.status.code === 1) {
          const modal = bootstrap.Modal.getInstance($("#delete_user_modal"));
          modal.hide();
          $("#delete_user").text("Delete");
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          $("#delete_user").text("Delete");
          user_table.row(rowIndex).remove().draw();
          let currentPage = user_table.page();
          user_table.page(currentPage).draw("page");
          rowData = void 0;
          rowIndex = void 0;
        } else {
          $("#delete_user").text("Delete");
          const modal = bootstrap.Modal.getInstance($("#delete_user_modal"));
          modal.hide();
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          rowData = void 0;
          rowIndex = void 0;
        }
      },
      error: function(data2) {
        $("#delete_user").text("Delete");
        const modal = bootstrap.Modal.getInstance($("#delete_user_modal"));
        modal.hide();
        notyf.error({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  var customer_table = $("#customer_dataTable").DataTable({
    ajax: {
      url: nafisa_domain + "/customer/all",
      dataSrc: "data"
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
        title: "Shop Information"
      },
      '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_customer_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],
    columns: [
      { data: "name" },
      { data: "email" },
      { data: "phone_no" },
      { data: "address" },
      { data: "company_name" },
      {
        data: "image_url",
        render: function() {
          return '<button id="customer_profile_img_url"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#customer_image_modal">View</button>';
        }
      },
      {
        data: "",
        render: function() {
          return '<button id="update_customerBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_customer_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  <button   id="delete_customerBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_customerr_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
        }
      }
    ]
  });
  $(document).ready(function() {
    $("#customer_image_url").cropzee();
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
  $("#customer_dataTable tbody").on("click", "#customer_profile_img_url", function() {
    rowData = customer_table.row($(this).parents("tr")).data();
    $("#customer_image").attr("src", rowData.image_url);
  });
  $("#add_customer_modal").on("hidden.bs.modal", function() {
    $('[data-cropzee="customer_image_url"]').replaceWith('<div class="modal-body align-items-center-center"  data-cropzee="customer_image_url"><img  src=""></div>');
    $(this).find("#salesman_post_form").trigger("reset");
  });
  $("#customer_post_form").on("submit", function(e) {
    e.preventDefault();
    $.ajax({
      url: nafisa_domain + "/customer",
      type: "POST",
      data: new FormData(this),
      contentType: false,
      cache: false,
      processData: false,
      success: function(data2) {
        if (data2.status.code === 1) {
          $("#add_supplier").text("Add");
          const modal = bootstrap.Modal.getInstance($("#add_customer_modal"));
          modal.hide();
          let newSRowIndex = customer_table.row.add(data2.data).draw();
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          $("form :input").val("");
          $(".input").val("");
          customer_table.search("");
          customer_table.order([0, "desc"]).draw();
          $(customer_table.row(newSRowIndex.index()).nodes()).addClass("selected");
        } else {
          const modal = bootstrap.Modal.getInstance($("#add_customer_modal"));
          modal.hide();
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        }
      },
      error: function(data2) {
        const modal = bootstrap.Modal.getInstance($("#add_customer_modal"));
        modal.hide();
        notyf.error({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  $("#customer_dataTable tbody").on("click", "#delete_customerBtn", function() {
    rowData = customer_table.row($(this).parents("tr")).data();
    rowIndex = customer_table.row($(this).parents("tr")).index();
  });
  $("#delete_customer").click(function() {
    $(this).text("Deleting...");
    $.ajax({
      url: nafisa_domain + "/customer/" + rowData.id,
      type: "DELETE",
      success: function(data2) {
        if (data2.status.code === 1) {
          let currentPage = customer_table.page();
          customer_table.row(rowIndex).remove().draw();
          const modal = bootstrap.Modal.getInstance($("#delete_customerr_modal"));
          modal.hide();
          $("#delete_customer").text("Delete");
          customer_table.page(currentPage).draw("page");
          notyf.success({
            message: "Customer  Deleted <strong>Successfully !</strong>",
            duration: 7e3,
            icon: false
          });
          rowData = void 0;
          rowIndex = void 0;
        } else {
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          const modal = bootstrap.Modal.getInstance($("#delete_customerr_modal"));
          modal.hide();
          $("#delete_customer").text("Delete");
        }
      },
      error: function() {
        $("#delete_customer").text("Delete");
        notyf.success({
          message: data.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  function updateNidURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        $("#update_customer_image_url").attr("src", e.target.result);
        $("#update_customer_image_url").hide();
        $("#update_customer_image_url").fadeIn(650);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  $("#salesman_edit_nid_photos").change(function() {
    updateNidURL(this);
  });
  $("#customer_dataTable tbody").on("click", "#update_customerBtn", function() {
    rowData = customer_table.row($(this).parents("tr")).data();
    $("#update_customer_name").val(rowData.name);
    $("#update_customer_email").val(rowData.email);
    $("#update_customer_phone_no").val(rowData.phone_no);
    $("#update_customer_address").val(rowData.address);
    $("#update_customer_company_name").val(rowData.company_name);
    $("#update_customer_image_url").val(rowData.image_url);
    closeModal();
  });
  $("#update_customer_post_form").on("submit", function(e) {
    e.preventDefault();
    $.ajax({
      url: nafisa_domain + "/customer/" + rowData.id,
      type: "POST",
      data: new FormData(this),
      contentType: false,
      cache: false,
      processData: false,
      success: function(data2) {
        if (data2.status.code === 1) {
          const modal = bootstrap.Modal.getInstance($("#update_customer_modal"));
          modal.hide();
          let newSRowIndex = customer_table.row.add(data2.data).draw();
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          $("form :input").val("");
          $(".input").val("");
          customer_table.search("");
          customer_table.order([0, "desc"]).draw();
          $(customer_table.row(newSRowIndex.index()).nodes()).addClass("selected");
        } else {
          const modal = bootstrap.Modal.getInstance($("#update_customer_modal"));
          modal.hide();
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        }
      },
      error: function(data2) {
        const modal = bootstrap.Modal.getInstance($("#update_customer_modal"));
        modal.hide();
        notyf.error({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  var shop_supplier_table = $("#supplier_dataTable").DataTable({
    order: [[0, "desc"]],
    "columnDefs": [
      { "visible": false, "targets": 0 },
      { "width": "15%", "targets": 1 },
      { "width": "20%", "targets": 2 },
      { "visible": "20%", "targets": 3 },
      { "visible": false, "targets": 4 },
      { "visible": false, "targets": 5 },
      { "visible": false, "targets": 6 },
      { "visible": false, "targets": 7 },
      { "visible": false, "targets": 8 },
      { "visible": false, "targets": 9 },
      { "visible": false, "targets": 10 },
      { "width": "15%", "targets": 11 },
      { "width": "7%", "targets": 12 },
      { "width": "10%", "targets": 13 }
    ],
    ajax: {
      url: riyad_domain + "/supplier/all",
      dataSrc: "data"
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
      { data: "email" },
      { data: "phone_no" },
      { data: "address" },
      {
        data: "company_name",
        render: function(data2) {
          if (data2 === null) {
            return "N/A";
          } else {
            return data2;
          }
        }
      },
      {
        data: "company_phone_no",
        render: function(data2) {
          if (data2 === null) {
            return "N/A";
          } else {
            return data2;
          }
        }
      },
      {
        data: "company_address",
        render: function(data2) {
          if (data2 === null) {
            return "N/A";
          } else {
            return data2;
          }
        }
      },
      {
        data: "bank_account_info",
        render: function(data2) {
          if (data2 === null) {
            return "N/A";
          } else {
            return data2;
          }
        }
      },
      {
        data: "ref_comment",
        render: function(data2) {
          if (data2 === null) {
            return "N/A";
          } else {
            return data2;
          }
        }
      },
      {
        data: "blacklist",
        render: function(data2) {
          if (data2 === null) {
            return "N/A";
          } else {
            return data2;
          }
        }
      },
      {
        data: "image_url",
        render: function() {
          return '<button id="supplier_photo"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#supplier_image_modal">View</button>';
        }
      },
      {
        data: "details",
        render: function() {
          return '<button id="supplier_details"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#details_supplier_modal">Details</button>';
        }
      },
      {
        data: "",
        render: function() {
          return '<button id="update_supplierBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"  data-bs-target="#Update_supplier_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button><button   id="delete_supplierBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_supplier_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
        }
      }
    ]
  });
  $("#supplier_dataTable tbody").on("click", "#supplier_details", function() {
    rowIndex = shop_supplier_table.row($(this).parents("tr")).index();
    rowData = shop_supplier_table.row($(this).parents("tr")).data();
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
  });
  $("#supplier_dataTable tbody").on("click", "#supplier_photo", function() {
    rowData = shop_supplier_table.row($(this).parents("tr")).data();
    $("#supplier_image").attr("src", riyad_domain + rowData.image_url);
  });
  $(document).ready(function() {
    $("#image_url").cropzee();
  });
  $("#Supplier_post_form").on("submit", function(e) {
    e.preventDefault();
    $.ajax({
      url: riyad_domain + "/supplier",
      type: "POST",
      data: new FormData(this),
      contentType: false,
      cache: false,
      processData: false,
      success: function(data2) {
        if (data2.status.code === 1) {
          $("#add_supplier").text("Add");
          const modal = bootstrap.Modal.getInstance($("#add_supplier_modal"));
          modal.hide();
          let newSRowIndex = shop_supplier_table.row.add(data2.data).draw();
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          $("form :input").val("");
          $(".input").val("");
          shop_supplier_table.search("");
          shop_supplier_table.order([0, "desc"]).draw();
          $(shop_supplier_table.row(newSRowIndex.index()).nodes()).addClass("selected");
        } else {
          $("#add_supplier").text("Add");
          const modal = bootstrap.Modal.getInstance($("#add_supplier_modal"));
          modal.hide();
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        }
      },
      error: function(data2) {
        $("#add_supplier").text("Add");
        const modal = bootstrap.Modal.getInstance($("#add_supplier_modal"));
        modal.hide();
        notyf.error({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  $("#supplier_dataTable tbody").on("click", "#update_supplierBtn", function() {
    rowData = shop_supplier_table.row($(this).parents("tr")).data();
    $("#Uname").val(rowData.name);
    $("#Uemail").val(rowData.email);
    $("#Uphone_no").val(rowData.phone_no);
    $("#Uaddress").val(rowData.address);
    $("#Ucompany_name").val(rowData.company_name);
    $("#Uimage_url").val(rowData.image_url);
  });
  $("#Supplier_update_post_form").on("submit", function(e) {
    e.preventDefault();
    $.ajax({
      url: riyad_domain + "/supplier/" + rowData.id,
      type: "PUT",
      data: new FormData(this),
      contentType: false,
      cache: false,
      processData: false,
      success: function(data2) {
        if (data2.status.code === 1) {
          const modal = bootstrap.Modal.getInstance($("#update_supplier_modal"));
          modal.hide();
          let currentPage = shop_supplier_table.page();
          shop_supplier_table.row(rowIndex).data(data2.data).draw();
          shop_supplier_table.page(currentPage).draw("page");
          $(shop_supplier_table.row(rowIndex).nodes()).addClass("selected");
          setTimeout(function() {
            $(shop_supplier_table.row(rowIndex).nodes()).removeClass("selected");
          }, 2e3);
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        } else {
          const modal = bootstrap.Modal.getInstance($("#update_supplier_modal"));
          modal.hide();
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        }
      },
      error: function(data2) {
        const modal = bootstrap.Modal.getInstance($("#Update_supplier_modal"));
        modal.hide();
        notyf.error({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  $("#supplier_dataTable tbody").on("click", "#delete_supplierBtn", function() {
    rowData = shop_supplier_table.row($(this).parents("tr")).data();
    rowIndex = shop_supplier_table.row($(this).parents("tr")).index();
  });
  $("#delete_supplier").click(function() {
    $(this).text("Deleting...");
    $.ajax({
      url: riyad_domain + "/supplier/" + rowData.id,
      type: "DELETE",
      dataType: "json",
      success: function(data2) {
        let currentPage = shop_supplier_table.page();
        shop_supplier_table.row(rowIndex).remove().draw();
        const modal = bootstrap.Modal.getInstance($("#delete_supplier_modal"));
        modal.hide();
        $("#delete_supplier").text("Delete");
        shop_supplier_table.page(currentPage).draw("page");
        notyf.success({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
        rowData = void 0;
        rowIndex = void 0;
      },
      error: function(data2) {
        $("#delete_supplier").text("Delete");
        notyf.error({
          message: "Cannot Delete This Supplier",
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  var brand_table = $("#Brand_dataTable").DataTable({
    ajax: {
      url: nafisa_domain + "/brand",
      dataSrc: "data"
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
      '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_brand_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],
    columns: [
      { data: "name" },
      { data: "description" },
      {
        data: "image_url",
        render: function() {
          return '<button id="brand_photo"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#brand_image_modal">View</button>';
        }
      },
      {
        data: "",
        render: function() {
          return '<button id="update_brandBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_brand_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  <button   id="delete_shopBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_shop_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
        }
      }
    ]
  });
  $(document).ready(function() {
    $("#brand_image_url").cropzee();
  });
  $("#Brand_post_form").on("submit", function(e) {
    e.preventDefault();
    $.ajax({
      url: nafisa_domain + "/brand",
      type: "POST",
      data: new FormData(this),
      contentType: false,
      cache: false,
      processData: false,
      success: function(data2) {
        if (data2.status.code === 1) {
          const modal = bootstrap.Modal.getInstance($("#add_brand_modal"));
          modal.hide();
          let newSRowIndex = brand_table.row.add(data2.data).draw();
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          $("form :input").val("");
          $(".input").val("");
          brand_table.search("");
          brand_table.order([0, "desc"]).draw();
          $(brand_table.row(newSRowIndex.index()).nodes()).addClass("selected");
        } else {
          $("#add_supplier").text("Add");
          const modal = bootstrap.Modal.getInstance($("#add_brand_modal"));
          modal.hide();
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        }
      },
      error: function(data2) {
        const modal = bootstrap.Modal.getInstance($("#add_brand_modal"));
        modal.hide();
        notyf.error({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  $("#Brand_dataTable tbody").on("click", "#brand_photo", function() {
    rowData = brand_table.row($(this).parents("tr")).data();
    $("#brand_image").attr("src", rowData.image_url);
  });
  $("#Brand_dataTable tbody").on("click", "#update_brandBtn", function() {
    rowData = brand_table.row($(this).parents("tr")).data();
    $("#update_brand_name").val(rowData.name);
    $("#update_brand_description").val(rowData.description);
    $("#brand_image_url").val(rowData.image_url);
  });
  $(document).ready(function() {
    $("#update_brand_image_url").cropzee();
  });
  $("#update_brand_post_form").on("submit", function(e) {
    e.preventDefault();
    $.ajax({
      url: nafisa_domain + "/brand/" + rowData.id,
      type: "POST",
      data: new FormData(this),
      contentType: false,
      cache: false,
      processData: false,
      success: function(data2) {
        if (data2.status.code === 1) {
          const modal = bootstrap.Modal.getInstance($("#update_brand_modal"));
          modal.hide();
          let currentPage = brand_table.page();
          brand_table.row(rowIndex).data(data2.data).draw();
          brand_table.page(currentPage).draw("page");
          $(brand_table.row(rowIndex).nodes()).addClass("selected");
          setTimeout(function() {
            $(brand_table.row(rowIndex).nodes()).removeClass("selected");
          }, 2e3);
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        } else {
          const modal = bootstrap.Modal.getInstance($("#update_brand_modal"));
          modal.hide();
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        }
      },
      error: function(data2) {
        const modal = bootstrap.Modal.getInstance($("#update_brand_modal"));
        modal.hide();
        notyf.error({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  $("#supplier_dataTable tbody").on("click", "#delete_supplierBtn", function() {
    rowData = shop_supplier_table.row($(this).parents("tr")).data();
    rowIndex = shop_supplier_table.row($(this).parents("tr")).index();
  });
  $("#delete_supplier").click(function() {
    $(this).text("Deleting...");
    $.ajax({
      url: riyad_domain + "/supplier/" + rowData.id,
      type: "DELETE",
      dataType: "json",
      success: function(data2) {
        let currentPage = shop_supplier_table.page();
        shop_supplier_table.row(rowIndex).remove().draw();
        const modal = bootstrap.Modal.getInstance($("#delete_supplier_modal"));
        modal.hide();
        $("#delete_supplier").text("Delete");
        shop_supplier_table.page(currentPage).draw("page");
        notyf.success({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
        rowData = void 0;
        rowIndex = void 0;
      },
      error: function(data2) {
        $("#delete_supplier").text("Delete");
        notyf.error({
          message: "Cannot Delete This Supplier",
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  var department_table = $("#department_dataTable").DataTable({
    ajax: {
      url: nafisa_domain + "/department",
      dataSrc: "data"
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
          columns: [1],
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
      '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_department_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],
    columns: [
      { data: "name" },
      {
        data: "",
        render: function() {
          return '<button id="update_department_btn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_department_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  <button   id="delete_department_btn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_department_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
        }
      }
    ]
  });
  $("#add_department").click(function() {
    $(this).text("Adding...");
    let addDepartment = {
      name: $("#department_name").val()
    };
    $.ajax({
      url: nafisa_domain + "/department",
      type: "POST",
      data: JSON.stringify(addDepartment),
      contentType: "application/json",
      success: function(data2) {
        if (data2.status.code === 1) {
          $("#add_department").text("Add");
          const modal = bootstrap.Modal.getInstance($("#add_department_modal"));
          modal.hide();
          let newRowIndex = department_table.row.add(addDepartment).draw();
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          $("form :input").val("");
          $(".input").val("");
          department_table.search("");
          department_table.order([0, "desc"]).draw();
          $(department_table.row(newRowIndex.index()).nodes()).addClass("selected");
        } else {
          $("#add_department").text("Add");
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        }
      }
    });
  });
  $("#department_dataTable tbody").on("click", "#update_department_btn", function() {
    rowIndex = department_table.row($(this).parents("tr")).index();
    rowData = department_table.row($(this).parents("tr")).data();
    $("#update_department_name").val(rowData.name);
  });
  $("#update_department").click(function() {
    let updateDepartment = {
      name: $("#update_department_name").val()
    };
    $(this).text("Updating...");
    $.ajax({
      url: nafisa_domain + "/department/" + rowData.id,
      type: "PUT",
      data: JSON.stringify(updateDepartment),
      contentType: "application/json; charset=utf-8",
      success: function(data2) {
        if (data2.status.code === 1) {
          const modal = bootstrap.Modal.getInstance($("#update_department_modal"));
          modal.hide();
          $("#update_department").text("Update");
          let currentPage = department_table.page();
          department_table.row(rowIndex).data(updateDepartment).draw();
          department_table.page(currentPage).draw("page");
          $(department_table.row(rowIndex).nodes()).addClass("selected");
          setTimeout(function() {
            $(department_table.row(rowIndex).nodes()).removeClass("selected");
          }, 2e3);
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        } else {
          $("#update_department").text("Update");
          const modal = bootstrap.Modal.getInstance($("#update_department_modal"));
          modal.hide();
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        }
      },
      error: function() {
        $("#update_department").text("Update");
        const modal = bootstrap.Modal.getInstance($("#update_department_modal"));
        modal.hide();
        notyf.error({
          message: data.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  $("#department_dataTable tbody").on("click", "#delete_department_btn", function() {
    rowData = department_table.row($(this).parents("tr")).data();
    rowIndex = department_table.row($(this).parents("tr")).index();
  });
  $("#delete_department").click(function() {
    $(this).text("Deleting...");
    $.ajax({
      url: nafisa_domain + "/department/" + rowData.id,
      type: "DELETE",
      success: function(data2) {
        if (data2.status.code === 1) {
          const modal = bootstrap.Modal.getInstance($("#delete_department_modal"));
          modal.hide();
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          $("#delete_department").text("Delete");
          department_table.row(rowIndex).remove().draw();
          let currentPage = department_table.page();
          department_table.page(currentPage).draw("page");
          rowData = void 0;
          rowIndex = void 0;
        } else {
          $("#delete_department").text("Delete");
          const modal = bootstrap.Modal.getInstance($("#delete_department_modal"));
          modal.hide();
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          rowData = void 0;
          rowIndex = void 0;
        }
      },
      error: function(data2) {
        $("#delete_department").text("Delete");
        const modal = bootstrap.Modal.getInstance($("#delete_department_modal"));
        modal.hide();
        notyf.error({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
        rowData = void 0;
        rowIndex = void 0;
      }
    });
  });
  var category_table = $("#category_dataTable").DataTable({
    ajax: {
      url: nafisa_domain + "/category",
      dataSrc: "data"
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
      '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_category_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],
    columns: [
      { data: "name" },
      { data: "description" },
      { data: "featured" },
      {
        data: "id",
        render: function() {
          return '<button id="update_categoryBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_category_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  <button   id="delete_categorybtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_category_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
        }
      }
    ]
  });
  $.ajax({
    url: "https://nafisa.selopian.us/category/byparent/0",
    type: "GET",
    success: function(data2) {
      let category_parents = data2?.data.map((item) => item);
      category_parents.forEach((element) => {
        $("<option/>").val(element["id"]).html(element["name"]).appendTo("#cParent", "#update_cParent");
      });
    }
  });
  $("#add_category").click(function() {
    $(this).text("Submitting..");
    let addcategoryModal = {
      name: $("#category_name").val(),
      description: $("#category_description").val(),
      parent_id: $("#cParent").val(),
      featured: $("#category_featured").val()
    };
    $.ajax({
      url: nafisa_domain + "/category",
      type: "POST",
      data: JSON.stringify(addcategoryModal),
      contentType: "application/json",
      success: function(data2) {
        if (data2.status.code === 1) {
          const modal = bootstrap.Modal.getInstance($("#add_category_modal"));
          modal.hide();
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          let newRowIndex = category_table.row.add(addcategoryModal).draw();
          $("#add_category").text("Submit");
          $("form :input").val("");
          $(".input").val("");
          category_table.search("");
          category_table.order([0, "desc"]).draw();
          $(category_table.row(newRowIndex.index()).nodes()).addClass("selected");
        } else {
          $("#add_category").text("Submit");
          const modal = bootstrap.Modal.getInstance($("#add_category_modal"));
          modal.hide();
          notyf.error({
            message: "<strong>Warning !</strong> Can't Add Category.",
            duration: 7e3,
            icon: false
          });
        }
      }
    });
  });
  $("#category_dataTable tbody").on("click", "#update_categoryBtn", function() {
    rowIndex = category_table.row($(this).parents("tr")).index();
    rowData = category_table.row($(this).parents("tr")).data();
    $("#update_category_name").val(rowData.name);
    $("#update_category_description").val(rowData.description);
    $("<option/>").val(rowData["id"]).html(rowData["name"]).appendTo("#update_cParent");
    $("#update_category_featured").val(rowData.featured);
  });
  $("#update_category").click(function() {
    let ddcategoryModal = {
      name: $("#update_category_name").val(),
      description: $("#update_category_description").val(),
      parent_id: $("#update_cParent").val(),
      featured: $("#update_category_featured").val()
    };
    $(this).text("Updating...");
    $.ajax({
      url: nafisa_domain + "/category/" + rowData.id,
      type: "PUT",
      data: JSON.stringify(ddcategoryModal),
      contentType: "application/json; charset=utf-8",
      success: function(data2) {
        if (data2.status.code === 1) {
          const modal = bootstrap.Modal.getInstance($("#update_category_modal"));
          modal.hide();
          $("#update_category").text("Update");
          let currentPage = category_table.page();
          category_table.row(rowIndex).data(ddcategoryModal).draw();
          category_table.page(currentPage).draw("page");
          $(category_table.row(rowIndex).nodes()).addClass("selected");
          setTimeout(function() {
            $(category_table.row(rowIndex).nodes()).removeClass("selected");
          }, 2e3);
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        } else {
          const modal = bootstrap.Modal.getInstance($("#update_category_modal"));
          modal.hide();
          $("#update_category").text("Update");
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        }
      },
      error: function() {
        const modal = bootstrap.Modal.getInstance($("#update_category_modal"));
        modal.hide();
        $("#update_category").text("Update");
        notyf.error({
          message: data.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  $("#category_dataTable tbody").on("click", "#delete_categorybtn", function() {
    rowData = category_table.row($(this).parents("tr")).data();
    rowIndex = category_table.row($(this).parents("tr")).index();
  });
  $("#delete_category").click(function() {
    $("#delete_category").text("Deleting....");
    $.ajax({
      url: nafisa_domain + "/category/" + rowData.id,
      type: "DELETE",
      dataType: "json",
      success: function(data2) {
        if (data2.status.code === 1) {
          $("#delete_category").text("Delete");
          let currentPage = category_table.page();
          category_table.row(rowIndex).remove().draw();
          const modal = bootstrap.Modal.getInstance($("#delete_category_modal"));
          modal.hide();
          category_table.page(currentPage).draw("page");
          notyf.success({
            message: "Category  Deleted <strong>Successfully !</strong>",
            duration: 7e3,
            icon: false
          });
          rowData = void 0;
          rowIndex = void 0;
        } else {
          const modal = bootstrap.Modal.getInstance($("#delete_category_modal"));
          modal.hide();
          $("#delete_category").text("Delete");
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          rowData = void 0;
          rowIndex = void 0;
        }
      },
      error: function(data2) {
        notyf.error({
          message: data2.responseJSON.message,
          duration: 7e3,
          icon: false
        });
        $("#delete_category").text("Delete");
      }
    });
  });
  var userProfile_table = $("#userProfile_datatable").DataTable({
    ajax: {
      url: nafisa_domain + "/user_profile",
      dataSrc: "data"
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
        title: "Shop Information"
      },
      '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_user_profile_photo" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],
    columns: [
      { data: "name" },
      { data: "user_id.phone_username" },
      { data: "nid_no" },
      { data: "designation_id.name" },
      { data: "salary" },
      { data: "department_id.name" },
      { data: "shop_id.name" },
      { data: "ref_comment" },
      {
        data: "nid_photo_url",
        render: function() {
          return '<button id="customer_profile_img_url"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#customer_image_modal">View</button>';
        }
      },
      {
        data: "profile_photo_url",
        render: function() {
          return '<button id="customer_profile_img_url"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#customer_image_modal">View</button>';
        }
      },
      {
        data: "",
        render: function() {
          return '<button id="update_customerBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_customer_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  <button   id="delete_customerBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_customerr_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
        }
      }
    ]
  });
  $(document).ready(function() {
    $("#customer_image_url").cropzee();
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
  $("#customer_dataTable tbody").on("click", "#customer_profile_img_url", function() {
    rowData = customer_table.row($(this).parents("tr")).data();
    $("#customer_image").attr("src", rowData.image_url);
  });
  $("#add_customer_modal").on("hidden.bs.modal", function() {
    $('[data-cropzee="customer_image_url"]').replaceWith('<div class="modal-body align-items-center-center"  data-cropzee="customer_image_url"><img  src=""></div>');
    $(this).find("#salesman_post_form").trigger("reset");
  });
  $("#user_profile_post_form").on("submit", function(e) {
    e.preventDefault();
    $.ajax({
      url: nafisa_domain + "/userprofile",
      type: "POST",
      data: new FormData(this),
      contentType: false,
      cache: false,
      processData: false,
      success: function(data2) {
        if (data2.status.code === 1) {
          $("#add_supplier").text("Add");
          const modal = bootstrap.Modal.getInstance($("#add_customer_modal"));
          modal.hide();
          let newSRowIndex = customer_table.row.add(data2.data).draw();
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          $("form :input").val("");
          $(".input").val("");
          customer_table.search("");
          customer_table.order([0, "desc"]).draw();
          $(customer_table.row(newSRowIndex.index()).nodes()).addClass("selected");
        } else {
          const modal = bootstrap.Modal.getInstance($("#add_customer_modal"));
          modal.hide();
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        }
      },
      error: function(data2) {
        const modal = bootstrap.Modal.getInstance($("#add_customer_modal"));
        modal.hide();
        notyf.error({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  $("#customer_dataTable tbody").on("click", "#delete_customerBtn", function() {
    rowData = customer_table.row($(this).parents("tr")).data();
    rowIndex = customer_table.row($(this).parents("tr")).index();
  });
  $("#delete_customer").click(function() {
    $(this).text("Deleting...");
    $.ajax({
      url: nafisa_domain + "/customer/" + rowData.id,
      type: "DELETE",
      success: function(data2) {
        if (data2.status.code === 1) {
          let currentPage = customer_table.page();
          customer_table.row(rowIndex).remove().draw();
          const modal = bootstrap.Modal.getInstance($("#delete_customerr_modal"));
          modal.hide();
          $("#delete_customer").text("Delete");
          customer_table.page(currentPage).draw("page");
          notyf.success({
            message: "Customer  Deleted <strong>Successfully !</strong>",
            duration: 7e3,
            icon: false
          });
          rowData = void 0;
          rowIndex = void 0;
        } else {
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          const modal = bootstrap.Modal.getInstance($("#delete_customerr_modal"));
          modal.hide();
          $("#delete_customer").text("Delete");
        }
      },
      error: function() {
        $("#delete_customer").text("Delete");
        notyf.success({
          message: data.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  function updateNidURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        $("#update_customer_image_url").attr("src", e.target.result);
        $("#update_customer_image_url").hide();
        $("#update_customer_image_url").fadeIn(650);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  $("#salesman_edit_nid_photos").change(function() {
    updateNidURL(this);
  });
  $("#customer_dataTable tbody").on("click", "#update_customerBtn", function() {
    rowData = customer_table.row($(this).parents("tr")).data();
    $("#update_customer_name").val(rowData.name);
    $("#update_customer_email").val(rowData.email);
    $("#update_customer_phone_no").val(rowData.phone_no);
    $("#update_customer_address").val(rowData.address);
    $("#update_customer_company_name").val(rowData.company_name);
    $("#update_customer_image_url").val(rowData.image_url);
    closeModal();
  });
  $("#update_customer_post_form").on("submit", function(e) {
    e.preventDefault();
    $.ajax({
      url: nafisa_domain + "/customer/" + rowData.id,
      type: "POST",
      data: new FormData(this),
      contentType: false,
      cache: false,
      processData: false,
      success: function(data2) {
        if (data2.status.code === 1) {
          const modal = bootstrap.Modal.getInstance($("#update_customer_modal"));
          modal.hide();
          let newSRowIndex = customer_table.row.add(data2.data).draw();
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          $("form :input").val("");
          $(".input").val("");
          customer_table.search("");
          customer_table.order([0, "desc"]).draw();
          $(customer_table.row(newSRowIndex.index()).nodes()).addClass("selected");
        } else {
          const modal = bootstrap.Modal.getInstance($("#update_customer_modal"));
          modal.hide();
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        }
      },
      error: function(data2) {
        const modal = bootstrap.Modal.getInstance($("#update_customer_modal"));
        modal.hide();
        notyf.error({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  var kpi_table = $("#salesKpi_dataTable").DataTable({
    ajax: {
      url: riyad_domain + "/sales_kpi",
      dataSrc: "data"
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
      '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_kpi_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],
    columns: [
      { data: "name" },
      { data: "target_sales_volume" },
      { data: "last_modified_at" },
      {
        data: "id",
        render: function() {
          return '<button id="update_kpiBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_kpi_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  <button   id="delete_kpibtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_kpi_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
        }
      }
    ]
  });
  $.ajax({
    url: riyad_domain + "/salesman",
    type: "GET",
    success: function(data2) {
      let category_parents = data2?.data.map((item) => item);
      category_parents.forEach((element) => {
        $("<option/>").val(element["user_id"]).html(element["name"]).appendTo("#kpi_user");
      });
    }
  });
  $("#add_kpi").click(function() {
    $(this).text("Submitting..");
    let addKpiModal = {
      user_id: $("#kpi_user").val(),
      target_sales_volume: $("#sales_kpi_volume").val()
    };
    let d = {
      name: $("#kpi_user").text(),
      target_sales_volume: $("#sales_kpi_volume").val()
    };
    $.ajax({
      url: riyad_domain + "/sales_kpi",
      type: "POST",
      data: JSON.stringify(addKpiModal),
      contentType: "application/json",
      success: function(data2) {
        if (data2.status.code === 1) {
          const modal = bootstrap.Modal.getInstance($("#add_kpi_modal"));
          modal.hide();
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          let newRowIndex = kpi_table.row.add(d).draw();
          $("#add_kpi").text("Submit");
          $("form :input").val("");
          $(".input").val("");
          kpi_table.search("");
          kpi_table.order([0, "desc"]).draw();
          $(kpi_table.row(newRowIndex.index()).nodes()).addClass("selected");
        } else {
          $("#add_kpi").text("Submit");
          const modal = bootstrap.Modal.getInstance($("#add_kpi_modal"));
          modal.hide();
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        }
      },
      error: function(data2) {
        const modal = bootstrap.Modal.getInstance($("#add_kpi_modal"));
        modal.hide();
        $("#add_kpi").text("Submit");
        notyf.error({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  $.ajax({
    url: riyad_domain + "/salesman",
    type: "GET",
    success: function(data2) {
      let category_parents = data2?.data.map((item) => item);
      category_parents.forEach((element) => {
        $("<option/>").val(element["user_id"]).html(element["name"]).appendTo("#update_kpi_user");
      });
    }
  });
  $("#salesKpi_dataTable tbody").on("click", "#update_kpiBtn", function() {
    rowIndex = kpi_table.row($(this).parents("tr")).index();
    rowData = kpi_table.row($(this).parents("tr")).data();
    $("#update_kpi_user option:selected").text();
    $("#update_kpi_volume ").val(rowData.target_sales_volume);
  });
  $("#update_kpi").click(function() {
    let addKpiModal = {
      user_id: $("#update_kpi_user").val(),
      target_sales_volume: $("#update_kpi_volume").val()
    };
    $(this).text("Updating...");
    $.ajax({
      url: riyad_domain + "/sales_kpi/" + rowData.id,
      type: "PUT",
      data: JSON.stringify(addKpiModal),
      contentType: "application/json; charset=utf-8",
      success: function(data2) {
        if (data2.status.code === 1) {
          const modal = bootstrap.Modal.getInstance($("#update_kpi_modal"));
          modal.hide();
          $("#update_kpi").text("Update");
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          let currentPage = kpi_table.page();
          kpi_table.row(rowIndex).data(data2.data.sales_volume).draw();
          kpi_table.page(currentPage).draw("page");
          $(kpi_table.row(rowIndex).nodes()).addClass("selected");
          setTimeout(function() {
            $(kpi_table.row(rowIndex).nodes()).removeClass("selected");
          }, 2e3);
        } else {
          const modal = bootstrap.Modal.getInstance($("#update_kpi_modal"));
          modal.hide();
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        }
        $("#update_kpi").text("Update");
      },
      error: function(data2) {
        const modal = bootstrap.Modal.getInstance($("#update_kpi_modal"));
        modal.hide();
        $("#update_kpi").text("Update");
        notyf.error({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  $("#salesKpi_dataTable tbody").on("click", "#delete_kpibtn", function() {
    rowData = kpi_table.row($(this).parents("tr")).data();
    rowIndex = kpi_table.row($(this).parents("tr")).index();
  });
  $("#delete_kpi").click(function() {
    $("#delete_category").text("Deleting....");
    $.ajax({
      url: riyad_domain + "/sales_kpi/" + rowData.id,
      type: "DELETE",
      dataType: "json",
      success: function(data2) {
        if (data2.status.code === 1) {
          $("#delete_kpi").text("Delete");
          let currentPage = category_table.page();
          category_table.row(rowIndex).remove().draw();
          const modal = bootstrap.Modal.getInstance($("#delete_kpi_modal"));
          modal.hide();
          category_table.page(currentPage).draw("page");
          notyf.success({
            message: "Category  Deleted <strong>Successfully !</strong>",
            duration: 7e3,
            icon: false
          });
          rowData = void 0;
          rowIndex = void 0;
        } else {
          const modal = bootstrap.Modal.getInstance($("#delete_kpi_modal"));
          modal.hide();
          $("#delete_kpi").text("Delete");
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          rowData = void 0;
          rowIndex = void 0;
        }
      },
      error: function(data2) {
        const modal = bootstrap.Modal.getInstance($("#delete_kpi_modal"));
        modal.hide();
        $("#delete_kpi").text("Delete");
        notyf.error({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  var attendance_table = $("#attendance_datatable").DataTable({
    ajax: {
      url: nafisa_domain + "/attendance/all/1/100",
      dataSrc: "data"
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
      '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_kpi_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],
    columns: [
      { data: "name" },
      { data: "date" },
      { data: "check_in" },
      { data: "check_out" },
      {
        data: "id",
        render: function() {
          return '<button id="update_kpiBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_kpi_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  <button   id="delete_kpibtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_kpi_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
        }
      }
    ]
  });
  var product_table = $("#product_dataTable").DataTable({
    ajax: {
      url: nafisa_domain + "/products",
      dataSrc: "data"
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
      '<button id="supplier_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#add_product_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],
    columns: [
      { data: "name" },
      { data: "description" },
      { data: "unit_type.name" },
      { data: "unit_size" },
      { data: "brand_id.name" },
      { data: "category_id.name" },
      { data: "cost_price" },
      { data: "mrp" },
      { data: "wholesale_price" },
      { data: "retail_price" },
      { data: "discount_amount" },
      {
        data: "product_image_url",
        render: function() {
          return '<button id="supplier_photo"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#supplier_image_modal">View</button>';
        }
      },
      {
        data: "details",
        render: function() {
          return '<button id="supplier_details"  class="btn btn-outline-gray-600" toggle="tooltip" title="details" type="button" data-bs-toggle="modal" data-bs-target="#details_supplier_modal">Details</button>';
        }
      },
      {
        data: "",
        render: function() {
          return '<button id="update_productBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"  data-bs-target="#update_product_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button><button   id="delete_productBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_product_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
        }
      }
    ]
  });
  $("#supplier_dataTable tbody").on("click", "#supplier_photo", function() {
    rowData = shop_supplier_table.row($(this).parents("tr")).data();
    $("#supplier_image").attr("src", riyad_domain + rowData.image_url);
  });
  $(document).ready(function() {
    $("#product_image_url").cropzee();
  });
  $.ajax({
    url: nafisa_domain + "/brand",
    type: "GET",
    success: function(data2) {
      let category_parents = data2?.data.map((item) => item);
      category_parents.forEach((element) => {
        $("<option/>").val(element["id"]).html(element["name"]).appendTo("#product_brand_id");
        $("<option/>").val(element["id"]).html(element["name"]).appendTo("#update_product_brand_id");
      });
    }
  });
  $.ajax({
    url: nafisa_domain + "/category",
    type: "GET",
    success: function(data2) {
      let category_parents = data2?.data.map((item) => item);
      category_parents.forEach((element) => {
        $("<option/>").val(element["id"]).html(element["name"]).appendTo("#product_category_id");
        $("<option/>").val(element["id"]).html(element["name"]).appendTo("#update_product_category_id");
      });
    }
  });
  $.ajax({
    url: nafisa_domain + "/product_unit",
    type: "GET",
    success: function(data2) {
      let category_parents = data2?.data.map((item) => item);
      category_parents.forEach((element) => {
        $("<option/>").val(element["id"]).html(element["name"]).appendTo("#product_unit_type");
        $("<option/>").val(element["id"]).html(element["name"]).appendTo("#update_product_unit_type");
      });
    }
  });
  $("#product_post_form").on("submit", function(e) {
    e.preventDefault();
    $.ajax({
      url: nafisa_domain + "/products",
      type: "POST",
      data: new FormData(this),
      contentType: false,
      cache: false,
      processData: false,
      success: function(data2) {
        if (data2.status.code === 1) {
          const modal = bootstrap.Modal.getInstance($("#add_product_modal"));
          modal.hide();
          let newSRowIndex = product_table.row.add(data2.data).draw();
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          $("form :input").val("");
          $(".input").val("");
          product_table.search("");
          product_table.order([0, "desc"]).draw();
          $(product_table.row(newSRowIndex.index()).nodes()).addClass("selected");
        } else {
          const modal = bootstrap.Modal.getInstance($("#add_product_modal"));
          modal.hide();
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        }
      },
      error: function(data2) {
        const modal = bootstrap.Modal.getInstance($("#add_product_modal"));
        modal.hide();
        notyf.error({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  $("#product_dataTable tbody").on("click", "#update_productBtn", function() {
    rowData = product_table.row($(this).parents("tr")).data();
    $("#update_name").val(rowData.name);
    $("#update_product_description").val(rowData.description);
    $("#update_product_brand_id :selected").text(rowData.brand_id.name);
    $("#update_product_category_id :selected").text(rowData.category_id.name);
    $("#update_product_unit_type :selected").text(rowData.unit_type.name);
    $("#update_product_unit_size").val(rowData.unit_size);
    $("#update_product_cost_price").val(rowData.cost_price);
    $("#update_product_mrp").val(rowData.mrp);
    $("#update_product_wholesale_price").val(rowData.wholesale_price);
    $("#update_product_retail_price").val(rowData.retail_price);
    $("#update_product_discount_amount").val(rowData.discount_amount);
    $("#product_image_url").val(rowData.product_image_url);
  });
  $("#update_product_post_form").on("submit", function(e) {
    e.preventDefault();
    $.ajax({
      url: riyad_domain + "/supplier/" + rowData.id,
      type: "PUT",
      data: new FormData(this),
      contentType: false,
      cache: false,
      processData: false,
      success: function(data2) {
        if (data2.status.code === 1) {
          const modal = bootstrap.Modal.getInstance($("#update_product_modal"));
          modal.hide();
          let currentPage = product_table.page();
          product_table.row(rowIndex).data(data2.data).draw();
          product_table.page(currentPage).draw("page");
          $(product_table.row(rowIndex).nodes()).addClass("selected");
          setTimeout(function() {
            $(product_table.row(rowIndex).nodes()).removeClass("selected");
          }, 2e3);
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        } else {
          const modal = bootstrap.Modal.getInstance($("#update_product_modal"));
          modal.hide();
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        }
      },
      error: function(data2) {
        const modal = bootstrap.Modal.getInstance($("#update_product_modal"));
        modal.hide();
        notyf.error({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  $("#product_dataTable tbody").on("click", "#delete_productBtn", function() {
    rowData = product_table.row($(this).parents("tr")).data();
    rowIndex = product_table.row($(this).parents("tr")).index();
  });
  $("#delete_product").click(function() {
    $(this).text("Deleting...");
    $.ajax({
      url: nafisa_domain + "/products/" + rowData.id,
      type: "DELETE",
      dataType: "json",
      success: function(data2) {
        let currentPage = product_table.page();
        product_table.row(rowIndex).remove().draw();
        const modal = bootstrap.Modal.getInstance($("#delete_product_modal"));
        modal.hide();
        $("#delete_product").text("Delete");
        product_table.page(currentPage).draw("page");
        notyf.success({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
        rowData = void 0;
        rowIndex = void 0;
      },
      error: function(data2) {
        const modal = bootstrap.Modal.getInstance($("#delete_product_modal"));
        modal.hide();
        $("#delete_product").text("Delete");
        notyf.error({
          message: "Cannot Delete This Product",
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  var unit_table = $("#product_unit_datatable").DataTable({
    ajax: {
      url: riyad_domain + "/product_unit",
      dataSrc: "data"
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
      '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#product_raw_material_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],
    columns: [
      { data: "id" },
      { data: "name" },
      { data: "product_raw_material_product_unit_id" },
      {
        data: "id",
        render: function() {
          return '<button id="update_rawBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_product_raw_material_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  <button   id="delete_rawBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_product_raw_material_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
        }
      }
    ]
  });
  var raw_material_table = $("#product_raw_material_dataTable").DataTable({
    ajax: {
      url: nafisa_domain + "/product_raw_material",
      dataSrc: "data"
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
      '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#product_raw_material_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],
    columns: [
      { data: "id" },
      { data: "name" },
      { data: "product_unit_id.name" },
      { data: "unit_size" },
      { data: "cost_price" },
      {
        data: "id",
        render: function() {
          return '<button id="update_rawBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_product_raw_material_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  <button   id="delete_rawBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_product_raw_material_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
        }
      }
    ]
  });
  $.ajax({
    url: nafisa_domain + "/product_unit",
    type: "GET",
    success: function(data2) {
      let category_parents = data2?.data.map((item) => item);
      category_parents.forEach((element) => {
        $("<option/>").val(element["id"]).html(element["name"]).appendTo("#product_raw_material_unit_name");
        $("<option/>").val(element["id"]).html(element["name"]).appendTo("#update_product_raw_material_unit_name");
      });
    }
  });
  $("#add_product_raw_material").click(function() {
    $(this).text("Submitting..");
    let addRawModal = {
      name: $("#product_raw_material_name").val(),
      product_unit_id: $("#product_raw_material_unit_name").val(),
      unit_size: $("#product_raw_material_unit_size").val(),
      cost_price: $("#product_raw_material_cost_price").val()
    };
    $.ajax({
      url: nafisa_domain + "/product_raw_material",
      type: "POST",
      data: JSON.stringify(addRawModal),
      contentType: "application/json",
      success: function(data2) {
        if (data2.status.code === 1) {
          const modal = bootstrap.Modal.getInstance($("#product_raw_material_modal"));
          modal.hide();
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          let newRowIndex = raw_material_table.row.add(addRawModal).draw();
          $("#add_product_raw_material").text("Submit");
          $("form :input").val("");
          $(".input").val("");
          raw_material_table.search("");
          raw_material_table.order([0, "desc"]).draw();
          $(raw_material_table.row(newRowIndex.index()).nodes()).addClass("selected");
        } else {
          $("#add_product_raw_material").text("Submit");
          const modal = bootstrap.Modal.getInstance($("#product_raw_material_modal"));
          modal.hide();
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        }
      },
      error: function(data2) {
        const modal = bootstrap.Modal.getInstance($("#product_raw_material_modal"));
        modal.hide();
        $("#add_kpi").text("Submit");
        notyf.error({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  $("#product_raw_material_dataTable tbody").on("click", "#update_rawBtn", function() {
    rowData = raw_material_table.row($(this).parents("tr")).data();
    rowIndex = raw_material_table.row($(this).parents("tr")).index();
    $("#update_product_raw_material_name").val(rowData.name);
    $("#update_product_raw_material_unit_name :selected").text(rowData.product_unit_id.name);
    $("#update_product_raw_material_unit_size").val(rowData.unit_size);
    $("#update_product_raw_material_cost_price").val(rowData.cost_price);
  });
  $("#update_product_raw_material").click(function() {
    let updateRawModal = {
      name: $("#update_product_raw_material_name").val(),
      product_unit_id: $("#update_product_raw_material_unit_name").val(),
      unit_size: $("#update_product_raw_material_unit_size").val(),
      cost_price: $("#update_product_raw_material_cost_price").val()
    };
    $(this).text("Updating...");
    $.ajax({
      url: nafisa_domain + "/product_raw_material/" + rowData.id,
      type: "PUT",
      data: JSON.stringify(updateRawModal),
      contentType: "application/json; charset=utf-8",
      success: function(data2) {
        if (data2.status.code === 1) {
          const modal = bootstrap.Modal.getInstance($("#update_product_raw_material_modal"));
          modal.hide();
          $("#update_product_raw_material").text("Update");
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          let currentPage = raw_material_table.page();
          raw_material_table.row(rowIndex).data(data2.data).draw();
          raw_material_table.page(currentPage).draw("page");
          $(raw_material_table.row(rowIndex).nodes()).addClass("selected");
          setTimeout(function() {
            $(raw_material_table.row(rowIndex).nodes()).removeClass("selected");
          }, 2e3);
        } else {
          const modal = bootstrap.Modal.getInstance($("#update_product_raw_material_modal"));
          modal.hide();
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
        }
        $("#update_product_raw_material").text("Update");
      },
      error: function(data2) {
        const modal = bootstrap.Modal.getInstance($("#update_product_raw_material_modal"));
        modal.hide();
        $("#update_product_raw_material").text("Update");
        notyf.error({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  $("#product_raw_material_dataTable tbody").on("click", "#delete_rawBtn", function() {
    rowData = raw_material_table.row($(this).parents("tr")).data();
    rowIndex = raw_material_table.row($(this).parents("tr")).index();
  });
  $("#delete_raw_product").click(function() {
    $("#delete_raw_product").text("Deleting....");
    $.ajax({
      url: nafisa_domain + "/product_raw_material/" + rowData.id,
      type: "DELETE",
      dataType: "json",
      success: function(data2) {
        if (data2.status.code === 1) {
          $("#delete_raw_product").text("Delete");
          let currentPage = raw_material_table.page();
          raw_material_table.row(rowIndex).remove().draw();
          const modal = bootstrap.Modal.getInstance($("#delete_product_raw_material_modal"));
          modal.hide();
          category_table.page(currentPage).draw("page");
          notyf.success({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          rowData = void 0;
          rowIndex = void 0;
        } else {
          const modal = bootstrap.Modal.getInstance($("#delete_product_raw_material_modal"));
          modal.hide();
          $("#delete_raw_product").text("Delete");
          notyf.error({
            message: data2.status.message,
            duration: 7e3,
            icon: false
          });
          rowData = void 0;
          rowIndex = void 0;
        }
      },
      error: function(data2) {
        const modal = bootstrap.Modal.getInstance($("#delete_product_raw_material_modal"));
        modal.hide();
        $("#delete_raw_product").text("Delete");
        notyf.error({
          message: data2.status.message,
          duration: 7e3,
          icon: false
        });
      }
    });
  });
  var sales_product_table = $("#sales_product_dataTable").DataTable({
    ajax: {
      url: nafisa_domain + "/sales_product",
      dataSrc: "data"
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
      '<button id="shop_addBtn"  toggle="tooltip" title="Add New" class="btn btn-light btn-outline-gray-700 shadow-none" type="button" data-bs-toggle="modal" data-bs-target="#product_raw_material_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></button>'
    ],
    columns: [
      { data: "id" },
      { data: "name" },
      { data: "product_unit_id.name" },
      { data: "unit_size" },
      { data: "cost_price" },
      {
        data: "id",
        render: function() {
          return '<button id="update_rawBtn"  class="btn btn-primary" toggle="tooltip" title="Edit" type="button" data-bs-toggle="modal"   data-bs-target="#update_product_raw_material_modal" ><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>  <button   id="delete_rawBtn"  class="btn btn-danger" toggle="tooltip" title="Delete" data-bs-toggle="modal"   data-bs-target="#delete_product_raw_material_modal"><svg class="icon icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>';
        }
      }
    ]
  });
  $(document).ready(function() {
    var i = 1;
    $("#add_row").click(function() {
      b = i - 1;
      $("#addr" + i).html($("#addr" + b).html()).find("td:first-child").html(i + 1);
      $(".tab_logic").append('<tr id="addr' + (i + 1) + '"></tr>');
      i++;
    });
    $("#delete_row").click(function() {
      if (i > 1) {
        $("#addr" + (i - 1)).html("");
        i--;
      }
      calc();
    });
    $(".tab_logic tbody").on("keyup change", function() {
      calc();
    });
  });
  function calc() {
    $(".tab_logic tbody tr").each(function(i, element) {
      var html = $(this).html();
      if (html != "") {
        var qty = $(this).find(".qty").val();
        var price = $(this).find(".price").val();
        var dis = $(this).find(".discount").val();
        $(this).find(".total").val(qty * price - dis);
        var arr = $(".total").map((i2, e) => e.value).get();
        var sum = arr.reduce(function(a, b2) {
          if (isNaN(a) || a == "")
            a = 0;
          if (isNaN(b2) || b2 == "")
            b2 = 0;
          return parseInt(a) + parseInt(b2);
        }, 0);
        $("#allTotal").text(sum + " BDT");
      }
    });
  }
  $(document).ready(function() {
    $(document).on("change", ".price", function() {
      var arr = $(".price").map((i, e) => e.value).get();
      var sum = arr.reduce(function(a, b2) {
        if (isNaN(a) || a == "")
          a = 0;
        if (isNaN(b2) || b2 == "")
          b2 = 0;
        return parseInt(a) + parseInt(b2);
      }, 0);
      $("#totalPrice").text(sum + " BDT");
    });
  });
  $(document).ready(function() {
    $(document).on("change", ".discount", function() {
      var arr = $(".discount").map((i, e) => e.value).get();
      var sum = arr.reduce(function(a, b2) {
        if (isNaN(a) || a == "")
          a = 0;
        if (isNaN(b2) || b2 == "")
          b2 = 0;
        return parseInt(a) + parseInt(b2);
      }, 0);
      $("#totalDiscount").text(sum + " BDT");
    });
  });
  $(document).ready(function() {
    $(document).on("change", ".qty", function() {
      var arr = $(".qty").map((i, e) => e.value).get();
      var sum = arr.reduce(function(a, b2) {
        if (isNaN(a) || a == "")
          a = 0;
        if (isNaN(b2) || b2 == "")
          b2 = 0;
        return parseInt(a) + parseInt(b2);
      }, 0);
      $("#totalUnit").text(sum);
    });
  });
  $.ajax({
    url: riyad_domain + "/products",
    type: "GET",
    success: function(data2) {
      let product_parents = data2?.data.map((item) => item);
      product_parents.forEach((element) => {
        $("<option/>").val(element["id"]).html(element["name"]).attr("data-price", element["cost_price"]).attr("data-unit", element["unit_id"]["name"]).appendTo(".product_list");
      });
    }
  });
  $.ajax({
    url: riyad_domain + "/branch",
    type: "GET",
    success: function(data2) {
      let purchase_branch = data2?.data.map((item) => item);
      purchase_branch.forEach((element) => {
        $("<option/>").val(element["id"]).html(element["name"]).appendTo("#select_branch_purchase");
      });
    }
  });
  $.ajax({
    url: riyad_domain + "/supplier/all",
    type: "GET",
    success: function(data2) {
      let purchase_branch = data2?.data.map((item) => item);
      purchase_branch.forEach((element) => {
        $("<option/>").val(element["id"]).html(element["name"]).appendTo("#select_supplier_purchase");
      });
    }
  });
  $(".tab_logic").on("change", "select", function() {
    let matha = $(this).find(":selected").data("price");
    $(this).closest("tr").find(".price").val(matha);
    $(this).closest("tr").find(".Unit_size").text($(this).find(":selected").data("unit"));
  });
  $("#Submit_btn").click(function() {
    var values = [];
    var value = {};
    var i = 0;
    var field_name, field_value;
    $(".tab_logic tr").find(":input").each(function() {
      field_name = $(this).attr("name");
      field_value = this.value;
      if (field_name === "product_id" || field_name === "discount_amount" || field_name === "amount_unit") {
        value[$(this).attr("name")] = this.value;
      }
      i++;
      if (i % 5 === 0) {
        values.push(value);
        value = {};
      }
    });
    var addpurchaseorder = {
      default_branch_id: $("#select_branch_purchase").val(),
      supplier_id: $("#select_supplier_purchase").val(),
      supply_schedule: $("#date_purchase").val(),
      product_name_list: values
    };
    $.ajax({
      url: riyad_domain + "/purchase_order",
      type: "POST",
      data: JSON.stringify(addpurchaseorder),
      contentType: "application/json",
      success: function(data2) {
      },
      error: function(data2) {
      }
    });
  });
})();
