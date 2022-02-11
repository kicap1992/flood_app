let level = localStorage.getItem("level");
if(level == null){
  localStorage.setItem("level", null);
  window.location.href = "index.html";
}
if(level != "admin"){
  localStorage.setItem("level", null);
  window.location.href = "index.html";
}