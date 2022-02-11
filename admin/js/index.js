async function login(){
  let username = $("#username").val();
  let password = $("#password").val();
  if(username == "" || password == ""){
    toastr.error("Username dan Password tidak boleh kosong!", "Error");
    //focus ke username
    $("#username").focus();
  }else{
    //block UI
    $.blockUI({
      message: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><br><span class="font-bold">Loading...</span>'
    });
    if(username == "admin" && password == "admin_admin"){
      localStorage.setItem("level", 'admin');
      window.location.href = "admin_index.html";
      // $.unblockUI();
    }else{
      toastr.error("Username atau Password salah!", "Error");
      //focus ke username
      $("#username").focus();
      $.unblockUI();
    }
  }
}